import { db } from './db/database';
import { Entity, Relationship, Project } from '@/types';
import { useStoryStore } from '@/stores/storyStore';

export const loadVedicSampleData = async (forceNewProject = false) => {
  let { activeProject } = useStoryStore.getState();

  // If no project is active, OR we force it, create a new one
  if (!activeProject || forceNewProject) {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: 'Vedic Cosmology (Sample)',
      genre: 'Mythology / Epic Fantasy',
      premise: 'A complete structural mapping of Vedic and Puranic cosmic laws, realms, factions, and entities.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetWordCount: 50000,
      genreModules: ['vedic']
    };
    await db.projects.put(newProject);
    await useStoryStore.getState().setActiveProject(newProject.id);
    activeProject = newProject;
  }

  const projectId = activeProject.id;
  const entities: Entity[] = [];
  const relationships: Relationship[] = [];
  const now = Date.now();

  const addNode = (
    name: string,
    type: string,
    categorySlug: string,
    data: Record<string, unknown> = {},
    parentId?: string
  ): string => {
    const id = crypto.randomUUID();
    entities.push({
      id,
      projectId,
      type,
      entityClass: 'INSTANCE',
      name,
      categorySlug,
      data,
      hasAIRule: false,
      createdAt: now,
      updatedAt: now,
    });

    if (parentId) {
      relationships.push({
        id: crypto.randomUUID(),
        projectId,
        fromEntityId: parentId,
        toEntityId: id,
        type: 'HIERARCHY',
        directed: true,
        metadata: { label: 'contains' },
      });
    }
    return id;
  };

  // Master Root Node
  const masterRootId = addNode('The Vedic Universe', 'UNIVERSE', 'cosmos');

  // ==========================================
  // MILESTONE 1: WORLD (Geography & Cosmology)
  // ==========================================
  const worldId = addNode('World (Cosmography & Geography)', 'CATEGORY_NODE', 'geography', {}, masterRootId);

  // 1. Realms (Lokas)
  const realmsId = addNode('Realms (Lokas)', 'LOKA', 'realms', {}, worldId);
  
  const upperRealmsId = addNode('Upper Realms', 'LOKA', 'realms', {}, realmsId);
  addNode('Satya Loka (Brahma Loka)', 'LOKA', 'realms', {}, upperRealmsId);
  addNode('Svarga Loka (Heaven)', 'LOKA', 'realms', {}, upperRealmsId);
  addNode('Vaikuntha Loka', 'LOKA', 'realms', {}, upperRealmsId);
  addNode('Kailash Loka', 'LOKA', 'realms', {}, upperRealmsId);
  
  const middleRealmsId = addNode('Middle Realm (Bhu Loka - Mortal World)', 'LOKA', 'realms', {}, realmsId);
  
  // 2. Locations and Places (in Middle Realm)
  const kuruLocId = addNode('Kuru Kingdom', 'location', 'geography', {}, middleRealmsId);
  const hastinapuraPlaceId = addNode('Hastinapura (City)', 'landmark', 'geography', {}, kuruLocId);
  addNode('Royal Sabha (Assembly Hall)', 'landmark', 'geography', {}, hastinapuraPlaceId);
  addNode('Indraprastha (City)', 'landmark', 'geography', {}, kuruLocId);

  const kosalaLocId = addNode('Kosala Kingdom', 'location', 'geography', {}, middleRealmsId);
  const ayodhyaPlaceId = addNode('Ayodhya (City)', 'landmark', 'geography', {}, kosalaLocId);
  addNode('Ram Janmabhoomi (Temple)', 'landmark', 'geography', {}, ayodhyaPlaceId);

  const dandaRegId = addNode('Dandakaranya (Deep Wild Forest)', 'region', 'geography', {}, middleRealmsId);
  addNode('Chitrakoot (Ashrama)', 'landmark', 'geography', {}, dandaRegId);
  addNode('Panchavati (Ashrama)', 'landmark', 'geography', {}, dandaRegId);

  const lowerRealmsId = addNode('Lower Realms (Patala)', 'LOKA', 'realms', {}, realmsId);
  addNode('Atala Loka', 'LOKA', 'realms', {}, lowerRealmsId);
  addNode('Naga Loka (Deepest Patala)', 'LOKA', 'realms', {}, lowerRealmsId);

  // 3. Geographic Features & Economic Arteries
  const geoFeaturesId = addNode('Geographic Features & Routes', 'region', 'geography', {}, worldId);
  addNode('Uttarapatha (Northern Trade Route)', 'landmark', 'geography', {}, geoFeaturesId);
  addNode('Dakshinapatha (Southern Trade Route)', 'landmark', 'geography', {}, geoFeaturesId);


  // ==========================================
  // MILESTONE 2: PEOPLE (Factions, Cast, Lineages)
  // ==========================================
  const peopleId = addNode('People (Factions, Cast, & Lineages)', 'CATEGORY_NODE', 'cast', {}, masterRootId);

  // 1. Factions & Groups
  const factionsId = addNode('Factions & Groups', 'FACTION', 'communities', {}, peopleId);
  addNode('The Kuru Alliance', 'FACTION', 'communities', {}, factionsId);
  addNode('The Pandava Camp', 'FACTION', 'communities', {}, factionsId);
  addNode('The Vrishni Confederacy', 'FACTION', 'communities', {}, factionsId);
  addNode('Saptarishi (Council of Seven Sages)', 'FACTION', 'communities', {}, factionsId);

  // 2. Dynasties (Vamsha)
  const vamshaRootId = addNode('Dynasties (Vamsha)', 'VAMSHA', 'families', {}, peopleId);
  const suryaVamshaId = addNode('Suryavansha (Solar Dynasty)', 'VAMSHA', 'families', {}, vamshaRootId);
  addNode('King Ikshvaku Line', 'VAMSHA', 'families', {}, suryaVamshaId);
  const chandraVamshaId = addNode('Chandravansha (Lunar Dynasty)', 'VAMSHA', 'families', {}, vamshaRootId);
  const kuruLineId = addNode('Kuru Line', 'VAMSHA', 'families', {}, chandraVamshaId);
  addNode('Yadu Line', 'VAMSHA', 'families', {}, chandraVamshaId);
  addNode('Naga Vamsha (Serpent Dynasties)', 'VAMSHA', 'families', {}, vamshaRootId);

  // 3. Gotras (Lineages & Preceptor Line)
  const gotraRootId = addNode('Gotras (Lineages & Preceptor Line)', 'GOTRA', 'families', {}, peopleId);
  const vasisthaGotraId = addNode('Vasistha Gotra', 'GOTRA', 'families', {}, gotraRootId);
  const bharadwajaGotraId = addNode('Bharadwaja Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Kashyapa Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Vishvamitra Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Angiras Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Atri Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Bhrigu Gotra', 'GOTRA', 'families', {}, gotraRootId);
  addNode('Gautama Gotra', 'GOTRA', 'families', {}, gotraRootId);

  // Connect Gotra Preceptor Lineages to Dynasties via relationships
  relationships.push({
    id: crypto.randomUUID(),
    projectId,
    fromEntityId: vasisthaGotraId,
    toEntityId: suryaVamshaId,
    type: 'LINEAGE_PRECEPTOR',
    directed: true,
    metadata: { label: 'Kula Guru / Preceptor to' },
  });
  relationships.push({
    id: crypto.randomUUID(),
    projectId,
    fromEntityId: bharadwajaGotraId,
    toEntityId: kuruLineId,
    type: 'LINEAGE_PRECEPTOR',
    directed: true,
    metadata: { label: 'Kula Preceptor to' },
  });

  // 3. Species / Races (Yoni)
  const racesId = addNode('Species & Races (Yoni)', 'YONI_MANUSHYA', 'races', {}, peopleId);
  addNode('Manushya (Humans)', 'YONI_MANUSHYA', 'races', {}, racesId);
  addNode('Deva (Gods & Celestials)', 'YONI_DEVA', 'celestial_races', {}, racesId);
  addNode('Asura (Demons & Chthonic Forces)', 'YONI_ASURA', 'celestial_races', {}, racesId);
  addNode('Vanara (Forest Dwellers)', 'YONI_YAKSHA', 'races', {}, racesId);
  addNode('Naga (Serpent Folk)', 'YONI_PASHU', 'celestial_races', {}, racesId);

  // 4. Character Archetypes & Roles
  const archetypesId = addNode('Character Archetypes & Occupations', 'character', 'cast', {}, peopleId);
  addNode('Maharathi (Warrior Elite)', 'character', 'cast', {}, archetypesId);
  addNode('Purohit (Royal Priest)', 'character', 'cast', {}, archetypesId);
  addNode('Sanyasi / Sadhu (Renunciate)', 'character', 'cast', {}, archetypesId);
  addNode('Rishi (Seer of Truth)', 'character', 'cast', {}, archetypesId);
  addNode('Rajguru (Royal Preceptor)', 'character', 'cast', {}, archetypesId);


  // ==========================================
  // MILESTONE 3: LORE (Concepts, Magic, Systems)
  // ==========================================
  const loreId = addNode('Lore (Cosmology, Laws, & Magic)', 'CATEGORY_NODE', 'knowledge', {}, masterRootId);

  // 1. Cosmic Laws & Concepts
  const lawsId = addNode('Cosmic Laws & Concepts', 'UNIVERSAL_LAW', 'universal_laws', {}, loreId);
  addNode('Dharma (Righteousness / Master Alignment)', 'UNIVERSAL_LAW', 'universal_laws', {}, lawsId);
  addNode('Karma (Action & Consequence)', 'UNIVERSAL_LAW', 'universal_laws', {}, lawsId);
  const purusharthaId = addNode('Purushartha (Goals of Human Life)', 'UNIVERSAL_LAW', 'universal_laws', {}, lawsId);
  addNode('Dharma (Duty)', 'UNIVERSAL_LAW', 'universal_laws', {}, purusharthaId);
  addNode('Artha (Wealth)', 'UNIVERSAL_LAW', 'universal_laws', {}, purusharthaId);
  addNode('Kama (Desire)', 'UNIVERSAL_LAW', 'universal_laws', {}, purusharthaId);
  addNode('Moksha (Liberation)', 'UNIVERSAL_LAW', 'universal_laws', {}, purusharthaId);
  const ashramaId = addNode('Ashrama (Life Stages)', 'UNIVERSAL_LAW', 'universal_laws', {}, lawsId);
  addNode('Brahmacharya (Student)', 'UNIVERSAL_LAW', 'universal_laws', {}, ashramaId);
  addNode('Grihastha (Householder)', 'UNIVERSAL_LAW', 'universal_laws', {}, ashramaId);
  addNode('Vanaprastha (Forest Dweller)', 'UNIVERSAL_LAW', 'universal_laws', {}, ashramaId);
  addNode('Sannyasa (Renunciate)', 'UNIVERSAL_LAW', 'universal_laws', {}, ashramaId);
  addNode('Vardan (Boons) & Shaap (Curses)', 'UNIVERSAL_LAW', 'universal_laws', {}, lawsId);

  // 2. Power Systems & Combat
  const powerId = addNode('Power Systems & Combat', 'UNIVERSAL_LAW', 'universal_laws', {}, loreId);
  addNode('Tapas (Austerity Resource)', 'UNIVERSAL_LAW', 'universal_laws', {}, powerId);
  addNode('Maya (Illusion/Reality-Warping)', 'UNIVERSAL_LAW', 'universal_laws', {}, powerId);
  const weaponsId = addNode('Divine Weapons (Astras & Shastras)', 'WEAPON', 'divine_weapons', {}, powerId);
  addNode('Brahmastra (Brahma\'s Cosmic Weapon)', 'ASTRA', 'divine_weapons', {}, weaponsId);
  addNode('Sudarshana Chakra', 'ASTRA', 'divine_weapons', {}, weaponsId);
  addNode('Gada (Mace)', 'SHASTRA', 'divine_weapons', {}, weaponsId);
  const vyuhasId = addNode('Vyūha Formations', 'VYUHA', 'formations', {}, powerId);
  addNode('Chakra Vyūha (The Wheel)', 'VYUHA', 'formations', {}, vyuhasId);
  addNode('Garuda Vyūha (The Eagle)', 'VYUHA', 'formations', {}, vyuhasId);

  // 3. Institutions & Knowledge Systems
  const instId = addNode('Institutions & Knowledge Systems', 'PHILOSOPHY', 'knowledge', {}, loreId);
  addNode('Gurukul (Education System)', 'PHILOSOPHY', 'knowledge', {}, instId);
  const textsId = addNode('Vedas & Puranas', 'TEXT', 'knowledge', {}, instId);
  addNode('Rig Veda', 'TEXT', 'knowledge', {}, textsId);
  addNode('Mahabharata (Itihasa)', 'TEXT', 'knowledge', {}, textsId);
  addNode('Ramayana (Itihasa)', 'TEXT', 'knowledge', {}, textsId);

  // 4. Time Cycles
  const timeId = addNode('Cosmic Time (Yugas & Kalpas)', 'COSMIC_TIME', 'cosmic_time', {}, loreId);
  addNode('Satya Yuga (Golden Age)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Treta Yuga (Silver Age)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Dvapara Yuga (Bronze Age)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Kali Yuga (Iron Age)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Maha-Kalpa (Life of Brahma)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);


  // ==========================================
  // SAMPLE CHAPTERS & SCENES FOR MANUSCRIPT
  // ==========================================
  const chap1Id = `chap-${now}-1`;
  const chap2Id = `chap-${now}-2`;
  const chap3Id = `chap-${now}-3`;

  const sampleChapters = [
    { id: chap1Id, projectId, title: 'Khanda I: Cosmic Order & Disruption (Rita)', order: 1, createdAt: now, updatedAt: now },
    { id: chap2Id, projectId, title: 'Khanda II: Royal Assembly & Quest (Artha)', order: 2, createdAt: now, updatedAt: now },
    { id: chap3Id, projectId, title: 'Khanda III: Trial in the Wilderness (Kama)', order: 3, createdAt: now, updatedAt: now },
  ];

  const sampleScenes = [
    {
      id: `scene-${now}-1`,
      projectId,
      chapterId: chap1Id,
      title: 'Scene 1: The Breaking of the Rita',
      content: '<p>The celestial fires burned blue along the peaks of Mount Meru. Indra watched from his high throne as the ancient vows of austerity resonated across the three worlds...</p><p>For three thousand solar cycles, no mortal had accumulated Tapas of such potency without threatening the balance between Devas and Asuras.</p>',
      wordCount: 52,
      order: 1,
      kanbanColumn: 'draft',
      planning: {
        goal: 'Establish the cosmic imbalance and the threat posed by unchecked Tapas.',
        conflict: 'Indra fears losing the celestial throne to a mortal rishi.',
        outcome: 'A divine herald is dispatched to test the rishi\'s resolve.'
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: `scene-${now}-2`,
      projectId,
      chapterId: chap2Id,
      title: 'Scene 1: The Royal Assembly at Ayodhya',
      content: '<p>The scent of sandalwood incense and roasted cardamom hung heavy in the royal sabha. The King sat upon the lion-throne, surrounded by his ministers and the revered Rajguru...</p>',
      wordCount: 30,
      order: 1,
      kanbanColumn: 'todo',
      planning: {
        goal: 'Convene the royal sabha to address the kingdom\'s impending succession and quest.',
        conflict: 'Court factions disagree on army deployment.',
        outcome: 'The princes are summoned to undertake the sacred Astra sadhana.'
      },
      createdAt: now,
      updatedAt: now
    }
  ];

  // --- BULK INSERT ---
  await db.entities.bulkPut(entities);
  if (relationships.length > 0) {
    await db.relationships.bulkPut(relationships);
  }
  await db.chapters.bulkPut(sampleChapters);
  await db.scenes.bulkPut(sampleScenes);

  // Update in-memory state if we are still active on this project
  if (useStoryStore.getState().activeProjectId === projectId) {
    const currentState = useStoryStore.getState();
    useStoryStore.setState({
      entities: [...currentState.entities, ...entities],
      relationships: [...currentState.relationships, ...relationships],
    });
  }
};
