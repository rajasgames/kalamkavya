// Entity type visual configuration for the Master Flow canvas
// Maps World Bible entity types to distinct colors, icons, and labels

export interface EntityTypeConfig {
  color: string;       // Border/badge color (CSS hex)
  bg: string;          // Light mode background
  darkBg: string;      // Dark mode background
  label: string;       // Display label
  icon: string;        // Unicode icon glyph
}

const CONFIG_MAP: Record<string, EntityTypeConfig> = {
  // ── Characters ──────────────────────────────────────────────────────────
  CHARACTER:    { color: '#6366F1', bg: '#EEF2FF', darkBg: '#1E1B4B', label: 'Character', icon: '◎' },

  // ── Divine / Cosmic ──────────────────────────────────────────────────────
  GOD:          { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'God', icon: '✦' },
  TRIDEV:       { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'Tridev', icon: '✦' },
  COSMIC:       { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'Cosmic', icon: '✦' },
  DEVA:         { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'Deva', icon: '✦' },
  DEITY:        { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'Deity', icon: '✦' },
  AVATAR:       { color: '#F59E0B', bg: '#FFFBEB', darkBg: '#2D1F00', label: 'Avatar', icon: '✦' },

  // ── Factions / Collectives ───────────────────────────────────────────────
  FACTION:      { color: '#10B981', bg: '#ECFDF5', darkBg: '#0D2E20', label: 'Faction', icon: '⚑' },
  CLAN:         { color: '#10B981', bg: '#ECFDF5', darkBg: '#0D2E20', label: 'Clan', icon: '⚑' },
  ARMY:         { color: '#10B981', bg: '#ECFDF5', darkBg: '#0D2E20', label: 'Army', icon: '⚑' },
  ASURA:        { color: '#EF4444', bg: '#FEF2F2', darkBg: '#2E0A0A', label: 'Asura', icon: '⚑' },
  KINGDOM:      { color: '#10B981', bg: '#ECFDF5', darkBg: '#0D2E20', label: 'Kingdom', icon: '⚑' },

  // ── Places / Realms ──────────────────────────────────────────────────────
  LOCATION:     { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Location', icon: '◉' },
  LOKA:         { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Loka', icon: '◉' },
  REGION:       { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Region', icon: '◉' },
  GEOGRAPHY:    { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Geography', icon: '◉' },
  LANDMARK:     { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Landmark', icon: '◉' },
  REALM:        { color: '#0EA5E9', bg: '#F0F9FF', darkBg: '#0C1A2E', label: 'Realm', icon: '◉' },

  // ── Weapons / Astras ─────────────────────────────────────────────────────
  WEAPON:       { color: '#EF4444', bg: '#FEF2F2', darkBg: '#2E0A0A', label: 'Weapon', icon: '⚔' },
  ASTRA:        { color: '#EF4444', bg: '#FEF2F2', darkBg: '#2E0A0A', label: 'Astra', icon: '⚔' },
  ARTIFACT:     { color: '#EF4444', bg: '#FEF2F2', darkBg: '#2E0A0A', label: 'Artifact', icon: '⚔' },

  // ── Lineages / Cultures ───────────────────────────────────────────────────
  VAMSHA:       { color: '#D97706', bg: '#FDF3E1', darkBg: '#2E1A00', label: 'Vamsha', icon: '⬡' },
  LINEAGE:      { color: '#D97706', bg: '#FDF3E1', darkBg: '#2E1A00', label: 'Lineage', icon: '⬡' },
  CULTURE:      { color: '#D97706', bg: '#FDF3E1', darkBg: '#2E1A00', label: 'Culture', icon: '⬡' },
  GOTRA:        { color: '#D97706', bg: '#FDF3E1', darkBg: '#2E1A00', label: 'Gotra', icon: '⬡' },

  // ── Mystical / Knowledge ──────────────────────────────────────────────────
  MAGIC_SYSTEM: { color: '#8B5CF6', bg: '#F5F3FF', darkBg: '#1E1040', label: 'Magic', icon: '✧' },
  TAPAS:        { color: '#8B5CF6', bg: '#F5F3FF', darkBg: '#1E1040', label: 'Tapas', icon: '✧' },
  KNOWLEDGE:    { color: '#8B5CF6', bg: '#F5F3FF', darkBg: '#1E1040', label: 'Knowledge', icon: '✧' },
  LORE:         { color: '#8B5CF6', bg: '#F5F3FF', darkBg: '#1E1040', label: 'Lore', icon: '✧' },
};

/** Fallback config for unknown entity types */
const DEFAULT_CONFIG: EntityTypeConfig = {
  color: '#71717A',
  bg: '#F4F4F5',
  darkBg: '#1A1A24',
  label: 'Entity',
  icon: '○',
};

/**
 * Get visual config for a World Bible entity type.
 * Falls back gracefully to a neutral style for unknown types.
 */
export const getEntityTypeConfig = (type: string): EntityTypeConfig => {
  const t = type.toUpperCase();
  if (CONFIG_MAP[t]) return CONFIG_MAP[t];
  // Partial match — e.g. 'CHARACTER_CLASS' still resolves to Character
  for (const [key, config] of Object.entries(CONFIG_MAP)) {
    if (t.includes(key)) return config;
  }
  return DEFAULT_CONFIG;
};

/** Get edge stroke color based on relationship type */
export const getRelationshipColor = (type: string): string => {
  const t = type.toUpperCase();
  if (t.includes('ALLY')  || t.includes('FRIEND') || t.includes('BLESSED')   || t.includes('INCARNATION')) return '#10B981'; // emerald
  if (t.includes('ENEMY') || t.includes('RIVAL')  || t.includes('CURSE')     || t.includes('CORRUPT'))     return '#EF4444'; // red
  if (t.includes('HIERARCHY') || t.includes('INHERITS') || t.includes('DESCENDED') || t.includes('AVATAR') || t.includes('BORN'))  return '#6366F1'; // indigo
  if (t.includes('MEMBER') || t.includes('LOCATED') || t.includes('PRACTICES') || t.includes('WIELDS') || t.includes('BELONG'))    return '#0EA5E9'; // sky
  return '#A1A1AA'; // neutral zinc
};
