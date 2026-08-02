import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "node:path";
import { projects } from "@/data/portfolio";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
  addOns?: string[];
  goals?: string;
  estimate?: {
    baseLabel?: string;
    total?: number;
    advance?: number;
    finalPayment?: number;
    timelineLabel?: string;
    budgetLabel?: string;
    addOnLabels?: string[];
  };
};

let transporter: nodemailer.Transporter | null = null;

const NOTION_LEADS_DATA_SOURCE_ID = "4a415245-063f-444a-9a17-aa983e22228d";

async function logLeadToNotion({ name, email, message }: { name: string; email: string; message: string }) {
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
          Name: { title: [{ text: { content: name } }] },
          Email: { email },
          "Project Brief": { rich_text: [{ text: { content: message.slice(0, 2000) } }] },
          Source: { select: { name: "Contact Form" } },
          Status: { status: { name: "Not started" } },
          "Date Received": { date: { start: new Date().toISOString() } }
        }
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Notion lead log failed:", response.status, body);
    }
  } catch (error) {
    console.error("Notion lead log failed:", error instanceof Error ? error.message : error);
  }
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return transporter;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ContactPayload | null;
  const name = payload?.name?.trim() ?? "";
  const email = payload?.email?.trim() ?? "";
  const phone = payload?.phone?.trim() ?? "";
  const company = payload?.company?.trim() ?? "";
  const projectType = payload?.projectType?.trim() ?? "";
  const timeline = payload?.timeline?.trim() ?? "";
  const budget = payload?.budget?.trim() ?? "";
  const addOns = Array.isArray(payload?.addOns) ? payload!.addOns.filter(Boolean) : [];
  const message = payload?.goals?.trim() ?? "";
  const estimate = payload?.estimate;

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ message: "Please enter your name, a valid email, and enough project detail to prepare the quotation." }, { status: 400 });
  }

  await logLeadToNotion({ name, email, message });

  const mailer = getTransporter();

  if (!mailer) {
    return NextResponse.json({ message: "SMTP is not configured yet. Add credentials in .env.local to enable the form." }, { status: 503 });
  }

  try {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://saathvikvisuals.com").replace(/\/$/, "");
    const featuredWork = projects.slice(0, 4).map((project) => ({
      name: project.name,
      tag: project.tag,
      url: project.url || `${siteUrl}/work/${project.slug}`
    }));
    const logoAttachment = {
      filename: "saathvik-visuals.png",
      path: path.join(process.cwd(), "public", "brand-favicon.png"),
      cid: "saathvikvisuals-logo"
    };

    await mailer.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.CONTACT_TO ?? "saathvikk202@gmail.com",
      replyTo: email,
      subject: `New Saathvik Visuals brief from ${name}`,
      text: ownerEmailText({ name, email, phone, company, projectType, timeline, budget, addOns, message, estimate }),
      html: ownerEmailHtml({ name, email, phone, company, projectType, timeline, budget, addOns, message, siteUrl, estimate }),
      attachments: [logoAttachment]
    });

    await mailer.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: email,
      replyTo: process.env.CONTACT_TO ?? "saathvikk202@gmail.com",
      subject: "Your project brief reached Saathvik Visuals",
      text: autoReplyText({ name, message, siteUrl, featuredWork, estimate }),
      html: autoReplyHtml({ name, message, siteUrl, featuredWork, estimate }),
      attachments: [logoAttachment]
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP send failed.";
    console.error("SMTP send failed:", message);
    return NextResponse.json({ message: "Message service is being connected. Please email saathvikk202@gmail.com directly for now." }, { status: 502 });
  }

  return NextResponse.json({ message: "Brief received. I will get back to you soon." });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[char];
  });
}

function emailShell({ preheader, title, kicker, body, footer = "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, and story-led digital experiences." }: { preheader: string; title: string; kicker: string; body: string; footer?: string }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f1fb;font-family:Arial,Helvetica,sans-serif;color:#171321;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f4f1fb;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1fb;margin:0;padding:22px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e8e2f5;border-radius:16px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:26px 24px 24px;background:#111111;border-bottom:1px solid #262029;text-align:center;">
                <img src="cid:saathvikvisuals-logo" width="58" height="58" alt="Saathvik Visuals" style="display:block;width:58px;height:58px;border-radius:14px;border:0;margin:0 auto 13px;background:#111111;">
                <div style="font-family:'Brush Script MT','Segoe Script','Lucida Handwriting',cursive;font-size:38px;line-height:1;color:#ffffff;font-weight:400;">SaathvikVisuals</div>
                <div style="margin-top:9px;font-size:12px;line-height:1.5;font-weight:800;text-transform:uppercase;color:#bea7ff;letter-spacing:1.6px;">Premium UI/UX design</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 10px;">
                <div style="display:inline-block;font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#6f52c9;background:#f1ebff;border:1px solid #dfd3ff;border-radius:999px;padding:7px 11px;">${escapeHtml(kicker)}</div>
                <h1 style="margin:16px 0 10px;font-size:30px;line-height:1.14;font-weight:850;color:#171321;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            ${body}
            <tr>
              <td style="padding:22px 24px 28px;">
                <p style="margin:0;font-size:12px;line-height:1.7;color:#7b718b;">${escapeHtml(footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ownerEmailHtml({
  name,
  email,
  phone,
  company,
  projectType,
  timeline,
  budget,
  addOns,
  message,
  siteUrl,
  estimate
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  addOns: string[];
  message: string;
  siteUrl: string;
  estimate?: ContactPayload["estimate"];
}) {
  const estimateRows = estimate
    ? `
      <p style="margin:14px 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Estimate:</strong> ${escapeHtml(estimate.baseLabel ?? "Custom scope")}</p>
      <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Indicative total:</strong> ${escapeHtml(formatInr(estimate.total))}</p>
      <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Advance:</strong> ${escapeHtml(formatInr(estimate.advance))}</p>
      <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Remaining:</strong> ${escapeHtml(formatInr(estimate.finalPayment))}</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#171321;"><strong>Timeline / budget:</strong> ${escapeHtml(estimate.timelineLabel ?? timeline)} / ${escapeHtml(estimate.budgetLabel ?? budget)}</p>`
    : "";

  const body = `
    <tr>
      <td style="padding:0 24px 22px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ff;border:1px solid #e6dcff;border-radius:14px;">
          <tr>
            <td style="padding:18px;">
              <div style="font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#7657d0;letter-spacing:1px;">Lead details</div>
              <p style="margin:12px 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#171321;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#6f52c9;text-decoration:none;">${escapeHtml(email)}</a></p>
              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Phone:</strong> ${escapeHtml(phone || "Not shared")}</p>
              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Company:</strong> ${escapeHtml(company || "Not shared")}</p>
              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Project type:</strong> ${escapeHtml(projectType || "Not specified")}</p>
              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Timeline:</strong> ${escapeHtml(timeline || "Not specified")}</p>
              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Budget range:</strong> ${escapeHtml(budget || "Not specified")}</p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#171321;"><strong>Add-ons:</strong> ${escapeHtml(addOns.join(", ") || "None selected")}</p>
              ${estimateRows}
              <div style="margin-top:16px;padding:16px;border-radius:12px;background:#ffffff;border:1px solid #ebe5f6;">
                <div style="font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#8a8097;letter-spacing:1px;">Project message</div>
                <p style="margin:10px 0 0;font-size:16px;line-height:1.7;color:#342d41;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
              </div>
              <div style="margin-top:18px;">
                <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 18px;font-size:14px;font-weight:800;">Reply to lead</a>
                <a href="${siteUrl}" style="display:inline-block;margin-left:8px;background:#f1ebff;color:#6f52c9;text-decoration:none;border-radius:999px;padding:13px 18px;font-size:14px;font-weight:800;">Open portfolio</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return emailShell({
    preheader: `New project brief from ${name}`,
    kicker: "New client lead",
    title: "A new project brief is waiting.",
    body
  });
}

function autoReplyHtml({
  name,
  message,
  siteUrl,
  featuredWork,
  estimate
}: {
  name: string;
  message: string;
  siteUrl: string;
  featuredWork: { name: string; tag: string; url: string }[];
  estimate?: ContactPayload["estimate"];
}) {
  const workList = featuredWork
    .map(
      (project) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid #ebe5f6;">
            <div style="font-size:16px;line-height:1.3;font-weight:850;color:#171321;">${escapeHtml(project.name)}</div>
            <div style="margin-top:4px;font-size:14px;line-height:1.55;color:#5d536d;">${escapeHtml(project.tag)}</div>
            <a href="${escapeHtml(project.url)}" style="display:inline-block;margin-top:8px;color:#6f52c9;text-decoration:none;font-size:13px;font-weight:800;">View work</a>
          </td>
        </tr>`
    )
    .join("");

  const body = `
    <tr>
      <td style="padding:0 24px 22px;">
        <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#3c344d;">Hi ${escapeHtml(name)}, your project brief reached Saathvik Visuals. I will review the context and reply with the right next step.</p>
        ${
          estimate
            ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:#fff;border:1px solid #ebe5f6;border-radius:14px;">
                <tr>
                  <td style="padding:18px;">
                    <div style="font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#7657d0;letter-spacing:1px;">Estimate snapshot</div>
                    <p style="margin:10px 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Scope:</strong> ${escapeHtml(estimate.baseLabel ?? "Custom scope")}</p>
                    <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Indicative total:</strong> ${escapeHtml(formatInr(estimate.total))}</p>
                    <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#171321;"><strong>Advance to start:</strong> ${escapeHtml(formatInr(estimate.advance))}</p>
                    <p style="margin:0;font-size:16px;line-height:1.6;color:#171321;"><strong>Remaining on delivery:</strong> ${escapeHtml(formatInr(estimate.finalPayment))}</p>
                  </td>
                </tr>
              </table>`
            : ""
        }
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ff;border:1px solid #e6dcff;border-radius:14px;">
          <tr>
            <td style="padding:18px;">
              <div style="font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#7657d0;letter-spacing:1px;">Your submitted brief</div>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.7;color:#342d41;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;background:#ffffff;border:1px solid #ebe5f6;border-radius:14px;">
          <tr>
            <td style="padding:18px 18px 4px;">
              <div style="font-size:12px;line-height:1.4;font-weight:800;text-transform:uppercase;color:#7657d0;letter-spacing:1px;">Selected work while you wait</div>
              ${workList}
            </td>
          </tr>
        </table>
        <div style="margin-top:22px;">
          <a href="${siteUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 18px;font-size:14px;font-weight:800;">Open portfolio</a>
          <a href="mailto:saathvikk202@gmail.com" style="display:inline-block;margin-left:8px;background:#f1ebff;color:#6f52c9;text-decoration:none;border-radius:999px;padding:13px 18px;font-size:14px;font-weight:800;">Email directly</a>
        </div>
      </td>
    </tr>`;

  return emailShell({
    preheader: "Your project brief reached Saathvik Visuals.",
    kicker: "Brief received",
    title: "Your brief is in the studio.",
    body,
    footer: "You are receiving this because you submitted the Saathvik Visuals portfolio contact form."
  });
}

function ownerEmailText({
  name,
  email,
  phone,
  company,
  projectType,
  timeline,
  budget,
  addOns,
  message,
  estimate
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  addOns: string[];
  message: string;
  estimate?: ContactPayload["estimate"];
}) {
  return `New Saathvik Visuals brief

Name: ${name}
Email: ${email}
Phone: ${phone || "Not shared"}
Company: ${company || "Not shared"}
Project type: ${projectType || "Not specified"}
Timeline: ${timeline || "Not specified"}
Budget: ${budget || "Not specified"}
Add-ons: ${addOns.join(", ") || "None"}
${estimate ? `Indicative total: ${formatInr(estimate.total)}
Advance: ${formatInr(estimate.advance)}
Remaining: ${formatInr(estimate.finalPayment)}
` : ""}
Project message:
${message}`;
}

function autoReplyText({
  name,
  message,
  siteUrl,
  featuredWork,
  estimate
}: {
  name: string;
  message: string;
  siteUrl: string;
  featuredWork: { name: string; tag: string; url: string }[];
  estimate?: ContactPayload["estimate"];
}) {
  const work = featuredWork.map((project) => `- ${project.name}: ${project.tag}\n  ${project.url}`).join("\n");
  return `Hi ${name},

Your project brief reached Saathvik Visuals. I will review the context and reply with the right next step.

${estimate ? `Estimate snapshot:
- Scope: ${estimate.baseLabel ?? "Custom scope"}
- Indicative total: ${formatInr(estimate.total)}
- Advance to start: ${formatInr(estimate.advance)}
- Remaining on delivery: ${formatInr(estimate.finalPayment)}

` : ""}Your submitted brief:
${message}

Selected work while you wait:
${work}

Portfolio: ${siteUrl}`;
}

function formatInr(value?: number) {
  if (!value) return "Not available";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
