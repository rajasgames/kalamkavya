import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  PenTool, 
  Sun, 
  Rocket, 
  Coffee, 
  ShieldAlert, 
  ArrowRight,
  Compass,
  FileText,
  Search,
  Zap,
  Ghost,
  BookOpen,
  Crown,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { Button, Card, Input } from '@/components/ui';

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
    id: 'vedic_epical',
    title: 'Vedic Dharmic 4-Purushartha Arc',
    category: 'Narrative Arc',
    genre: 'Vedic & Puranic / Mythic',
    Icon: Sun,
    description: 'Cosmic mythic structure balancing Dharma (Duty), Artha (Prosperity), Kama (Desire), & Moksha (Liberation).',
    targetWordCount: 90000,
    difficulty: 'Master',
    tags: ['Vedic', 'Purushartha', 'Epical', 'Cosmic Law'],
    beats: [
      { title: 'Khanda I: Cosmic Order & Disruption (Rita)', desc: 'Establish cosmic harmony (Rita) broken by unrighteous Tapas or Adharma.', writingTip: 'Invoke planetary and celestial alignments.', suggestedWordCount: 10000 },
      { title: 'Khanda II: Royal Assembly & Divine Quest (Artha)', desc: 'Gathering of heroes, Astra sadhana (weapons discipline), and kingdom politics.', writingTip: 'Focus on vow-taking and lineage honor.', suggestedWordCount: 15000 },
      { title: 'Khanda III: Trial in the Wilderness (Kama)', desc: 'Exile, celestial temptations, forest hermitage encounters, and devotion.', writingTip: 'Explore internal attachments vs duty.', suggestedWordCount: 20000 },
      { title: 'Khanda IV: Mahayuddha & Cosmic War (Yajna)', desc: 'Epic battle deploying sacred Vyuhas (military arrays) and Astras.', writingTip: 'Treat combat as a sacral ritual.', suggestedWordCount: 25000 },
      { title: 'Khanda V: Transcendence & Cosmic Order Restored (Moksha)', desc: 'Restoration of universal order, ascension, and liberation from cycle.', writingTip: 'End on philosophical peace and renewal.', suggestedWordCount: 20000 },
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

export function ProjectTemplates() {
  const { activeProject } = useStoryStore();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<StructureTemplate>(TEMPLATE_LIBRARY[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_LIBRARY.filter(t => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleApplyTemplate = async () => {
    if (!activeProject) return;
    setIsApplying(true);

    try {
      // Create chapters and scenes for each beat in the selected template
      let chapterOrder = (await db.chapters.where('projectId').equals(activeProject.id).count()) + 1;
      
      for (const beat of selectedTemplate.beats) {
        const chapterId = `chap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await db.chapters.add({
          id: chapterId,
          projectId: activeProject.id,
          title: beat.title,
          order: chapterOrder++,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        await db.scenes.add({
          id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          projectId: activeProject.id,
          chapterId: chapterId,
          title: `Scene 1: ${beat.title}`,
          content: `<p><strong>Scene Objective:</strong> ${beat.desc}</p><p><em>Writing Tip: ${beat.writingTip || 'Establish atmosphere and narrative momentum.'}</em></p><p>Begin drafting your scene content here...</p>`,
          wordCount: 30,
          order: 1,
          kanbanColumn: 'todo',
          planning: {
            goal: beat.desc,
            conflict: 'What obstacles or internal doubts block the protagonist in this scene?',
            outcome: 'How does the character or situation change by the scene conclusion?'
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Update active project target word count if default 50k
      if (!activeProject.targetWordCount || activeProject.targetWordCount === 50000) {
        await db.projects.update(activeProject.id, {
          targetWordCount: selectedTemplate.targetWordCount,
          updatedAt: Date.now()
        });
      }

      // Reload active project state
      await useStoryStore.getState().setActiveProject(activeProject.id);

      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to apply template:', err);
    } finally {
      setIsApplying(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-4 rounded-2xl bg-amber-from/10 border border-amber-from/30 w-fit mx-auto text-amber-from">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary">No Active Project Selected</h2>
        <p className="text-sm text-secondary max-w-md mx-auto">
          Please select or create a project to apply narrative structure templates and worldbuilding codex schemas.
        </p>
        <Button onClick={() => navigate('/')} className="gap-2">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans overflow-y-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-subtle pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-from/15 text-amber-from border border-amber-from/30 shadow-md shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary flex items-center gap-3 flex-wrap">
              Narrative & Worldbuilding Templates
              {appliedSuccess && (
                <span className="text-xs font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <CheckCircle2 size={13} /> Applied to Manuscript!
                </span>
              )}
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Apply structural beats, chapter arcs, and worldbuilding schemas to <strong className="text-primary">{activeProject.title}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button onClick={() => navigate('/manuscript/planner')} variant="ghost" className="gap-2 text-xs">
            <PenTool size={16} /> Open Planner
          </Button>
          <Button 
            onClick={handleApplyTemplate} 
            disabled={isApplying}
            className="gap-2 text-xs bg-amber-from text-black font-bold shadow-md hover:brightness-110"
          >
            <Sparkles size={16} /> {isApplying ? 'Applying...' : 'Apply Template'}
          </Button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface/50 p-3 rounded-2xl border border-subtle">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full w-full sm:w-auto shrink-0 flex-nowrap">
          {['All', 'Narrative Arc', 'Worldbuilding Schema', 'Genre Beats'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-from text-black font-bold shadow-sm'
                  : 'bg-base text-secondary hover:text-primary hover:bg-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" />
          <Input 
            type="text"
            placeholder="Filter templates or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs py-1.5 bg-base border-subtle"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Template Catalog List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ghost flex items-center gap-1.5">
              <ListFilter size={13} /> Available Schemas ({filteredTemplates.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-xs text-ghost border border-dashed border-subtle rounded-xl">
                No templates found matching "{searchQuery}".
              </div>
            ) : (
              filteredTemplates.map((t) => {
                const isSelected = selectedTemplate.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col gap-2 relative ${
                      isSelected
                        ? 'bg-amber-from/10 border-amber-from shadow-md'
                        : 'bg-surface border-subtle hover:border-ghost'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-from/15 text-amber-from">
                          <t.Icon size={18} />
                        </div>
                        <span className="font-bold text-xs text-primary">{t.title}</span>
                      </div>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-from shadow-[0_0_10px_rgba(212,153,90,0.9)]" />}
                    </div>

                    <p className="text-[11px] text-ghost leading-relaxed line-clamp-2">{t.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {t.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-base text-secondary border border-subtle">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-secondary font-mono pt-1 border-t border-subtle/50 mt-1">
                      <span>{t.genre}</span>
                      <span className="bg-base px-2 py-0.5 rounded border border-subtle font-bold text-amber-from">
                        {t.beats.length} Beats
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Template Beat Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 bg-surface border-subtle space-y-6">
            {/* Header Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-subtle pb-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-from/15 text-amber-from border border-amber-from/30 shrink-0">
                  <selectedTemplate.Icon size={28} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-from/15 text-amber-from px-2 py-0.5 rounded border border-amber-from/30">
                      {selectedTemplate.category}
                    </span>
                    <span className="text-[10px] font-mono text-secondary">
                      Difficulty: <strong>{selectedTemplate.difficulty}</strong>
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary">{selectedTemplate.title}</h3>
                  <p className="text-xs text-secondary leading-relaxed">{selectedTemplate.description}</p>
                </div>
              </div>

              <Button 
                onClick={handleApplyTemplate} 
                disabled={isApplying}
                className="gap-2 text-xs bg-amber-from text-black font-bold shrink-0 self-start shadow-sm"
              >
                <Sparkles size={15} /> Apply Template
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-base border border-subtle text-center text-xs">
              <div>
                <div className="text-ghost text-[10px]">Total Beats</div>
                <div className="font-bold text-primary font-mono">{selectedTemplate.beats.length} Structural Acts</div>
              </div>
              <div>
                <div className="text-ghost text-[10px]">Target Word Count</div>
                <div className="font-bold text-amber-from font-mono">{selectedTemplate.targetWordCount.toLocaleString()} words</div>
              </div>
              <div>
                <div className="text-ghost text-[10px]">Primary Genre</div>
                <div className="font-bold text-primary">{selectedTemplate.genre}</div>
              </div>
            </div>

            {/* Structural Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ghost flex items-center gap-2">
                <FileText size={14} className="text-amber-from" /> Chapter & Beat Breakdown Sequence
              </h4>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {selectedTemplate.beats.map((beat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-base border border-subtle space-y-2 hover:border-amber-from/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-from/15 text-amber-from text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {beat.title}
                      </div>
                      {beat.suggestedWordCount && (
                        <span className="text-[10px] font-mono text-ghost bg-surface px-2 py-0.5 rounded border border-subtle">
                          ~{beat.suggestedWordCount.toLocaleString()} words
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-ghost leading-relaxed pl-7">{beat.desc}</p>
                    
                    {beat.writingTip && (
                      <div className="ml-7 p-2.5 rounded-lg bg-amber-from/5 border border-amber-from/15 text-[11px] text-amber-from/90 flex items-start gap-2">
                        <Zap size={13} className="shrink-0 mt-0.5 text-amber-from" />
                        <span><strong>Author's Prompt:</strong> {beat.writingTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action Card */}
            <div className="p-4 rounded-xl bg-amber-from/5 border border-amber-from/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-primary">
                <Sparkles size={16} className="text-amber-from shrink-0" />
                <span>Applying will automatically add these structural chapters & scenes to <strong>{activeProject.title}</strong>.</span>
              </div>
              <Button onClick={() => navigate('/manuscript/planner')} variant="ghost" className="gap-1.5 text-xs text-amber-from whitespace-nowrap">
                View Planner <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
