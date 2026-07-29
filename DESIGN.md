---
name: Kalam Kavya
description: The All-in-One Studio & Narrative Engine for Authors, Worldbuilders, and Story Architects
colors:
  canvas: "#FFFFFF"
  surface: "#F9F9F9"
  deep: "#F0F0F0"
  ink: "#000000"
  primary: "#000000"
  secondary: "#666666"
  ghost: "#A1A1A1"
  border-subtle: "#E5E5E5"
typography:
  display:
    fontFamily: '"Playfair Display", serif'
  body:
    fontFamily: '"Inter", "Geist", sans-serif'
  editor:
    fontFamily: '"Lora", "Merriweather", serif'
  mono:
    fontFamily: '"JetBrains Mono", "Fira Code", monospace'
---

# Design System: Kalam Kavya

## Overview

**Creative North Star: "The Architectural Galley Proof"**

The defining metaphor is a raw, unbound manuscript laid out on a minimalist architect's desk. There are no leather-bound books, no skeuomorphic paper textures, and no decorative chrome. It is the stage just before publication—where the scaffolding of the world is pinned to the walls with invisible precision. The UI acts as a structural blueprint: invisible gridlines, hairline rules, and pure typography holding the author's imagination in place.

Stark, rigorous, and deeply quiet. The app operates like a sensory deprivation tank for the author's inner critic. By stripping away all background fills, heavy borders, and visible scrollbars, the interface achieves a state of total visual silence. It feels stark and academic, but highly breathable—the only thing permitted to make noise on the screen is the author’s own text and the gentle, analytical pulse of the Lore AI.

**Key Characteristics:**
- Absolute flatness with zero physical depth or shadows.
- Total reliance on grayscale high-contrast typography.
- Invisible structural borders and 1px hairline dividers.
- Tactile, weightless interactions using micro-animations and typography shifts instead of background fills.

## Colors

A rigorously restrained grayscale palette that refuses to distract from the written word. 

### Neutral
- **Canvas** (#FFFFFF): The foundational background for all authorial prose and empty space.
- **Surface** (#F9F9F9): A barely-there separation layer for sidebar navigation and secondary panes.
- **Deep** (#F0F0F0): Used sparingly for active states or subtle grouping indicators.
- **Ink / Primary Text** (#000000): The absolute highest contrast for all primary reading text, headings, and active links.
- **Secondary Text** (#666666): For metadata, word counts, and less critical UI labels.
- **Ghost Text** (#A1A1A1): For disabled states, placeholders, and extremely subtle hints.
- **Border Subtle** (#E5E5E5): The structural 1px gridline that separates panes without drawing the eye.

### Named Rules
**The Sensory Deprivation Rule.** No accent colors are permitted. Colors like Terracotta, Sage, and Dusty Blue are completely neutralized into black and white. Color is reserved entirely for the user's uploaded art and conceptual content.

## Typography

**Display Font:** Playfair Display (with serif)
**Body/UI Font:** Inter, Geist (with sans-serif)
**Editor/Prose Font:** Lora, Merriweather (with serif)
**Mono Font:** JetBrains Mono, Fira Code (with monospace)

**Character:** Highly legible and deeply academic. The UI relies on crisp geometric sans-serifs (Inter/Geist) for structural scaffolding, while the author's actual work is elevated with classic, editorial serifs (Lora/Merriweather) to evoke print publishing.

### Hierarchy
- **Display** (300-400): Empty state hero headers and major brand moments.
- **Headline** (600-700): View titles, manuscript chapters.
- **Body** (400): Standard UI elements, buttons, and navigation.
- **Label** (700, uppercase, tracking-wider): Micro-typography used in place of heavy badges for metadata (e.g., 10px uppercase tags for word counts).

### Named Rules
**The Micro-Typographic Badge Rule.** Never use heavy, colored box backgrounds for tags or badges. Use uppercase, heavily tracked micro-typography (`text-[10px] uppercase tracking-wider`) separated by a hairline border.

## Layout

A flexible, pane-based layout that prioritizes the central editor column. Spacing is mathematically precise, relying heavily on negative space (padding of `1.5rem` to `2rem` inside cards and columns) to let the content breathe. 

## Elevation & Depth

Absolutely flat. The UI refuses to cast shadows or claim physical depth.

### Named Rules
**The Weightless Plane Rule.** Surfaces rest entirely on a flat plane. Shadows (`box-shadow`) and glassmorphism (`backdrop-blur`) are strictly forbidden. Separation between elements is achieved exclusively through 1px subtle borders or generous negative space.

## Shapes

Harsh, minimalist, and un-styled. Corners are kept entirely sharp (`rounded-none`) to reinforce the "architectural blueprint" metaphor. Forms and inputs use 1px borders without glowing focus rings (except for accessibility).

## Components

Interactive elements do not feel like physical "buttons" or "cards"—they feel like editorial annotations.

### Buttons & Actions
- **Shape:** Sharp (`rounded-none`) or entirely text-based.
- **Primary:** Stark high-contrast (`bg-ink text-canvas`), mostly reserved for the most critical actions (like "New Project").
- **Ghost / Text Links:** Typeset as simple text links.
- **Hover / Focus:** Hovering triggers subtle typographical shifts (e.g., an underline appearing, or an opacity change) rather than a background fill.
- **Destructive:** Destructive actions (like Delete) remain neutral grayscale, utilizing progressive disclosure (appearing only on hover) rather than shouting in red.

### Cards / Containers
- **Corner Style:** Sharp (`rounded-none`).
- **Background:** `bg-surface` or `bg-canvas`.
- **Shadow Strategy:** No shadows.
- **Border:** `1px solid border-subtle`.
- **Internal Padding:** Generous (e.g., `p-6`).

## Do's and Don'ts

### Do:
- **Do** use `rounded-none` and `border-subtle` for all cards and containers.
- **Do** use progressive disclosure (`opacity-0 group-hover:opacity-100`) for secondary and destructive actions to keep the default view clean.
- **Do** use uppercase micro-typography (`text-[10px] font-bold tracking-wider`) instead of bulky filled badges.

### Don't:
- **Don't** use `shadow-sm`, `shadow-md`, or `glass-card-hover` classes.
- **Don't** use background color fills for active states in navigation; use a 2px left border or bold text instead.
- **Don't** use non-grayscale colors (like red, blue, or green) for success/error/warning states; rely on typography weight, icons, and text labels instead.
