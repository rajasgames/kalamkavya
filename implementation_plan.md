# KalamKavya: Comprehensive Project Architecture Blueprint

This document outlines the master technical and feature architecture for **KalamKavya**, a premium, specialized worldbuilding engine and writing tool designed for authors, game designers, and screenwriters, with a primary focus on Indian Mythology and Vedic lore.

## User Review Required
> [!IMPORTANT]
> Please review this comprehensive architecture blueprint which incorporates the World Bible, Manuscript Editor, Characters & Casts, and the core technical stack. Once approved, we can begin implementing the foundational data structures and UI components. Let me know if any specific domains or features need expansion.

## Open Questions
> [!NOTE]
> 1. **Data Persistence**: Since this is a Tauri desktop app, should we use a local SQLite database for storing complex worldbuilding nodes and manuscript data, or rely on a file-based JSON system for easier user backups?
> 2. **Master Flowchart UI**: Should the node-based Master Flowchart use a specific library (e.g., React Flow) for rendering the complex interconnections?
> 3. **Syncing**: Are we planning to support cloud syncing across devices in the future, or is it strictly offline-first for v1?

---

## 1. Product Vision & Value Proposition
**KalamKavya** is a single, beautiful desktop application (built with Tauri + React) that merges a professional writing canvas with interactive visual databases. It solves the "messy combination of Word documents and spreadsheets" problem by providing structured, interconnected data models specifically tailored to complex fantasy systems like Vedic lore.

## 2. Technical Stack
- **Frontend Framework**: React 18+ (via Vite)
- **Desktop Runtime**: Tauri (Rust-based, lightweight, native performance)
- **State Management**: Zustand or Redux Toolkit for managing complex, deeply nested relational data between the manuscript and world bible.
- **Node/Graph Visualization**: React Flow (or similar) for the Master Flowchart.
- **Rich Text Editor**: Protiptap, Slate.js, or Lexical for the Manuscript Editor, enabling custom inline blocks (e.g., linking a character directly in the text).

---

## 3. Core Modules Architecture

### A. The World Bible: Master Flowchart
The central administrative hub representing interconnected world-rules via a node-based system.
- **Cosmos (Universal Foundations)**:
  - *Universal Laws*: Dharma, Karma, and Siddhis.
  - *Cosmic Chronology*: Kalpas, Manvantaras, Mahayugas, Yugas.
  - *Cycle of Creation*: Srishti, Sthiti, Pralaya.
- **Divine World (Transcendental Realms)**:
  - *Hierarchy of Lokas*: Multidimensional mapping of realms.
  - *Deity Categorization*: 33 Koti devas, cosmic duties.
  - *Celestial Races*: Non-humanoid profiles.
- **Mortal World (Geopolitical & Social)**:
  - *World Geography*: Landmasses and Tirthas (sacred sites).
  - *Terrestrial Races & Species*.
  - *Social Stratification & Lineage*: Varna, Jati, Vansha, Gotra.
- **Combat, Artifacts, & Relics**:
  - *Warfare & Weaponry*: Vyuhas (formations) and Astras (divine projectiles).
  - *Artifact Taxonomy*: Origins, power levels, conditions.

### B. Characters & Cast Management
A hierarchical entity creation system that integrates directly into the Master Flowchart.
- **Tier 1: 33 Koti Devas**: Functional forces (e.g., Vayu, Agni). Tracks cosmic origin, domain tension, and elemental forms.
- **Tier 2: Regents / Guardians**: Ashta-Dikpalas (e.g., Yama, Kubera). Adds administrative roles, court affiliations, and political fears.
- **Tier 3: Tridev / Tridevi**: Brahma-Vishnu-Shiva. Carries cosmogonic functions, avatars (Dashavatara), sampradaya affiliations, and philosophical tensions.
- **Tier 4: Para-Brahman / Absolute**: Formless, attributeless (Nirguna/Saguna) roots of the universe.
*Note: Custom characters can be created and mapped to these templates, dynamically updating the world state.*

### C. Manuscript Editor Panel
The central hub for creative production, linking directly to the World Bible.
- **Hierarchical Organization**:
  - *Chapters & Scenes*: Nested containers for narrative segments.
  - *Multi-Page Interface*: Tabbed or seamless pagination for expansive drafts.
- **Plot Board (Visual Planner)**: Kanban-style structural mapping.
  - Standard Narrative Columns: Setup, Inciting Incident, Rising Action, Midpoint, Complications, Climax, Falling Action, Resolution.
  - Custom Columns: Subplots, parallel arcs.
- **Outline Panel**: Quick navigation and structural overview of the entire project.



---

## 5. Proposed Implementation Phases

### Phase 1: Foundation & Data Layer
- Set up Tauri + React + Tailwind boilerplate.
- Define TypeScript interfaces and schemas for the World Bible, Characters, and Manuscript data models.
- Implement the local storage/database layer.

### Phase 2: World Bible & Character Engine
- Build the node-based Master Flowchart UI.
- Implement the 4-Tier Character creation templates and link them to Flowchart nodes.

### Phase 3: Manuscript & Plot Board
- Integrate the Rich Text Editor with custom entity-linking plugins.
- Build the Kanban Plot Board and hierarchical Outline Panel.



## 6. Verification Plan
- **Data Integrity**: Ensure modifying a character's attributes automatically reflects in the Master Flowchart and Manuscript context cards.
- **Performance**: Test the node visualization (React Flow) with 500+ interconnected entities to ensure native-like performance in Tauri.
