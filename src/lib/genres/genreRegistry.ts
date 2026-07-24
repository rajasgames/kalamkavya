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
      { id: 'groups', label: 'Factions & Groups', types: ['faction', 'race'] },
      { id: 'families', label: 'Families & Lineages', types: ['family'] },
      { id: 'languages', label: 'Languages', types: ['language'] },
    ],
  },
  {
    group: 'Lore',
    categories: [
      { id: 'concepts', label: 'Power Systems', types: ['system'] },
      { id: 'things', label: 'Objects & Artifacts', types: ['object'] },
      { id: 'events', label: 'Events', types: ['event'] },
      { id: 'lore', label: 'Lore & Texts', types: ['lore_text'] },
      { id: 'beliefs', label: 'Religions & Philosophies', types: ['religion', 'philosophy'] },
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
  { value: 'landmark', label: 'Landmark' },
  { value: 'faction', label: 'Faction / Organization' },
  { value: 'family', label: 'Family / Lineage' },
  { value: 'system', label: 'Power System (Magic / Tech / Other)' },
  { value: 'object', label: 'Object / Artifact' },
  { value: 'event', label: 'Historical Event' },
  { value: 'lore_text', label: 'Lore / Text / Myth' },
  { value: 'creature', label: 'Creature / Species / Race' },
  { value: 'language', label: 'Language / Dialect' },
  { value: 'religion', label: 'Religion / Cult' },
  { value: 'philosophy', label: 'Philosophy / Ideology' },
];

// ---------------------------------------------------------------------------
// GENRE MODULES
// ---------------------------------------------------------------------------
export const GENRE_MODULES: Record<string, GenreModule> = {
  action: {
    id: 'action',
    label: 'Action',
    shortLabel: 'Action',
    description: 'High-stakes conflict, physical stunts, chases, battles, and fast-paced sequences.',
    icon: '💥',
    accentColor: 'destructive',
    entityTypes: [],
    categoryGroups: [],
  },
  adventure: {
    id: 'adventure',
    label: 'Adventure',
    shortLabel: 'Adventure',
    description: 'Exploration, quests, treasure hunts, and journeys into the unknown.',
    icon: '🗺️',
    accentColor: 'amber',
    entityTypes: [],
    categoryGroups: [],
  },
  animation: {
    id: 'animation',
    label: 'Animation',
    shortLabel: 'Animation',
    description: 'CGI, Stop-Motion, Traditional 2D, Adult Animation, and Anime-style (Western).',
    icon: '🎬',
    accentColor: 'blue',
    entityTypes: [],
    categoryGroups: [],
  },
  comedy: {
    id: 'comedy',
    label: 'Comedy',
    shortLabel: 'Comedy',
    description: 'Humor, satire, parody, slapstick, and situational laughs.',
    icon: '😂',
    accentColor: 'amber',
    entityTypes: [],
    categoryGroups: [],
  },
  crime: {
    id: 'crime',
    label: 'Crime',
    shortLabel: 'Crime',
    description: 'Heists, gangsters, detectives, legal battles, and the underworld.',
    icon: '🕵️',
    accentColor: 'slate',
    entityTypes: [],
    categoryGroups: [],
  },
  documentary: {
    id: 'documentary',
    label: 'Documentary',
    shortLabel: 'Documentary',
    description: 'Factual exploration of nature, history, true crime, music, and society.',
    icon: '📽️',
    accentColor: 'sage',
    entityTypes: [],
    categoryGroups: [],
  },
  drama: {
    id: 'drama',
    label: 'Drama',
    shortLabel: 'Drama',
    description: 'Intense emotional narratives, realistic characters, and heavy conflicts.',
    icon: '🎭',
    accentColor: 'primary',
    entityTypes: [],
    categoryGroups: [],
  },
  fantasy: {
    id: 'fantasy',
    label: 'Fantasy',
    shortLabel: 'Fantasy',
    description: 'Magic, mythical creatures, alternate worlds, and supernatural powers.',
    icon: '🔮',
    accentColor: 'indigo',
    entityTypes: [],
    categoryGroups: [],
  },
  historical: {
    id: 'historical',
    label: 'Historical',
    shortLabel: 'Historical',
    description: 'Set in a specific time period in the past, often interacting with real events.',
    icon: '📜',
    accentColor: 'amber',
    entityTypes: [],
    categoryGroups: [],
  },
  horror: {
    id: 'horror',
    label: 'Horror',
    shortLabel: 'Horror',
    description: 'Fear, dread, monsters, slashers, and the supernatural.',
    icon: '👻',
    accentColor: 'destructive',
    entityTypes: [],
    categoryGroups: [],
  },
  musical: {
    id: 'musical',
    label: 'Musical',
    shortLabel: 'Musical',
    description: 'Songs, dances, Broadway adaptations, and rock operas.',
    icon: '🎵',
    accentColor: 'pink',
    entityTypes: [],
    categoryGroups: [],
  },
  mystery: {
    id: 'mystery',
    label: 'Mystery',
    shortLabel: 'Mystery',
    description: 'Whodunit, investigations, suspense, and puzzling scenarios.',
    icon: '🔍',
    accentColor: 'teal',
    entityTypes: [],
    categoryGroups: [],
  },
  romance: {
    id: 'romance',
    label: 'Romance',
    shortLabel: 'Romance',
    description: 'Love stories, romantic comedies, passion, and relationship drama.',
    icon: '❤️',
    accentColor: 'rose',
    entityTypes: [],
    categoryGroups: [],
  },
  scifi: {
    id: 'scifi',
    label: 'Science Fiction',
    shortLabel: 'Sci-Fi',
    description: 'Futuristic technology, space exploration, time travel, and cyberpunk.',
    icon: '🚀',
    accentColor: 'blue',
    entityTypes: [],
    categoryGroups: [],
  },
  thriller: {
    id: 'thriller',
    label: 'Thriller',
    shortLabel: 'Thriller',
    description: 'Suspense, tension, psychological games, and high stakes.',
    icon: '🔪',
    accentColor: 'slate',
    entityTypes: [],
    categoryGroups: [],
  },
  war: {
    id: 'war',
    label: 'War',
    shortLabel: 'War',
    description: 'Military conflict, resistance, POW camps, and anti-war narratives.',
    icon: '🪖',
    accentColor: 'stone',
    entityTypes: [],
    categoryGroups: [],
  },
  western: {
    id: 'western',
    label: 'Western',
    shortLabel: 'Western',
    description: 'Cowboys, outlaws, frontier justice, and the wild west.',
    icon: '🤠',
    accentColor: 'amber',
    entityTypes: [],
    categoryGroups: [],
  },
  shonen: {
    id: 'shonen',
    label: 'Shonen',
    shortLabel: 'Shonen',
    description: 'Targeted at young boys (12–18); action, adventure, friendship, rivalry.',
    icon: '🔥',
    accentColor: 'orange',
    entityTypes: [],
    categoryGroups: [],
  },
  shojo: {
    id: 'shojo',
    label: 'Shojo',
    shortLabel: 'Shojo',
    description: 'Targeted at young girls (12–18); romance, emotions, relationships, self-discovery.',
    icon: '🌸',
    accentColor: 'pink',
    entityTypes: [],
    categoryGroups: [],
  },
  seinen: {
    id: 'seinen',
    label: 'Seinen',
    shortLabel: 'Seinen',
    description: 'Targeted at adult men (18+); mature themes, complex narratives, darker tone.',
    icon: '🚬',
    accentColor: 'slate',
    entityTypes: [],
    categoryGroups: [],
  },
  josei: {
    id: 'josei',
    label: 'Josei',
    shortLabel: 'Josei',
    description: 'Targeted at adult women (18+); realistic romance, workplace, adult life.',
    icon: '🥂',
    accentColor: 'rose',
    entityTypes: [],
    categoryGroups: [],
  },
  kodomo: {
    id: 'kodomo',
    label: 'Kodomo',
    shortLabel: 'Kodomo',
    description: 'Targeted at young children; educational, lighthearted, moral lessons.',
    icon: '🧸',
    accentColor: 'yellow',
    entityTypes: [],
    categoryGroups: [],
  },
};

// ---------------------------------------------------------------------------
// SUB-GENRES & TAILORED CATEGORIES
// ---------------------------------------------------------------------------
export interface SubGenreDefinition {
  id: string;
  label: string;
  description: string;
  extraCategories?: { groupLabel: string; categories: GenreCategory[] }[];
}

// Helper to quickly map string names to definitions without descriptions
const mapSub = (names: string[]): SubGenreDefinition[] => 
  names.map(name => ({ id: name.toLowerCase().replace(/[\s\/]/g, '_'), label: name, description: '' }));

export const SUB_GENRE_MAP: Record<string, SubGenreDefinition[]> = {
  action: [
    ...mapSub(['Martial Arts', 'Spy/Espionage', 'Superhero', 'War Action', 'Disaster', 'Swashbuckler', 'Vigilante', 'Girls with Guns', 'Heroic Bloodshed']),
    ...mapSub(['Battle Shonen', 'Super Power/Supernatural Ability', 'Samurai', 'Ninja', 'Hunting', 'Exploration']) // Anime/Manga additions
  ],
  adventure: [
    ...mapSub(['Survival', 'Treasure Hunt', 'Expedition', 'Jungle/Safari', 'Sea/Ocean', 'Sword and Sandal'])
  ],
  animation: [
    ...mapSub(['CGI', 'Stop-Motion', 'Traditional 2D', 'Adult Animation', 'Anime-style (Western)'])
  ],
  comedy: [
    ...mapSub(['Slapstick', 'Screwball', 'Romantic Comedy (Rom-Com)', 'Dark/Black Comedy', 'Satire', 'Parody', 'Sitcom (Situation Comedy)', 'Sketch Comedy', 'Mockumentary', 'Cringe', 'Farce', 'Body Comedy']),
    ...mapSub(['Gag Comedy', 'Surreal Comedy', 'School Comedy', 'Workplace Comedy', 'Rom-Com'])
  ],
  crime: [
    ...mapSub(['Gangster', 'Heist/Caper', 'Detective/Police Procedural', 'Film Noir', 'Neo-Noir', 'Legal Thriller', 'True Crime', 'Prison', 'Organized Crime (Mafia/Yakuza)'])
  ],
  documentary: [
    ...mapSub(['Nature', 'Biographical', 'Historical', 'True Crime', 'Music', 'Political', 'Social Issues', 'Travel', 'Sports'])
  ],
  drama: [
    ...mapSub(['Legal', 'Medical', 'Political', 'Period/Historical', 'Family', 'Teen', 'Melodrama', 'Soap Opera', 'Anthology', 'Coming-of-Age', 'Kitchen Sink', 'Social Realism']),
    ...mapSub(['School Life', 'Workplace', 'Tragedy', 'Psychological Drama'])
  ],
  fantasy: [
    ...mapSub(['High Fantasy', 'Dark Fantasy', 'Urban Fantasy', 'Contemporary Fantasy', 'Sword and Sorcery', 'Fairy Tale', 'Mythological', 'Superhero (fantasy-adjacent)']),
    ...mapSub(['Isekai', 'Game World/Fantasy RPG'])
  ],
  horror: [
    ...mapSub(['Slasher', 'Psychological Horror', 'Supernatural', 'Body Horror', 'Found Footage', 'Folk Horror', 'Gothic', 'Haunted House', 'Monster', 'Zombie', 'Vampire', 'Werewolf', 'Cosmic/Lovecraftian', 'Torture Porn', 'Tech Horror']),
    ...mapSub(['Gore', 'Survival Horror', 'Ghost/Yokai', 'Curse'])
  ],
  musical: [
    ...mapSub(['Jukebox Musical', 'Broadway Adaptation', 'Rock Opera', 'Dance Film'])
  ],
  mystery: [
    ...mapSub(['Cozy Mystery', 'Hardboiled', 'Whodunit', 'Police Procedural', 'Forensic', 'Amateur Sleuth', 'Locked Room']),
    ...mapSub(['Detective', 'Police', 'Survival Game'])
  ],
  romance: [
    ...mapSub(['Period Romance', 'Contemporary Romance', 'Romantic Comedy', 'Romantic Drama', 'Erotic Romance']),
    ...mapSub(['Shojo Romance', 'Josei Romance', 'Reverse Harem', 'Love Triangle', 'Slow Burn', 'Childhood Friends', 'Enemies to Lovers'])
  ],
  scifi: [
    ...mapSub(['Cyberpunk', 'Steampunk', 'Space Opera', 'Hard Sci-Fi', 'Dystopian', 'Utopian', 'Post-Apocalyptic', 'Time Travel', 'Alternate History', 'Alien Invasion', 'First Contact', 'Biopunk', 'Nanopunk']),
    ...mapSub(['Mecha']) // Adding Mecha here as it crosses over with Anime heavily
  ],
  thriller: [
    ...mapSub(['Psychological Thriller', 'Action Thriller', 'Political Thriller', 'Spy Thriller', 'Legal Thriller', 'Erotic Thriller', 'Techno-Thriller', 'Conspiracy', 'Survival Thriller'])
  ],
  war: [
    ...mapSub(['Anti-War', 'War Comedy', 'War Drama', 'Resistance', 'POW'])
  ],
  western: [
    ...mapSub(['Spaghetti Western', 'Revisionist Western', 'Epic Western', 'Outlaw/Gunfighter', 'Western-Noir', 'Contemporary Western'])
  ]
};

// Also adding specific anime content genres as requested by the user
// E.g. Mecha, Psychological, Slice of Life, Sports, Supernatural
SUB_GENRE_MAP.mecha = mapSub(['Real Robot', 'Super Robot', 'Hybrid']);
SUB_GENRE_MAP.psychological = mapSub(['Mind Games', 'Thriller', 'Horror', 'Social Experiment', 'Manipulation', 'Identity']);
SUB_GENRE_MAP.slice_of_life = mapSub(['Iyashikei', 'School Life', 'Workplace', 'Family Life', 'Coming-of-Age', 'Hobby/Club Activities']);
SUB_GENRE_MAP.sports = mapSub(['Team Sports', 'Individual Sports', 'Motorsport', 'Extreme Sports']);
SUB_GENRE_MAP.supernatural = mapSub(['Yokai', 'Demons', 'Spirits', 'Gods', 'Exorcism', 'Curses', 'Vampires', 'Werewolves']);

// Add the extra modules to GENRE_MODULES for the above anime content genres
GENRE_MODULES.mecha = {
  id: 'mecha',
  label: 'Mecha',
  shortLabel: 'Mecha',
  description: 'Giant robots, piloted mechs, and military sci-fi.',
  icon: '🤖',
  accentColor: 'slate',
  entityTypes: [],
  categoryGroups: [],
};
GENRE_MODULES.psychological = {
  id: 'psychological',
  label: 'Psychological',
  shortLabel: 'Psychological',
  description: 'Mind games, manipulation, identity, and mental struggles.',
  icon: '🧠',
  accentColor: 'indigo',
  entityTypes: [],
  categoryGroups: [],
};
GENRE_MODULES.slice_of_life = {
  id: 'slice_of_life',
  label: 'Slice of Life',
  shortLabel: 'Slice of Life',
  description: 'Everyday life, mundane events, and character-driven interactions.',
  icon: '☕',
  accentColor: 'amber',
  entityTypes: [],
  categoryGroups: [],
};
GENRE_MODULES.sports = {
  id: 'sports',
  label: 'Sports',
  shortLabel: 'Sports',
  description: 'Athletics, teamwork, training, and competitive matches.',
  icon: '🏀',
  accentColor: 'orange',
  entityTypes: [],
  categoryGroups: [],
};
GENRE_MODULES.supernatural = {
  id: 'supernatural',
  label: 'Supernatural',
  shortLabel: 'Supernatural',
  description: 'Yokai, demons, spirits, curses, and paranormal events.',
  icon: '👻',
  accentColor: 'violet',
  entityTypes: [],
  categoryGroups: [],
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Returns the full ordered list of sidebar category groups for a project,
 * starting with universal groups, appending genre-specific ones, and adding
 * tailored sub-genre categories if selected.
 */
export function getCategoriesForGenre(
  genreModules?: string[],
  subGenreId?: string,
): { group: string; categories: GenreCategory[] }[] {
  const groups = [...UNIVERSAL_CATEGORIES];

  const modules = genreModules ?? [];
  for (const moduleId of modules) {
    const mod = GENRE_MODULES[moduleId];
    if (!mod) continue;
    for (const cg of mod.categoryGroups) {
      groups.push({ group: cg.groupLabel, categories: cg.categories });
    }

    // Check if subGenre matches any defined sub-genre extra categories
    if (subGenreId && SUB_GENRE_MAP[moduleId]) {
      const foundSub = SUB_GENRE_MAP[moduleId].find(s => s.id === subGenreId);
      if (foundSub && foundSub.extraCategories) {
        for (const ec of foundSub.extraCategories) {
          groups.push({ group: ec.groupLabel, categories: ec.categories });
        }
      }
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
 * Handles the legacy case where genreModules is undefined (treated as universal now).
 */
export function hasGenreModule(genreModules: string[] | undefined, moduleId: string): boolean {
  if (genreModules === undefined || genreModules.length === 0) {
    return moduleId === 'universal';
  }
  return genreModules.includes(moduleId);
}

/**
 * Maps a sidebar category ID (the `defaultType` passed from WorldBibleLayout)
 * to the most appropriate entity type value for the creation modal.
 */
export function categoryIdToEntityType(categoryId: string): string {
  const map: Record<string, string> = {
    // Universal
    cast: 'character',
    geography: 'location',
    groups: 'faction',
    families: 'family',
    languages: 'language',
    concepts: 'system',
    things: 'object',
    events: 'event',
    lore: 'lore_text',
    beliefs: 'religion',
  };

  return map[categoryId] ?? 'character';
}

/** All available genre module definitions as an ordered array for the UI. */
export const GENRE_MODULE_LIST = Object.values(GENRE_MODULES);
