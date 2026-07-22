import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  Check, 
  PenTool, 
  Sun, 
  Rocket, 
  Coffee, 
  ShieldAlert, 
  ArrowRight,
  Compass,
  FileText
} from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { Button, Card } from '@/components/ui';

interface StructureTemplate {
  id: string;
  title: string;
  category: 'Narrative Arc' | 'Worldbuilding Schema';
  genre: string;
  Icon: React.ElementType;
  description: string;
  beats: { title: string; desc: string }[];
}

const TEMPLATE_LIBRARY: StructureTemplate[] = [
  {
    id: 'hero_journey',
    title: "Classic 3-Act Hero's Journey",
    category: 'Narrative Arc',
    genre: 'Universal / Fantasy',
    Icon: Compass,
    description: 'The classic 12-stage monomyth structure popularized by Joseph Campbell.',
    beats: [
      { title: 'Act I: Ordinary World & Call to Adventure', desc: 'Introduce protagonist in their mundane life, followed by a disruption call.' },
      { title: 'Act I: Crossing the Threshold', desc: 'The hero accepts the quest and steps into the unfamiliar special world.' },
      { title: 'Act II: Tests, Allies & Enemies', desc: 'Challenges, encounters with mentors, and trial scenes.' },
      { title: 'Act II: Midpoint & The Ordeal', desc: 'Central climax where stakes escalate and secrets are revealed.' },
      { title: 'Act III: Resurrection & Ultimate Return', desc: 'Final confrontation with the antagonist and return home transformed.' },
    ]
  },
  {
    id: 'vedic_epical',
    title: 'Vedic Dharmic 4-Purushartha Arc',
    category: 'Narrative Arc',
    genre: 'Vedic & Puranic',
    Icon: Sun,
    description: 'Cosmic mythic structure balancing Dharma (Duty), Artha (Prosperity), Kama (Desire), & Moksha (Liberation).',
    beats: [
      { title: 'Khanda I: Cosmic Order & Disruption (Dharma)', desc: 'Establish cosmic law (Rita) broken by an unrighteous act or Tapas.' },
      { title: 'Khanda II: Royal Assembly & Quest (Artha)', desc: 'Gathering of heroes, Astra training, and kingdom politics.' },
      { title: 'Khanda III: Trial in the Wilderness (Kama)', desc: 'Exile, temptations, celestial encounters, and devotion.' },
      { title: 'Khanda IV: Mahayuddha (Cosmic War)', desc: 'Epic battle using military Vyuhas and divine weapons.' },
      { title: 'Khanda V: Transcendence (Moksha)', desc: 'Restoration of universal order and spiritual ascension.' },
    ]
  },
  {
    id: 'romance_beats',
    title: 'Contemporary Romance Beat Sheet',
    category: 'Narrative Arc',
    genre: 'Contemporary / Rom-Com',
    Icon: Coffee,
    description: 'The standard romance arc focusing on meet cute, internal barriers, and Happily Ever After (HEA).',
    beats: [
      { title: 'Beat 1: The Meet Cute & Initial Friction', desc: 'Protagonists cross paths under memorable, forced circumstances.' },
      { title: 'Beat 2: Forced Proximity & Chemical Shift', desc: 'Forced alignment (fake dating, rooming, work project) breeds attraction.' },
      { title: 'Beat 3: Midpoint Confession & Wall Down', desc: 'Vulnerability moment where defenses temporarily drop.' },
      { title: 'Beat 4: Dark Night of the Soul (The Break)', desc: 'Misunderstanding or secret comes to light, threatening the bond.' },
      { title: 'Beat 5: Grand Gesture & HEA', desc: 'Declaration of true feelings and commitment to a shared future.' },
    ]
  },
  {
    id: 'scifi_ship_codex',
    title: 'Generation Ship Mystery Codex',
    category: 'Worldbuilding Schema',
    genre: 'Sci-Fi / Space Opera',
    Icon: Rocket,
    description: 'Structure for closed-system colony ship mystery, deck factions, and tech decay.',
    beats: [
      { title: 'Sector 1: System Anomaly Detected', desc: 'Unexplained life-support or navigational glitch on the colony vessel.' },
      { title: 'Sector 2: Faction Friction', desc: 'Conflict between Engineering Guild, Command Deck, & Bio-Dome farmers.' },
      { title: 'Sector 3: Ancient Record Uncovered', desc: 'Classified historical logs reveal true mission origin.' },
      { title: 'Sector 4: Hull Breach Crisis', desc: 'Climactic survival emergency requiring collective action.' },
    ]
  }
];

export function ProjectTemplates() {
  const { activeProject } = useStoryStore();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<StructureTemplate>(TEMPLATE_LIBRARY[0]);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

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
          content: `<p><em>${beat.desc}</em></p><p>Start writing scene content here...</p>`,
          wordCount: 15,
          order: 1,
          kanbanColumn: 'todo',
          planning: {
            goal: beat.desc,
            conflict: 'Drafting scene conflict...',
            outcome: 'Drafting scene outcome...'
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // Reload active project state
      await useStoryStore.getState().setActiveProject(activeProject.id);

      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3000);
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
    <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-8 font-sans overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-subtle pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-from/15 text-amber-from border border-amber-from/30 shadow-md">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              Narrative & Worldbuilding Templates
              {appliedSuccess && (
                <span className="text-xs font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check size={13} /> Applied to Manuscript!
                </span>
              )}
            </h1>
            <p className="text-xs text-secondary">
              Apply structural beats, chapter arcs, and worldbuilding schemas to <strong className="text-primary">{activeProject.title}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/manuscript/planner')} variant="ghost" className="gap-2 text-xs">
            <PenTool size={16} /> Open Planner
          </Button>
          <Button 
            onClick={handleApplyTemplate} 
            disabled={isApplying}
            className="gap-2 text-xs bg-amber-from text-black font-bold shadow-sm"
          >
            <Sparkles size={16} /> {isApplying ? 'Applying...' : 'Apply Template to Project'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Catalog List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ghost px-1">
            Available Template Schemas
          </h3>

          {TEMPLATE_LIBRARY.map((t) => {
            const isSelected = selectedTemplate.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
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
                  {isSelected && <div className="w-2 h-2 rounded-full bg-amber-from shadow-[0_0_8px_rgba(212,153,90,0.8)]" />}
                </div>

                <p className="text-[11px] text-ghost leading-relaxed">{t.description}</p>
                <div className="flex items-center justify-between text-[10px] text-secondary font-mono pt-1">
                  <span>{t.genre}</span>
                  <span className="bg-base px-2 py-0.5 rounded border border-subtle">{t.beats.length} Structural Beats</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Template Beat Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-surface border-subtle space-y-6">
            <div className="flex items-start justify-between border-b border-subtle pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-from/15 text-amber-from border border-amber-from/30">
                  <selectedTemplate.Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary">{selectedTemplate.title}</h3>
                  <p className="text-xs text-secondary">{selectedTemplate.description}</p>
                </div>
              </div>

              <Button 
                onClick={handleApplyTemplate} 
                disabled={isApplying}
                className="gap-2 text-xs bg-amber-from text-black font-bold shrink-0"
              >
                <Sparkles size={15} /> Apply Template
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ghost flex items-center gap-2">
                <FileText size={14} className="text-amber-from" /> Structural Chapters & Beats Breakdown
              </h4>

              <div className="space-y-3">
                {selectedTemplate.beats.map((beat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-base border border-subtle space-y-1 hover:border-amber-from/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-from/15 text-amber-from text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {beat.title}
                      </div>
                    </div>
                    <p className="text-xs text-ghost leading-relaxed pl-7">{beat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-from/5 border border-amber-from/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-primary">
                <Sparkles size={16} className="text-amber-from" />
                <span>Applying will automatically add these structural chapters & scenes to <strong>{activeProject.title}</strong>.</span>
              </div>
              <Button onClick={() => navigate('/manuscript/planner')} variant="ghost" className="gap-1.5 text-xs text-amber-from">
                View Planner <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
