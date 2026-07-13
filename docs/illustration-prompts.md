# Illustration prompts — Saathvik Visuals entrance experience

Status: items 1–4 below are **done** — you generated and dropped in
`public/illus-1.png` (rooms), `illus-2.png` (welcome door), `illus-3.png`
(Just Enough portal), and `illus-4.png` (6-badge sheet, cropped and placed
in the app repo). Wired into code with the same filenames, no further
action needed on those. Item 5 (4 remaining badges) is still open.

Style baseline for the site illustrations: flat/vector illustration, soft
gradients, no harsh outlines, matches the site's dark cinematic base
(`--void`/near-black backgrounds) with the four mode accents as the only
saturated color:

- Founder — blue `#1d4ed8`
- Creative — violet `#7c3aed`
- Minimal — ink `#111827`
- Future — cyan `#0891b2`

---

## 1. Room-concept explainer (four rooms → one) — ✅ done

`ConceptScreen` in `src/components/entrance-experience.tsx`. Using
`public/illus-1.png`.

---

## 2. Welcome beat icon glow — ✅ done

`WelcomeScreen`. Using `public/illus-2.png`.

---

## 3. Just Enough case study — portal reveal — ✅ done

`PortalIllustration` in `src/components/play-embed-reveal.tsx`. Using
`public/illus-3.png`.

---

## 4. Achievement badges, batch 1 — ✅ done

`first-clear.png`, `completionist.png`, `tier-1.png`, `flawless-5.png`,
`halfway.png`, `categorizer.png` in the `just-enough` repo's
`assets/achievements/` — cropped from `illus-4.png` and replaced in place.

---

## 5. Achievement badges, batch 2 — still open

Same `assets/achievements/` folder in the `just-enough` repo has 4 more
still on the old gray placeholder style: `perfectionist.png`,
`streak-3.png`, `tier-3.png`, `tier-5.png`. Match the finished style from
`streak-7.png` / the batch-1 badges (warm gold gradient, hexagonal
shield-shape border, laurel leaves, star accents on points).

**Prompt template** (swap the bracketed part per badge):
> Flat vector achievement badge icon in a hexagonal shield shape with warm
> gold gradient (orange-to-gold), laurel leaf accents at the base, a
> sparkle/star at the top point, thick soft border, glowing outer edge,
> dark background — [a perfect gold star / the number 3 in flames / a
> bronze/silver tier medallion / the number 5 in a radiant gold medallion],
> matching a cheerful, cream-and-sage puzzle game's achievement screen.

Badge meanings for context:
- `perfectionist.png` — earned for a flawless clear with no mistakes
- `streak-3.png` — 3-day play streak (pairs with the existing `streak-7.png` flame+7 design — reuse that flame motif with a "3")
- `tier-3.png` / `tier-5.png` — difficulty tier medallions (pairs with `tier-1.png` from batch 1 — reuse that shield+checkmark motif, swap tier number/color)

Deliverable: 4 PNGs (or one more composite sheet like `illus-4.png` was),
transparent or dark background, 512x512 each, same filenames as above
(drop-in replacements).

---

## How to hand these back

Drop new files at `public/illus-5.png` (or directly into
`assets/achievements/` in the just-enough repo) and tell me — I'll crop/
wire them the same way as batch 1.
