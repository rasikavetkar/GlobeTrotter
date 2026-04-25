---
name: Cinematic Explorer
colors:
  surface: '#081613'
  surface-dim: '#081613'
  surface-bright: '#2e3c38'
  surface-container-lowest: '#04110d'
  surface-container-low: '#101e1b'
  surface-container: '#15221f'
  surface-container-high: '#1f2d29'
  surface-container-highest: '#2a3834'
  on-surface: '#d6e6e0'
  on-surface-variant: '#b9caca'
  inverse-surface: '#d6e6e0'
  inverse-on-surface: '#25332f'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#e9feff'
  on-tertiary: '#003739'
  tertiary-container: '#73f0f6'
  on-tertiary-container: '#006c70'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#79f5fb'
  tertiary-fixed-dim: '#59d8de'
  on-tertiary-fixed: '#002021'
  on-tertiary-fixed-variant: '#004f52'
  background: '#081613'
  on-background: '#d6e6e0'
  surface-variant: '#2a3834'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 24px
---

## Brand & Style

This design system is built to evoke the thrill of high-tech discovery and the precision of modern exploration. The brand personality is **Adventurous, Cutting-Edge, and Immersive**, positioning the app not just as a utility for planning, but as a sophisticated navigator for the digital age.

The aesthetic is rooted in **Cinematic Glassmorphism**. We utilize deep, obsidian backgrounds that suggest the vastness of space or the deep sea, layered with luminous, neon-tinted translucent interfaces that feel like a high-tech viewfinder. This style balances a sense of mystery with hyper-modern clarity. Every interaction should feel like a frame from a premium sci-fi documentary—fluid, high-impact, and visually arresting.

## Colors

The palette is anchored in a **Dark Mode** default to maximize visual impact and ensure accent colors feel like light sources within the interface.

- **Primary (Electric Cyan):** Used for core branding and high-priority interactions. It provides a luminous, "neon" focal point against the dark canvas.
- **Secondary (Emerald Green):** A vibrant, high-energy green for secondary actions, success states, and progress indicators. It evokes growth and energy.
- **Tertiary (Neon Ice):** A lighter, ethereal blue used for subtle accents and glowing elements, providing a cool contrast.
- **Neutral (Obsidian & Steel):** Backgrounds are rendered in deep blacks and very dark grays to ensure the glass effects and primary typography pop with maximum intensity.

## Typography

This design system employs a high-contrast typographic pairing to bridge the gap between editorial elegance and functional clarity.

- **Noto Serif** is used for headlines and display text. Its sophisticated terminals and varying stroke weights lend a premium, "travel magazine" feel to the interface.
- **Inter** handles all functional UI elements, body copy, and labels. Its neutral, geometric construction ensures maximum readability across different devices, especially in high-contrast dark environments.
- **Letter Spacing:** Headlines use slight negative tracking for a tighter, cinematic look, while labels use expanded tracking for a refined, modern "engineered" touch.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model designed to showcase high-resolution imagery. We utilize a 12-column system for tablet and desktop, collapsing to a single column with generous 24px side margins on mobile.

The rhythm is dictated by a strict 8px base unit. To maintain a "premium" feel, we prioritize whitespace (negative space) over dense information packing. Content should "breathe," with large margins ensuring that the background glass effects and imagery are always part of the composition.

## Elevation & Depth

Visual hierarchy is established through **Backdrop Blurs and Luminous Stacking** rather than traditional heavy shadows.

- **Surface Layers:** The base layer is the Obsidian background. Overlays use a semi-transparent cyan or white tint with a `blur` value between 12px and 20px.
- **Borders:** "Ghost" borders are critical—1px solid strokes at 10-15% opacity to define edges without adding visual weight.
- **Shadows:** When used, shadows are "Glowing"—extremely diffused, low-opacity, and tinted with the primary cyan color to suggest light emitting from the UI.
- **Z-Index:** Interactive elements and floating action buttons occupy the highest Z-layer, often accompanied by a subtle outer glow using the Electric Cyan or Emerald Green accent color.

## Shapes

The shape language is **Rounded and Organic**, reflecting the fluid nature of discovery and movement. 

Standard components use a 0.5rem (8px) radius. Larger interactive elements, such as destination cards and primary containers, utilize a 1rem (16px) or 1.5rem (24px) radius to create a soft, friendly silhouette that contrasts against the high-energy "neon" color palette. Buttons may use a fully pill-shaped profile for high-frequency actions.

## Components

### Buttons
- **Primary:** Solid Electric Cyan with dark text. Designed for maximum visibility.
- **Secondary:** Glassmorphic background with a cyan ghost border. 
- **Tertiary:** Text-only in Neon Ice with a glowing hover state.

### High-Impact Image Cards
The centerpiece of the app. Cards feature edge-to-edge photography with a subtle dark gradient overlay to ensure white typography remains legible. On hover, cards scale slightly (1.02x) and increase their primary cyan backdrop glow.

### Progress Indicators
Used for group voting tallies. These are horizontal bars using the Emerald Green color. They feature a "neon" inner glow effect to feel like light-tubes, fitting the cinematic high-tech theme.

### Form Elements
- **Inputs:** Underlined or subtle glass-filled boxes with Electric Cyan floating labels.
- **Checkboxes/Radios:** Custom-styled circles using Emerald Green for "active" states.

### Additional Elements
- **Interactive Map Pins:** Pulsing glows using the primary Cyan color to indicate trending choice.
- **Glass Sheets:** Modal sheets that slide up using heavy backdrop blur to maintain context of the underlying map or imagery.