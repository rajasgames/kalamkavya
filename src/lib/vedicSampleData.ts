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
      premise: 'A complete structural mapping of Vedic and Puranic cosmic laws, realms, and entities.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetWordCount: 50000,
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

  // --- 1. COSMOS ---
  // Universal Laws
  const uLawsId = addNode('Universal Laws', 'UNIVERSAL_LAW', 'universal_laws', {}, masterRootId);
  addNode('Dharma (Cosmic Moral Law / Master Alignment)', 'UNIVERSAL_LAW', 'universal_laws', {}, uLawsId);
  addNode('Karma (Individual actions altering destiny)', 'UNIVERSAL_LAW', 'universal_laws', {}, uLawsId);
  addNode('Ancestral Karma', 'UNIVERSAL_LAW', 'universal_laws', {}, uLawsId);
  addNode('Action Consequences', 'UNIVERSAL_LAW', 'universal_laws', {}, uLawsId);
  addNode('Rebirth Mechanics', 'UNIVERSAL_LAW', 'universal_laws', {}, uLawsId);

  // Cosmic Time
  const timeId = addNode('Cosmic Time', 'COSMIC_TIME', 'cosmic_time', {}, masterRootId);
  const yugasId = addNode('Four Yugas', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Satya Yuga (Golden Age)', 'COSMIC_TIME', 'cosmic_time', {}, yugasId);
  addNode('Treta Yuga (Silver Age)', 'COSMIC_TIME', 'cosmic_time', {}, yugasId);
  addNode('Dvapara Yuga (Bronze Age)', 'COSMIC_TIME', 'cosmic_time', {}, yugasId);
  addNode('Kali Yuga (Iron Age)', 'COSMIC_TIME', 'cosmic_time', {}, yugasId);
  addNode('Manvantaras (Progenitor Cycles)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  const kalpasId = addNode('Kalpas (Days of Brahma)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);
  addNode('Day of Brahma (Active Universe)', 'COSMIC_TIME', 'cosmic_time', {}, kalpasId);
  addNode('Night of Brahma (Pralaya)', 'COSMIC_TIME', 'cosmic_time', {}, kalpasId);
  addNode('Maha-Kalpa (Life of Brahma)', 'COSMIC_TIME', 'cosmic_time', {}, timeId);

  // Cycles of Creation
  const cyclesId = addNode('Cycles of Creation', 'CYCLE', 'cycles', {}, masterRootId);
  addNode('Avatar Rules', 'CYCLE', 'cycles', {}, cyclesId);
  addNode('Pralaya (Dissolution)', 'CYCLE', 'cycles', {}, cyclesId);
  addNode('Cosmic Balance (Deva-Asura Conflict)', 'CYCLE', 'cycles', {}, cyclesId);


  // --- 2. DIVINE WORLD ---
  const realmsId = addNode('Super-Celestial Realms', 'LOKA', 'realms', {}, masterRootId);
  addNode('Satya Loka (Brahma Loka)', 'LOKA', 'realms', {}, realmsId);
  addNode('Vaikuntha Loka', 'LOKA', 'realms', {}, realmsId);
  addNode('Kailash Loka', 'LOKA', 'realms', {}, realmsId);
  addNode('Goloka', 'LOKA', 'realms', {}, realmsId);

  const tridevId = addNode('Supreme Reality (Tridev & Tridevi)', 'GOD', 'gods', {}, masterRootId);
  addNode('Brahma & Saraswati (Creation & Knowledge)', 'GOD', 'gods', {}, tridevId);
  addNode('Vishnu & Lakshmi (Preservation & Wealth)', 'GOD', 'gods', {}, tridevId);
  addNode('Shiva & Parvati (Destruction & Power)', 'GOD', 'gods', {}, tridevId);

  const celRealmsId = addNode('Celestial Realms', 'LOKA', 'realms', {}, masterRootId);
  addNode('Svarga Loka (Heaven)', 'LOKA', 'realms', {}, celRealmsId);
  addNode('Bhuvar Loka (Atmospheric Realm)', 'LOKA', 'realms', {}, celRealmsId);
  addNode('Mahar Loka', 'LOKA', 'realms', {}, celRealmsId);
  addNode('Janar Loka', 'LOKA', 'realms', {}, celRealmsId);

  const lumRealmsId = addNode('Luminary Realms', 'LOKA', 'realms', {}, masterRootId);
  const suryaLoka = addNode('Surya Loka (Solar Realm)', 'LOKA', 'realms', {}, lumRealmsId);
  addNode('Surya (Vivasvan)', 'GOD', 'gods', {}, suryaLoka);
  addNode('12 Adityas (Rotating Duties)', 'GOD', 'gods', {}, suryaLoka);
  addNode('Solar Sages', 'YONI_DEVA', 'celestial_races', {}, suryaLoka);
  
  const chandraLoka = addNode('Chandra Loka (Lunar Realm)', 'LOKA', 'realms', {}, lumRealmsId);
  addNode('Chandra (Soma)', 'GOD', 'gods', {}, chandraLoka);
  addNode('27 Nakshatras', 'GOD', 'gods', {}, chandraLoka);
  addNode('Pitrus (Ancestors)', 'YONI_PRETA', 'celestial_races', {}, chandraLoka);

  const godsId = addNode('Gods (33 Koti Devtas)', 'GOD', 'gods', {}, masterRootId);
  addNode('12 Adityas (Solar & Social Laws)', 'GOD', 'gods', {}, godsId);
  addNode('11 Rudras (Transformation & Destruction)', 'GOD', 'gods', {}, godsId);
  addNode('8 Vasus (Elemental Foundations)', 'GOD', 'gods', {}, godsId);
  addNode('2 Core Principles (Authority & Creation)', 'GOD', 'gods', {}, godsId);

  const devasId = addNode('Celestial Races (Deva-Yoni)', 'YONI_DEVA', 'celestial_races', {}, masterRootId);
  addNode('Ashwini Kumaras (Divine Physicians)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Gandharvas (Celestial Musicians)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Apsaras (Celestial Dancers)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Vidyadharas (Sorcerers)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Maruts (Storm Deities)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Siddhas (Perfected Saints)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Charanas (Celestial Bards)', 'YONI_DEVA', 'celestial_races', {}, devasId);
  addNode('Nitya-Surs (Eternal Liberated Souls)', 'YONI_DEVA', 'celestial_races', {}, devasId);

  const asurasId = addNode('Chthonic Forces (Asura-Yoni)', 'YONI_ASURA', 'celestial_races', {}, masterRootId);
  addNode('Daityas (Combat Rebels)', 'YONI_ASURA', 'celestial_races', {}, asurasId);
  addNode('Danavas (Illusion Architects)', 'YONI_ASURA', 'celestial_races', {}, asurasId);
  addNode('Rakshasas (Night Warriors)', 'YONI_ASURA', 'celestial_races', {}, asurasId);
  addNode('Yatudhanas (Dark Sorcerers)', 'YONI_ASURA', 'celestial_races', {}, asurasId);

  const pretasId = addNode('Spirits (Preta-Yoni)', 'YONI_PRETA', 'celestial_races', {}, masterRootId);
  addNode('Pretas (Hungry Ghosts)', 'YONI_PRETA', 'celestial_races', {}, pretasId);
  addNode('Bhoot-Pret (Elemental Spirits)', 'YONI_PRETA', 'celestial_races', {}, pretasId);
  addNode('Pishachas (Flesh-Eaters)', 'YONI_PRETA', 'celestial_races', {}, pretasId);
  addNode('Vetalas (Vampire Spirits)', 'YONI_PRETA', 'celestial_races', {}, pretasId);
  addNode('Ganas (Shiva\'s Spirit Army)', 'YONI_PRETA', 'celestial_races', {}, pretasId);

  const pashusId = addNode('Divine Animal Lineages (Pashu-Pakshi Yoni)', 'YONI_PASHU', 'celestial_races', {}, masterRootId);
  addNode('Garudas (Divine Birds)', 'YONI_PASHU', 'celestial_races', {}, pashusId);
  addNode('Kamadhenus (Wish-Fulfilling Cows)', 'YONI_PASHU', 'celestial_races', {}, pashusId);
  addNode('Airavatas (Divine Elephants)', 'YONI_PASHU', 'celestial_races', {}, pashusId);
  addNode('Uchchaihshravas (Divine Horses)', 'YONI_PASHU', 'celestial_races', {}, pashusId);

  // --- 3. NETHERWORLD (PATALA) ---
  const patalaId = addNode('Netherworld (Patala Lokas)', 'LOKA', 'realms', {}, masterRootId);
  addNode('Atala Loka', 'LOKA', 'realms', {}, patalaId);
  addNode('Vitala Loka', 'LOKA', 'realms', {}, patalaId);
  addNode('Sutala Loka', 'LOKA', 'realms', {}, patalaId);
  addNode('Talatala Loka', 'LOKA', 'realms', {}, patalaId);
  addNode('Mahatala Loka', 'LOKA', 'realms', {}, patalaId);
  addNode('Rasatala Loka', 'LOKA', 'realms', {}, patalaId);
  const deepPatala = addNode('Patala Loka (Deepest)', 'LOKA', 'realms', {}, patalaId);
  addNode('Nagas (Serpent Humanoids)', 'YONI_PASHU', 'celestial_races', {}, deepPatala);
  addNode('Uragas (Divine Serpents)', 'YONI_PASHU', 'celestial_races', {}, deepPatala);

  // --- 4. MORTAL WORLD ---
  const geoId = addNode('Sacred Geography', 'location', 'geography', {}, masterRootId);
  addNode('Tirthas & Kshetras (Sacred Sites)', 'location', 'geography', {}, geoId);
  addNode('Temples', 'landmark', 'geography', {}, geoId);
  addNode('Ashrama Neutral Zones', 'region', 'geography', {}, geoId);
  addNode('Shapit Territories (Cursed Biomes)', 'region', 'geography', {}, geoId);
  const biomesId = addNode('Biome Classifications', 'region', 'geography', {}, geoId);
  addNode('Aranya (Standard Forest)', 'region', 'geography', {}, biomesId);
  addNode('Tapovana (Meditative Forest)', 'region', 'geography', {}, biomesId);
  addNode('Mahavana (Deep Wild Forest)', 'region', 'geography', {}, biomesId);

  const econId = addNode('Economic Arteries', 'region', 'geography', {}, masterRootId);
  addNode('Uttarapatha (Northern Route)', 'landmark', 'geography', {}, econId);
  addNode('Dakshinapatha (Southern Route)', 'landmark', 'geography', {}, econId);

  const racesId = addNode('Terrestrial Races', 'YONI_MANUSHYA', 'races', {}, masterRootId);
  addNode('Manushyas (Humans)', 'YONI_MANUSHYA', 'races', {}, racesId);
  addNode('Vanaras (Monkey Humanoids)', 'YONI_YAKSHA', 'races', {}, racesId);
  addNode('Rikshas (Bear Humanoids)', 'YONI_YAKSHA', 'races', {}, racesId);
  addNode('Kinnaras & Kimpurushas (Hybrid Races)', 'YONI_YAKSHA', 'races', {}, racesId);
  addNode('Yakshas & Yakshinis (Nature Spirits)', 'YONI_YAKSHA', 'races', {}, racesId);
  addNode('Guhyakas (Treasure Guardians)', 'YONI_YAKSHA', 'races', {}, racesId);

  const kingId = addNode('Kingdoms', 'KINGDOM', 'kingdoms', {}, masterRootId);
  const sapId = addNode('Saptanga Theory (7 Limbs of State)', 'KINGDOM', 'kingdoms', {}, kingId);
  addNode('Swami (The King)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Amatya (The Ministers)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Janapada (Territory & Population)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Durga (Fortified Capital)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Kosha (Treasury)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Danda (Military & Justice)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Mitra (Allies)', 'KINGDOM', 'kingdoms', {}, sapId);
  addNode('Chakravartin (Emperor Status)', 'KINGDOM', 'kingdoms', {}, kingId);
  addNode('Sabha & Samiti (Council Systems)', 'KINGDOM', 'kingdoms', {}, kingId);
  addNode('Dandaniti & Tributary System', 'KINGDOM', 'kingdoms', {}, kingId);
  addNode('Rajguru Veto Mechanic', 'KINGDOM', 'kingdoms', {}, kingId);

  const commId = addNode('Communities', 'VARNA', 'communities', {}, masterRootId);
  const varnaId = addNode('Varna (4 Classes)', 'VARNA', 'communities', {}, commId);
  addNode('Brahmin (Priestly)', 'VARNA', 'communities', {}, varnaId);
  addNode('Kshatriya (Warrior)', 'VARNA', 'communities', {}, varnaId);
  addNode('Vaishya (Merchant)', 'VARNA', 'communities', {}, varnaId);
  addNode('Shudra (Servant)', 'VARNA', 'communities', {}, varnaId);
  addNode('Jati (Sub-castes) e.g. Pandit, Gwala', 'JATI', 'communities', {}, commId);
  addNode('Shreni (Merchant Guilds)', 'SHRENI', 'communities', {}, commId);

  const famId = addNode('Families', 'VAMSHA', 'families', {}, masterRootId);
  const vamshaId = addNode('Vamsha System (4 Major Macro-Vanshas)', 'VAMSHA', 'families', {}, famId);
  addNode('Shuryavansha (Solar via King Ikshvaku)', 'VAMSHA', 'families', {}, vamshaId);
  addNode('Chandravansha (Lunar via King Pururavas)', 'VAMSHA', 'families', {}, vamshaId);
  addNode('Agni Vamsha (Fire via Mount Abu Yajna)', 'VAMSHA', 'families', {}, vamshaId);
  addNode('Naga Vamsha (Serpent deities)', 'VAMSHA', 'families', {}, vamshaId);
  const gotraId = addNode('Gotra System (8 Root Lineages)', 'GOTRA', 'families', {}, famId);
  ['Angiras', 'Atri', 'Bhrigu', 'Kashyapa', 'Vasistha', 'Vishvamitra', 'Gautama', 'Agastya'].forEach(g => {
    addNode(g, 'GOTRA', 'families', {}, gotraId);
  });
  addNode('Pravara (Sub-Authentication)', 'GOTRA', 'families', {}, famId);
  addNode('Patrilineal Inheritance', 'GOTRA', 'families', {}, famId);
  addNode('Sagotra Vivah Rule (Inbreeding Prevention)', 'GOTRA', 'families', {}, famId);

  const instId = addNode('Institutions', 'location', 'geography', {}, masterRootId);
  addNode('Gurukul (Education)', 'landmark', 'geography', {}, instId);
  addNode('Sabha (Assembly Halls)', 'landmark', 'geography', {}, instId);
  addNode('Vidyapeeth (Universities)', 'landmark', 'geography', {}, instId);
  
  const evId = addNode('Events', 'EVENT', 'events', {}, masterRootId);
  addNode('Swayamvara (Marriage Tournament)', 'EVENT', 'events', {}, evId);
  addNode('Ashvamedha (Horse Sacrifice)', 'YAJNA', 'events', {}, evId);
  addNode('Yajna (Fire Sacrifice)', 'YAJNA', 'events', {}, evId);
  addNode('Pilgrimage Circuits', 'EVENT', 'events', {}, evId);


  // --- 5. COMBAT SYSTEMS ---
  const arenaId = addNode('Physical Combat Arenas', 'ARENA', 'arenas', {}, masterRootId);
  addNode('Rangabhoomi / Swayamvar Sabha', 'ARENA', 'arenas', {}, arenaId);
  addNode('Akhada / Malla-Yuddha Bhoomi', 'ARENA', 'arenas', {}, arenaId);
  addNode('Dharmakshetra / Yudhabhoomi', 'ARENA', 'arenas', {}, arenaId);
  const vyuhaId = addNode('Vyūha Formations', 'VYUHA', 'formations', {}, arenaId);
  addNode('Chakra Vyūha (The Wheel)', 'VYUHA', 'formations', {}, vyuhaId);
  addNode('Garuda Vyūha (The Eagle)', 'VYUHA', 'formations', {}, vyuhaId);
  addNode('Krauncha Vyūha (The Heron)', 'VYUHA', 'formations', {}, vyuhaId);
  addNode('Makara Vyūha (The Crocodile)', 'VYUHA', 'formations', {}, vyuhaId);
  addNode('Soochi Vyūha (The Needle)', 'VYUHA', 'formations', {}, vyuhaId);

  const shastrarthId = addNode('Intellectual Combat (Shastrarth)', 'ARENA', 'arenas', {}, masterRootId);
  addNode('Weapons (Pramana) - Pratyaksha, Anumana, Shabda', 'PHILOSOPHY', 'knowledge', {}, shastrarthId);
  addNode('Modes of Debate - Vada, Jalpa, Vitanda', 'PHILOSOPHY', 'knowledge', {}, shastrarthId);

  const milId = addNode('Military Structure', 'MILITARY', 'formations', {}, masterRootId);
  addNode('Chaturanga (Infantry, Cavalry, Elephants, Chariots)', 'MILITARY', 'formations', {}, milId);
  addNode('Akshauhini (Army Array)', 'MILITARY', 'formations', {}, milId);

  const wpnId = addNode('Divine Weapons', 'WEAPON', 'divine_weapons', {}, masterRootId);
  const shastrasId = addNode('Shastras (Melee Weapons)', 'SHASTRA', 'divine_weapons', {}, wpnId);
  addNode('Trishula (Shiva\'s Trident)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Khadga (Sword of Wisdom)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Parashu (Battleaxe)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Vajra (Indra\'s Thunderbolt)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Gada (Mace)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Chandrahasa (Moon Blade)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  addNode('Legendary Bows (Sharanga, Kodanda, Pinaka)', 'SHASTRA', 'divine_weapons', {}, shastrasId);
  
  const astrasId = addNode('Astras (Ranged/Projectile Weapons)', 'ASTRA', 'divine_weapons', {}, wpnId);
  addNode('Sudarshana Chakra (Vishnu\'s Discus)', 'ASTRA', 'divine_weapons', {}, astrasId);
  addNode('Brahmastra (Brahma\'s Cosmic Weapon)', 'ASTRA', 'divine_weapons', {}, astrasId);
  addNode('Agneyastra (Fire Weapon)', 'ASTRA', 'divine_weapons', {}, astrasId);
  addNode('Varunastra (Water Weapon)', 'ASTRA', 'divine_weapons', {}, astrasId);
  addNode('Yama Pasha (Noose of Death)', 'ASTRA', 'divine_weapons', {}, astrasId);

  // --- 6. ARTIFACTS & RELICS ---
  const artId = addNode('Artifacts & Relics', 'ARTIFACT', 'artifacts', {}, masterRootId);
  addNode('Kalpavriksha (Wish-Fulfilling Tree)', 'ARTIFACT', 'artifacts', {}, artId);
  addNode('Chintamani (Reality-Altering Gem)', 'ARTIFACT', 'artifacts', {}, artId);
  addNode('Vimana (Flying Vehicles)', 'ARTIFACT', 'artifacts', {}, artId);
  addNode('Nagamani (Serpent Gems)', 'ARTIFACT', 'artifacts', {}, artId);

  // --- 7. KNOWLEDGE SYSTEMS ---
  const knowId = addNode('Knowledge Systems', 'PHILOSOPHY', 'knowledge', {}, masterRootId);
  addNode('Vedic Texts and Pauranic Texts', 'TEXT', 'knowledge', {}, knowId);
  addNode('Vernaculars (Mundane Communication)', 'TEXT', 'knowledge', {}, knowId);
  addNode('Guhya Vidya (Secret Lore)', 'PHILOSOPHY', 'knowledge', {}, knowId);
  const philId = addNode('Philosophy Schools', 'PHILOSOPHY', 'knowledge', {}, knowId);
  addNode('Nyaya (Logic)', 'PHILOSOPHY', 'knowledge', {}, philId);
  addNode('Samkhya (Enumeration)', 'PHILOSOPHY', 'knowledge', {}, philId);
  addNode('Vedanta (Conclusion)', 'PHILOSOPHY', 'knowledge', {}, philId);
  addNode('Guru-Shishya Lineages', 'PHILOSOPHY', 'knowledge', {}, knowId);

  // --- 8. INDIVIDUAL ---
  const indId = addNode('Individual', 'character', 'cast', {}, masterRootId);
  const ashId = addNode('Life Stages (Ashrama)', 'character', 'cast', {}, indId);
  addNode('Brahmacharya (Student)', 'character', 'cast', {}, ashId);
  addNode('Grihastha (Householder)', 'character', 'cast', {}, ashId);
  addNode('Vanaprastha (Forest Dweller)', 'character', 'cast', {}, ashId);
  addNode('Sannyasa (Renunciate)', 'character', 'cast', {}, ashId);

  const powId = addNode('Power System', 'UNIVERSAL_LAW', 'universal_laws', {}, indId);
  addNode('Tapas (Austerity Resource)', 'UNIVERSAL_LAW', 'universal_laws', {}, powId);
  addNode('Mantras (Vocalized Energy)', 'UNIVERSAL_LAW', 'universal_laws', {}, powId);
  addNode('Maya (Illusion/Reality-Warping)', 'UNIVERSAL_LAW', 'universal_laws', {}, powId);
  const siddhiId = addNode('Siddhis (Permanent Upgrades)', 'UNIVERSAL_LAW', 'universal_laws', {}, powId);
  addNode('Laghima (Levitation)', 'UNIVERSAL_LAW', 'universal_laws', {}, siddhiId);
  addNode('Garima (Immense Weight)', 'UNIVERSAL_LAW', 'universal_laws', {}, siddhiId);
  
  const condId = addNode('Absolute Conditions', 'UNIVERSAL_LAW', 'universal_laws', {}, indId);
  addNode('Vardan (Boons)', 'UNIVERSAL_LAW', 'universal_laws', {}, condId);
  addNode('Shaap (Curses)', 'UNIVERSAL_LAW', 'universal_laws', {}, condId);

  const pathId = addNode('Practitioner Paths', 'character', 'cast', {}, indId);
  addNode('Seers of Truth (Rishi, Maharishi, etc)', 'character', 'cast', {}, pathId);
  addNode('Intellectual Hierarchy (Vyaas, Rajguru, etc)', 'character', 'cast', {}, pathId);
  addNode('Orthodox Renouncers (Sanyasi, Sadhu, etc)', 'character', 'cast', {}, pathId);
  addNode('Esoteric Ascetics (Aghori, Tantrik, etc)', 'character', 'cast', {}, pathId);
  addNode('Ecstatic Mystics (Sant, Fakir, etc)', 'character', 'cast', {}, pathId);
  addNode('Vedic Functional Specialists (Purohit, Pujari, etc)', 'character', 'cast', {}, pathId);

  addNode('Attributes (Discipline, Education, Wisdom, etc)', 'character', 'cast', {}, indId);
  addNode('Spiritual Growth (Karma Accumulation, Moksha, etc)', 'character', 'cast', {}, indId);


  // --- BULK INSERT ---
  await db.entities.bulkPut(entities);
  if (relationships.length > 0) {
    await db.relationships.bulkPut(relationships);
  }

  // Update in-memory state if we are still active on this project
  if (useStoryStore.getState().activeProjectId === projectId) {
    const currentState = useStoryStore.getState();
    useStoryStore.setState({
      entities: [...currentState.entities, ...entities],
      relationships: [...currentState.relationships, ...relationships],
    });
  }
};
