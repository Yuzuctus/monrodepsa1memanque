# Mon Rode PSA1 me manque 💔

> RIP 2020 – 23/04/2026 19:54. The greatest microphone arm that ever lived.  
> It never failed me. Until that fateful day.
> A tribute page for a broken Rode PSA1. Black humor, BSOD popups, fake repair attempts that always fail, emoji rain, vine booms on every click, and a Konami code that grants you 5 seconds of happiness before dragging you back into grief.

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
│   ├── Discours-Hommage.mp3            # Spoken tribute to the arm
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
| **Konami Code** `↑↑↓↓←→←→ B A Enter` | 5-second party mode: rainbow background, sped-up music, then back to grayscale grief                                |
| Click anywhere at any time           | Vine boom sound effect                                                                                              |
| **"LIRE LE DISCOURS D'HOMMAGE"**     | Plays `assets/Discours-Hommage.mp3` and ducks background music during the tribute                                  |
| **"TENTER DE RÉPARER"** button       | BSOD popup with fake progress bars that always fail, then a random system error (KERNEL PANIC, SEGFAULT, 404, etc.) |
| Hover the repair button              | It spins violently                                                                                                  |
