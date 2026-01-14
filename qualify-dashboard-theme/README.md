# Qualify Dashboard Theme

This package contains the **Brand Identity Theme** extracted from the Qualify Landing Page, optimized for a **HeroUI (v2.8+) + Tailwind CSS v4** dashboard environment using a **CSS-first** approach.

## Content
- `plugin.ts`: The HeroUI plugin configuration defining the `qualify-dark` theme and color palette.
- `theme.css`: The main entry point. Imports Tailwind, the plugin, and defines custom utilities and gradients.

## Installation

1. Copy this entire folder `qualify-dashboard-theme` to your dashboard project root (or `packages/`).
2. Install dependencies in your dashboard project:

```bash
npm install tailwindcss @tailwindcss/postcss postcss @heroui/react framer-motion
```

## Usage

### 1. Import CSS
In your main global CSS file (e.g., `src/index.css`), simply import the `theme.css` file. 

```css
@import "../qualify-dashboard-theme/theme.css"; 
/* Adjust path as needed */
```

**Note on `@source`:**
Inside `theme.css`, there is a `@source` directive pointing to `../node_modules/@heroui/theme/...`. Ensure this relative path is correct for where you place the theme folder in your new project. If your node_modules are further up, adjust it in `theme.css`.

### 2. Set the Theme
In your root layout or `html` tag, set the data-theme attribute:

```html
<html class="dark" data-theme="qualify-dark">
```

### 3. Usage in Components
You can now use standard HeroUI components. They will automatically use the "Cyber Matrix Green" palette defined in `plugin.ts`.

Custom Utilities available:
- `glass-panel`: Glassmorphism effect.
- `text-glow`: Neon text shadow.
- `bg-matrix`: Gradient background.
