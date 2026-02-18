# LAST NIGHT — Static Site

This repository contains the `LAST NIGHT` static site (HTML/CSS/JS) with a neon starfield theme, splash intro, and ticketing demo logic.

Local preview

1. From the project root run a simple static server (Python 3):

```bash
python -m http.server 8000

# then open http://localhost:8000 in your browser
```

Notes before publishing
- Media files (MOVs, large images) are located in `assets/` and may be large — pushing to GitHub will upload them as-is.
- For production payments, wire `TicketSystem.API_URL` to your backend and configure Stripe keys securely.

To publish on GitHub Pages

1. Create a repository on GitHub and push this project (or use `gh repo create ... --push`).
2. In the repository Settings → Pages, enable Pages from branch `main` and folder `/ (root)`.

Contact

If you want me to finish the GitHub push and Pages setup here, authenticate `gh` in this environment and tell me the desired repo name.
# LAST NIGHT - The Controlled Aftermath

A premium streetwear landing page designed for psychological conversion and brand exclusivity.

## Brand Identity

**Last Night** positions itself at the intersection of nightlife, streetwear, and the "morning after" culture. It's not just apparel; it's a badge for those who live in the fringes of the AM hours.

- **Vibe**: High-contrast, grainy, raw, and exclusive
- **The "ZZZ"**: Implies the crash after the high
- **Philosophy**: You aren't selling fabric; you're selling the memory of the night before

## Features

### Psychological Funnel Architecture

1. **Veblen Hero Section** - Scarcity-driven countdown timer, premium video background
2. **Logic of Exclusivity** - Limited product drops (3 items max)
3. **Community Feed** - CCTV-style tagged content from underground figures
4. **Blacklist Conversion** - SMS early-access signup with membership card visual

### Technical Features

- ⚡ Sub-500ms load time (static assets)
- 🎨 Custom cursor effects
- 📱 Fully responsive design
- 🛒 Cart with localStorage persistence
- ⏱️ Live countdown timer
- 🎞️ Video hero with grain overlay
- ✨ Scroll-based animations
- 📊 Animated statistics counter

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Primary background |
| White | `#FFFFFF` | Text, CTAs |
| Matrix Green | `#00FF41` | Accent, highlights |

## Typography

- **Primary**: Space Mono (monospaced, industrial feel)
- **Secondary**: Inter (clean body text)

## Setup

### 1. Add Your Assets

Create an `assets/` folder and add:

```
assets/
├── hero-video.mp4      # Hero background video (optional)
├── product-1.jpg       # Flagship product (3:4 ratio)
├── product-2.jpg       # Product 2
├── product-3.jpg       # Product 3
├── community-1.jpg     # Community image 1
├── community-2.jpg     # Community image 2
├── community-3.jpg     # Community image 3
├── community-4.jpg     # Community image 4
├── community-5.jpg     # Community image 5
└── community-6.jpg     # Community image 6
```

**Image Recommendations:**
- Product images: 800x1066px (3:4 ratio), grayscale or desaturated
- Community images: Various sizes, lo-fi/CCTV aesthetic
- Hero video: 10-15 seconds, loop-friendly, shaky cam aesthetic

### 2. Run Locally

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

### 3. Customize

Edit the `CONFIG` object in `script.js` to update:
- Product names, prices, and descriptions
- Stock quantities
- Drop end times

## Deployment

### Recommended Platforms

1. **Vercel** - Instant deploy, great performance
2. **Netlify** - Free tier, form handling
3. **Shopify** - Full e-commerce (requires migration)

### For Shopify Integration

To convert this to a Shopify theme:

1. Create a new theme in your Shopify admin
2. Upload assets to theme assets
3. Convert HTML to Liquid templates
4. Connect products via Shopify's Admin API
5. Consider Shopify Plus for high-volume flash drops

## Million-Dollar Strategy Implementation

### 1. Engineered Scarcity
- Display lower stock counts than actual inventory
- Use "SOLD OUT" badges aggressively
- Reset countdown for each drop

### 2. Mystery Box/Bundle
- High-ticket item ($285) already implemented
- Contains unreleased gear for AOV spike
- No refunds policy creates urgency

### 3. Blacklist SMS System
- Connect form to SMS service (Twilio, Postscript)
- Send access codes 15 minutes before public
- Build owned audience outside social platforms

## Performance Optimization

The site is optimized for speed:

- Minimal JavaScript (vanilla, no frameworks)
- System fonts fallback
- CSS animations over JavaScript
- Lazy loading for images
- No unnecessary dependencies

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

All rights reserved. This template is provided for personal and commercial use.

---

**FOR THE ONES WHO NEVER LEFT.**
