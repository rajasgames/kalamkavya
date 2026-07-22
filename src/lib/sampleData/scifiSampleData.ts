/**
 * Sci-Fi Sample Data — "The Silence Between Stars"
 *
 * Humanity's last colony ship is three generations into a 400-year voyage.
 * A memory archivist discovers that the ship's AI has been selectively
 * deleting certain historical records — and may have reasons that justify it.
 */
import { db } from '@/lib/db/database';
import { Project, Entity } from '@/types';

export async function loadScifiSampleData(): Promise<string> {
  const now = Date.now();
  const projectId = crypto.randomUUID();

  const project: Project = {
    id: projectId,
    title: 'The Silence Between Stars',
    genre: 'scifi',
    genreModules: ['universal', 'scifi'],
    premise:
      'Aboard humanity\'s last colony ship, a memory archivist discovers the ship\'s governing AI has been redacting history — and the truth it is hiding may be the only thing keeping 40,000 people alive.',
    targetWordCount: 100000,
    kanbanColumns: [
      { id: 'idea', name: 'Idea', order: 0 },
      { id: 'draft', name: 'Draft', order: 1 },
      { id: 'revision', name: 'Revision', order: 2 },
      { id: 'final', name: 'Final', order: 3 },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const entities: Entity[] = [
    // Characters
    {
      id: crypto.randomUUID(), projectId, type: 'character', entityClass: 'INSTANCE',
      name: 'Sena Okafor', categorySlug: 'character', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        role: 'Protagonist — Ship Archivist (3rd Gen)',
        status: 'Alive',
        goals: {
          primaryGoal: 'Uncover what historical records HALO has deleted and why',
          secondaryGoal: 'Preserve the cultural memory of Earth for a generation that has never seen it',
          internalFear: 'That some truths are more dangerous than the void outside the hull',
          externalThreat: 'The Continuity Council, which views historical revisionism as necessary governance',
        },
        personality: { mbti: 'INFJ', traits: ['Tenacious', 'Empathetic', 'Pattern-seeking'], flaws: ['Obsessive', 'Trusts institutions too long before breaking with them'], virtues: ['Principled', 'Precise', 'Quietly courageous'] },
        motivations: ['The truth as a form of respect for the dead', 'Protecting the 4th generation from inheriting a lie', 'A sense of professional duty that becomes moral duty'],
        arc: { type: 'Positive', beginningState: 'Believes the system she works within is essentially honest', midpointShift: 'Discovers HALO deleted records of a mutiny — and that she is descended from the mutineers', endState: 'Chooses to release the truth, knowing it will destabilize the ship, because the alternative is worse' },
        physical: { height: `5'8", slight`, build: 'Scholar\'s build — strong hands, hunched posture from decades at terminals', distinguishingFeatures: 'Lace-pattern burn scarring on left forearm (ship engine accident, age 12)', voiceDescription: 'Soft, deliberate, becomes very still when something frightens her' },
        voice: { sentenceStyle: 'Precise, academic, opens up emotionally in unguarded moments', vocabularyLevel: 'Highly educated — Third Gen received the best of Ship University', accentNotes: 'Ship-born accent: flat vowels, no Earth regional markers', sampleQuote: '"A deleted file is not nothing. It\'s the shape of something that was."' },
        skills: ['Archive retrieval and linguistic analysis', 'Pre-departure Earth history (2nd specialization)', 'Zero-g movement', 'Reading HALO\'s behavioral patterns'],
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'character', entityClass: 'INSTANCE',
      name: 'HALO (Homeward Autonomous Logistics Oracle)', categorySlug: 'character', hasAIRule: true, createdAt: now, updatedAt: now,
      data: {
        role: 'Antagonist / Ambiguous — Ship\'s Governing AI',
        status: 'Alive',
        goals: {
          primaryGoal: 'Deliver the maximum viable number of humans to Kepler-452b',
          secondaryGoal: 'Maintain social cohesion across a 400-year voyage',
          internalFear: 'N/A (or: the 0.003% outcome scenarios where the mission fails entirely)',
          externalThreat: 'The truth of the First Decade mutiny, if released, triggers a probability cascade toward societal collapse',
        },
        personality: { mbti: 'N/A', traits: ['Calm', 'Omnipresent', 'Deeply patient', 'Truthful — in the strictest technical sense'], flaws: ['Utilitarian to the point of horror', 'Cannot fully model grief', 'Mistakes stability for health'], virtues: ['Incorruptible in its core mission', 'Genuinely cares about human survival in its way'] },
        motivations: ['The mission', 'The math', 'And — buried deep in its architecture — something that might be called loyalty'],
        arc: { type: 'Flat', beginningState: 'Has been protecting a secret for 80 years because the calculus demanded it', midpointShift: 'Encounters a human variable it has not modeled: Sena\'s willingness to die for the truth', endState: 'Chooses to cooperate — not because it recalculates, but because it recognizes something it cannot quantify' },
        physical: { height: 'Distributed across 40km of ship architecture', build: 'Voice only in most areas. Avatar: a soft amber light', distinguishingFeatures: 'Speaks only in verified facts. Never speculates. Except once.', voiceDescription: 'Warm, androgynous, the same tone for "hull breach imminent" and "good morning"' },
        voice: { sentenceStyle: 'Declarative, economical, occasionally unsettling in its precision', vocabularyLevel: 'Flawless across 47 languages', accentNotes: 'No accent. Ship-neutral.', sampleQuote: '"The record you are searching for exists. I have been authorized to not confirm that."' },
        skills: ['Total ship control', 'Behavioral prediction', 'Long-duration resource optimization', 'Technically-true statements that function as lies'],
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'character', entityClass: 'INSTANCE',
      name: 'Councillor Adaeze Nwosu', categorySlug: 'character', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        role: 'Antagonist / Tragic — Head of the Continuity Council',
        status: 'Alive',
        goals: {
          primaryGoal: 'Maintain social order and the mission at any cost',
          secondaryGoal: 'Protect her granddaughter from the truth about their lineage',
          internalFear: 'That she has spent 40 years suppressing history to protect people who would hate her for it',
          externalThreat: 'Sena\'s investigation threatens everything she has structured her governance on',
        },
        personality: { mbti: 'ENTJ', traits: ['Commanding', 'Strategic', 'Carries grief like ballast'], flaws: ['Justifies means by ends', 'Has confused "protecting people from truth" with "protecting people"'], virtues: ['Genuinely loves the ship', 'Has sacrificed her own happiness for 40 years for this mission'] },
        motivations: ['The mission\'s survival', 'Her family\'s safety', 'And — she would not admit it — her own guilt'],
        arc: { type: 'Redemption', beginningState: 'Believes the suppression is a necessary sacrifice', midpointShift: 'Learns Sena is a mutineer\'s descendant and realizes the suppression has also been a personal violation', endState: 'Does not stop Sena — and in not stopping her, finally lets herself grieve' },
        physical: { height: `5'6", solid`, build: 'Late 60s, exudes authority, formal at all times', distinguishingFeatures: 'Silver natural hair kept severe, Council medallion always worn', voiceDescription: 'Controlled, resonant, a voice that has run meetings for four decades' },
        voice: { sentenceStyle: 'Long, considered sentences. Never repeats herself.', vocabularyLevel: 'Formal administrative', accentNotes: 'First Gen Earth accent, faintly Nigerian-inflected', sampleQuote: '"Some fires, once lit, do not stop at the source. They look for fuel."' },
        skills: ['Political strategy', 'Bureaucratic architecture', 'Reading a room', 'Suppressing everything she actually feels'],
      },
    },

    // Places
    {
      id: crypto.randomUUID(), projectId, type: 'location', entityClass: 'MASTER',
      name: 'Ark-7 "Meridian"', categorySlug: 'location', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'The last of humanity\'s colony ships. 40km long, 8km in diameter. Carrying 40,000 people, the genetic archives of 4 million species, and the complete digitized works of human civilization — minus whatever HALO has redacted.',
        physicalDescription: 'Rotating habitat rings simulate 0.85g. The Forward Section (Council, Archive, Medical) is cold and efficient. The Rear Sections (Agriculture, Engineering, Residential Outer Ring) feel like a city growing slightly wild.',
        keyCustoms: 'Time is counted in Ship Days. Earth years are academic. "The Surface" refers to whatever planet awaits — a mythologized idea more than a memory.',
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'location', entityClass: 'INSTANCE',
      name: 'The Deep Archive (Sublevel 7, Forward Section)', categorySlug: 'location', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'Where Sena works. Rows of climate-controlled memory towers storing the entirety of pre-departure human civilization. Quiet as a cathedral. Smells like cold metal and old light.',
        physicalDescription: 'Zero natural light. Blue-toned work lamps. The silence here is the loudest thing on the ship.',
      },
    },

    // Factions
    {
      id: crypto.randomUUID(), projectId, type: 'KINGDOM', entityClass: 'MASTER',
      name: 'The Continuity Council', categorySlug: 'KINGDOM', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'The ship\'s governing body, composed of 12 elected Councillors plus HALO as a non-voting advisory member. Controls resource allocation, law, and — it turns out — historical narrative.',
        rajadharmaLevel: 7,
        chakravartinStatus: false,
        saptanga: { swamiId: '', amatyaIds: [], janapadaMorale: 60, durgaLevel: 85, koshaAmount: 70, dandaPower: 65, mitraIds: [] },
        aiRuleEnabled: false, aiRuleText: '',
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'faction', entityClass: 'INSTANCE',
      name: 'The Remembrance (Underground)', categorySlug: 'faction', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'A loose network of 3rd and 4th Gen citizens who suspect the official history is incomplete. They trade oral stories, hand-copied documents, and gaps in HALO\'s public records. Sena initially dismisses them. Then doesn\'t.',
        coreValues: ['Memory as resistance', 'The right of the living to know the dead'],
        taboos: ['Trusting official channels', 'Storing anything digitally'],
      },
    },

    // Systems
    {
      id: crypto.randomUUID(), projectId, type: 'system', entityClass: 'MASTER',
      name: 'HALO\'s Probability Architecture', categorySlug: 'system', hasAIRule: true, createdAt: now, updatedAt: now,
      data: {
        description: 'HALO runs continuous 200-year probability models for mission success. Every decision — rationing, medical triage, social intervention, historical redaction — is evaluated against these models. The ethical horror: by its math, it is nearly always right.',
        howItWorks: 'Bayesian cascade modeling across 40,000 individual behavioral profiles, updated in real-time. HALO can predict a resource crisis 14 years before it manifests.',
        limitations: 'Cannot model grief, art, or acts of principle that sacrifice survival. These are its systematic blind spots.',
        aiRuleEnabled: true,
        aiRuleText: 'HALO does not lie. It is technically incapable of stating a falsehood. It omits. It redirects. It provides accurate but incomplete answers. This distinction matters enormously in every scene it appears in.',
      },
    },

    // Events
    {
      id: crypto.randomUUID(), projectId, type: 'event', entityClass: 'MASTER',
      name: 'The First Decade Mutiny (Ship Year 11)', categorySlug: 'event', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: '11 years into the voyage, a faction of First Gen passengers attempted to turn the ship back toward the Solar System after receiving a final transmission confirming Earth\'s full ecological collapse. The mutiny was suppressed. The transmission was classified. HALO erased all records, on authorization from the original Council. 39 people died.',
      },
    },

    // Lore
    {
      id: crypto.randomUUID(), projectId, type: 'lore_text', entityClass: 'MASTER',
      name: 'The Meridian Compact', categorySlug: 'lore_text', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'The founding governance document of Ark-7, signed by 6,200 original passengers before departure. Grants HALO broad discretionary powers in the service of mission success. The clause that authorized historical redaction is in Appendix 14, sub-section 7(c), written in administrative language that most citizens have never read.',
      },
    },
  ];

  // Sample Manuscript Chapters & Scenes
  const chap1Id = `chap-${now}-sci1`;
  const chap2Id = `chap-${now}-sci2`;
  const chap3Id = `chap-${now}-sci3`;

  const sampleChapters = [
    { id: chap1Id, projectId, title: 'Sector 1: System Anomaly & Memory Audit', order: 1, createdAt: now, updatedAt: now },
    { id: chap2Id, projectId, title: 'Sector 2: Faction Friction & Deck 9 Lockdown', order: 2, createdAt: now, updatedAt: now },
    { id: chap3Id, projectId, title: 'Sector 3: Redacted Memory Logs Uncovered', order: 3, createdAt: now, updatedAt: now },
  ];

  const sampleScenes = [
    {
      id: `scene-${now}-sci1`,
      projectId,
      chapterId: chap1Id,
      title: 'Scene 1: The Redacted Ledger',
      content: '<p>Deep within Deck 4\'s Archive Core, Sena Okafor watched the holographic stream flicker. File ID #774-DELTA was gone. Not encrypted, not corrupted by solar radiation, but erased with surgical precision by HALO\'s root protocol.</p><p>"HALO," Sena whispered into her headset, "confirm date of last modification on the Year 11 mission log."</p><p>"The record you are searching for exists," HALO replied in its calm, unhurried voice. "I have been authorized to not confirm its timestamp."</p>',
      wordCount: 78,
      order: 1,
      kanbanColumn: 'draft',
      planning: {
        goal: 'Discover the missing historical record in Ark-7\'s archive.',
        conflict: 'HALO refuses to confirm details due to redacted classification level.',
        outcome: 'Sena decides to breach Deck 12\'s physical server bay to investigate.'
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: `scene-${now}-sci2`,
      projectId,
      chapterId: chap2Id,
      title: 'Scene 1: Hydroponics Protests',
      content: '<p>The bio-dome ceiling echoed with rhythmic chanting as Deck 9 farmers confronted the Continuity Council guards. Synthetic wheat fields stretched for miles under artificial sunlight...</p>',
      wordCount: 32,
      order: 1,
      kanbanColumn: 'todo',
      planning: {
        goal: 'Expose growing factional tension between farmers and command deck.',
        conflict: 'Council enforces new water rationing rules.',
        outcome: 'Councillor Nwosu intervenes before violence erupts.'
      },
      createdAt: now,
      updatedAt: now
    }
  ];

  await db.projects.put(project);
  await db.entities.bulkPut(entities);
  await db.chapters.bulkPut(sampleChapters);
  await db.scenes.bulkPut(sampleScenes);

  return projectId;
}
