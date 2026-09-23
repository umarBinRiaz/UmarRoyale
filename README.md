# UMAR ROYALE — Perfume E-commerce Website

A luxury perfume e-commerce website with a comprehensive admin panel, built with vanilla HTML, CSS, and JavaScript.

## Features

### Main Website (index.html)
- Responsive Design — 320px to 4K screens
- Pure CSS Components — checkbox/radio hacks, scroll-driven animations, lightbox galleries, carousels, filterable product grids
- E-commerce — product catalog, shopping cart, checkout with WhatsApp integration, order management
- Dark/light theme toggle, cinematic intro animation, glass-morphism effects
- Mobile-optimized touch interface with responsive navigation drawer

### Admin Panel (admin.html)
- Professional CMS dashboard with Bootstrap 5
- Live data sync with storefront via localStorage
- Product management, order tracking, settings
- Passcode-protected access

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — Grid, Flexbox, Custom Properties, Scroll-driven animations, `:has()`, `:target()`
- **JavaScript** — Vanilla, localStorage persistence, cross-tab sync
- **No build tools, no frameworks, no dependencies**

## File Structure

```
.
├── index.html          ← Main storefront
├── admin.html          ← Admin/CMS panel
├── store.js            ← E-commerce engine (cart, products, checkout)
├── server.js           ← Local Node.js dev server (optional)
├── package.json        ← NPM manifest (no dependencies)
├── css/
│   └── index.css       ← All website styles (1950 lines)
├── assets/
│   ├── 01.png–05.png   ← Product images
│   ├── images.jpg      ← Product thumbnail
│   └── u.png           ← Favicon
└── README.md
```

## Usage

### Quick Start (no server needed)
Open `index.html` directly in a browser. The site works as a static website.

### Local Development Server
```bash
npm start
# Server runs at http://localhost:3000
```

### Admin Panel
Navigate to `admin.html` (link in the footer). Default passcode: `royale2026`.

### GitHub Pages Deployment
Push to GitHub and enable Pages in repo settings. The site is fully static — no server required.

## Customization

- **Products**: Edit the `DEFAULT_PRODUCTS` array in `store.js`
- **Branding**: Modify CSS variables in `:root` block of `css/index.css`
- **WhatsApp number**: Configure in admin panel settings
- **Content**: Update HTML directly in `index.html`

## Browser Support

- Chrome, Firefox, Safari, Edge (desktop)
- Android Chrome, iOS Safari (mobile)
- Tablets (iPad, Android)

## License

ISC
