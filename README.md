# Muhammad Awais — Video Editor & Videographer portfolio

React 19 + TypeScript + Vite, GSAP scroll choreography, and an optional React Three Fiber
3D "editing studio" hero. Every page is **prerendered to static HTML**, so all text, links and
the contact form work before (and without) JavaScript.

**Hero:** portrait-led by default — the offer heading "Turn Footage Into Powerful Content." with a compact
offer panel (results in violet, period and guarantee in mint) and the actions on the left; Muhammad's portrait on the right in a soft-cornered frame with violet
backlight, ringed by four floating software badges (Premiere Pro, After Effects, DaVinci Resolve,
CapCut). On phones the badges sit around the portrait (Premiere upper-left, After Effects upper-right, DaVinci lower-left, CapCut lower-right), overlapping its edges and clear of the face. Switch to the 3D studio with `heroVisual = 'studio'` in
`src/content/site.ts`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check → client build → SSR build → prerender to dist/
npm run preview    # serve dist/ at http://localhost:4173
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages…).
Set the environment variables from `.env.example` in the host's build settings.

**GitHub Pages:** `.github/workflows/static.yml` builds the site and publishes `dist/` (Settings → Pages →
Source: "GitHub Actions"). For a project page (`https://user.github.io/repo/`) it sets `VITE_BASE=/repo/` and
`VITE_SITE_URL=https://user.github.io/repo/`; for a root site (`user.github.io` repo or custom domain) use
`VITE_BASE=/`. Media paths in the content files are written as `/media/…` — the base path is added automatically.

---

## Updating content

All visitor-facing text lives in **`src/content/site.ts`** (one place, never duplicated):
name, headline, biography, services, software, skills, experience, education,
"Why work with me", social links, contact details and the showreel.

| To change… | Edit |
|---|---|
| Biography, services, skills, experience, education | `src/content/site.ts` |
| Portfolio projects | `src/content/projects.ts` |
| Portfolio, showreel and Before/After videos | originals in a folder → `node scripts/encode-portfolio.mjs "<folder>"` writes web-ready MP4s, 4 s hover previews and JPG thumbnails to `public/media/work/`, `public/media/showreel/` and `public/media/process/` (edit `JOBS` in the script to change files or thumbnail frames) |
| Page title, meta description, social image + alt text, site name | `seo` in `site.ts` (image: `dev-fixtures/og.html` → `public/media/og-image.jpg`, 1200×630) |
| Links under the About biography | `about.links` in `site.ts` |
| "Page not found" page | `NotFound` in `src/App.tsx`; prerendered to `dist/404.html` (noindex) — serve it for unknown paths with a 404 status |
| Portrait (hero + About) | `node scripts/convert-portrait.mjs "<photo>"` → WebP files in `public/media/portrait/`; sizes in `person.portrait` |
| Hero visual | `heroVisual` in `site.ts`: `'portrait'` (default) or `'studio'` (3D) |
| Hero heading / offer panel | `hero` in `site.ts` (`hero.headline`; `hero.offer.results` and `.terms` mix plain text with violet `stat` and `mint` highlights) |
| Behind the Edit text, steps, optional preview video | `process` in `site.ts` |
| Services heading, cards (text + icon) and call to action | `servicesSection` and `services` in `site.ts` |
| Toolkit heading, software card text, skill tags | `toolkitSection`, `software[].use`, `skills` in `site.ts` |
| Why Work With Me subtitle, button and the five cards (icon, text, the large "3+") | `whySection` and `reasons` in `site.ts` — the first card is the wide feature card |
| Why Work With Me 3D icons (shapes, graphite/violet materials, lighting) | `src/components/Icon3D.tsx`; each card picks one with `reasons[].icon` |
| Footer invitation (eyebrow, heading, line, two buttons) and role line | `footer` in `site.ts` (links come from `nav`; icons from `socials` plus any configured contact channels) |
| "What Happens Next?" steps (Contact section) | `nextSteps` in `site.ts` |
| "Stories in Motion" showcase (About, under Education) | heading/text/button in `stories` in `site.ts`; the three frames come from `projects.ts` (published work with thumbnails first, then the Commercial, Reels and Cinematic entries) |
| Contact heading, supporting line and description | `contact.label` / `heading` / `statement` / `text` in `site.ts` |
| FAQ (section 08, after Contact) | `faqSection` and `faqs` in `site.ts` — the same questions and answers are published as FAQPage data, so edit them in one place only |
| Contact form Project Type options | taken from the service titles in `services` |
| Hero background photo | `node scripts/convert-hero-bg.mjs "<photo>"` (see Portrait section) |
| Software logos | drop official files into `src/assets/software/` (see below) |
| Showreel | `showreel.video` / `showreel.poster` / `showreel.previewSrc` in `site.ts` |
| WhatsApp, phone, email, Fiverr, Upwork | `contact.*` in `site.ts` — each appears automatically once valid (WhatsApp +92 347 5914101 is shown in Contact and the footer; no call link) |
| 3D scene look and motion | `src/config/scene.ts` |

### Adding a project
1. Copy the commented example at the top of the `projects` array in `src/content/projects.ts`.
2. Put media in `public/media/work/` (thumbnail ≈1280×720 JPG/WebP < 200 KB, optional 3–6 s muted
   preview < 1.5 MB, final video as H.264 MP4 — or use a YouTube/Vimeo **embed** URL).
3. Set `status: 'published'`. Delete the matching placeholder slot.

A published project automatically gets: a playable card (hover preview on desktop, tap-to-open on
mobile), the video dialog, a page at `/work/<slug>/`, a sitemap entry and — only when `thumbnail`,
`uploadDate` and the video URL are all present and `VITE_SITE_URL` is set — `VideoObject`
structured data. Thumbnails whose shape matches a floating panel also replace that panel in the
hero scene.

### Showreel
- `video: { kind: 'file', src: '/media/showreel.mp4' }` or `{ kind: 'embed', src: 'https://player.vimeo.com/video/ID' }`
- `poster`: 16:9 still. `previewSrc`: optional 5–10 s muted loop (≤ 2 MB) that plays on the
  hero monitor only while the hero is visible and animation is allowed.
- Until `video` is set, **Play Showreel** opens an honest "coming soon" panel — never other footage.

### Contact form
Delivery is configured with environment variables (see `.env.example`):
- **Formspree** (simplest): create a form at formspree.io, set `VITE_CONTACT_ENDPOINT`.
- **Web3Forms**: set the endpoint plus `VITE_CONTACT_ACCESS_KEY` and `VITE_CONTACT_PROVIDER=web3forms`.
- **Own endpoint**: `VITE_CONTACT_PROVIDER=json`; it receives a JSON POST and must return 2xx.

The success message is shown **only** after the provider confirms delivery. While no endpoint is
configured the form validates normally, then says the message was not sent and offers
"Copy my message" plus LinkedIn. The form sends `name`, `email`, `project_type`, `details` and
`reference_link` (the optional link, normalised to a full URL, or "Not provided").

### Portrait
`scripts/convert-portrait.mjs` only **resizes** the photo (420 / 640 / original width WebP) —
no cropping, retouching or colour changes — and prints the photo's backdrop colour, which the
page uses to blend the image edges into the dark background. The hero serves the right size via
`srcset`/`sizes` with high fetch priority; About reuses the same files lazily.
Hero motion (all CSS, disabled for reduced motion): short upward fade for eyebrow, headline,
description and buttons; portrait fade with a gentle 0.96 → 1 scale (uniform — never distorted;
on stacked/mobile layouts it scales in without starting invisible, which keeps it fast to paint);
staggered badge entrance; slow badge float with different timing per badge (off on phones);
pointer parallax at different depths and a small hover tilt on each badge (fine pointers only).
The hero background is a static photo of an editing setup (`public/media/hero-bg-1600.webp`; on screens ≤768px `hero-bg-mobile.webp`, a full-resolution vertical slice of the same photo cut so the framing is identical) under an 85% black overlay, fading into the page colour at the bottom. To replace it run `node scripts/convert-hero-bg.mjs "<photo>"` (resize only; keeps the same file names when the source is 1600px wide, otherwise update the two `url()`s in `sections.css` → `.hero--portrait::before`). The hero has no
"Pause animation" button (removed at the owner's request); a pause saved by an earlier version is
cleared on load so animations don't stay stopped.

### Software logos
Drop the vendors' official files into `src/assets/software/` named exactly
`premiere-pro`, `after-effects`, `davinci-resolve`, `capcut` (`.svg`, `.png` or `.webp`) —
they replace the text badges in the hero and the Toolkit section automatically (rendered at
40×40, `object-fit: contain`, original colours). Prefer square app-icon versions so all four
line up. Until a file is present a colour-coded text badge is shown (DaVinci Resolve uses its CC0
mark from simple-icons).

### Regenerating the 3D poster / social image
The 3D poster (`public/media/hero-poster.webp`, studio mode only) is a still of the 3D scene,
used for instant first paint and as the no-WebGL fallback. After changing the scene:
```bash
npm run dev   # in another terminal
node scripts/qa/shoot.mjs "http://localhost:5173/?quality=high" 1440x900 tmp.png --dpr=2 --wait=9000 --save-canvas=public/media/hero-poster.webp
```
`dev-fixtures/og.html` composes the 1200×630 social image from the portrait; screenshot it to
`public/media/og-image.jpg` (see `scripts/qa/` for the Puppeteer helpers).

---

### Section spacing
One shared rule in `src/styles/base.css`: sections have no bottom padding and each section after
the first adds `--section-gap` on top — **48px desktop, 32px tablet (≤1023px), 24px mobile (≤640px)**,
measured from the previous section's last content to the next section's label. Change the gap in
one place (`--section-gap`). `node scripts/qa/gaps.mjs` verifies every boundary at eight sizes.

---

## 3D scene settings — `src/config/scene.ts`

| Group | What it controls |
|---|---|
| `camera` | FOV, final position/target, intro close-up on the lens, path bow |
| `entrance` | 0.8 s reveal, 0.5 s assemble, settle (≈1.5 s total), easing, panel stagger |
| `pointer` | max tilt (4°), parallax range, damping, lens/monitor response |
| `idle` | playhead loop length, focus-ring drift |
| `layout` | positions/rotations/sizes of monitor, lens, timeline, footage panels |
| `colors` | satin, rubber, metal, engraving, glass tint, accent |
| `lighting` | exposure, key / violet rim / fill lights, environment intensity |
| `bloom` | intensity and threshold (only HDR emissives — playhead, LEDs — exceed it) |
| `quality` | `high` / `medium` / `low`: DPR, bloom, contact shadows, env-map size, segments, MSAA |

All geometry is procedural (lathe/extrude/rounded boxes); textures (lens engravings, timeline,
"film stills") are drawn on canvas at runtime. **No external models, HDRIs or stock images.**

Dev-only URL helpers: `?quality=low|medium|high`, `?freeze=0..1` (hold the entrance at a given
point), `?no3d` (force the static fallback, also works in production), `?fixtures` (synthetic test clips).

### Runtime behaviour
- One `<Canvas>` (3D studio hero only); all other sections use plain DOM/CSS. "Behind the Edit"
  shows an illustrated editing timeline (or real footage via `process.previewVideo` in `site.ts`)
  beside four step cards; steps reveal in sequence and the playhead makes one pass on entry.
- Scene bundle is lazy-loaded on browser idle; shaders are precompiled one mesh at a time with
  yields so the page stays responsive; the canvas fades in over the poster after its first frame.
- Frames render continuously only while something moves; `demand` when paused/reduced motion;
  **no frames at all** when the hero is offscreen, the tab is hidden or a video dialog is open.
- Adaptive quality: starts from device signals, steps down when frame rate drops.
- Reduced motion: final composition, no camera move/parallax/tilt; no reveals or playhead pass.
- **Pause animation** button stops the scene renderer, the idle motion and the hero preview video.

---

## Missing assets & integrations (to supply)

- [ ] Showreel video (+ poster, optional 5–10 s muted preview)
- [ ] Portfolio videos, thumbnails and descriptions (6 clearly labelled placeholder slots now)
- [x] WhatsApp number (+92 347 5914101)
- [ ] Contact email, Fiverr URL, Upwork URL (hidden until supplied)
- [ ] Form delivery endpoint (`VITE_CONTACT_ENDPOINT`) — **the form is not connected yet**
- [ ] Final domain (`VITE_SITE_URL`) — needed for canonical/OG URLs and sitemap
- [ ] Optional: matching original/graded footage pair for a before-and-after comparison

---

## QA record

Helpers in `scripts/qa/` (use the locally installed Chrome via `puppeteer-core`):
`interactions.mjs` (41 automated checks, adapt to the hero mode), `mobile.mjs` (whole-page phone/tablet audit),
`gaps.mjs` (section spacing, including the space above the footer), `perf.mjs` (lab metrics), `shoot.mjs` (screenshots),
`make-fixtures.mjs` (synthetic TEST clips for the player — never published).

**Tested on** Windows 10, Chrome 154 (headless, real GPU: Intel HD Graphics 520 via ANGLE/D3D11),
viewports 1920, 1440, 1280 and 1024 px; phones/tablets 320, 375, 390, 430 and 768 px plus landscape
667×375, 844×390 and 932×430 (mobile emulation with touch). Safari, Firefox and physical phones were
**not** tested.

**Mobile audit (`mobile.mjs`, all passing at every viewport above):** no horizontal scroll, nothing
pushed off-screen or cropped; tap targets ≥ 44 px; text ≥ 15 px (median ≈ 16 px); 16–20 px phone
gutters; hero order heading → offer → buttons → portrait with the logos around it (clear of the face); full-width
form fields at 16 px (no zoom on focus); media below the hero lazy-loaded and no video or 3D bundle
on first load; video popup (16:9 and 9:16) fits the screen and closing stops playback; the sticky
Hire Me button never sits over a button, link or field. On touch screens, project previews play
while a card crosses the middle of the screen (one at a time; not with reduced motion or Data Saver).

**Interaction checks (40, all passing, portrait hero):** portrait WebP loads and is visible; new
headline in Manrope, no software text row; View My Work / Hire Me / Play Showreel visible; all
four badges clear of the face and buttons and fully on screen; badges float; no pause button in
the hero; static hero background (no floating balls or cursor effects); desktop parallax follows the pointer; on 320/375 px the portrait sits below the
intro/buttons with the badges around it, clear of the face; filters + empty state + `aria-pressed`; dialog opens, focuses Close, plays after click,
keeps focus inside, Esc closes and stops playback, focus returns to the card; vertical clip keeps
9:16; showreel opens honest empty state; 3D stops while a video plays; Process stage buttons; form
validation + focus on first error + no false success when unconfigured; social links
`target=_blank rel=noopener`; reduced motion (no floating, entrances or parallax; no pinning); no horizontal overflow at 320/375/768 px; mobile menu (modal,
Esc, focus return); sticky Hire Me shows mid-page and hides near the form; tap targets ≥ 40 px.

**Lab performance** (production build via `vite preview`, cold cache, this laptop — not field data;
runs varied noticeably):

Portrait hero (default) with the background photo — ≈ 300 KB transferred on first load. Latest runs:

| Profile | LCP | CLS | Slowest interaction |
|---|---|---|---|
| Desktop 1440×900, unthrottled | 1.0 – 2.0 s | 0 – 0.001 | 40 – 136 ms |
| Mobile 390×844, slow 4G + 4× CPU | 1.6 – 1.7 s (portrait image) | 0 | 72 – 136 ms |

On phones the portrait is the largest element. Sections below the hero use `content-visibility: auto`
for the first paint only (`.cv-done` lays everything out once the page is idle), which keeps the
slowed-down phone from laying out the whole page before showing the hero. Check field data after launch.

3D studio hero (`heroVisual = 'studio'`) — ≈ 590 KB: LCP 0.9 – 2.7 s desktop / 1.7 – 2.7 s
throttled mobile, CLS ≤ 0.04; entrance 1.48 s from first frame; the scene took ≈ 7 – 14 s to
appear on this GPU (cold shader cache, poster shown meanwhile) with blocking tasks up to ≈ 1 s.
Check field INP once real-user data exists.
