/**
 * Rom-Com Sample Data — "The Accidental Flatmates"
 *
 * A contemporary romance set in modern-day Mumbai. A workaholic architect
 * and a free-spirited food blogger accidentally end up as flatmates.
 */
import { db } from '@/lib/db/database';
import { Project, Entity } from '@/types';

export async function loadRomComSampleData(): Promise<string> {
  const now = Date.now();
  const projectId = crypto.randomUUID();

  const project: Project = {
    id: projectId,
    title: 'The Accidental Flatmates',
    genre: 'contemporary',
    genreModules: ['universal', 'contemporary'],
    premise:
      "A meticulous architect and a chaotic food blogger are forced to share a flat in Mumbai after a housing mix-up \u2014 and slowly discover that opposites don't just attract, they complete each other.",
    targetWordCount: 65000,
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
      name: 'Arjun Mehra', categorySlug: 'character', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        role: 'Protagonist',
        status: 'Alive',
        goals: {
          primaryGoal: 'Land the Bandra waterfront project and prove himself to his firm',
          secondaryGoal: 'Control the chaos of his new living situation',
          internalFear: "That his need for order is actually loneliness in disguise",
          externalThreat: "His ex-girlfriend is the lead interior designer on his biggest project",
        },
        personality: { mbti: 'ISTJ', traits: ['Meticulous', 'Reliable', 'Dry-witted'], flaws: ['Rigid', 'Emotionally closed-off'], virtues: ['Loyal', 'Diligent'] },
        motivations: ['Professional excellence', 'A sense of control', 'Proving his father wrong'],
        arc: { type: 'Positive', beginningState: 'Believes love is a distraction from success', midpointShift: 'Realizes the flat is the most alive he has felt in years', endState: 'Embraces imperfection as part of a full life' },
        physical: { height: "5'11\", 75kg", build: 'Lean, always in formal wear', distinguishingFeatures: 'Silver-framed glasses, perpetually ink-stained fingers', voiceDescription: 'Low, measured, precise' },
        voice: { sentenceStyle: 'Short, precise statements', vocabularyLevel: 'Educated and slightly formal', accentNotes: 'Delhi-bred Mumbai accent', sampleQuote: '"There is a place for everything. Yours is not the kitchen sink."' },
        skills: ['Architecture', 'Structural engineering', 'Obsessive spreadsheet creation', 'Excellent coffee'],
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'character', entityClass: 'INSTANCE',
      name: 'Zara Khan', categorySlug: 'character', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        role: 'Protagonist (Love Interest)',
        status: 'Alive',
        goals: {
          primaryGoal: 'Grow her food blog into a full restaurant review column in a national magazine',
          secondaryGoal: 'Stop running from her half-finished culinary degree',
          internalFear: "That she is fundamentally too scattered to succeed at anything she truly cares about",
          externalThreat: 'A rival blogger is plagiarizing her recipes and pitching to the same editor',
        },
        personality: { mbti: 'ENFP', traits: ['Effervescent', 'Curious', 'Disarmingly honest'], flaws: ['Impulsive', 'Avoidant of conflict', 'Chronically late'], virtues: ['Warm', 'Creative', 'Fearlessly kind'] },
        motivations: ["Joy of discovery", "Proving she did not waste her parents' investment", 'Finding a place that feels like home'],
        arc: { type: 'Positive', beginningState: 'Treats life as a series of beautiful distractions', midpointShift: 'Confronts why she really quit culinary school', endState: 'Commits to the thing (and person) that actually feels like home' },
        physical: { height: "5'5\", athletic", build: 'Compact, always moving', distinguishingFeatures: 'Perpetual flour dusting, vivid kurtas, earrings that could double as wind chimes', voiceDescription: 'Quick, lilting, laughs mid-sentence' },
        voice: { sentenceStyle: 'Run-on sentences that land somewhere unexpected', vocabularyLevel: 'Colloquial, multilingual (Hindi-Urdu-English mix)', accentNotes: 'Mumbai casual', sampleQuote: '"You put a label on the cheese. Who does that? Actually -- wait -- can I borrow it for the shoot?"' },
        skills: ['Recipe development', 'Food photography', 'Navigating Mumbai traffic on a scooter', 'Making strangers feel like old friends'],
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'character', entityClass: 'INSTANCE',
      name: 'Priya Mehra', categorySlug: 'character', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        role: 'Supporting — Arjun\'s sister / confidante',
        status: 'Alive',
        goals: { primaryGoal: 'Get her brother to stop working himself to death', secondaryGoal: '', internalFear: '', externalThreat: '' },
        personality: { mbti: 'ESFJ', traits: ['Perceptive', 'Meddlesome (lovingly)', 'Blunt'], flaws: ['Overprotective', 'Gossips'], virtues: ['Loyal', 'Emotionally intelligent'] },
        motivations: ['Family', 'Seeing people she loves happy'],
        arc: { type: 'Flat', beginningState: 'Knows what her brother needs before he does', midpointShift: '', endState: 'Vindicated' },
        physical: { height: '', build: '', distinguishingFeatures: '', voiceDescription: '' },
        voice: { sentenceStyle: '', vocabularyLevel: '', accentNotes: '', sampleQuote: '"Arjun. She reorganised your spice rack by colour. You\'re in love."' },
        skills: ['People-reading', 'Strategic WhatsApp forwarding'],
      },
    },

    // Places
    {
      id: crypto.randomUUID(), projectId, type: 'location', entityClass: 'MASTER',
      name: 'Flat 4B, Bougainvillea Heights, Bandra West', categorySlug: 'location', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'A 2BHK flat with sea-facing balcony, original 1960s teak floors, and an impossibly small kitchen that becomes a battleground and then a peace treaty. The flat is the third main character.',
        physicalDescription: 'Light-washed, perpetually cluttered on Zara\'s half, aggressively minimalist on Arjun\'s. The balcony is neutral ground — potted herbs on one side, architectural scale models on the other.',
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'location', entityClass: 'INSTANCE',
      name: 'Samovar, Jehangir Art Gallery', categorySlug: 'location', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'Arjun\'s go-to lunch spot. Formal, quiet, known. The place Zara drags him to her first food review — and he quietly notices the way her face changes when she tastes something extraordinary.',
        physicalDescription: 'Old Mumbai charm, ceiling fans, white tablecloths.',
      },
    },

    // Factions / Social circles
    {
      id: crypto.randomUUID(), projectId, type: 'faction', entityClass: 'MASTER',
      name: 'The Thursday Table', categorySlug: 'faction', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'Zara\'s rotating crew of food bloggers, artists, and assorted Bandra characters who commandeer a different restaurant table every Thursday. Arjun is horrified by them. Then slowly isn\'t.',
        coreValues: ['Joy', 'Spontaneity', 'Good food above all'],
        socialStructure: 'Whoever suggests the restaurant picks up 10% of the bill.',
        keyCustoms: 'You must order one thing you have never tried before.',
      },
    },

    // Events
    {
      id: crypto.randomUUID(), projectId, type: 'event', entityClass: 'INSTANCE',
      name: 'The Housing Mix-Up', categorySlug: 'event', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'Both Arjun and Zara receive the same lease confirmation for Flat 4B, due to a clerical error by the landlord\'s tech-phobic nephew. Arrival day. Two suitcases. One flat.',
      },
    },
    {
      id: crypto.randomUUID(), projectId, type: 'event', entityClass: 'INSTANCE',
      name: 'The Monsoon Power Cut', categorySlug: 'event', hasAIRule: false, createdAt: now, updatedAt: now,
      data: {
        description: 'A 14-hour power cut during peak monsoon. Zara cooks everything in the fridge by candlelight. Arjun sketches by phone torch. They talk until 3am for the first time without a single argument.',
      },
    },
  ];

  // Persist to IndexedDB
  await db.projects.put(project);
  await db.entities.bulkPut(entities);

  return projectId;
}
