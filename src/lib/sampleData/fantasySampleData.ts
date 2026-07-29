/**
 * Fantasy Sample Data — "Aethelgard: The Shattered Realm"
 *
 * A rich universal High Fantasy World Bible sample featuring realms, magic systems,
 * characters, factions, artifacts, species, and historical lore.
 */
import { db } from '@/lib/db/database';
import { Project, Entity } from '@/types';

export async function loadFantasySampleData(): Promise<string> {
  const now = Date.now();
  const projectId = crypto.randomUUID();

  const project: Project = {
    id: projectId,
    title: 'Aethelgard: The Shattered Realm',
    genre: 'fantasy',
    subGenre: 'high_fantasy',
    genreModules: ['universal', 'fantasy'],
    premise:
      'In a world where celestial ley lines weave the cosmos together, four mortal kingdoms clash over the slumbering remnants of the First Arcane Spire.',
    targetWordCount: 90000,
    kanbanColumns: [
      { id: 'idea', name: 'Worldbuilding', order: 0 },
      { id: 'draft', name: 'Drafting', order: 1 },
      { id: 'revision', name: 'Revision', order: 2 },
      { id: 'final', name: 'Master Manuscript', order: 3 },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const entities: Entity[] = [
    // Characters
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Arch-Mage Valerius Vance',
      categorySlug: 'character',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        role: 'Protagonist / Grand Scholar',
        species: 'Human',
        status: 'Alive',
        goals: {
          primaryGoal: 'Stabilize the leaking Arcane Conduit before the Sky-Fall event',
          secondaryGoal: 'Protect the High Archive from factional looting',
          internalFear: 'That his own ambition caused the fracture of the First Spire',
          externalThreat: 'The Crimson Inquisition seeking to purge magic practitioners',
        },
        personality: {
          mbti: 'INTJ',
          traits: ['Analytical', 'Stoic', 'Secretive'],
          flaws: ['Overly cautious', 'Emotionally distant'],
          virtues: ['Unwavering dedication', 'Profound wisdom'],
        },
        motivations: ['Knowledge preservation', 'Universal balance'],
        arc: {
          type: 'Positive',
          beginningState: 'Isolated in tower academic pursuits',
          midpointShift: 'Forced into active field leadership during the siege',
          endState: 'Unites the fractured orders to repair the ley grid',
        },
        physical: {
          height: '6 ft 1 in',
          build: 'Slender, robes inlaid with silver glyphs',
          distinguishingFeatures: 'Eye of Aether scar across left palm',
          voiceDescription: 'Resonant, measured, carrying quiet authority',
        },
        voice: {
          sentenceStyle: 'Articulate and precise',
          vocabularyLevel: 'Scholarly',
          accentNotes: 'High Aethelgardian cadence',
          sampleQuote: '"The ley lines do not weep for kings; they demand equilibrium."',
        },
        skills: ['Runic Weaver', 'Celestial Navigation', 'Ancient Translation'],
        loreConnections: {
          factionIds: [],
          locationIds: [],
          weaponIds: [],
          cultureIds: [],
        },
        attributes: {
          discipline: 90,
          strength: 40,
          intelligence: 95,
          perception: 85,
          memory: 92,
          charisma: 70,
          vitality: 65,
          wisdom: 88,
          education: 98,
          senseMastery: 75,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Commander Lyra Sunstrider',
      categorySlug: 'character',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        role: 'Co-Protagonist / Knight Commander',
        species: 'High Elf',
        status: 'Alive',
        goals: {
          primaryGoal: 'Defend the Silver Keep against the Void Horde',
          secondaryGoal: 'Uncover the traitor within the High Council',
          internalFear: 'Failing to live up to her ancestral blade’s honor',
          externalThreat: 'Invasion forces from the Sunken Wastes',
        },
        personality: {
          mbti: 'ESTJ',
          traits: ['Brave', 'Tactical', 'Fiercely loyal'],
          flaws: ['Stubborn', 'Impatient with bureaucracy'],
          virtues: ['Honor', 'Selflessness'],
        },
        motivations: ['Protection of the innocent', 'Restoring ancestral glory'],
        arc: {
          type: 'Positive',
          beginningState: 'Blindly trusting of royal protocol',
          midpointShift: 'Discovers corrupt council orders and chooses true justice',
          endState: 'Leads the independent Vanguard of the Free Realms',
        },
        physical: {
          height: '5 ft 10 in',
          build: 'Athletic, wearing gilded plate armor',
          distinguishingFeatures: 'Braid woven with sun-gold ribbons',
          voiceDescription: 'Commanding, crisp, inspiring',
        },
        voice: {
          sentenceStyle: 'Direct and decisive',
          vocabularyLevel: 'Military standard',
          accentNotes: 'Solar Citadel dialect',
          sampleQuote: '"Hold the line! Aethelgard stands as long as we draw breath!"',
        },
        skills: ['Master Swordsmanship', 'Battle Tactics', 'Gryphon Riding'],
        attributes: {
          discipline: 95,
          strength: 85,
          intelligence: 75,
          perception: 90,
          memory: 70,
          charisma: 88,
          vitality: 90,
          wisdom: 80,
          education: 78,
          senseMastery: 82,
        },
      },
    },

    // Locations / Realms
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'location',
      entityClass: 'INSTANCE',
      name: 'The Solar Citadel',
      categorySlug: 'geography',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        locationType: 'Continent',
        climate: 'Temperate, bathed in permanent golden dusk',
        terrain: 'Floating mountain archipelagos and crystal cascades',
        resources: ['Sun-Gold Ore', 'Aether Crystals', 'Star-Silk'],
        population: '1,200,000',
        description:
          'The ancient seat of the Sunstrider Dynasty, hovering above the Cloud Sea anchored by giant ley chains.',
      },
    },
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'location',
      entityClass: 'INSTANCE',
      name: 'The Sunken Wastes',
      categorySlug: 'geography',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        locationType: 'Region',
        climate: 'Arid and magic-warped',
        terrain: 'Desolate glass dunes and abyssal chasms',
        resources: ['Void Crystals', 'Dark Iron'],
        population: 'Unknown',
        description:
          'A ruined wasteland shattered during the First Arcane War, now infested with voidspawn and renegade sorcerers.',
      },
    },

    // Factions & Dynasties
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'faction',
      entityClass: 'INSTANCE',
      name: 'The Order of the Arcane Weavers',
      categorySlug: 'groups',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        description:
          'An ancient guild of mages and scholars dedicated to mapping celestial ley networks and maintaining cosmic balance.',
      },
    },
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'family',
      entityClass: 'INSTANCE',
      name: 'Sunstrider Royal House',
      categorySlug: 'families',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        description:
          'The ruling high elven lineage of the Solar Citadel, famed for their sun-forged blades and gryphon riders.',
      },
    },

    // Power Systems & Magic
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'system',
      entityClass: 'MASTER',
      name: 'Celestial Weaving Magic System',
      categorySlug: 'concepts',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        sourceType: 'Cosmic',
        howItWorks:
          'Practitioners channel invisible Aetheric threads linking constellation alignments down to physical runic conduits.',
        limitations:
          'Over-casting causes Aether burn and fractures ambient localized gravity fields.',
        sideEffects: ['Lucid crystal veins', 'Temporal perception lag'],
        awakeningConditions: 'Profound resonance with a fallen starfragment during a celestial eclipse.',
      },
    },

    // Artifacts & Objects
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'object',
      entityClass: 'INSTANCE',
      name: 'Sun-Forged Blade of Solaria',
      categorySlug: 'things',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        itemType: 'Weapon',
        materials: ['Star-Steel', 'Solarium Core'],
        value: 'Priceless Royal Artifact',
        properties: ['Emits blinding solar light', 'Cleaves through void magic shields'],
        history: 'Forged during the First Dawn by Arch-Smith Eldrin for the original Sunward Queen.',
      },
    },

    // Events & Lore
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'event',
      entityClass: 'INSTANCE',
      name: 'The Shattering of the First Spire',
      categorySlug: 'events',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        description:
          'The cataclysmic event 300 years ago when the central Arcane Spire exploded, splitting Aethelgard into floating continents.',
      },
    },
    {
      id: crypto.randomUUID(),
      projectId,
      type: 'lore_text',
      entityClass: 'INSTANCE',
      name: 'Codex of Aetheric Threads',
      categorySlug: 'lore',
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
      data: {
        description:
          'The foundational text detailing the 12 prime runes and celestial alignments of magic.',
      },
    },
  ];

  // Save project and entities to Dexie DB
  await db.projects.put(project);
  await db.entities.bulkPut(entities);

  return projectId;
}
