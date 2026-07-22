# कalam काvya 🖋️✨ — Product Design Document (PDD) & UX Requirements

> **Version**: 1.0  
> **Target Audience**: UI/UX Design & Frontend Engineering Teams  
> **Project Scope**: The All-in-One Studio & Narrative Engine for Authors, Worldbuilders, and Story Architects  
> **Status**: Approved Blueprint for Design & Interface Implementation  

---

## 1. Executive Summary

### Product Overview
**कalam काvya** is an all-in-one desktop and web-based narrative studio designed specifically for fiction authors, screenwriters, worldbuilders, and story architects. It bridges the gap between distraction-free manuscript drafting, encyclopedic worldbuilding, cast relationship management, and privacy-first artificial intelligence (local LLMs via Ollama/LM Studio and cloud LLMs via OpenAI/Groq/OpenRouter).

### Primary Value Proposition
Existing creative tools force writers to constantly context-switch between disparate apps (Scrivener for drafting, Notion/Obsidian for worldbible notes, WorldAnvil for lore, and web browser tabs for ChatGPT). कalam काvya unifies these workflows into a single offline-first, highly tactile environment where the AI engine possesses complete, context-aware awareness of the user's active scene, characters, and lore while maintaining 100% data sovereignty and privacy.

### Overall Design Vision
*"Warm literary craftsmanship meets high-efficiency studio tools."*  
The interface must evoke the aesthetic satisfaction of a master bookbinder's desk paired with the speed and precision of a high-performance developer IDE. It prioritizes focus, clarity, high information density without clutter, and fluid micro-interactions.

### Primary Business Goals
1. **Market Leadership**: Establish कalam काvya as the premier narrative software for serious authors and worldbuilders.
2. **User Retention**: Achieve high daily active usage (DAU) by creating a friction-free, flow-state drafting environment.
3. **Data Sovereignty Champion**: Build a strong brand reputation for offline dependability and privacy-first local AI integration.

### Primary User Goals
1. **Uninterrupted Flow State**: Draft prose without UI distractions while retaining instant keyboard access to project lore.
2. **Cohesive Story Architecture**: Effortlessly track complex character arcs, relationship webs, and worldbuilding rules across multi-volume projects.
3. **Privacy-Preserved AI Co-Pilot**: Harness AI for creative brainstorming and consistency checks without uploading confidential manuscript drafts to public cloud models.

---

## 2. User Personas & Scenarios

### Persona 1: Elena Vance — The Epic Worldbuilder & Sci-Fi/Fantasy Author
* **Demographics & Role**: 34, Independent Fantasy Novelist & Game Worldbuilder.
* **Core Goals**: Construct intricate magic/technology systems, track 30+ characters across a multi-book series, write 2,000 words daily.
* **Frustrations**: Fragmented notes in separate apps, losing track of cross-referenced lore, fear of cloud AI models training on her unreleased intellectual property.
* **Technical Proficiency**: High. Uses local LLMs (Ollama), keyboard shortcuts, and customized markdown workflows.

### Persona 2: Marcus Chen — The Indie Screenwriter & Genre Author
* **Demographics & Role**: 42, Full-Time Genre Fiction Writer & Screenplay Architect.
* **Core Goals**: Visually map story arcs across acts, run daily gamified word sprints, export manuscript clean to EPUB/DOCX for publishers.
* **Frustrations**: Cluttered tools with slow load times, rigid narrative software lacking drag-and-drop index cards, distracting UI chrome during writing.
* **Technical Proficiency**: Moderate. Values clean, intuitive visual design, fast offline launch, and keyboard efficiency.

### "Day in the Life" Scenario: Elena's Writing Session
1. **08:00 AM — Coffee Shop Launch**: Elena opens कalam काvya on her laptop without Wi-Fi. The desktop app launches instantly (<1s) into her active project.
2. **08:02 AM — Entering Flow State**: She selects Chapter 4, Scene 1 in the **Manuscript Studio** and hits `Ctrl+F` (Focus Mode). The sidebars smoothly retract, leaving a clean serif canvas. She launches a 20-minute Word Sprint using the floating `<Timer>` widget.
3. **08:12 AM — Instant Lore Lookup**: While writing, Elena needs to verify the rules of the "Solar Core Artifact". She types `@` or hits `Ctrl+K` (Global Search), previews the artifact entry in a lightweight popover, inserts a cross-link chip, and resumes typing without moving her hands from the keyboard.
4. **08:18 AM — Local AI Brainstorming**: Stuck on a dialogue transition, she opens the **AI Co-Pilot Drawer** (`Sparkles`). Her local Ollama model reads the active scene context and suggests three voice-consistent dialogue options. She picks option 2 with one click.
5. **08:22 AM — Sprint Complete**: A subtle chime and radial glow celebrate her completing 540 words (+15% over velocity goal). Her project metrics automatically update in IndexedDB.

---

## 3. Information Architecture (IA)

```
[ कalam काvya Studio ]
 ├── 📊 1. Dashboard (Overview & Analytics)
 │    ├── Project Metrics & Word Target Gauge
 │    ├── Quick Sprint Launcher
 │    └── Recent Scenes & Activity Feed
 │
 ├── ✍️ 2. Manuscript Studio
 │    ├── Focus Prose Editor (TipTap Engine)
 │    ├── Drag-and-Drop Scene Planner (@dnd-kit Board)
 │    └── Visual Index Card Outline View
 │
 ├── 📚 3. World Bible & Codex
 │    ├── Category Grid (Locations, Factions, Magic/Tech, Artifacts, Cultures, Timelines)
 │    ├── Dynamic Genre Modules (Vedic/Puranic, Sci-Fi, Rom-Com, Epic Fantasy, Thriller)
 │    └── Entity Detail Inspector & Lore Cross-Linker
 │
 ├── 👥 4. Cast Studio
 │    ├── Character Dossier Cards & Profile Inspector
 │    ├── Interactive Relationship Web & Matrix (ReactFlow Graph)
 │    └── Voice Guidelines & Avatar/Art Direction Generator
 │
 ├── 🛠️ 5. Author's Toolkit
 │    ├── Gamified Word Sprint Timer Widget
 │    ├── Context-Aware AI Co-Pilot Drawer
 │    └── Multi-Format Exporter Studio (EPUB, PDF, DOCX, Markdown)
 │
 └── ⚙️ 6. Project & AI Settings
      ├── AI Provider Manager (Ollama, LM Studio, OpenAI, Groq, OpenRouter)
      ├── Genre Schema Configuration
      └── Local Data Sovereignty (IndexedDB Backup / Export / Import)
```

---

## 4. Core User Flows

### Flow 1: Focus Drafting with Contextual Lore Cross-Linking
```
[ Open Manuscript Studio ] ──> [ Select Chapter/Scene ] ──> [ Press Ctrl+F (Focus Mode) ]
                                                                      │
[ Write Prose in TipTap Editor ] <── [ Insert Cross-Link Chip ] <── [ Type '@' or Ctrl+K ]
```
* **Happy Path**: User selects scene -> Enters Focus Mode (`Ctrl+F`) -> UI sidebars retract -> User types prose -> Types `@` or `Ctrl+K` -> Inline popover filters Lore & Characters -> User selects entry -> Interactive chip tag is inserted -> Flow state continues.
* **Error Handling**:
  * *No search matches*: Popover displays "No lore entity found. [ + Quick-Create Codex Entry ]" allowing inline creation without leaving scene.
  * *Storage quota warning*: If IndexedDB approaches limit, non-intrusive warning chip offers one-click JSON backup.

### Flow 2: Character Dossier & Interactive Relationship Mapping
```
[ Open Cast Studio ] ──> [ Select Relationship Web ] ──> [ Drag Line between Character Nodes ]
                                                                      │
[ Graph Updates with Color-Coded Connection ] <── [ Select Relationship Type & Sentiment ]
```
* **Happy Path**: User opens Cast Studio -> Switches to "Relationship Web" tab -> ReactFlow canvas displays character nodes -> User drags connector line from Character A to Character B -> Modal prompts for relationship type (e.g., "Rival", "Rivalry Sentiment: -8") -> Connection renders with custom animated edge styling.
* **Error Handling**:
  * *Self-linking attempt*: Prevents invalid connections with clear toast notification.
  * *High node count (50+)*: Canvas automatically enables node clustering and search filter to maintain 60fps.

### Flow 3: Privacy-First AI Co-Pilot Brainstorming & Prose Polish
```
[ Highlight Prose or Open Drawer ] ──> [ Click AI Action Chip ] ──> [ System Assembles Scene Context ]
                                                                                    │
[ Stream Response from Ollama/Cloud ] ──> [ Click "Replace Selection" or "Insert at Cursor" ]
```
* **Happy Path**: User selects prose block -> Clicks AI Co-Pilot (`Sparkles`) -> Chooses prompt preset ("Enhance Sensory Details") -> Engine gathers context (active scene + active POV character + linked lore) -> Streams output from local Ollama endpoint -> User clicks "Replace Selection" -> Text updates with subtle diff highlight animation.
* **Error Handling**:
  * *Ollama service offline*: AI Drawer displays: *"Local AI Endpoint (localhost:11434) Unreachable. [ Test Connection ] [ Switch to Cloud API ]"*.

---

## 5. Screen-by-Screen Functional Requirements

### 1. Dashboard & Project Overview
* **Purpose**: Command center for tracking project health, writing velocity, daily goals, and recent scenes.
* **Key UI Elements**: Circular goal progress ring, word velocity graph, recent scenes quick-list, word sprint launcher button, quick-action creation buttons (`+ Scene`, `+ Character`, `+ Codex`).
* **Data Displayed**: Total manuscript word count, daily target progress (e.g., 1,450 / 2,000 words), chapter completion status, active sprint velocity (words/min).
* **States**:
  * **Empty State**: Warm welcome hero banner with "Create First Manuscript" or "Load Sample World" (Vedic Myth, Rom-Com, Sci-Fi).
  * **Loading State**: Shimmer skeleton blocks across statistics cards.
  * **Error State**: Non-blocking toast alert if project metrics fail to load, with manual refresh button.
  * **Success State**: Smooth progress ring animation with green/amber metric gauges.

### 2. Manuscript Studio (Editor & Scene Planner)
* **Purpose**: Primary workspace for drafting prose, organizing chapter outlines, and visual drag-and-drop scene planning.
* **Key UI Elements**: TipTap rich text canvas, floating formatting menu, collapsible chapter sidebar tree, `@dnd-kit` Kanban board for scene cards, word count & target progress bar, Focus Mode toggle button.
* **Data Displayed**: Scene prose, scene title, status badge (Draft, Revision, Final), word count, POV character avatar tag, location tag, scene notes.
* **States**:
  * **Empty State**: "No scenes in this chapter yet. [ + Add First Scene ]".
  * **Loading State**: Content skeleton over canvas and chapter tree.
  * **Error State**: Autosave indicator turns amber/red with "Local save pending - retrying in 3s".
  * **Success State**: Clean canvas with subtle "All changes saved locally" status indicator in footer.

### 3. World Bible & Codex
* **Purpose**: Centralized encyclopedic repository for worldbuilding lore, locations, magic/tech systems, artifacts, cultures, and timelines.
* **Key UI Elements**: Category tab bar (Locations, Factions, Magic/Tech, Artifacts, Cultures, Timelines), search & filter bar, genre module dropdown, entity grid card layout, detail inspection drawer.
* **Data Displayed**: Entity title, category tag, thumbnail avatar, genre schema fields (e.g., Deva alignment, Sci-Fi propulsion), cross-linked characters and scenes.
* **States**:
  * **Empty State**: Category illustration with "No Factions created yet. [ + Create Faction ] [ Generate with AI ]".
  * **Loading State**: Grid card shimmer effect.
  * **Error State**: Field validation error alert on missing required metadata.
  * **Success State**: Responsive card grid with instant search and filtering.

### 4. Cast Studio (Character Dossiers & Relationship Web)
* **Purpose**: Comprehensive character profile management and visual relationship network design.
* **Key UI Elements**: Character card grid, tabbed dossier inspector (Psychology, Voice, Arc, Appearance), avatar prompt generator, ReactFlow relationship graph canvas, connection editor modal.
* **Data Displayed**: Character name, archetype badge (Protagonist, Antagonist, Supporting), visual avatar, psychological flaw, core motivation, voice guidelines, relationship links.
* **States**:
  * **Empty State**: "Your story cast is empty. [ + Create Character ] [ Import Sample Cast ]".
  * **Loading State**: Avatar skeleton shimmer and graph loading spinner.
  * **Error State**: Graph rendering fallback to structured list view if WebGL context is unavailable.
  * **Success State**: Interactive node graph with hover highlights and dynamic filtering.

### 5. AI Co-Pilot Drawer
* **Purpose**: Context-aware writing assistant for brainstorming, dialogue polishing, and consistency checks.
* **Key UI Elements**: Collapsible right drawer, AI model provider selector (Ollama, LM Studio, OpenAI, Groq, OpenRouter), quick-prompt chips, prompt textarea, markdown response container, action bar (Insert at Cursor, Replace Selection, Copy).
* **Data Displayed**: Active scene/POV context badges, model latency meter (ms), token estimate, streamed markdown output.
* **States**:
  * **Empty State**: Grid of prompt suggestion chips ("Brainstorm 3 scene escalations", "Sharpen dialogue", "Sensory descriptions").
  * **Loading State**: Animated typing indicator with real-time text streaming.
  * **Error State**: Connection alert with diagnostic instructions & quick switch to alternate provider.
  * **Success State**: Formatted markdown response with action buttons.

### 6. Author's Toolkit & Multi-Format Exporter
* **Purpose**: Manage timed word sprints and compile finished manuscripts into publication formats.
* **Key UI Elements**: Word sprint timer widget, live velocity gauge (words/min), format selector cards (EPUB, PDF, DOCX, Markdown), typography preview toggle, front/back matter switches, "Compile & Export" CTA button.
* **Data Displayed**: Countdown timer, sprint word progress, export format options, manuscript preview.
* **States**:
  * **Empty State**: N/A.
  * **Loading State**: Animated progress bar ("Compiling EPUB package...").
  * **Error State**: Validation warning if manuscript contains empty chapters or missing metadata.
  * **Success State**: Completion banner with file download trigger and file size metrics.

---

## 6. UX & Interaction Guidelines

### Micro-Interactions
* **Buttons & Controls**: 150ms ease-out transitions. Scale to `1.02x` on hover; `0.98x` on click.
* **Drag-and-Drop Scene Cards**: On drag start, scene cards elevate with shadow, apply `5deg` tilt, and show drop placement indicator.
* **Autosave Feedback**: Subtle checkmark animation in footer status bar (`Saved 10:42 AM`) without disruptive toasts.
* **Sprint Goal Celebration**: Radial progress ring fill with particle confetti explosion when sprint target is hit.

### Cognitive Load & Data Entry Streamlining
* **Distraction-Free Mode (`Ctrl+F`)**: Instantly hides navigation sidebars and headers, leaving only the writing canvas and subtle word count meter.
* **Progressive Disclosure**: Detailed character/lore metadata is organized into focused tabs (Basic, Psychology, Voice, Relationships) to prevent form fatigue.
* **Keyboard-First Navigation**: Global Command Palette (`Ctrl+K`) allows instant navigation, lore search, and command execution without leaving the keyboard.

---

## 7. UI & Branding Direction (Conceptual)

### Visual Direction
**Modern Literary Studio** — Sophisticated, warm, distraction-free aesthetic that combines classical bookbinding craftsmanship with modern dark-mode software interfaces.

### Color Palette Strategy
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Primary Theme: Midnight Velvet (Dark Mode Default)                      │
│ █ Background: #0F1117 (Deep Obsidian)                                  │
│ █ Card Surface: #1E222D (Slate Charcoal)                                │
│ █ Elevated Surface: #262B38 (Dark Steel)                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Secondary Theme: Warm Parchment (Light Mode Option)                     │
│ █ Background: #FBF9F4 (Cream Parchment)                                │
│ █ Card Surface: #FFFFFF (Pure White)                                    │
│ █ Border/Divider: #E5E0D8 (Warm Linen)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ Accent & Brand Palette                                                  │
│ █ Primary Accent: #D97706 (Warm Amber Gold)                             │
│ █ Secondary Accent: #8B5CF6 (Deep Literary Violet)                      │
│ █ Highlight Glow: #F59E0B (Amber Sparkle)                              │
├─────────────────────────────────────────────────────────────────────────┤
│ Semantic Palette                                                        │
│ █ Success: #10B981 (Emerald Green)                                      │
│ █ Warning: #F59E0B (Warm Ochre)                                         │
│ █ Error: #EF4444 (Crimson Red)                                          │
│ █ Info: #6366F1 (Sky Indigo)                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Typography Hierarchy
* **Prose & Manuscript Editor**: Serif — **Merriweather** / **Lora** (18px, 1.7 line height, 65-75 chars per line optimal measure).
* **Display & Section Titles**: Display Serif — **Cinzel** / **Playfair Display** (24px - 36px, medium weight).
* **UI Controls & Navigation**: Sans-Serif — **Inter** / **Outfit** (12px - 14px, medium weight).
* **Keyboard Shortcuts & Code**: Monospace — **JetBrains Mono** / **Fira Code** (12px, tabular figures).

---

## 8. Edge Cases & Accessibility

### Edge Cases
1. **Extremely Long Manuscripts (150,000+ Words across 100+ Scenes)**: Use virtualized list rendering (`react-window`) in sidebar outlines to maintain 60fps scrolling performance without DOM bloat.
2. **Offline Local AI Service Crash**: If Ollama or LM Studio service drops mid-generation, the system catches connection error silently, preserves user prompt, displays a non-blocking toast, and offers alternate providers.
3. **Unsaved Local Storage on Window Exit**: Tauri window intercept prompts confirmation modal if pending IndexedDB transactions remain unsaved.
4. **Zero Data State on Initial Launch**: First-time users see an interactive 5-step tour with instant-load buttons for pre-built sample story worlds (Vedic Myth, Rom-Com, Sci-Fi).
5. **High Node Count in Relationship Web (50+ Characters)**: ReactFlow canvas auto-activates node clustering and search filter to maintain rendering performance.

### Accessibility Requirements (WCAG 2.1 AA Compliance)
* **Color Contrast**: Maintain minimum `4.5:1` contrast ratio for all text controls in both Dark (Midnight Velvet) and Light (Warm Parchment) themes.
* **Keyboard Navigation**: Complete tab-stop order for all interactive controls; active elements display a visible `2px` amber focus ring (`#F59E0B`).
* **Screen Reader Support**: Semantic HTML5 tags (`<main>`, `<nav>`, `<aside>`, `<header>`), `aria-expanded` attributes on collapsible sidebars, and `aria-live="polite"` on sprint timers and autosave indicators.
* **Reduced Motion**: Respect `prefers-reduced-motion` to disable complex graph animations, drawer transitions, and particle confetti effects.
