/**
 * Romance Sample Data — "Echoes of the Heart"
 *
 * A comprehensive Contemporary Romance (Love Triangle) sample featuring 
 * characters, locations, factions, intricate relationships, and 10 chapters 
 * with deeply planned scenes.
 */
import { db } from '@/lib/db/database';
import { Project, Entity, Chapter, Scene, Relationship, Note } from '@/types';

const uuidv4 = () => crypto.randomUUID(); 

export async function loadRomanceSampleData(): Promise<string> {
  const now = Date.now();
  const projectId = crypto.randomUUID();

  // ---------------------------------------------------------
  // PHASE 1: PROJECT & CORE WORLD BIBLE
  // ---------------------------------------------------------
  const project: Project = {
    id: projectId,
    title: 'Echoes of the Heart',
    genre: 'romance',
    subGenre: 'love_triangle',
    theme: 'Choosing between the safety of the past and the thrill of the future',
    pov: 'First Person, Single POV (Elara)',
    tone: 'Emotional, witty, contemporary',
    genreModules: ['universal', 'romance'],
    premise:
      'A junior developer is caught between her demanding, enigmatic billionaire boss and her sweet, dependable childhood best friend just as her career is taking off.',
    targetWordCount: 80000,
    kanbanColumns: [
      { id: 'outline', name: 'Outlining', order: 0 },
      { id: 'drafting', name: 'Drafting', order: 1 },
      { id: 'editing', name: 'Editing', order: 2 },
      { id: 'done', name: 'Completed', order: 3 },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // Pre-generate IDs for linking
  const locHorizon = crypto.randomUUID();
  const locCafe = crypto.randomUUID();
  const locPenthouse = crypto.randomUUID();

  const facHorizon = crypto.randomUUID();
  const facSterling = crypto.randomUUID();

  const charElara = crypto.randomUUID();
  const charJulian = crypto.randomUUID();
  const charLiam = crypto.randomUUID();
  const charChloe = crypto.randomUUID();
  const charVictoria = crypto.randomUUID();
  const charMarcus = crypto.randomUUID();

  const entities: Entity[] = [
    // Locations
    {
      id: locHorizon,
      projectId,
      type: 'location',
      entityClass: 'INSTANCE',
      name: 'Horizon Tech Headquarters',
      categorySlug: 'geography',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        locationType: 'Building',
        climate: 'Climate-controlled, perpetually set to a crisp 68 degrees',
        terrain: 'Glass walls, open-plan ergonomic desks, high-tech labs',
        resources: ['Artisan Coffee Bar', 'High-end quantum servers', 'Nap pods'],
        rulerId: charJulian,
        population: '500 employees',
        description: 'A cutting-edge tech hub in the heart of downtown. Cold, intimidating, yet pulsing with ambition. The architecture is sharp and modern.',
        aiRuleEnabled: true,
        aiRuleText: 'When characters are in this location, emphasize the cold, sterile environment and the high-pressure atmosphere. Interactions should feel observed or professional.',
      },
    },
    {
      id: locCafe,
      projectId,
      type: 'location',
      entityClass: 'INSTANCE',
      name: 'The Roasted Bean',
      categorySlug: 'geography',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        locationType: 'Building',
        climate: 'Warm, cozy, smelling of roasted espresso and cinnamon',
        terrain: 'Exposed brick, fairy lights, mismatched velvet armchairs',
        resources: ['Fresh pastries', 'Acoustic guitar corner', 'Free WiFi'],
        rulerId: charLiam,
        population: 'Varies; mostly locals and students',
        description: 'An indie coffee shop owned by Liam. It feels like a second home to Elara, full of warmth, nostalgia, and the scent of roasting coffee beans.',
        aiRuleEnabled: true,
        aiRuleText: 'In this location, tone down the tension. Characters should speak more casually, and sensory details should focus on warmth, smell, and comfort.',
      },
    },
    {
      id: locPenthouse,
      projectId,
      type: 'location',
      entityClass: 'INSTANCE',
      name: 'Elysium Penthouse',
      categorySlug: 'geography',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        locationType: 'Building',
        climate: 'Silent, vast, impeccably clean with state-of-the-art air filtration',
        terrain: 'Imported Italian marble floors, floor-to-ceiling windows overlooking the city skyline',
        resources: ['Fully stocked vintage bar', 'Grand piano', 'Smart home AI'],
        rulerId: charJulian,
        population: '1 (Julian)',
        description: 'Julian\'s private residence. It looks like a magazine cover but feels intensely lonely. High above the city noise, it isolates him from the world.',
        aiRuleEnabled: true,
        aiRuleText: 'Describe this location to reflect Julian\'s internal state: wealthy but isolated. Use words like "cavernous", "pristine", and "silent".',
      },
    },

    // Factions/Families
    {
      id: facHorizon,
      projectId,
      type: 'system',
      entityClass: 'INSTANCE',
      name: 'Horizon Innovations',
      categorySlug: 'groups',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        systemType: 'Economic', 
        structure: 'Strict corporate hierarchy with Julian at the apex and a ruthless board of directors.',
        rules: ['Innovation above all', 'No personal relationships between management and subordinates', 'Ship products on time or face termination'],
        keyFigures: [charJulian, charMarcus],
        description: 'The fastest-growing AI startup in the city, constantly pushing the boundaries of tech while burning out its employees.',
        aiRuleEnabled: true,
        aiRuleText: 'When dealing with Horizon Innovations, the stakes are always career-oriented. Emphasize the cutthroat corporate culture.',
      },
    },
    {
      id: facSterling,
      projectId,
      type: 'culture',
      entityClass: 'INSTANCE',
      name: 'The Sterling Family Dynasty',
      categorySlug: 'families',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        associatedRegionId: locPenthouse,
        languageNotes: 'They speak with refined vocabulary and subtle condescension. Never raise voices; anger is expressed coldly.',
        coreValues: ['Wealth preservation', 'Impeccable public reputation', 'Legacy over individual happiness'],
        socialStructure: 'Matriarchal influence (led by Victoria) heavily controlling the heirs.',
        keyCustoms: 'Annual charity galas, mandatory Sunday dinners where business is discussed over fine wine.',
        taboos: ['Public scandal', 'Marrying below their station', 'Emotional outbursts'],
        religiousBeliefs: 'None, though they worship success and status.',
        artAndMusic: 'Classical music only. Julian\'s piano playing is a rare exception of emotion.',
        factionIds: [facHorizon], 
        aiRuleEnabled: true,
        aiRuleText: 'Any interaction involving a Sterling family member (especially Victoria) must feel oppressive and laden with classism. Emphasize their wealth and disdain for the working class.',
      },
    },

    // ---------------------------------------------------------
    // PHASE 2: CHARACTERS
    // ---------------------------------------------------------
    {
      id: charElara,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Elara Vance',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Protagonist',
        rank: 'Mortal',
        species: 'Human',
        role: 'Junior Developer',
        status: 'Alive',
        goals: {
          primaryGoal: 'Successfully launch her AI accessibility project.',
          secondaryGoal: 'Figure out what she truly wants in love and life.',
          internalFear: 'Not being good enough / Imposter syndrome.',
          externalThreat: 'Corporate sabotage from Victoria Sterling.',
        },
        personality: {
          mbti: 'INFP',
          traits: ['Creative', 'Determined', 'Empathetic', 'Over-thinker'],
          flaws: ['Avoids conflict', 'Self-doubting'],
          virtues: ['Loyal', 'Brilliant coder'],
        },
        motivations: ['To prove her worth', 'To make a difference with tech', 'To find a place where she belongs'],
        arc: {
          type: 'Positive',
          beginningState: 'Meek and hiding behind her code.',
          midpointShift: 'Stands up to Julian; realizes her own value.',
          endState: 'Confident in her career and clear in her heart.',
        },
        physical: {
          height: '5 ft 4 in',
          build: 'Petite, often wearing oversized cozy sweaters',
          distinguishingFeatures: 'Ink smudge on her wrist, bright hazel eyes',
          voiceDescription: 'Soft but gains confidence when talking about tech',
        },
        voice: {
          sentenceStyle: 'Rambles slightly when nervous',
          vocabularyLevel: 'Casual but highly technical when needed',
          accentNotes: 'Standard American',
          sampleQuote: '"I didn\'t write this algorithm for the board members, Julian. I wrote it for the people who actually need it."',
        },
        skills: ['Python', 'Machine Learning', 'Baking disaster-level cookies'],
        loreConnections: {
          factionIds: [facHorizon],
          locationIds: [locHorizon, locCafe],
          weaponIds: [],
          cultureIds: [],
        },
        customFields: {
          aiRuleText: 'Elara should sound hesitant when discussing her feelings but completely self-assured when discussing her work.',
          clearanceLevel: 'Level 2 Developer'
        }
      },
    },
    {
      id: charJulian,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Julian Sterling',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Supporting',
        rank: 'Mortal',
        species: 'Human',
        role: 'Grumpy Billionaire Boss / Love Interest 1',
        status: 'Alive',
        goals: {
          primaryGoal: 'Prove his family wrong by making Horizon a global leader.',
          secondaryGoal: 'Protect Elara (though he won\'t admit it).',
          internalFear: 'Becoming as cold and calculating as his mother.',
          externalThreat: 'Board members threatening a takeover.',
        },
        personality: {
          mbti: 'INTJ',
          traits: ['Intense', 'Brooding', 'Protective', 'Workaholic'],
          flaws: ['Arrogant', 'Bad at expressing emotions'],
          virtues: ['Fiercely protective', 'Secretly generous'],
        },
        motivations: ['Independence from his family', 'A hidden longing for genuine connection', 'Success at all costs'],
        arc: {
          type: 'Positive',
          beginningState: 'Ice king of the boardroom.',
          midpointShift: 'Lets his guard down during a gala.',
          endState: 'Learns to prioritize love over legacy.',
        },
        physical: {
          height: '6 ft 2 in',
          build: 'Broad-shouldered, tailored suits',
          distinguishingFeatures: 'A permanent scowl that softens only for Elara',
          voiceDescription: 'Deep, gravelly, commanding',
        },
        voice: {
          sentenceStyle: 'Terse and commanding',
          vocabularyLevel: 'Highly educated, precise',
          accentNotes: 'Slight Mid-Atlantic poshness',
          sampleQuote: '"I don\'t do \'nice\', Ms. Vance. But for you, I might make an exception."',
        },
        skills: ['Strategic Planning', 'Intimidation', 'Piano'],
        loreConnections: {
          factionIds: [facHorizon, facSterling],
          locationIds: [locHorizon, locPenthouse],
          weaponIds: [],
          cultureIds: [],
        },
        customFields: {
          aiRuleText: 'Julian\'s dialogue should be brief, sharp, and emotionally guarded unless he is alone with Elara.',
          netWorth: '$2.5 Billion'
        }
      },
    },
    {
      id: charLiam,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Liam Carter',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Supporting',
        rank: 'Mortal',
        species: 'Human',
        role: 'Golden Retriever Best Friend / Love Interest 2',
        status: 'Alive',
        goals: {
          primaryGoal: 'Expand his coffee shop business.',
          secondaryGoal: 'Finally confess his 10-year crush on Elara.',
          internalFear: 'Losing Elara completely if the romance fails.',
          externalThreat: 'Gentrification threatening his shop\'s lease.',
        },
        personality: {
          mbti: 'ENFJ',
          traits: ['Warm', 'Funny', 'Dependable', 'Observant'],
          flaws: ['Can be overly passive', 'Jealous but hides it'],
          virtues: ['Unwavering support', 'Excellent listener'],
        },
        motivations: ['Building a community', 'Creating a safe haven for Elara', 'Fear of change'],
        arc: {
          type: 'Positive',
          beginningState: 'Waiting in the wings, afraid to risk the friendship.',
          midpointShift: 'Steps up and challenges Julian.',
          endState: 'Accepts his own worth, regardless of the outcome.',
        },
        physical: {
          height: '6 ft 0 in',
          build: 'Athletic, usually in flannel and aprons',
          distinguishingFeatures: 'Warm smile, perpetually messy hair',
          voiceDescription: 'Friendly, easy-going, warm',
        },
        voice: {
          sentenceStyle: 'Relaxed, uses nicknames',
          vocabularyLevel: 'Casual, conversational',
          accentNotes: 'Local city accent',
          sampleQuote: '"I\'ve known how you take your coffee since we were fifteen, El. I know you better than you know yourself."',
        },
        skills: ['Barista Mastery', 'Making people feel safe', 'Fixing everything'],
        loreConnections: {
          factionIds: [],
          locationIds: [locCafe],
          weaponIds: [],
          cultureIds: [],
        },
        customFields: {
          aiRuleText: 'Liam should always sound welcoming and casual, but hint at deeper underlying emotions when Elara mentions Julian.',
          specialtyDrink: 'Caramel Macchiato with extra foam'
        }
      },
    },
    {
      id: charChloe,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Chloe Brooks',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Supporting',
        rank: 'Mortal',
        species: 'Human',
        role: 'Best Friend / Confidante',
        status: 'Alive',
        goals: { 
          primaryGoal: 'Be the ultimate wingwoman', 
          secondaryGoal: 'Survive nursing school',
          internalFear: 'Failing her exams',
          externalThreat: 'Exhaustion' 
        },
        personality: { 
          mbti: 'ESFP', 
          traits: ['Chaotic good', 'Loud', 'Fierce', 'Honest'], 
          flaws: ['Nosy', 'Impulsive'], 
          virtues: ['Fiercely loyal', 'Optimistic'] 
        },
        motivations: ['Wants Elara to be happy', 'Looking for a good time', 'Passing finals'],
        arc: { 
          type: 'Flat', 
          beginningState: 'Supportive chaos', 
          midpointShift: 'Gives Elara a reality check', 
          endState: 'Still supportive chaos' 
        },
        physical: { 
          height: '5 ft 6 in', 
          build: 'Curvy', 
          distinguishingFeatures: 'Bright pink dyed hair and scrubs', 
          voiceDescription: 'Loud and bubbly' 
        },
        voice: { 
          sentenceStyle: 'Rapid-fire, exclamation points', 
          vocabularyLevel: 'Slang-heavy with medical jargon mixed in', 
          accentNotes: 'Slight valley girl', 
          sampleQuote: '"Girl, if you don\'t kiss one of them soon, I will."' 
        },
        skills: ['Medical knowledge', 'Gossip gathering', 'Unsolicited advice'],
        loreConnections: { factionIds: [], locationIds: [], weaponIds: [], cultureIds: [] },
        customFields: {
          aiRuleText: 'Chloe speaks quickly and often interrupts. She serves as comedic relief and the voice of reason.'
        }
      },
    },
    {
      id: charVictoria,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Victoria Sterling',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Antagonist',
        rank: 'Mortal',
        species: 'Human',
        role: 'Julian\'s Controlling Mother',
        status: 'Alive',
        goals: { 
          primaryGoal: 'Maintain the Sterling legacy', 
          secondaryGoal: 'Oust Elara from Julian\'s life', 
          internalFear: 'Losing control of her family', 
          externalThreat: 'Public scandal involving Horizon Tech' 
        },
        personality: { 
          mbti: 'ESTJ', 
          traits: ['Ruthless', 'Elegant', 'Cold', 'Calculating'], 
          flaws: ['Elitist', 'Controlling'], 
          virtues: ['Determined', 'Poised'] 
        },
        motivations: ['Family honor', 'Perfectionism', 'Fear of societal drop'],
        arc: { 
          type: 'Negative', 
          beginningState: 'In complete control', 
          midpointShift: 'Losing grip on Julian\'s decisions', 
          endState: 'Alienated from her son entirely' 
        },
        physical: { 
          height: '5 ft 8 in', 
          build: 'Slender, sharp angles', 
          distinguishingFeatures: 'Impeccable posture, designer clothing, pearls', 
          voiceDescription: 'Icy, sharp, never raised' 
        },
        voice: { 
          sentenceStyle: 'Condescending and perfectly structured', 
          vocabularyLevel: 'High society, archaic at times', 
          accentNotes: 'Posh Mid-Atlantic', 
          sampleQuote: '"You are a temporary distraction, Ms. Vance. Do not forget your place."' 
        },
        skills: ['Manipulation', 'Social destruction', 'Event planning'],
        loreConnections: { factionIds: [facSterling], locationIds: [locPenthouse], weaponIds: [], cultureIds: [] },
        customFields: {
          aiRuleText: 'Victoria never yells. Her insults should be wrapped in polite, devastating observations about class.'
        }
      },
    },
    {
      id: charMarcus,
      projectId,
      type: 'character',
      entityClass: 'INSTANCE',
      name: 'Marcus Thorne',
      categorySlug: 'character',
      hasAIRule: true,
      createdAt: now,
      updatedAt: now,
      data: {
        castType: 'Supporting',
        rank: 'Mortal',
        species: 'Human',
        role: 'Mentor / Senior Developer',
        status: 'Alive',
        goals: { 
          primaryGoal: 'See the AI project succeed', 
          secondaryGoal: 'Keep his job and retire early', 
          internalFear: 'Becoming obsolete in the tech world', 
          externalThreat: 'Upper management changes' 
        },
        personality: { 
          mbti: 'ISTP', 
          traits: ['Pragmatic', 'Tired', 'Wise', 'Direct'], 
          flaws: ['Cynical', 'Apathetic to office drama'], 
          virtues: ['Fair', 'Protective of his team'] 
        },
        motivations: ['Technological advancement', 'Peace and quiet', 'A stable paycheck'],
        arc: { 
          type: 'Flat', 
          beginningState: 'Tired mentor', 
          midpointShift: 'Defends Elara to the board', 
          endState: 'Proud mentor' 
        },
        physical: { 
          height: '5 ft 10 in', 
          build: 'Dad bod', 
          distinguishingFeatures: 'Glasses pushed up on his head, usually holding coffee', 
          voiceDescription: 'Exhausted but kind, gravelly' 
        },
        voice: { 
          sentenceStyle: 'To the point, short sentences', 
          vocabularyLevel: 'Technical, uses analogies', 
          accentNotes: 'None', 
          sampleQuote: '"Code doesn\'t care about your feelings, Elara. But your boss clearly does."' 
        },
        skills: ['System Architecture', 'Navigating office politics', 'Debugging'],
        loreConnections: { factionIds: [facHorizon], locationIds: [locHorizon], weaponIds: [], cultureIds: [] },
        customFields: {
          aiRuleText: 'Marcus should sound perpetually tired but act as a stabilizing, father-figure presence for Elara.'
        }
      },
    }
  ];

  // ---------------------------------------------------------
  // PHASE 2: RELATIONSHIPS
  // ---------------------------------------------------------
  const relationships: Relationship[] = [
    { id: uuidv4(), projectId, fromEntityId: charElara, toEntityId: charJulian, type: 'romantic_tension', directed: true, metadata: { dynamic: 'Employee to Boss', trustLevel: 40, history: 'Met 1 year ago', intimacyLevel: 'High Tension' } },
    { id: uuidv4(), projectId, fromEntityId: charJulian, toEntityId: charElara, type: 'hidden_affection', directed: true, metadata: { dynamic: 'Protector / Grumpy x Sunshine', trustLevel: 85, history: 'Fell first', secretDesire: 'To run away with her' } },
    { id: uuidv4(), projectId, fromEntityId: charElara, toEntityId: charLiam, type: 'deep_trust', directed: true, metadata: { dynamic: 'Childhood Friends', trustLevel: 100, history: '15 years', intimacyLevel: 'Platonic (for now)' } },
    { id: uuidv4(), projectId, fromEntityId: charLiam, toEntityId: charElara, type: 'unrequited_love', directed: true, metadata: { dynamic: 'Pining / Friends to Lovers', trustLevel: 95, history: 'In love for 10 years', obstacle: 'Fear of ruining friendship' } },
    { id: uuidv4(), projectId, fromEntityId: charJulian, toEntityId: charLiam, type: 'rivalry', directed: true, metadata: { dynamic: 'Billionaire vs Barista', trustLevel: 0, reason: 'Views Liam as a threat to Elara\'s affection', interactions: 'Hostile' } },
    { id: uuidv4(), projectId, fromEntityId: charLiam, toEntityId: charJulian, type: 'distrust', directed: true, metadata: { dynamic: 'Protective of Elara', trustLevel: 5, reason: 'Thinks Julian will hurt her', interactions: 'Defensive' } },
    { id: uuidv4(), projectId, fromEntityId: charElara, toEntityId: charChloe, type: 'best_friends', directed: false, metadata: { dynamic: 'Roommates / Support System', trustLevel: 90, history: 'College roommates' } },
    { id: uuidv4(), projectId, fromEntityId: charVictoria, toEntityId: charElara, type: 'disdain', directed: true, metadata: { reason: 'Classism', trustLevel: 0, threatLevel: 'High' } },
    { id: uuidv4(), projectId, fromEntityId: charJulian, toEntityId: charVictoria, type: 'strained_family', directed: true, metadata: { reason: 'Controlling mother', trustLevel: 20, dynamic: 'Resentful Son' } },
    { id: uuidv4(), projectId, fromEntityId: charElara, toEntityId: charMarcus, type: 'mentorship', directed: true, metadata: { dynamic: 'Student / Teacher', trustLevel: 75, history: 'Mentored her since day 1' } },
  ];

  // ---------------------------------------------------------
  // PHASE 3 & 4: CHAPTERS & SCENE PLANNING
  // ---------------------------------------------------------
  const chapters: Chapter[] = [];
  const scenes: Scene[] = [];

  const chapterTitles = [
    "The Pitch",
    "Late Night Code",
    "The Coffee Spill",
    "The Gala Invitation",
    "The Sterling Gala",
    "The Morning After",
    "The Choice Looms",
    "The Ultimatum",
    "The Grand Gesture",
    "Echoes Resolved"
  ];

  for (let i = 0; i < 10; i++) {
    const chapterId = uuidv4();
    chapters.push({
      id: chapterId,
      projectId,
      title: `Chapter ${i + 1}: ${chapterTitles[i]}`,
      order: i,
      createdAt: now,
      updatedAt: now,
    });

    // Create 2 scenes per chapter
    for (let j = 0; j < 2; j++) {
      const sceneId = uuidv4();
      
      // Dynamic planning based on chapter
      let goal = '';
      let conflict = '';
      let pacingType: 'Action' | 'Dialogue' | 'Reflection' | 'Reveal' | 'Transition' = 'Dialogue';
      let locId = locHorizon;
      let chars = [charElara];

      if (i === 0) {
        goal = "Elara wants her AI project approved.";
        conflict = "Julian is ruthlessly tearing apart her presentation.";
        locId = locHorizon;
        chars = [charElara, charJulian, charMarcus];
      } else if (i === 2) {
        goal = "Liam brings coffee to Elara at work to surprise her.";
        conflict = "He runs into Julian in the elevator; immediate alpha male clash.";
        locId = locHorizon;
        chars = [charElara, charJulian, charLiam];
        pacingType = 'Reveal';
      } else if (i === 4) {
        goal = "Elara attends the gala as Julian's plus one to secure funding.";
        conflict = "Victoria corners Elara and insults her. Julian steps in.";
        locId = locPenthouse; 
        chars = [charElara, charJulian, charVictoria];
        pacingType = 'Action';
      } else if (i === 5) {
        goal = "Elara tries to process the near-kiss with Julian at the cafe.";
        conflict = "Liam senses the shift and finally confesses his feelings.";
        locId = locCafe;
        chars = [charElara, charLiam, charChloe];
        pacingType = 'Reflection';
      } else {
        goal = `Advance plot point for Chapter ${i + 1}, Scene ${j + 1}.`;
        conflict = "Internal doubt vs External pressure.";
      }

      scenes.push({
        id: sceneId,
        chapterId,
        projectId,
        title: `Scene ${i + 1}.${j + 1}`,
        content: `*Drafting content for ${chapterTitles[i]} - Scene ${j + 1}...*\n\n"We need to talk about the algorithm," Julian said, his voice lowering.\nElara swallowed hard. "The algorithm is fine."\n"I wasn't talking about the code," he replied, taking a step closer.`,
        wordCount: 1500,
        order: j,
        kanbanColumn: i < 3 ? 'done' : (i < 6 ? 'editing' : 'drafting'),
        createdAt: now,
        updatedAt: now,
        planning: {
          goal,
          conflict,
          outcome: "Tension increases, leaving the protagonist conflicted.",
          characters: chars,
          locationId: locId,
          pacingNote: "Build sexual tension slowly.",
          pacingType,
          conflictEntries: [
            { id: uuidv4(), description: "Elara's imposter syndrome flaring up.", severity: 'High', status: 'Open' },
            { id: uuidv4(), description: "The looming deadline for the project.", severity: 'Medium', status: 'Open' }
          ]
        }
      });
    }
  }

  // ---------------------------------------------------------
  // PHASE 4: NOTES
  // ---------------------------------------------------------
  const notes: Note[] = [
    {
      id: uuidv4(),
      projectId,
      title: 'Pacing Check: The Triangle',
      body: 'Make sure Liam doesn\'t come off as too passive in Chapter 5. He needs a proactive moment before he confesses in Chapter 6. Maybe have him stand up to a rude customer?',
      color: 'amber',
      tags: ['Revisions', 'Pacing', 'Liam'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      projectId,
      title: 'Julian\'s Motivation',
      body: 'Julian is harsh, but he MUST be fair. He shouldn\'t be toxic, just extremely guarded. Ensure Marcus mentions how Julian secretly funded Elara\'s department in Chapter 7.',
      color: 'sage',
      tags: ['Character Arc', 'Julian'],
      createdAt: now,
      updatedAt: now,
    }
  ];

  // ---------------------------------------------------------
  // PHASE 5: DATABASE INSERTS
  // ---------------------------------------------------------
  await db.projects.put(project);
  await db.entities.bulkPut(entities);
  await db.relationships.bulkPut(relationships);
  await db.chapters.bulkPut(chapters);
  await db.scenes.bulkPut(scenes);
  await db.notes.bulkPut(notes);

  return projectId;
}
