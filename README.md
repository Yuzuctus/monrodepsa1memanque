# Mon Rode PSA1 me manque 💔

> RIP 2020 – 23/04/2026 19:54. The greatest microphone arm that ever lived.  
> It never failed me. Until that fateful day.
> A tribute page for a broken Rode PSA1. Black humor, BSOD popups, fake repair attempts that always fail, emoji rain, vine booms on every click, and a Konami code that grants you 2 seconds of happiness before dragging you back into grief.

## **[monrodepsa1memanque.yuzuctus.fr](https://monrodepsa1memanque.yuzuctus.fr/)**

## Tech Stack

Pure vanilla — no frameworks, no bundler, no npm.

- **HTML** — semantic, zero inline CSS or JS
- **CSS** — custom properties, well-organized, responsive
- **JavaScript** — modular vanilla JS split by feature

## Project Structure

```
├── index.html               # Entry point — clean HTML only
├── assets/                  # Images, audio
│   ├── bras.jpg             #   Tiled background (Rode PSA1 render)
│   ├── coffindancerodepsa1casser.jpg  # Disaster photo
│   ├── conffindancemusic.mp3           # Background mourning music
│   └── vine-boom-onclic.mp3            # Click sound effect
├── css/
│   ├── style.css            # Layout, components, BSOD, marquee, party mode
│   └── animations.css       # All @keyframes
├── js/
│   ├── app.js               # Entry point, overlay, module init
│   ├── bsod.js              # BSOD popup, fake progress bars, error messages
│   ├── konami.js            # Konami code Easter egg + party mode
│   └── effects.js           # Vine boom, cursor, counter, emoji rain, marquee
├── sitemap.xml
└── README.md
```

## Easter Eggs

| Trigger                              | Effect                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Konami Code** `↑↑↓↓←→←→ B A Enter` | 2-second party mode: rainbow background, sped-up music, then back to grayscale grief                                |
| Click anywhere at any time           | Vine boom sound effect                                                                                              |
| **"TENTER DE REPARER"** button       | BSOD popup with fake progress bars that always fail, then a random system error (KERNEL PANIC, SEGFAULT, 404, etc.) |
| Hover the repair button              | It spins violently                                                                                                  |

## Deploy

Deployed on **Cloudflare Pages** via **GitHub Actions** (`cloudflare/wrangler-action@v3`).

Every push to `master` triggers an automatic deploy — no manual steps.

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (scope: Cloudflare Pages — Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

`GITHUB_TOKEN` is provided automatically by GitHub Actions (permissions: `contents: read`, `deployments: write`).
