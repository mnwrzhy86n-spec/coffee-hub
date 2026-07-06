# ☕ Coffee Hub

Our family coffee handbook — a tiny static site that behaves like an iPhone app.
Live at: **https://mnwrzhy86n-spec.github.io/coffee-hub/**

## Put it on an iPhone home screen

1. Open the link above in **Safari**.
2. Tap the **Share** button → **Add to Home Screen**.
3. It launches full-screen with its own icon, works offline, and remembers checkboxes.

## Add real photos

Each step of the espresso guide has a photo slot. Until a photo exists, a placeholder
illustration shows instead. To fill a slot, drop a JPEG into `images/` with the exact name:

| File | Shows |
|---|---|
| `images/step-1-prep.jpg` | The machine, ready to go |
| `images/step-2-grind.jpg` | A correctly filled basket |
| `images/step-3-tamp.jpg` | Tamping level |
| `images/step-4-brew.jpg` | The shot flowing (honey-like) |
| `images/step-5-milk.jpg` | Jug filled to the right level |
| `images/step-6-clean.jpg` | Knocking out the puck |

From an iPhone: AirDrop the photos to the Mac, rename them, copy them into `images/`, then publish (below). Landscape ~4:3 photos look best.

## Edit content

Everything is plain HTML — no build step, no frameworks.

- `index.html` — home screen cards
- `espresso.html` — the 6-step guide (each step is a `<section class="step">`)
- `drinks.html` — drink ratio cards
- `cleaning.html` — cleaning checklists
- `troubleshooting.html` — symptom → fix cards
- `styles.css` / `app.js` — shared look and behavior

## Publish changes

```sh
git add -A
git commit -m "Update guide"
git push
```

GitHub Pages redeploys automatically in about a minute.

> **Note:** the site is cached for offline use. After publishing, bump the version
> string in `sw.js` (`coffee-hub-v1` → `coffee-hub-v2`) so phones pick up the new
> version, and reopen the app twice.
