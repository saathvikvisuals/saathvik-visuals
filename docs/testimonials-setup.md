# Setting up real client testimonials

The site only ever shows testimonials that came from an actual client response —
there's no placeholder/fake content seeded in. Here's how to wire it up.

## 1. Create the Google Form

Go to [forms.google.com](https://forms.google.com) and create a form with these
exact questions (the sync script matches on these labels, case-insensitive):

1. **Your name** — short answer, required
2. **Which project / website did Saathvik build for you?** — short answer
3. **Project link (optional)** — short answer (their live site URL, if public)
4. **How would you rate your experience?** — linear scale 1 to 5 (label 1
   "Poor", 5 "Excellent"), required — shown as a star row on the card
5. **Your experience (write in any language you're comfortable in)** — paragraph, required
6. **What language did you write in?** — short answer (e.g. "English", "Hindi") —
   optional, shown as a small tag on the card if filled in
7. **OK to show this publicly on the portfolio site?** — multiple choice: Yes / No
   — this is the consent gate. Anything other than "Yes" is filtered out by the
   sync script, so don't skip adding this question.

Send the form link to clients after wrapping up their project.

## 2. Publish the response sheet as CSV

1. In the Form, go to **Responses → the green Sheets icon** to create a linked
   Google Sheet.
2. Open that Sheet → **File → Share → Publish to web**.
3. Choose the responses sheet/tab, format **Comma-separated values (.csv)**, click **Publish**.
4. Copy the published URL.

## 3. Connect it to the site

Add to `.env.local` (and to your Vercel project's environment variables for
production):

```bash
TESTIMONIALS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
```

Then run:

```bash
npm run testimonials:sync
```

This writes real responses into `src/data/testimonials.json`. It also runs
automatically as part of `npm run build` (via `prebuild`), so once the env var
is set on Vercel, every deploy picks up new reviews automatically — same
pattern as `project-intake.json` syncing into `auto-projects.json`.

No `TESTIMONIALS_SHEET_CSV_URL` set yet? The sync step just skips quietly and
the site shows an honest "reviews are on the way" message instead of going
empty/broken.
