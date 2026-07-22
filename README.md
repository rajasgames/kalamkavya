# Inkwell Pro 🖋️✨

> **The All-in-One Studio & Narrative Engine for Authors, Worldbuilders, and Story Architects.**

![Inkwell Pro Version](https://img.shields.io/badge/version-0.1.0-amber?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/stack-React_18_%7C_TypeScript_%7C_Vite_%7C_Tauri-blue?style=for-the-badge)
![Database](https://img.shields.io/badge/storage-Dexie.js_(IndexedDB)-emerald?style=for-the-badge)
![AI Privacy](https://img.shields.io/badge/AI-Local_(Ollama/LM_Studio)_%2B_Cloud-purple?style=for-the-badge)

Inkwell Pro bridges the gap between distraction-free manuscript drafting, encyclopedic worldbuilding, character cast management, and context-aware artificial intelligence. Whether you are crafting Vedic mythological epics, hard sci-fi sagas, or contemporary romances, Inkwell Pro gives you complete control over your narrative universe.

---

## 🌟 Key Features

### 🏛️ The 4 Core Pillars

#### 1. ✍️ Manuscript Studio
- **Focus Prose Editor**: Clean, rich-text editor powered by TipTap with real-time word counting, goal progress rings, and chapter/scene organization.
- **Drag-and-Drop Scene Planner**: Organize scenes visually across acts, plot points, and narrative arcs using `@dnd-kit`.
- **Visual Index Card Outline**: High-level structural overview with color-coded scene cards and instant status updates.

#### 2. 📚 World Bible & Codex
- **Encyclopedic Lore Categories**: Dedicated management for **Locations, Factions, Magic & Technology Systems, Artifacts, Cultures, Timelines,** and **Codex Entries**.
- **Dynamic Genre Modules**: Specialized worldbuilding schemas for **Vedic & Puranic Myth**, **Sci-Fi**, **Contemporary Rom-Com**, **Epic Fantasy**, and **Thriller**.
- **Entity Grid & Filter**: Fast visual lookup, custom tags, and cross-linked encyclopedic entries.

#### 3. 👥 Cast Studio
- **Character Dossiers**: Comprehensive character profiles featuring psychological motivations, flaws, voice guidelines, and arc trajectory.
- **Relationship Web & Matrix**: Map dynamic alliances, rivalries, romantic links, and family hierarchies.
- **Art Direction & Avatars**: Color palette generators and prompt tools to visualize character concept art.

#### 4. 🛠️ Author's Toolkit
- **Gamified Word Sprints**: Custom countdown timer widget with live word velocity tracking.
- **AI Co-Pilot Drawer**: Brainstorm plot twists, expand prose descriptions, polish dialogue, or generate lore on demand.
- **Multi-Format Publishing Exporter**: Compile completed manuscripts into **EPUB, PDF, DOCX,** or **Markdown**.

---

## 🤖 Privacy-First AI Integration

Inkwell Pro gives you complete data sovereignty:

- **100% Offline Local LLMs**: Connect **Ollama** or **LM Studio** to run models like Llama 3, Mistral, or Gemma on your local GPU with zero internet connection or data leakage.
- **Cloud LLMs**: Connect **OpenAI** (GPT-4o), **Groq** (Instant Llama 3.1), or **OpenRouter** API keys.
- **Context-Aware Prompts**: The AI assistant automatically reads your active scene prose, character dossiers, and world bible context to ensure plot consistency.

---

## ⚡ Keyboard Shortcuts & Power Workflows

| Shortcut | Action |
| :--- | :--- |
| <kbd>Cmd</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open **Global Search** across scenes, characters, & lore |
| Click <kbd>Sparkles</kbd> | Toggle **AI Assistant Drawer** |
| Click <kbd>Timer</kbd> | Launch **Word Sprint Widget** |
| Click <kbd>HelpCircle</kbd> | Re-open the interactive **User Guide & Tour** |

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS design tokens, Lucide React icons
- **State Management**: Zustand (with devtools & local storage persistence)
- **Local Storage**: IndexedDB via `Dexie.js` for fast offline project data
- **Rich Text Editor**: TipTap (`@tiptap/react`, `@tiptap/starter-kit`)
- **Visual Diagrams & Flow**: ReactFlow, D3.js, RoughJS
- **Desktop Shell**: Tauri (`@tauri-apps/api`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `pnpm` / `yarn`
- *(Optional for Desktop builds)* [Rust & Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### 1. Clone the Repository

```bash
git clone https://github.com/rajasgames/inkwell.git
cd inkwell
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to start writing!

### 4. Build for Production

```bash
npm run build
```

---

## 📖 First-Time User Onboarding

Inkwell Pro includes a built-in 5-step interactive **User Guide & Tour**. First-time users will automatically see the tour upon initial launch, offering:
1. An overview of the story studio philosophy.
2. Interactive walkthrough of the 4 Core Pillars.
3. Local & Cloud AI setup instructions.
4. Shortcut cheat sheets.
5. Instant load buttons for pre-built sample worlds (**Vedic Myth**, **Mumbai Rom-Com**, and **Generation Ship Sci-Fi**).

---

## 📄 License

Private & Proprietary. Developed for narrative architects and authors.
