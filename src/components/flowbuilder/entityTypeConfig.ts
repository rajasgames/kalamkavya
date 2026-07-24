// Entity type visual configuration for the Master Flow canvas — Flowcraft Blueprint Design System
// Maps World Bible entity types to functional 6-hue color system (Brass, Teal, Coral, Slate-Violet, Sage, Fog)

export interface EntityTypeConfig {
  color: string;       // Accent color (CSS hex)
  bg: string;          // Light background alpha
  darkBg: string;      // Blueprint dark mode background
  label: string;       // Display label
  icon: string;        // Glyph icon
  badgeClass?: string;
  prefix: string;      // Spec ID prefix e.g. CHAR, LOC, FAK, ASTR
}

// ── Flowcraft 6-Hue Functional System ──────────────────────────────────────
// Brass: #E3A542
// Teal: #4FC1A6
// Coral: #E2705F
// Slate Violet: #7B87D6
// Sage: #8FB88A
// Fog: #7A84A3

const CONFIG_MAP: Record<string, EntityTypeConfig> = {
  // ── Characters & Beings (Brass) ─────────────────────────────────────────
  CHARACTER:    { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.12)', darkBg: '#1B160C', label: 'Character', icon: '👤', prefix: 'CHAR' },
  GOD:          { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'God', icon: '✦', prefix: 'GOD' },
  TRIDEV:       { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'Tridev', icon: '✦', prefix: 'COSM' },
  COSMIC:       { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'Cosmic', icon: '✦', prefix: 'COSM' },
  DEVA:         { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'Deva', icon: '✦', prefix: 'DEVA' },
  DEITY:        { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'Deity', icon: '✦', prefix: 'DEIT' },
  AVATAR:       { color: '#E3A542', bg: 'rgba(227, 165, 66, 0.16)', darkBg: '#231B0A', label: 'Avatar', icon: '✦', prefix: 'AVAT' },

  // ── Factions & Collectives (Teal) ───────────────────────────────────────
  FACTION:      { color: '#4FC1A6', bg: 'rgba(79, 193, 166, 0.12)', darkBg: '#0A1C18', label: 'Faction', icon: '⚑', prefix: 'FACT' },
  CLAN:         { color: '#4FC1A6', bg: 'rgba(79, 193, 166, 0.12)', darkBg: '#0A1C18', label: 'Clan', icon: '⚑', prefix: 'CLAN' },
  ARMY:         { color: '#4FC1A6', bg: 'rgba(79, 193, 166, 0.12)', darkBg: '#0A1C18', label: 'Army', icon: '⚔', prefix: 'ARMY' },
  ASURA:        { color: '#E2705F', bg: 'rgba(226, 112, 95, 0.14)', darkBg: '#24100E', label: 'Asura', icon: '🔥', prefix: 'ASUR' },
  KINGDOM:      { color: '#4FC1A6', bg: 'rgba(79, 193, 166, 0.12)', darkBg: '#0A1C18', label: 'Kingdom', icon: '🏰', prefix: 'KING' },

  // ── Places & Realms (Sage) ─────────────────────────────────────────────
  LOCATION:     { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Location', icon: '◉', prefix: 'LOC' },
  LOKA:         { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Loka', icon: '🌌', prefix: 'LOKA' },
  REGION:       { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Region', icon: '🗺️', prefix: 'REG' },
  GEOGRAPHY:    { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Geography', icon: '⛰️', prefix: 'GEO' },
  LANDMARK:     { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Landmark', icon: '📍', prefix: 'MARK' },
  REALM:        { color: '#8FB88A', bg: 'rgba(143, 184, 138, 0.12)', darkBg: '#0E1A0E', label: 'Realm', icon: '🏛️', prefix: 'RLM' },

  // ── Weapons & Astras (Coral) ────────────────────────────────────────────
  WEAPON:       { color: '#E2705F', bg: 'rgba(226, 112, 95, 0.14)', darkBg: '#24100E', label: 'Weapon', icon: '⚔', prefix: 'WEAP' },
  ASTRA:        { color: '#E2705F', bg: 'rgba(226, 112, 95, 0.14)', darkBg: '#24100E', label: 'Astra', icon: '⚡', prefix: 'ASTR' },
  ARTIFACT:     { color: '#E2705F', bg: 'rgba(226, 112, 95, 0.14)', darkBg: '#24100E', label: 'Artifact', icon: '🔮', prefix: 'ART' },

  // ── Lineages & Cultures (Slate Violet) ──────────────────────────────────
  VAMSHA:       { color: '#7B87D6', bg: 'rgba(123, 135, 214, 0.12)', darkBg: '#111326', label: 'Vamsha', icon: '⬡', prefix: 'VAMS' },
  LINEAGE:      { color: '#7B87D6', bg: 'rgba(123, 135, 214, 0.12)', darkBg: '#111326', label: 'Lineage', icon: '🌳', prefix: 'LINE' },
  CULTURE:      { color: '#7B87D6', bg: 'rgba(123, 135, 214, 0.12)', darkBg: '#111326', label: 'Culture', icon: '📜', prefix: 'CULT' },
  GOTRA:        { color: '#7B87D6', bg: 'rgba(123, 135, 214, 0.12)', darkBg: '#111326', label: 'Gotra', icon: '🧬', prefix: 'GOTR' },

  // ── Mystical & Knowledge (Fog) ──────────────────────────────────────────
  MAGIC_SYSTEM: { color: '#7A84A3', bg: 'rgba(122, 132, 163, 0.12)', darkBg: '#12141C', label: 'Magic', icon: '✧', prefix: 'MAG' },
  TAPAS:        { color: '#7A84A3', bg: 'rgba(122, 132, 163, 0.12)', darkBg: '#12141C', label: 'Tapas', icon: '🧘', prefix: 'TAP' },
  KNOWLEDGE:    { color: '#7A84A3', bg: 'rgba(122, 132, 163, 0.12)', darkBg: '#12141C', label: 'Knowledge', icon: '📚', prefix: 'KNOW' },
  LORE:         { color: '#7A84A3', bg: 'rgba(122, 132, 163, 0.12)', darkBg: '#12141C', label: 'Lore', icon: '📖', prefix: 'LORE' },

  // ── Scenes & Narrative Processes (Process Purple) ───────────────────────
  SCENE:        { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.14)', darkBg: '#1F0B2E', label: 'Scene', icon: '🎬', prefix: 'SCN' },
  EVENT:        { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.14)', darkBg: '#1F0B2E', label: 'Event', icon: '⚡', prefix: 'EVNT' },
  PROCESS:      { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.14)', darkBg: '#1F0B2E', label: 'Process', icon: '🔄', prefix: 'PROC' },
};

/** Fallback config for unknown entity types */
const DEFAULT_CONFIG: EntityTypeConfig = {
  color: '#7A84A3',
  bg: 'rgba(122, 132, 163, 0.12)',
  darkBg: '#12141C',
  label: 'Node',
  icon: '⚙️',
  prefix: 'NODE',
};

/**
 * Get visual config for a World Bible entity type.
 */
export const getEntityTypeConfig = (type: string): EntityTypeConfig => {
  if (!type) return DEFAULT_CONFIG;
  const t = type.toUpperCase();
  if (CONFIG_MAP[t]) return CONFIG_MAP[t];
  for (const [key, config] of Object.entries(CONFIG_MAP)) {
    if (t.includes(key)) return config;
  }
  return DEFAULT_CONFIG;
};

/** Format entity ID into a clean Flowcraft Spec Tag ID (e.g. #CHAR-01) */
export const formatSpecId = (type: string, id: string): string => {
  const config = getEntityTypeConfig(type);
  const cleanId = id.replace(/[^0-9a-zA-Z]/g, '').slice(-3).toUpperCase() || '01';
  return `#${config.prefix}-${cleanId}`;
};

/** Get edge stroke color based on relationship type */
export const getRelationshipColor = (type: string): string => {
  const t = (type || '').toUpperCase();
  if (t.includes('ALLY')  || t.includes('FRIEND') || t.includes('BLESSED')   || t.includes('INCARNATION')) return '#4FC1A6'; // teal
  if (t.includes('ENEMY') || t.includes('RIVAL')  || t.includes('CURSE')     || t.includes('CORRUPT'))     return '#E2705F'; // coral
  if (t.includes('HIERARCHY') || t.includes('INHERITS') || t.includes('DESCENDED') || t.includes('AVATAR') || t.includes('BORN'))  return '#E3A542'; // brass
  if (t.includes('MEMBER') || t.includes('LOCATED') || t.includes('PRACTICES') || t.includes('WIELDS') || t.includes('BELONG'))    return '#7B87D6'; // slate violet
  return '#7A84A3'; // fog
};
