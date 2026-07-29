import React from 'react';
import { 
  Compass, 
  Zap, 
  Sun, 
  BookOpen, 
  Coffee, 
  Rocket, 
  Crown, 
  Ghost 
} from 'lucide-react';

export interface StructureBeat {
  title: string;
  desc: string;
  writingTip?: string;
  suggestedWordCount?: number;
}

export interface StructureTemplate {
  id: string;
  title: string;
  category: 'Narrative Arc' | 'Worldbuilding Schema' | 'Genre Beats';
  genre: string;
  Icon: React.ElementType;
  description: string;
  targetWordCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  tags: string[];
  beats: StructureBeat[];
}

export const TEMPLATE_LIBRARY: StructureTemplate[] = [
  {
    id: 'hero_journey',
    title: "Classic 12-Stage Hero's Journey (Monomyth)",
    category: 'Narrative Arc',
    genre: 'Universal / Heroic Fantasy',
    Icon: Compass,
    description: 'The definitive 12-stage mythic narrative cycle based on Joseph Campbell and Christopher Vogler.',
    targetWordCount: 80000,
    difficulty: 'Intermediate',
    tags: ['Monomyth', 'Fantasy', 'Mythic', 'Classic'],
    beats: [
      { title: '1. Ordinary World', desc: 'Establish the hero in their familiar environment before disruption.', writingTip: 'Highlight the hero\'s internal lack or flaw here.', suggestedWordCount: 4000 },
      { title: '2. Call to Adventure', desc: 'An incisive event or herald disrupts the mundane balance.', writingTip: 'Make the stakes clear immediately.', suggestedWordCount: 3500 },
      { title: '3. Refusal of the Call', desc: 'The hero hesitates out of fear, duty, or insecurity.', writingTip: 'Show genuine emotional resistance.', suggestedWordCount: 3000 },
      { title: '4. Meeting the Mentor', desc: 'A wise guide provides training, wisdom, or a key relic.', writingTip: 'The mentor cannot fight the battle for them.', suggestedWordCount: 4000 },
      { title: '5. Crossing the First Threshold', desc: 'The hero fully commits and steps into the unknown world.', writingTip: 'Mark this moment with a point of no return.', suggestedWordCount: 5000 },
      { title: '6. Tests, Allies, and Enemies', desc: 'Navigating the new rules of the special world.', writingTip: 'Build the core party and establish rivalries.', suggestedWordCount: 10000 },
      { title: '7. Approach to the Inmost Cave', desc: 'Preparation for the central confrontation and major trial.', writingTip: 'Heighten atmospheric dread and tension.', suggestedWordCount: 6000 },
      { title: '8. The Ordeal', desc: 'The hero faces their greatest fear and experiences symbolic death.', writingTip: 'This is the emotional and physical climax of Act II.', suggestedWordCount: 8000 },
      { title: '9. Reward (Seizing the Sword)', desc: 'The hero claims the ultimate treasure, knowledge, or power.', writingTip: 'The victory must come at a tangible cost.', suggestedWordCount: 4000 },
      { title: '10. The Road Back', desc: 'Urgency escalates as the hero attempts to return with the prize.', writingTip: 'Introduce a ticking clock or pursuit scene.', suggestedWordCount: 5000 },
      { title: '11. Resurrection', desc: 'The final, ultimate test where the hero is purified and reborn.', writingTip: 'Test whether the hero has truly internalised the lesson.', suggestedWordCount: 9000 },
      { title: '12. Return with the Elixir', desc: 'Returning home transformed, using the elixir to heal their world.', writingTip: 'Contrast the beginning ordinary world with the new reality.', suggestedWordCount: 3000 },
    ]
  },
  {
    id: 'save_the_cat',
    title: 'Save the Cat! 15-Beat Novel Sheet',
    category: 'Narrative Arc',
    genre: 'Commercial Fiction / Thriller / YA',
    Icon: Zap,
    description: 'Blake Snyder\'s renowned 15-beat narrative arc optimized for high-pacing and tight dramatic beats.',
    targetWordCount: 75000,
    difficulty: 'Beginner',
    tags: ['Pacing', 'Screenplay', 'Bestseller', 'Commercial'],
    beats: [
      { title: '1. Opening Image', desc: 'Snapshot of the hero\'s current baseline state.', writingTip: 'Set the tone and visual atmosphere.', suggestedWordCount: 2000 },
      { title: '2. Theme Stated', desc: 'A subtle statement declaring what the story is truly about.', writingTip: 'Usually spoken by a secondary character.', suggestedWordCount: 1500 },
      { title: '3. Setup', desc: 'Explore the protagonist\'s world, flaws, and unsustainable routine.', writingTip: 'Introduce all main secondary characters.', suggestedWordCount: 6000 },
      { title: '4. Catalyst', desc: 'The life-shattering event that knocks the hero out of orbit.', writingTip: 'Must be an external action or news.', suggestedWordCount: 2500 },
      { title: '5. Debate', desc: 'The hero wrestles with what to do next.', writingTip: 'Frame as a choice: stay safe or take the risk?', suggestedWordCount: 4000 },
      { title: '6. Break into Two', desc: 'The hero chooses to enter a new world or situation.', writingTip: 'Clear boundary transition.', suggestedWordCount: 2000 },
      { title: '7. B Story', desc: 'Introduction of the key relationship that carries the emotional thematic heart.', writingTip: 'Often a love interest, rival, or mentor.', suggestedWordCount: 3500 },
      { title: '8. Fun and Games', desc: 'The promise of the premise — exploring the central hook of the story.', writingTip: 'Deliver on what readers bought the book for.', suggestedWordCount: 12000 },
      { title: '9. Midpoint', desc: 'A false victory or false defeat where stakes shift dramatically.', writingTip: 'Raise the stakes from personal to public.', suggestedWordCount: 4000 },
      { title: '10. Bad Guys Close In', desc: 'Internal jealousies and external threats press inward.', writingTip: 'The hero\'s flaw causes fractures in the group.', suggestedWordCount: 10000 },
      { title: '11. All Hope Is Lost', desc: 'The lowest point: a major loss or apparent defeat.', writingTip: 'A mentor dies or the main strategy crumbles.', suggestedWordCount: 3000 },
      { title: '12. Dark Night of the Soul', desc: 'The hero wallows in despair before discovering the key realization.', writingTip: 'Must precede the transformation.', suggestedWordCount: 4000 },
      { title: '13. Break into Three', desc: 'The epiphany! The hero figures out the solution.', writingTip: 'Combines the A story goal with the B story lesson.', suggestedWordCount: 2000 },
      { title: '14. Finale', desc: 'The hero executes the new plan, defeats the antagonist, and changes.', writingTip: 'Paced high action and dramatic payoff.', suggestedWordCount: 12000 },
      { title: '15. Final Image', desc: 'The mirror opposite of the Opening Image showing total growth.', writingTip: 'Echo the opening visually.', suggestedWordCount: 1500 },
    ]
  },
  {
    id: 'grand_mythic_epic',
    title: 'Grand Mythic Epic Saga (5-Act Arc)',
    category: 'Narrative Arc',
    genre: 'Epic Fantasy / Mythology / Space Opera',
    Icon: Sun,
    description: 'Universal 5-Act mythic structure balancing cosmic order, heroic trials, factional alliance, and legendary resolution.',
    targetWordCount: 90000,
    difficulty: 'Master',
    tags: ['Mythic', 'Epic', 'Cosmic Saga', 'High Fantasy'],
    beats: [
      { title: 'Act I: Primordial Order & The Disruption', desc: 'Establish cosmic harmony and ancient peace broken by an ominous catalyst or dark emergence.', writingTip: 'Highlight the scale of the world and ancestral legacy.', suggestedWordCount: 10000 },
      { title: 'Act II: The Gathering of Heroes & Artifact Quest', desc: 'Assembling champions, mastering magical/technological artifacts, and kingdom politics.', writingTip: 'Focus on oath-taking and factional dynamics.', suggestedWordCount: 15000 },
      { title: 'Act III: Trials in the Unknown Wilds', desc: 'Exile into dangerous uncharted frontiers, temptations, internal conflict, and sacrifice.', writingTip: 'Test character convictions and core flaws.', suggestedWordCount: 20000 },
      { title: 'Act IV: The Climax & Great Realm War', desc: 'The decisive battle deploying legendary arrays, strategy, and ultimate power.', writingTip: 'Maintain high momentum and visceral stakes.', suggestedWordCount: 25000 },
      { title: 'Act V: Renewal & Legacy Restored', desc: 'Restoration of universal balance, ascension, and establishing a new era.', writingTip: 'Conclude with emotional resonance and world renewal.', suggestedWordCount: 20000 },
    ]
  },
  {
    id: 'kishotenketsu',
    title: 'Kishōtenketsu (4-Act Asian Arc)',
    category: 'Narrative Arc',
    genre: 'Literary / Asian Fantasy / Slice of Life',
    Icon: BookOpen,
    description: 'Traditional East-Asian 4-act narrative structure that relies on twist and juxtaposition rather than direct conflict.',
    targetWordCount: 60000,
    difficulty: 'Intermediate',
    tags: ['Kishotenketsu', 'Literary', 'Non-Western', 'Harmonious'],
    beats: [
      { title: 'Ki (Introduction)', desc: 'Introduce characters, world, and baseline atmosphere without forcing conflict.', writingTip: 'Immerse in sensory details and daily rhythms.', suggestedWordCount: 10000 },
      { title: 'Shō (Development)', desc: 'Expand on the premise, deepen character dynamics, and branch out topics.', writingTip: 'Build warmth and complexity organically.', suggestedWordCount: 20000 },
      { title: 'Ten (The Twist / Turning Point)', desc: 'Introduce an unexpected element or recontextualization that shifts perspective.', writingTip: 'Not a combat crisis, but a profound shift in lens.', suggestedWordCount: 18000 },
      { title: 'Ketsu (Reconciliation / Conclusion)', desc: 'Synthesize the twist with the initial premise into a resonant new harmony.', writingTip: 'Provide contemplative closure.', suggestedWordCount: 12000 },
    ]
  },
  {
    id: 'romance_beats',
    title: 'Contemporary Romance & Rom-Com Beat Sheet',
    category: 'Genre Beats',
    genre: 'Contemporary / Rom-Com',
    Icon: Coffee,
    description: 'The premier romance framework focusing on meet cute, emotional barriers, vulnerability, and HEA.',
    targetWordCount: 65000,
    difficulty: 'Beginner',
    tags: ['Romance', 'RomCom', 'HEA', 'Character Driven'],
    beats: [
      { title: 'Beat 1: The Meet Cute & Initial Friction', desc: 'Protagonists cross paths under memorable, forced circumstances.', writingTip: 'Show immediate sparks alongside internal resistance.', suggestedWordCount: 8000 },
      { title: 'Beat 2: Forced Proximity & Chemical Shift', desc: 'Forced alignment (fake dating, rooming, work project) breeds attraction.', writingTip: 'Use domestic or shared space to heighten intimacy.', suggestedWordCount: 15000 },
      { title: 'Beat 3: Midpoint Confession & Defenses Down', desc: 'Vulnerability moment where emotional shields temporarily drop.', writingTip: 'Reveal their deepest childhood or past betrayal wound.', suggestedWordCount: 12000 },
      { title: 'Beat 4: Dark Night of the Soul (The Break)', desc: 'Misunderstanding or secret comes to light, threatening the bond.', writingTip: 'Make the breakup feel inevitable yet heartbreaking.', suggestedWordCount: 10000 },
      { title: 'Beat 5: Grand Gesture & HEA', desc: 'Public or high-stakes declaration of true feelings and commitment.', writingTip: 'Deliver a joyful Happily Ever After.', suggestedWordCount: 20000 },
    ]
  },
  {
    id: 'cyberpunk_heist',
    title: 'Cyberpunk Heist & Megacorp Intrigue',
    category: 'Genre Beats',
    genre: 'Cyberpunk / Noir / Heist',
    Icon: Zap,
    description: 'High-tech, low-life narrative arc involving crew recruitment, netrunning hacks, and corp betrayals.',
    targetWordCount: 70000,
    difficulty: 'Intermediate',
    tags: ['Cyberpunk', 'Heist', 'SciFi', 'Noir'],
    beats: [
      { title: '1. The Score Dropped', desc: 'A fixer presents a high-risk job targeting a tier-1 corporation.', writingTip: 'Establish neon atmospheric noir style.', suggestedWordCount: 5000 },
      { title: '2. Assembling the Crew', desc: 'Recruiting specialized talent: netrunner, solo, rigger, face.', writingTip: 'Give each crew member distinct cybernetic traits.', suggestedWordCount: 12000 },
      { title: '3. Recon & Blueprint Infiltration', desc: 'Mapping physical security, ICE barriers, and corp routines.', writingTip: 'Build tension through near-catastrophic mistakes.', suggestedWordCount: 15000 },
      { title: '4. The Infiltration (Execute Heist)', desc: 'The job goes live. Initial plan works smoothly until alarm triggers.', writingTip: 'Fast-paced parallel action scenes.', suggestedWordCount: 18000 },
      { title: '5. The Betrayal & Black-ICE Trap', desc: 'The client or a crew insider flips the script.', writingTip: 'Reveal a hidden corp agenda or AI sentinel.', suggestedWordCount: 12000 },
      { title: '6. Neon Extraction & Payback', desc: 'Desperate escape through neon-soaked rain and counter-attack.', writingTip: 'End on bittersweet survival or revolutionary spark.', suggestedWordCount: 8000 },
    ]
  },
  {
    id: 'scifi_ship_codex',
    title: 'Generation Ship Mystery Codex',
    category: 'Worldbuilding Schema',
    genre: 'Sci-Fi / Hard Space Opera',
    Icon: Rocket,
    description: 'Structure for closed-system colony ship mystery, deck factions, and technical degradation.',
    targetWordCount: 85000,
    difficulty: 'Advanced',
    tags: ['Generation Ship', 'Hard SciFi', 'Mystery', 'Decay'],
    beats: [
      { title: 'Sector 1: System Anomaly Detected', desc: 'Unexplained life-support or navigational glitch on the colony vessel.', writingTip: 'Contrast claustrophobic corridors with vast space.', suggestedWordCount: 10000 },
      { title: 'Sector 2: Faction Friction', desc: 'Conflict between Engineering Guild, Command Deck, & Bio-Dome farmers.', writingTip: 'Detail scarcity economics and air rations.', suggestedWordCount: 18000 },
      { title: 'Sector 3: Redacted Memory Logs Uncovered', desc: 'Classified historical logs reveal true mission origin or mutiny.', writingTip: 'Use archivist or AI terminal transcripts.', suggestedWordCount: 20000 },
      { title: 'Sector 4: Hull Breach Crisis', desc: 'Climactic survival emergency requiring collective action across all decks.', writingTip: 'Execute high-tension physics-driven survival.', suggestedWordCount: 22000 },
      { title: 'Sector 5: Destination Arrival or New Dawn', desc: 'Breaching the final orbit or accepting life aboard the ship as permanent.', writingTip: 'Conclude on human resilience.', suggestedWordCount: 15000 },
    ]
  },
  {
    id: 'fantasy_realm_schema',
    title: 'High Fantasy Realm & Magic System Schema',
    category: 'Worldbuilding Schema',
    genre: 'High Fantasy / Worldbuilding',
    Icon: Crown,
    description: 'Comprehensive worldbuilding blueprint mapping hard magic systems, ancient pantheons, and dynastic wars.',
    targetWordCount: 100000,
    difficulty: 'Master',
    tags: ['Worldbuilding', 'High Fantasy', 'Magic System', 'Lore'],
    beats: [
      { title: 'Codex I: Foundational Myths & Cosmology', desc: 'Detail the primordial creation event, ancient deities, and elemental forces.', writingTip: 'Draft scriptures or creation songs.', suggestedWordCount: 15000 },
      { title: 'Codex II: Hard Magic Mechanics & Costs', desc: 'Define sources of power, limitations, taboos, and physical consequences.', writingTip: 'Sanderson\'s laws: limits are more interesting than powers!', suggestedWordCount: 20000 },
      { title: 'Codex III: Kingdoms & Feuding Factions', desc: 'Map geographical realms, economic trade routes, and royal court intrigue.', writingTip: 'Detail heraldry, banners, and mottoes.', suggestedWordCount: 25000 },
      { title: 'Codex IV: Artifacts & Ancient Ruin Expeditions', desc: 'Uncovering relic weapons, forgotten temples, and cataclysmic secrets.', writingTip: 'Incorporate ancient language inscriptions.', suggestedWordCount: 22000 },
      { title: 'Codex V: Dynastic Succession War', desc: 'Climactic collision of empires, magic systems, and prophecy fulfillments.', writingTip: 'Weave individual character arcs into regional politics.', suggestedWordCount: 18000 },
    ]
  },
  {
    id: 'gothic_mystery',
    title: 'Gothic Mystery & Psychological Thriller',
    category: 'Genre Beats',
    genre: 'Gothic / Horror / Mystery',
    Icon: Ghost,
    description: 'Atmospheric psychological descent featuring isolated manors, unreliable narrators, and ancestral curses.',
    targetWordCount: 70000,
    difficulty: 'Intermediate',
    tags: ['Gothic', 'Psychological', 'Thriller', 'Atmospheric'],
    beats: [
      { title: '1. Arrival at the Isolated Estate', desc: 'Protagonist arrives at a brooding estate shrouded in secrecy.', writingTip: 'Treat the mansion as a sentient character.', suggestedWordCount: 8000 },
      { title: '2. Unsettling Auditory & Visual Anomalies', desc: 'Creaking floorboards, missing journal pages, and locked doors.', writingTip: 'Build subtle tension that escalates gradually.', suggestedWordCount: 12000 },
      { title: '3. Unearthing the Ancestral Scandal', desc: 'Discovering hidden family letters, portraits with carved eyes, or wills.', writingTip: 'Layer clues with double meanings.', suggestedWordCount: 16000 },
      { title: '4. Isolation & Gaslighting Peak', desc: 'Communication to outside world cut off by storm; trust breaks down.', writingTip: 'Challenge the narrator\'s sanity.', suggestedWordCount: 14000 },
      { title: '5. The Secret Passage Revelation', desc: 'Physical descent into hidden basements or secret rooms.', writingTip: 'Climax of shocking revelation.', suggestedWordCount: 12000 },
      { title: '6. Cathartic Fire / Escape', desc: 'Destruction of the house and escaping the shadow of the past.', writingTip: 'Provide chilling or symbolic final resolution.', suggestedWordCount: 8000 },
    ]
  }
];
