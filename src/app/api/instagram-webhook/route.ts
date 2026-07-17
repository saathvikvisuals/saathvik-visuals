import { NextResponse } from "next/server";

const NOTION_LEADS_DATA_SOURCE_ID = "4a415245-063f-444a-9a17-aa983e22228d";
const PORTFOLIO_URL = "https://saathvik-visuals.vercel.app";
const KEYWORDS: Record<string, string> = {
  build: `Thanks for reaching out! Here's my portfolio with full case studies: ${PORTFOLIO_URL}\n\nTell me a bit about your project (what you're building, rough timeline) and I'll follow up personally.`,
  price: `Happy to talk pricing — it depends on scope. Quickest way: tell me what you're building here, or fill out the brief at ${PORTFOLIO_URL}#contact and I'll reply with a quote.`,
  portfolio: `Here's my full portfolio: ${PORTFOLIO_URL} — every project has a full case study with process, problem, and outcome.`
};

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
      const text = (event.message?.text ?? "").toLowerCase().trim();
      if (!senderId || !text) continue;

      const matchedKeyword = Object.keys(KEYWORDS).find((keyword) => text.includes(keyword));
      if (!matchedKeyword) continue;

      await sendReply(senderId, KEYWORDS[matchedKeyword]);
      await logLeadToNotion({ label: `Instagram DM (${senderId})`, keyword: matchedKeyword, message: event.message.text, source: "Instagram" });
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
      await logLeadToNotion({ label: `Instagram comment @${username}`, keyword: matchedKeyword, message: comment.text, source: "Instagram" });
    }
  }

  return NextResponse.json({ ok: true });
}

async function sendReply(recipientId: string, text: string) {
  const token = process.env.IG_PAGE_ACCESS_TOKEN;
  if (!token) return;

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
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
    const response = await fetch(`https://graph.facebook.com/v21.0/${commentId}/private_replies?access_token=${token}`, {
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

async function logLeadToNotion({ label, keyword, message, source }: { label: string; keyword: string; message: string; source: string }) {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) return;

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { data_source_id: NOTION_LEADS_DATA_SOURCE_ID },
        properties: {
          Name: { title: [{ text: { content: label } }] },
          "Project Brief": { rich_text: [{ text: { content: message.slice(0, 2000) } }] },
          Source: { select: { name: source } },
          Status: { status: { name: "Not started" } },
          "Date Received": { date: { start: new Date().toISOString() } },
          Notes: { rich_text: [{ text: { content: `Matched keyword: ${keyword}` } }] }
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Notion lead log failed:", response.status, errorBody);
    }
  } catch (error) {
    console.error("Notion lead log failed:", error instanceof Error ? error.message : error);
  }
}
