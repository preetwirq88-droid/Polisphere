---
name: Academic Prestige
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#45464f'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#767680'
  outline-variant: '#c6c5d0'
  surface-tint: '#4f5c8e'
  primary: '#000f3f'
  on-primary: '#ffffff'
  primary-container: '#172554'
  on-primary-container: '#808dc2'
  inverse-primary: '#b7c4fd'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#16140f'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b2822'
  on-tertiary-container: '#948f87'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4fd'
  on-primary-fixed: '#071747'
  on-primary-fixed-variant: '#374475'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#e8e1d9'
  tertiary-fixed-dim: '#ccc6bd'
  on-tertiary-fixed: '#1e1b16'
  on-tertiary-fixed-variant: '#4a4640'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is rooted in the "Modern Academic" aesthetic, blending the historical prestige of traditional political science with the efficiency of a high-end SaaS platform. It targets serious students, researchers, and educators who value clarity and intellectual rigor.

The style is **Premium Minimalism**. It leverages heavy white space to create an editorial feel, reminiscent of high-end journals or quality broadsheets. By combining sophisticated serif typography with a hyper-functional sans-serif UI, the system achieves a "Digital Ivy League" atmosphere—authoritative yet accessible.

## Colors
The palette is built on a foundation of "Deep Navy," evoking stability and institutional trust. 

- **Primary & Accent:** Deep Navy is used for global navigation and core brand moments. Royal Blue is reserved for interactive elements, links, and progress indicators to provide a clear functional signal.
- **Surface Strategy:** The UI uses a "Warm White" background to reduce eye strain during long reading sessions, while "Pure White" is used for cards and containers to create a subtle layered effect.
- **Accents:** "Warm Beige" is used sparingly for decorative backgrounds or high-level category markers to soften the clinical nature of the navy and blue.

## Typography
This design system employs a dual-typeface strategy to balance character and utility.

- **Headlines:** Playfair Display provides an authoritative, editorial voice. Use it for page titles, article headers, and hero sections. Keep tracking slightly tight on larger sizes to maintain a premium "ink-on-paper" look.
- **Body & UI:** Inter is used for all functional text, long-form reading, and interface labels. Its high x-height ensures legibility in dense academic texts.
- **Hierarchy:** Maintain a clear contrast between serif headlines and sans-serif body. Avoid using Playfair Display for text smaller than 24px.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain a structured, book-like column width (max-width 1280px). 

- **Grid:** Use a 12-column grid for desktop with 24px gutters. For long-form reading content, center the container and restrict the width to 8 columns (approx. 720px) to optimize line length.
- **Rhythm:** Utilize vertical spacing of `lg` (48px) or `xl` (80px) between major sections to emphasize the "Minimal" brand personality. 
- **Mobile:** Transition to a 4-column fluid grid with 16px margins.

## Elevation & Depth
Depth is conveyed through **Low-contrast Outlines** and very soft shadows. This prevents the UI from feeling "heavy" or overly digital.

- **Surfaces:** Use 1px borders in `#E2E8F0` for most cards and containers.
- **Shadows:** When elevation is required (e.g., on hover or for modals), use a multi-layered, highly diffused shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`.
- **Tonal Layers:** Distinguish the main content area from the sidebar or utility panels using the `background_hex` (#F8FAFC) versus the `surface_hex` (#FFFFFF).

## Shapes
The shape language is "Refined Geometry." It avoids the extreme playfulness of full circles while shunning the harshness of sharp corners.

- **Cards:** Use a 16px (`rounded-lg`) radius to create a soft, modern container for academic content.
- **Buttons/Inputs:** Use a 12px radius. This is slightly tighter than the cards to signal interactivity and precision.
- **Small Elements:** Use 4px for tags or checkboxes to maintain a clean, crisp appearance.

## Components
- **Buttons:** Primary buttons use the Deep Navy (#172554) background with white text. Secondary buttons use the Royal Blue (#2563EB) for an outline or text-only style. Ensure a minimum height of 48px for a premium, tactile feel.
- **Cards:** White background, 1px `#E2E8F0` border, 16px corner radius. Use these for course modules, article previews, and student profiles.
- **Input Fields:** 1px border with a 12px radius. Use Inter 14px for labels (Text Primary) and 16px for input text. On focus, change the border color to Royal Blue.
- **Progress Indicators:** Use Royal Blue for active states. Maintain a thin, 4px height for progress bars to keep the look "Minimal."
- **Lists:** Use subtle dividers (1px `#F1F5F9`) between list items. Use 24px padding-top/bottom to maintain the editorial rhythm.
- **Imagery:** Use realistic photography of universities, libraries, and diverse student environments. Apply a subtle cool-toned overlay or desaturation to align images with the Navy/Slate palette.