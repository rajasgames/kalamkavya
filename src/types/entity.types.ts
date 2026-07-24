export interface Entity {
  id: string;
  projectId: string;
  type: string;
  entityClass?: 'MASTER' | 'INSTANCE';
  name: string;
  categorySlug: string;
  data: Record<string, unknown>;
  hasAIRule: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface PowerRank {
  id: string;
  name: string;
  description: string;
}

export interface MagicSystemData {
  sourceType: 'Cosmic' | 'Divine' | 'Internal' | 'Elemental' | 'Technological' | '';
  howItWorks: string;
  limitations: string;
  sideEffects: string[];
  awakeningConditions: string;
  powerRanks: PowerRank[];
  knownPractitioners: string[];
  aiRuleEnabled: boolean;
  aiRuleText: string;
}

export interface RarityTierData {
  name: string;
  displayOrder: number;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  badgeStyle: 'solid' | 'gradient' | 'outline';
  description?: string;
}

export interface WeaponData {
  subType: 'SWORD' | 'MACE' | 'SPEAR' | 'BOW' | 'DAGGER' | 'STAFF' | 'AXE' | 'POLEARM' | 'EXOTIC' | 'MYTHOLOGICAL' | '';
  materials: string[];
  physicalDescription: string;
  weight?: number;
  length?: number;
  properties: string[];
  rarityTierId: string;
  magicSystemIds: string[];
  knownUsersIds: string[];
  originRegion?: string;
  historicalPeriod?: string;
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface CultureData {
  associatedRegionId?: string;
  languageNotes?: string;
  coreValues: string[];
  socialStructure?: string;
  keyCustoms?: string;
  taboos: string[];
  religiousBeliefs?: string;
  artAndMusic?: string;
  factionIds: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface LocationData {
  locationType: 'Planet' | 'Continent' | 'Region' | 'City' | 'Building' | 'Landmark' | 'Other';
  climate: string;
  terrain: string;
  resources: string[];
  rulerId?: string;
  population?: string;
  description: string;
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface SpeciesData {
  classification: 'Mammal' | 'Reptile' | 'Avian' | 'Aquatic' | 'Amphibian' | 'Insectoid' | 'Plant' | 'Energy' | 'Other';
  habitat: string;
  lifespan: string;
  diet: string;
  intelligence: 'Sentient' | 'Semi-Sentient' | 'Non-Sentient';
  physicalTraits: string[];
  abilities: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface ItemData {
  itemType: 'Weapon' | 'Armor' | 'Artifact' | 'Relic' | 'Vehicle' | 'Consumable' | 'Other';
  materials: string[];
  originRegionId?: string;
  value?: string;
  properties: string[];
  history: string;
  currentOwnerId?: string;
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface LanguageData {
  writingSystem: 'Logographic' | 'Syllabic' | 'Alphabetic' | 'None' | 'Other';
  nativeSpeakerIds: string[]; // Culture or Species IDs
  grammarRules: string;
  commonPhrases: string[];
  history: string;
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface ReligionData {
  deityIds: string[];
  founderId?: string;
  coreBeliefs: string[];
  rituals: string[];
  holyTexts: string[];
  placeOfWorship?: string;
  taboos: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface PhilosophyData {
  founderId?: string;
  corePrinciples: string[];
  societalImpact: string;
  associatedFactions: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface SystemData {
  systemType: 'Political' | 'Economic' | 'Legal' | 'Guild' | 'Other';
  structure: string;
  rules: string[];
  keyFigures: string[]; // IDs
  description: string;
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface CharacterData {
  castType: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Commoner' | 'Other' | '';
  rank: 'Supreme' | 'Divine' | 'Immortal' | 'Mortal' | '';
  species: string;
  role: string;
  status: 'Alive' | 'Dead' | 'Unknown' | 'Transformed' | '';
  goals: {
    primaryGoal: string;
    secondaryGoal: string;
    internalFear: string;
    externalThreat: string;
  };
  personality: {
    mbti: string;
    traits: string[];
    flaws: string[];
    virtues: string[];
  };
  motivations: [string, string, string];
  arc: {
    type: 'Positive' | 'Negative' | 'Flat' | 'Corruption' | 'Redemption' | 'Tragedy' | '';
    beginningState: string;
    midpointShift: string;
    endState: string;
  };
  physical: {
    height: string;
    build: string;
    distinguishingFeatures: string;
    voiceDescription: string;
  };
  voice: {
    sentenceStyle: string;
    vocabularyLevel: string;
    accentNotes: string;
    sampleQuote: string;
  };
  skills: string[];
  loreConnections: {
    factionIds: string[];
    locationIds: string[];
    weaponIds: string[];
    cultureIds: string[];
  };
  /**
   * Freeform key-value pairs for genre-specific extensions not covered
   * by the universal fields above (e.g. school subject grades for a
   * high-school rom-com, clearance level for a spy thriller, etc.).
   */
  customFields?: Record<string, unknown>;
  
  moodboardImages?: string[];

  // --- Vedic-specific fields (only rendered when genre module = 'vedic') ---
  /** Stage of life per Vedic ashrama system */
  ashrama?: 'Brahmacharya' | 'Grihastha' | 'Vanaprastha' | 'Sannyasa' | '';
  practitionerPath?: string;
  attributes?: {
    discipline: number;
    strength: number;
    intelligence: number;
    perception: number;
    memory: number;
    charisma: number;
    vitality: number;
    wisdom: number;
    education: number;
    senseMastery: number;
  };
  spiritualGrowth?: {
    karmaAccumulation: number;
    dharmaAlignment: number;
    tapasGeneration: number;
    boonAcquisition: string[];
    curseCleansing: string[];
    liberationStatus: string;
  };
}

export interface Relationship {
  id: string;
  projectId: string;
  fromEntityId: string;
  toEntityId: string;
  type: string;
  directed: boolean;
  metadata: Record<string, unknown>;
}

export interface AiSettings {
  id: 'global';
  activeProvider: string;
  providers: Record<string, {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }>;
  profile: {
    tone: string;
    pov: string;
    proseStyle: string;
  };
}

// --- Vedic & Puranic Specific Types ---

export interface TapasData {
  currentTapas: number;
  maxTapas: number;
  generationRate: number;
  siddhis: string[];
  boons: string[];
  curses: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface AstraData {
  conduitId: string; // ID of the physical weapon (e.g. bow)
  mantra: string;
  tapasCost: number;
  effects: string[];
  restrictedToVarna?: string[];
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface SocialStructureData {
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra' | 'Outside';
  jati: string;
  gotra: string;
  ashrama: 'Brahmacharya' | 'Grihastha' | 'Vanaprastha' | 'Sannyasa' | '';
  guruId?: string;
  shishyaIds: string[];
}

export interface CosmicHierarchyData {
  loka: 'Svarga' | 'Martya' | 'Patala';
  faction: 'Deva' | 'Asura' | 'Neutral';
  dikpalaZone?: string;
  isAvatar: boolean;
  avatarOfId?: string;
}

export interface KingdomData {
  rajadharmaLevel: number;
  chakravartinStatus: boolean;
  saptanga: {
    swamiId: string;
    amatyaIds: string[];
    janapadaMorale: number;
    durgaLevel: number;
    koshaAmount: number;
    dandaPower: number;
    mitraIds: string[];
  };
  aiRuleEnabled: boolean;
  aiRuleText?: string;
}

export interface UniversalLawData {
  lawType: 'Cosmic Order' | 'Karma' | 'Time' | 'Cycles';
  dharmaAlignment: number;
  yugaPhase?: 'Satya' | 'Treta' | 'Dvapara' | 'Kali';
  description: string;
}

export interface GodData {
  godType: 'Tridev' | 'Aditya' | 'Rudra' | 'Vasu' | 'Dikpala' | 'Other';
  lokaId?: string;
  corePrinciple: string;
}

export interface YoniData {
  yoniType: 'Deva' | 'Asura' | 'Preta' | 'Pashu' | 'Manushya' | 'Yaksha' | 'Other';
  characteristics: string[];
}

export interface VamshaData {
  vamshaType: 'Suryavansha' | 'Chandravansha' | 'Agni' | 'Naga' | 'Other';
  founderId?: string;
}

export interface GotraData {
  rootSage: 'Angiras' | 'Atri' | 'Bhrigu' | 'Kashyapa' | 'Vasistha' | 'Vishvamitra' | 'Gautama' | 'Agastya' | 'Other';
  pravara: string[];
}

export interface CombatData {
  vyuhaFormations: string[];
  militaryStructure?: 'Chaturanga' | 'Akshauhini';
  debateModes?: string[];
}

export interface KnowledgeSystemData {
  school: 'Nyaya' | 'Samkhya' | 'Vedanta' | 'Other';
  isGuhyaVidya: boolean;
}
