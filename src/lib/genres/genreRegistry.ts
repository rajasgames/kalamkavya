/**
 * Genre Registry — central source of truth for all genre modules.
 *
 * A genre module defines the optional entity sub-types and World Bible
 * sidebar categories that activate when a project uses that genre.
 *
 * Universal categories are always present; genre modules add on top.
 */
import type { GenreModule, GenreCategory } from '@/types';

// ---------------------------------------------------------------------------
// UNIVERSAL SIDEBAR CATEGORIES — always shown, genre-agnostic labels
// ---------------------------------------------------------------------------
export const UNIVERSAL_CATEGORIES: { group: string; categories: GenreCategory[] }[] = [
  {
    group: 'System',
    categories: [
      { id: 'catalog', label: 'Global Catalog', types: [] },
      { id: 'relationships', label: 'Master Flow Chart', types: [] },
    ],
  },
  {
    group: 'People',
    categories: [
      { id: 'cast', label: 'Characters', types: ['character'] },
    ],
  },
  {
    group: 'World',
    categories: [
      { id: 'geography', label: 'Places', types: ['location', 'region', 'landmark'] },
      { id: 'groups', label: 'Factions & Groups', types: ['faction', 'race', 'KINGDOM', 'VARNA', 'JATI', 'SHRENI'] },
      { id: 'families', label: 'Families & Lineages', types: ['VAMSHA', 'GOTRA', 'family'] },
    ],
  },
  {
    group: 'Lore',
    categories: [
      { id: 'concepts', label: 'Power Systems', types: ['MAGIC_SYSTEM', 'system'] },
      { id: 'things', label: 'Objects & Artifacts', types: ['WEAPON', 'SHASTRA', 'ASTRA', 'ARTIFACT', 'object'] },
      { id: 'events', label: 'Events', types: ['EVENT', 'YAJNA', 'event'] },
      { id: 'lore', label: 'Lore & Texts', types: ['TEXT', 'myth', 'PHILOSOPHY', 'lore_text', 'CULTURE'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// UNIVERSAL ENTITY TYPES — always shown in creation modal
// ---------------------------------------------------------------------------
export const UNIVERSAL_ENTITY_TYPES = [
  { value: 'character', label: 'Character / Person' },
  { value: 'location', label: 'Location' },
  { value: 'region', label: 'Region / Biome' },
  { value: 'landmark', label: 'Landmark / Landmark' },
  { value: 'faction', label: 'Faction / Organization' },
  { value: 'family', label: 'Family / Lineage' },
  { value: 'system', label: 'Power System (Magic / Tech / Other)' },
  { value: 'object', label: 'Object / Artifact' },
  { value: 'event', label: 'Historical Event' },
  { value: 'lore_text', label: 'Lore / Text / Myth' },
  { value: 'creature', label: 'Creature / Species / Race' },
];

// ---------------------------------------------------------------------------
// GENRE MODULES
// ---------------------------------------------------------------------------
export const GENRE_MODULES: Record<string, GenreModule> = {

  // ── VEDIC / PURANIC ──────────────────────────────────────────────────────
  vedic: {
    id: 'vedic',
    label: 'Vedic & Puranic',
    shortLabel: 'Vedic',
    description:
      'Epic-scale mythology drawn from Hindu cosmology — Lokas, Varna, Gotra, Astra, Yuga-cycles, Tapas, Karma, and the full Puranic universe.',
    icon: '🕉️',
    accentColor: 'amber',
    entityTypes: [
      { value: 'UNIVERSAL_LAW', label: 'Universal Law (Dharma/Rita)' },
      { value: 'COSMIC_TIME', label: 'Cosmic Time (Yuga/Kalpa)' },
      { value: 'CYCLE', label: 'Cycle of Creation' },
      { value: 'LOKA', label: 'Cosmic Realm (Loka)' },
      { value: 'GOD', label: 'God (Devta)' },
      { value: 'YONI_DEVA', label: 'Celestial Race (Deva-Yoni)' },
      { value: 'YONI_ASURA', label: 'Chthonic Force (Asura-Yoni)' },
      { value: 'YONI_PRETA', label: 'Spirit (Preta-Yoni)' },
      { value: 'YONI_PASHU', label: 'Divine Animal (Pashu-Yoni)' },
      { value: 'YONI_MANUSHYA', label: 'Terrestrial Race (Manushya)' },
      { value: 'YONI_YAKSHA', label: 'Terrestrial Race (Yaksha/Guha)' },
      { value: 'KINGDOM', label: 'Kingdom / State' },
      { value: 'VARNA', label: 'Varna (Class)' },
      { value: 'JATI', label: 'Jati (Sub-caste)' },
      { value: 'SHRENI', label: 'Shreni (Guild)' },
      { value: 'VAMSHA', label: 'Vamsha (Macro-Lineage)' },
      { value: 'GOTRA', label: 'Gotra (Root Lineage)' },
      { value: 'YAJNA', label: 'Ritual (Yajna)' },
      { value: 'ARENA', label: 'Combat Arena' },
      { value: 'VYUHA', label: 'Military Formation (Vyuha)' },
      { value: 'MILITARY', label: 'Military Structure' },
      { value: 'SHASTRA', label: 'Melee Weapon (Shastra)' },
      { value: 'ASTRA', label: 'Ranged Weapon (Astra)' },
      { value: 'WEAPON', label: 'Mundane Weapon' },
      { value: 'ARTIFACT', label: 'Artifact / Relic' },
      { value: 'TEXT', label: 'Knowledge Text (Shastra/Purana)' },
      { value: 'PHILOSOPHY', label: 'Philosophy School (Darshana)' },
      { value: 'MAGIC_SYSTEM', label: 'Power System (Tapas/Siddhi)' },
      { value: 'CULTURE', label: 'Culture / Tradition' },
    ],
    categoryGroups: [
      {
        groupLabel: 'Cosmos',
        categories: [
          { id: 'universal_laws', label: 'Universal Laws', types: ['UNIVERSAL_LAW'] },
          { id: 'cosmic_time', label: 'Cosmic Time', types: ['COSMIC_TIME'] },
          { id: 'cycles', label: 'Cycles of Creation', types: ['CYCLE'] },
        ],
      },
      {
        groupLabel: 'Divine World',
        categories: [
          { id: 'realms', label: 'Realms & Lokas', types: ['LOKA'] },
          { id: 'gods', label: 'Gods (33 Koti)', types: ['GOD'] },
          {
            id: 'celestial_races',
            label: 'Celestial Races',
            types: ['YONI_DEVA', 'YONI_ASURA', 'YONI_PRETA', 'YONI_PASHU'],
          },
        ],
      },
      {
        groupLabel: 'Mortal World',
        categories: [
          { id: 'races', label: 'Terrestrial Races', types: ['YONI_MANUSHYA', 'YONI_YAKSHA'] },
          { id: 'kingdoms', label: 'Kingdoms', types: ['KINGDOM'] },
          { id: 'communities', label: 'Communities (Varna/Jati)', types: ['VARNA', 'JATI', 'SHRENI'] },
          { id: 'events_vedic', label: 'Events & Rituals', types: ['EVENT', 'YAJNA'] },
        ],
      },
      {
        groupLabel: 'Combat Systems',
        categories: [
          { id: 'arenas', label: 'Combat Arenas', types: ['ARENA'] },
          { id: 'formations', label: 'Formations & Military', types: ['VYUHA', 'MILITARY'] },
          { id: 'divine_weapons', label: 'Divine Weapons', types: ['SHASTRA', 'ASTRA', 'WEAPON'] },
        ],
      },
      {
        groupLabel: 'Knowledge Systems',
        categories: [
          { id: 'knowledge', label: 'Texts & Philosophy', types: ['TEXT', 'PHILOSOPHY'] },
        ],
      },
    ],
  },

  // ── EPIC FANTASY ─────────────────────────────────────────────────────────
  fantasy: {
    id: 'fantasy',
    label: 'Epic Fantasy',
    shortLabel: 'Fantasy',
    description:
      'High fantasy with noble houses, ancient magic schools, enchanted relics, prophecies, and wars between kingdoms.',
    icon: '⚔️',
    accentColor: 'sage',
    entityTypes: [
      { value: 'MAGIC_SYSTEM', label: 'Magic System' },
      { value: 'WEAPON', label: 'Weapon' },
      { value: 'ARTIFACT', label: 'Artifact / Relic' },
      { value: 'KINGDOM', label: 'Kingdom / Realm' },
      { value: 'CULTURE', label: 'Culture / Tradition' },
      { value: 'TEXT', label: 'Ancient Text / Tome' },
      { value: 'PHILOSOPHY', label: 'Philosophy / Creed' },
      { value: 'ARENA', label: 'Combat Arena' },
      { value: 'VYUHA', label: 'Military Formation' },
      { value: 'EVENT', label: 'Historical Event' },
    ],
    categoryGroups: [
      {
        groupLabel: 'Power & Combat',
        categories: [
          { id: 'magic_systems', label: 'Magic Systems', types: ['MAGIC_SYSTEM'] },
          { id: 'weapons_fantasy', label: 'Weapons & Artifacts', types: ['WEAPON', 'ARTIFACT'] },
          { id: 'arenas_fantasy', label: 'Combat & Formations', types: ['ARENA', 'VYUHA'] },
        ],
      },
      {
        groupLabel: 'Society',
        categories: [
          { id: 'kingdoms_fantasy', label: 'Kingdoms & Realms', types: ['KINGDOM'] },
          { id: 'cultures_fantasy', label: 'Cultures & Traditions', types: ['CULTURE'] },
          { id: 'events_fantasy', label: 'Historical Events', types: ['EVENT'] },
        ],
      },
      {
        groupLabel: 'Knowledge',
        categories: [
          { id: 'lore_fantasy', label: 'Texts & Creeds', types: ['TEXT', 'PHILOSOPHY'] },
        ],
      },
    ],
  },

  // ── SCI-FI ───────────────────────────────────────────────────────────────
  scifi: {
    id: 'scifi',
    label: 'Science Fiction',
    shortLabel: 'Sci-Fi',
    description:
      'Interstellar civilizations, alien species, megacorps, AIs, cutting-edge tech systems, and the moral weight of the future.',
    icon: '🚀',
    accentColor: 'blue',
    entityTypes: [
      { value: 'system', label: 'Technology / Power System' },
      { value: 'object', label: 'Device / Vehicle / Ship' },
      { value: 'creature', label: 'Alien Species' },
      { value: 'KINGDOM', label: 'Empire / Government / Corp' },
      { value: 'CULTURE', label: 'Culture / Civilization' },
      { value: 'lore_text', label: 'Scientific / Historical Record' },
      { value: 'event', label: 'Historical Event / War' },
      { value: 'ARTIFACT', label: 'Alien Artifact / Relic' },
    ],
    categoryGroups: [
      {
        groupLabel: 'Civilization',
        categories: [
          { id: 'governments', label: 'Empires & Corps', types: ['KINGDOM', 'faction'] },
          { id: 'species', label: 'Species & Races', types: ['creature', 'race'] },
          { id: 'cultures_scifi', label: 'Cultures & Civilizations', types: ['CULTURE'] },
        ],
      },
      {
        groupLabel: 'Tech & Science',
        categories: [
          { id: 'tech_systems', label: 'Tech & Power Systems', types: ['system', 'MAGIC_SYSTEM'] },
          { id: 'devices', label: 'Devices, Ships & Artifacts', types: ['object', 'ARTIFACT'] },
        ],
      },
      {
        groupLabel: 'History',
        categories: [
          { id: 'events_scifi', label: 'Historical Events & Wars', types: ['event', 'EVENT'] },
          { id: 'records', label: 'Scientific Records & Lore', types: ['lore_text', 'TEXT'] },
        ],
      },
    ],
  },

  // ── CONTEMPORARY / ROM-COM ────────────────────────────────────────────────
  contemporary: {
    id: 'contemporary',
    label: 'Contemporary / Rom-Com',
    shortLabel: 'Contemporary',
    description:
      'Modern-day stories: social circles, workplaces, cities, relationships, personal growth arcs, and slice-of-life drama.',
    icon: '☕',
    accentColor: 'clay',
    entityTypes: [
      { value: 'faction', label: 'Social Circle / Friend Group' },
      { value: 'object', label: 'Object / Memento / Place of significance' },
      { value: 'event', label: 'Life Event (breakup, promotion, party…)' },
      { value: 'lore_text', label: 'Journal / Article / Media' },
    ],
    categoryGroups: [
      {
        groupLabel: 'Social World',
        categories: [
          { id: 'social_circles', label: 'Social Circles & Workplaces', types: ['faction'] },
          { id: 'life_events', label: 'Life Events', types: ['event', 'EVENT'] },
          { id: 'objects_contemp', label: 'Significant Objects', types: ['object', 'ARTIFACT'] },
        ],
      },
    ],
  },

  // ── HORROR / THRILLER ─────────────────────────────────────────────────────
  horror: {
    id: 'horror',
    label: 'Horror & Thriller',
    shortLabel: 'Horror',
    description:
      'Cults, urban legends, investigations, conspiracies, eldritch entities, and the darkness that lives in the modern world.',
    icon: '🕷️',
    accentColor: 'clay',
    entityTypes: [
      { value: 'faction', label: 'Cult / Secret Society / Agency' },
      { value: 'creature', label: 'Monster / Eldritch Entity' },
      { value: 'ARTIFACT', label: 'Cursed Object / Relic' },
      { value: 'lore_text', label: 'Forbidden Text / Investigation File' },
      { value: 'event', label: 'Incident / Disappearance / Murder' },
      { value: 'MAGIC_SYSTEM', label: 'Ritual / Dark Power System' },
    ],
    categoryGroups: [
      {
        groupLabel: 'The Dark',
        categories: [
          { id: 'cults', label: 'Cults & Secret Societies', types: ['faction'] },
          { id: 'monsters', label: 'Monsters & Entities', types: ['creature', 'race'] },
          { id: 'dark_artifacts', label: 'Cursed Objects', types: ['ARTIFACT', 'object'] },
          { id: 'dark_rituals', label: 'Rituals & Dark Powers', types: ['MAGIC_SYSTEM', 'system'] },
        ],
      },
      {
        groupLabel: 'Investigation',
        categories: [
          { id: 'incidents', label: 'Incidents & Events', types: ['event', 'EVENT'] },
          { id: 'forbidden_texts', label: 'Forbidden Texts', types: ['lore_text', 'TEXT'] },
        ],
      },
    ],
  },

  // ── HISTORICAL ────────────────────────────────────────────────────────────
  historical: {
    id: 'historical',
    label: 'Historical Fiction',
    shortLabel: 'Historical',
    description:
      'Real-world history with fictional characters — wars, courts, trade routes, social hierarchies, and the weight of the past.',
    icon: '📜',
    accentColor: 'amber',
    entityTypes: [
      { value: 'KINGDOM', label: 'State / Empire / City-State' },
      { value: 'CULTURE', label: 'Culture / Civilization' },
      { value: 'WEAPON', label: 'Historical Weapon' },
      { value: 'ARTIFACT', label: 'Historical Artifact' },
      { value: 'TEXT', label: 'Historical Document / Chronicle' },
      { value: 'EVENT', label: 'Historical Event / Battle' },
      { value: 'PHILOSOPHY', label: 'Religion / Philosophy' },
      { value: 'ARENA', label: 'Military Formation / Battle Doctrine' },
    ],
    categoryGroups: [
      {
        groupLabel: 'History',
        categories: [
          { id: 'states', label: 'States & Empires', types: ['KINGDOM'] },
          { id: 'cultures_hist', label: 'Cultures & Civilizations', types: ['CULTURE'] },
          { id: 'events_hist', label: 'Events & Battles', types: ['EVENT'] },
          { id: 'weapons_hist', label: 'Weapons & Gear', types: ['WEAPON', 'ARTIFACT'] },
          { id: 'texts_hist', label: 'Documents & Chronicles', types: ['TEXT', 'PHILOSOPHY'] },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Returns the full ordered list of sidebar category groups for a project,
 * starting with universal groups and appending genre-specific ones.
 *
 * @param genreModules - Array of genre module IDs from the project.
 *   If empty or undefined, only universal categories are returned.
 *   Legacy Vedic projects (those without genreModules) should pass ['vedic'].
 */
export function getCategoriesForGenre(
  genreModules?: string[],
): { group: string; categories: GenreCategory[] }[] {
  const groups = [...UNIVERSAL_CATEGORIES];

  const modules = genreModules ?? [];
  for (const moduleId of modules) {
    const mod = GENRE_MODULES[moduleId];
    if (!mod) continue;
    for (const cg of mod.categoryGroups) {
      groups.push({ group: cg.groupLabel, categories: cg.categories });
    }
  }

  return groups;
}

/**
 * Returns the entity type list for the creation modal.
 * Universal types are always first; genre-specific types follow.
 */
export function getEntityTypesForGenre(
  genreModules?: string[],
): { value: string; label: string }[] {
  const types = [...UNIVERSAL_ENTITY_TYPES];
  const seen = new Set(types.map(t => t.value));

  const modules = genreModules ?? [];
  for (const moduleId of modules) {
    const mod = GENRE_MODULES[moduleId];
    if (!mod) continue;
    for (const et of mod.entityTypes) {
      if (!seen.has(et.value)) {
        types.push({ value: et.value, label: et.label });
        seen.add(et.value);
      }
    }
  }

  return types;
}

/**
 * Returns true if the project has the given genre module active.
 * Handles the legacy case where genreModules is undefined (treated as vedic).
 */
export function hasGenreModule(genreModules: string[] | undefined, moduleId: string): boolean {
  if (genreModules === undefined) {
    // Legacy projects without genreModules are treated as Vedic
    return moduleId === 'vedic';
  }
  return genreModules.includes(moduleId);
}

/**
 * Maps a sidebar category ID (the `defaultType` passed from WorldBibleLayout)
 * to the most appropriate entity type value for the creation modal.
 */
export function categoryIdToEntityType(categoryId: string, genreModules?: string[]): string {
  const isVedic = hasGenreModule(genreModules, 'vedic');

  const map: Record<string, string> = {
    // Universal
    cast: 'character',
    geography: 'location',
    groups: 'faction',
    families: isVedic ? 'VAMSHA' : 'family',
    concepts: isVedic ? 'MAGIC_SYSTEM' : 'system',
    things: isVedic ? 'WEAPON' : 'object',
    events: isVedic ? 'EVENT' : 'event',
    lore: isVedic ? 'TEXT' : 'lore_text',
    // Vedic specific
    universal_laws: 'UNIVERSAL_LAW',
    cosmic_time: 'COSMIC_TIME',
    cycles: 'CYCLE',
    realms: 'LOKA',
    gods: 'GOD',
    celestial_races: 'YONI_DEVA',
    races: 'YONI_MANUSHYA',
    kingdoms: 'KINGDOM',
    kingdoms_fantasy: 'KINGDOM',
    communities: 'VARNA',
    events_vedic: 'EVENT',
    arenas: 'ARENA',
    formations: 'VYUHA',
    divine_weapons: 'ASTRA',
    artifacts: 'ARTIFACT',
    knowledge: 'TEXT',
    // Sci-fi
    governments: 'KINGDOM',
    species: 'creature',
    tech_systems: 'system',
    devices: 'object',
    events_scifi: 'event',
    records: 'lore_text',
    // Horror
    cults: 'faction',
    monsters: 'creature',
    dark_artifacts: 'ARTIFACT',
    dark_rituals: 'MAGIC_SYSTEM',
    incidents: 'event',
    forbidden_texts: 'lore_text',
    // Fantasy
    magic_systems: 'MAGIC_SYSTEM',
    weapons_fantasy: 'WEAPON',
    arenas_fantasy: 'ARENA',
    cultures_fantasy: 'CULTURE',
    events_fantasy: 'EVENT',
    lore_fantasy: 'TEXT',
  };

  return map[categoryId] ?? 'character';
}

/** All available genre module definitions as an ordered array for the UI. */
export const GENRE_MODULE_LIST = Object.values(GENRE_MODULES);
