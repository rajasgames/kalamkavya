# Product Requirements & Overview: कalam काvya

## 1. Product Overview
**कalam काvya** is an all-in-one studio and narrative engine designed specifically for authors, worldbuilders, and story architects. It serves as a comprehensive workspace that bridges the gap between distraction-free manuscript drafting, encyclopedic worldbuilding, character cast management, interactive flowcharts, and context-aware artificial intelligence.

## 2. Target Audience
- **Novelists & Authors:** Writers of high fantasy, hard sci-fi, contemporary romance, and mystery.
- **Worldbuilders & Game Designers:** Creators who need to manage complex lore, factions, and magic/technology systems.
- **Story Architects:** Planners who rely on visual outlining, beat sheets, and character arcs.

## 3. Core Value Proposition
To provide a unified, privacy-first, and highly visual environment that gives creators complete control over their narrative universe without needing to switch between disjointed tools (e.g., Word, Notion, Scrivener, Miro).

## 4. Key Features (The 4 Core Pillars)

### 4.1 Manuscript Studio
- **Focus Prose Editor:** Clean, rich-text editor with real-time word counting, target goal progress rings, and a distraction-free focus mode.
- **Drag-and-Drop Scene Planner:** Organize scenes visually across acts and narrative arcs using visual Kanban-style drag-and-drop.
- **Visual Index Card Outline:** High-level structural overview with color-coded scene cards and instant status updates.

### 4.2 World Bible & Codex
- **Encyclopedic Lore Categories:** Dedicated management for Locations, Factions, Magic & Tech Systems, Artifacts, Cultures, and Timelines.
- **Master Flowcraft Canvas:** Visual node graph network representing entity relationships and process flows.
- **Dynamic Genre Modules:** Universal worldbuilding schemas with customizable category reframing for various genres.
- **Entity Grid & Filter:** Fast visual lookup and cross-linked encyclopedic entries.

### 4.3 Cast Studio
- **Character Dossiers:** Comprehensive profiles featuring psychological motivations, flaws, and arc trajectories.
- **Relationship Web & Flowchart Matrix:** Map dynamic alliances, rivalries, romantic links, and family hierarchies visually.
- **Art Direction & Avatars:** Tools to visualize character concept art and define color palettes.

### 4.4 Author's Toolkit
- **Narrative Templates Library:** Pre-loaded with classic beat sheets (Hero's Journey, Save the Cat!, Kishōtenketsu, etc.).
- **Gamified Word Sprints:** Custom countdown timer widget with live word velocity tracking and session stats.
- **AI Co-Pilot Drawer:** Brainstorm plot twists, expand prose, polish dialogue, or generate lore on demand.
- **Multi-Format Exporters:** Export JSON specifications, Markdown outlines, and Mermaid diagram syntax.

## 5. Unique Selling Points (USPs)
- **Privacy-First AI Integration:** Complete data sovereignty with 100% offline Local LLMs via Ollama/LM Studio, ensuring zero data leakage. Cloud LLMs (OpenAI, Groq, OpenRouter) are also supported.
- **Context-Aware Assistance:** The AI automatically reads active scene prose, character dossiers, and world bible context to ensure plot consistency.
- **Keyboard-Centric Power Workflows:** Extensive global search and shortcuts for rapid navigation and interaction.
- **Local-First Architecture:** Runs locally using IndexedDB (Dexie.js), providing fast, offline access to project data.

## 6. Technical Architecture
- **Frontend Core:** React 18, TypeScript 5.5, Vite 5
- **Styling:** Tailwind CSS, Vanilla CSS design tokens
- **State Management:** Zustand 4 (with local storage persistence)
- **Database (Local Storage):** Dexie.js (v4) / IndexedDB
- **Visual Diagrams:** @xyflow/react, D3.js, RoughJS
- **Desktop Shell:** Tauri
- **Quality Assurance:** Vitest 4, ESLint (zero-warning policy)

## 7. Future Roadmap
- Export engine enhancements (Direct EPUB & PDF compilation).
- Advanced character timeline sequence analyzer.
