/**
 * A genre module defines the optional, genre-specific entity sub-types
 * and sidebar categories that are activated for a project.
 *
 * Universal types (character, location, faction, etc.) are always
 * available regardless of genre. Genre modules add on top.
 */
export interface GenreModule {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string; // emoji icon for display
  accentColor: string; // tailwind-compatible color class fragment
  /** Entity type values this module contributes to the creation modal */
  entityTypes: GenreEntityType[];
  /** Sidebar category groups this module adds */
  categoryGroups: GenreCategoryGroup[];
}

export interface GenreEntityType {
  value: string;
  label: string;
  /** Optional human-friendly description shown in creation modal */
  description?: string;
}

export interface GenreCategoryGroup {
  groupLabel: string;
  categories: GenreCategory[];
}

export interface GenreCategory {
  id: string;
  label: string;
  types: string[];
}

/**
 * Built-in genre module IDs. Used as values in Project.genreModules[].
 */
export type BuiltInGenreId =
  | 'universal'
  | 'vedic'
  | 'fantasy'
  | 'scifi'
  | 'contemporary'
  | 'horror'
  | 'historical'
  | 'custom';
