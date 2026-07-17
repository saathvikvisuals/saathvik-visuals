import { NextResponse } from "next/server";

const NOTION_LEADS_DATA_SOURCE_ID = "4a415245-063f-444a-9a17-aa983e22228d";
const NOTION_LEADS_DATABASE_ID = "ee34c710-0786-4a01-b351-63627ef436fb";
const PORTFOLIO_URL = "https://saathvik-visuals.vercel.app";
const IG_HANDLE = "@saathvik_visuals";
const KEYWORDS: Record<string, string> = {
  build: `Here's my portfolio with full case studies: ${PORTFOLIO_URL}\n\nTell me a bit about your project (what you're building, rough timeline) and I'll follow up personally.`,
  price: `Happy to talk pricing — it depends on scope. Quickest way: tell me what you're building here, or fill out the brief at ${PORTFOLIO_URL}#contact and I'll reply with a quote.`,
  portfolio: `Here's my full portfolio: ${PORTFOLIO_URL} — every project has a full case study with process, problem, and outcome.`
};
const DEFAULT_REPLY = `Thanks for messaging! Here's my portfolio in the meantime: ${PORTFOLIO_URL}`;
const CONFIRM_WORDS = ["done", "yes", "yep", "followed", "ok", "okay", "sure", "did"];
const EMAIL_REGEX = /[^\s]+@[^\s]+\.[^\s]+/;

// GET handles Meta's webhook verification handshake (done once when you
// register the webhook URL in the Meta App dashboard).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.IG_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.entry) return NextResponse.json({ ok: true });

  for (const entry of body.entry) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      const rawText = event.message?.text ?? "";
      const text = rawText.toLowerCase().trim();
      if (!senderId || !text) continue;

      await handleDm(senderId, rawText, text);
    }

    for (const change of entry.changes ?? []) {
      if (change.field !== "comments") continue;
      const comment = change.value;
      const commentId = comment?.id;
      const text = (comment?.text ?? "").toLowerCase().trim();
      const username = comment?.from?.username ?? comment?.from?.id ?? "someone";
      if (!commentId || !text) continue;

      const matchedKeyword = Object.keys(KEYWORDS).find((keyword) => text.includes(keyword));
      if (!matchedKeyword) continue;

      await sendPrivateReplyToComment(commentId, KEYWORDS[matchedKeyword]);
      await upsertLead({ label: `Instagram comment @${username}`, message: comment.text, stage: "completed", notesExtra: `Matched keyword: ${matchedKeyword}` });
    }
  }

  return NextResponse.json({ ok: true });
}

// Every DM runs through a small conversational funnel, state stored as a
// "stage" tag inside the lead's own Notion row (no separate DB needed):
//   awaiting_follow -> awaiting_contact -> completed
// This mirrors what Instagram DM-automation tools (e.g. Zorcha) do: a
// soft follow-gate (Meta's API can't actually verify follower status, so
// this is an honor-system ask-then-confirm, not a real check) followed by
// a guided name/email capture before handing over the link.
async function handleDm(senderId: string, rawText: string, text: string) {
  const matchedKeyword = Object.keys(KEYWORDS).find((keyword) => text.includes(keyword));
  const existing = await findLead(senderId);

  if (!existing) {
    await upsertLead({ label: `Instagram DM (${senderId})`, message: rawText, stage: "awaiting_follow" });
    await sendReply(senderId, `Thanks for reaching out! Quick favor before I send everything over — could you follow ${IG_HANDLE}? Reply "done" once you have and I'll send the link right away.`);
    return;
  }

  const stage = existing.stage;

  if (stage === "awaiting_follow") {
    if (CONFIRM_WORDS.some((word) => text.includes(word))) {
      await upsertLead({ pageId: existing.pageId, stage: "awaiting_contact" });
      await sendReply(senderId, `Awesome, thank you! One last thing — reply with your name and email (e.g. "Priya, priya@email.com") so I can send the full portfolio and follow up personally.`);
    } else {
      await sendReply(senderId, `No rush — just reply "done" once you've followed ${IG_HANDLE} and I'll send everything over.`);
    }
    return;
  }

  if (stage === "awaiting_contact") {
    const emailMatch = rawText.match(EMAIL_REGEX);
    if (!emailMatch) {
      await sendReply(senderId, `Didn't quite catch an email there — mind sending it like "Priya, priya@email.com"?`);
      return;
    }

    const email = emailMatch[0];
    const name = rawText.replace(email, "").replace(/[,]/g, "").trim() || "Instagram lead";
    await upsertLead({ pageId: existing.pageId, name, email, stage: "completed" });
    await sendReply(senderId, matchedKeyword ? KEYWORDS[matchedKeyword] : DEFAULT_REPLY);
    return;
  }

  // stage === "completed" — already have their info, just answer normally.
  await sendReply(senderId, matchedKeyword ? KEYWORDS[matchedKeyword] : DEFAULT_REPLY);
}

async function findLead(senderId: string): Promise<{ pageId: string; stage: string } | null> {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return null;

  try {
    // The newer /v1/data_sources/{id}/query endpoint doesn't exist at this
    // API version — confirmed via direct testing (400 invalid_request_url).
    // The classic /v1/databases/{database_id}/query endpoint is what
    // actually works with Notion-Version 2022-06-28.
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_LEADS_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: { property: "Name", title: { contains: `(${senderId})` } },
        page_size: 1
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Notion lead lookup failed:", response.status, errorBody);
      return null;
    }

    const data = await response.json();
    const page = data.results?.[0];
    if (!page) return null;

    const notesText: string = page.properties?.Notes?.rich_text?.[0]?.plain_text ?? "";
    const stageMatch = notesText.match(/stage:(\w+)/);
    return { pageId: page.id, stage: stageMatch?.[1] ?? "awaiting_follow" };
  } catch (error) {
    console.error("Notion lead lookup failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

async function upsertLead({
  pageId,
  label,
  message,
  name,
  email,
  stage,
  notesExtra
}: {
  pageId?: string;
  label?: string;
  message?: string;
  name?: string;
  email?: string;
  stage: string;
  notesExtra?: string;
}) {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return;

  const notes = [`stage:${stage}`, notesExtra].filter(Boolean).join(" — ");
  const properties: Record<string, unknown> = {
    Status: { status: { name: "Not started" } },
    Notes: { rich_text: [{ text: { content: notes } }] }
  };
  if (label) properties.Name = { title: [{ text: { content: label } }] };
  if (message) properties["Project Brief"] = { rich_text: [{ text: { content: message.slice(0, 2000) } }] };
  if (email) properties.Email = { email };
  if (name) properties["Project Brief"] = { rich_text: [{ text: { content: `Name: ${name}${message ? ` — ${message.slice(0, 1900)}` : ""}` } }] };

  try {
    if (pageId) {
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${notionKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ properties })
      });
      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error("Notion lead update failed:", response.status, errorBody);
      }
      return;
    }

    properties.Source = { select: { name: "Instagram" } };
    properties["Date Received"] = { date: { start: new Date().toISOString() } };
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ parent: { data_source_id: NOTION_LEADS_DATA_SOURCE_ID }, properties })
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Notion lead create failed:", response.status, errorBody);
    }
  } catch (error) {
    console.error("Notion lead upsert failed:", error instanceof Error ? error.message : error);
  }
}

async function sendReply(recipientId: string, text: string) {
  const token = process.env.IG_PAGE_ACCESS_TOKEN;
  if (!token) return;

  try {
    // graph.instagram.com, not graph.facebook.com — this Instagram API with
    // Instagram Login token type (prefix "IGAA") only authenticates against
    // the Instagram-specific host, confirmed via direct testing (the
    // Facebook host returns a token-parsing error, not an API-level error).
    const response = await fetch(`https://graph.instagram.com/v21.0/me/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient: { id: recipientId }, message: { text } })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Instagram reply send failed:", response.status, errorBody);
    }
  } catch (error) {
    console.error("Instagram reply send failed:", error instanceof Error ? error.message : error);
  }
}

async function sendPrivateReplyToComment(commentId: string, text: string) {
  const token = process.env.IG_PAGE_ACCESS_TOKEN;
  if (!token) return;

  try {
    // Instagram's "private reply" API sends a DM to whoever left the
    // comment, referencing that comment as the conversation starter — this
    // is what powers the classic "comment a keyword, get a DM" flow.
    // graph.instagram.com, not graph.facebook.com — see note in sendReply().
    const response = await fetch(`https://graph.instagram.com/v21.0/${commentId}/private_replies?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Instagram private reply failed:", response.status, errorBody);
    }
  } catch (error) {
    console.error("Instagram private reply failed:", error instanceof Error ? error.message : error);
  }
}
