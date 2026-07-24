import { useState } from 'react';
import { 
  Sparkles, 
  PenTool, 
  BookOpen, 
  Users, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  HelpCircle,
  BrainCircuit,
  Layers,
  Award,
  Sun,
  Coffee,
  Rocket
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { loadVedicSampleData } from '@/lib/vedicSampleData';
import { loadRomComSampleData } from '@/lib/sampleData/romComSampleData';
import { loadScifiSampleData } from '@/lib/sampleData/scifiSampleData';
import { Modal, Button } from '@/components/ui';

export function OnboardingModal() {
  const { isOnboardingOpen, setOnboardingOpen, setTourActive, setTourStep } = useUIStore();
  const { setActiveProject, activeProject } = useStoryStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPillarTab, setSelectedPillarTab] = useState<'manuscript' | 'worldbible' | 'cast' | 'toolkit'>('manuscript');
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const totalSteps = 5;

  const handleClose = () => {
    localStorage.setItem('kalam-kavya_onboarding_completed', 'true');
    setOnboardingOpen(false);
  };

  const handleStartTour = async (sampleKey?: 'vedic' | 'romcom' | 'scifi') => {
    localStorage.setItem('kalam-kavya_onboarding_completed', 'true');
    setOnboardingOpen(false);

    // If a sample key was chosen or if there is no active project, load sample data first
    if (sampleKey || !activeProject) {
      const keyToLoad = sampleKey || 'vedic';
      setLoadingSample(keyToLoad);
      try {
        let projectId = '';
        if (keyToLoad === 'vedic') {
          await loadVedicSampleData();
          const projects = await db.projects.toArray();
          projectId = projects[projects.length - 1]?.id ?? '';
        } else if (keyToLoad === 'romcom') {
          projectId = await loadRomComSampleData();
        } else {
          projectId = await loadScifiSampleData();
        }
        if (projectId) {
          await setActiveProject(projectId);
        }
      } catch (err) {
        console.error('Failed to load sample project for tour:', err);
      } finally {
        setLoadingSample(null);
      }
    }

    // Start Guided Tour
    setTourStep(1);
    setTourActive(true);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLoadSample = async (key: 'vedic' | 'romcom' | 'scifi') => {
    await handleStartTour(key);
  };

  return (
    <Modal isOpen={isOnboardingOpen} onClose={handleClose} title="" size="xl">
      <div className="relative overflow-hidden font-sans">
        {/* Top Progress Bar & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-subtle mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-terracotta/15 flex items-center justify-center border border-terracotta/30 shadow-[0_0_15px_rgba(212,153,90,0.2)] p-1 overflow-hidden shrink-0">
              <img src="/brand_logo.png" alt="Kalam Kavya Brand Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-primary flex items-center gap-2 flex-wrap">
                Welcome to kalam kavya
                <span className="text-[9px] sm:text-[10px] font-mono uppercase bg-terracotta/15 text-terracotta border border-terracotta/30 px-2 py-0.5 rounded-full font-bold">
                  User Guide & Tour
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-secondary">Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? 'Overview & Vision' :
                currentStep === 2 ? 'The 4 Core Pillars' :
                currentStep === 3 ? 'AI Co-Pilot & Local Privacy' :
                currentStep === 4 ? 'Keyboard Shortcuts & Workflows' :
                'Choose Your Starting Point'
              }</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx + 1)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    currentStep === idx + 1 
                      ? 'w-5 sm:w-6 bg-terracotta' 
                      : currentStep > idx + 1
                      ? 'w-1.5 sm:w-2 bg-terracotta/50'
                      : 'w-1.5 sm:w-2 bg-subtle'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-xl text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
              title="Close guide"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* STEP CONTENT BODY */}
        <div className="min-h-[300px] sm:min-h-[360px] md:min-h-[420px] max-h-[70vh] overflow-y-auto pr-1 flex flex-col justify-between">
          {/* Step 1: Welcome & Vision */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-terracotta/10 via-surface to-base border border-terracotta/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-terracotta pointer-events-none hidden sm:block">
                  <Sparkles size={160} />
                </div>
                
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-primary mb-2 sm:mb-3">
                  The All-in-One Studio for Novelists & Worldbuilders
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed max-w-2xl">
                  kalam kavya bridges the gap between creative storytelling, deep encyclopedic worldbuilding, and context-aware artificial intelligence. Designed for writers who demand complete control over their narrative universe.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="p-3 sm:p-4 rounded-xl bg-surface/80 border border-subtle backdrop-blur-sm">
                    <div className="text-terracotta mb-2">
                      <BrainCircuit size={22} />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-primary mb-1">Local & Cloud AI</h4>
                    <p className="text-[11px] sm:text-xs text-ghost leading-relaxed">
                      Connect local LLMs (Ollama, LM Studio) for 100% offline privacy or cloud providers (OpenAI, Groq).
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-surface/80 border border-subtle backdrop-blur-sm">
                    <div className="text-terracotta mb-2">
                      <Layers size={22} />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-primary mb-1">Genre Modules</h4>
                    <p className="text-[11px] sm:text-xs text-ghost leading-relaxed">
                      Tailor your workspace with specialized lore fields for Fantasy, Sci-Fi, Romance, Action, & more.
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-surface/80 border border-subtle backdrop-blur-sm">
                    <div className="text-terracotta mb-2">
                      <Award size={22} />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-primary mb-1">Full Manuscript Suite</h4>
                    <p className="text-[11px] sm:text-xs text-ghost leading-relaxed">
                      Distraction-free prose editor, scene drag-and-drop planner, index cards, and multi-format exporter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-base border border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-terracotta shrink-0" size={18} />
                  <p className="text-[11px] sm:text-xs text-secondary">
                    You can reopen this guide at any time by clicking the <span className="font-bold text-primary">User Guide</span> icon in the sidebar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: The Core Pillars */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-base border border-subtle rounded-xl overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedPillarTab('manuscript')}
                  className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    selectedPillarTab === 'manuscript'
                      ? 'bg-terracotta text-white shadow-md font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <PenTool size={14} /> Manuscript
                </button>
                <button
                  onClick={() => setSelectedPillarTab('worldbible')}
                  className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    selectedPillarTab === 'worldbible'
                      ? 'bg-terracotta text-white shadow-md font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <BookOpen size={14} /> World Bible
                </button>
                <button
                  onClick={() => setSelectedPillarTab('cast')}
                  className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    selectedPillarTab === 'cast'
                      ? 'bg-terracotta text-white shadow-md font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Users size={14} /> Cast Studio
                </button>
                <button
                  onClick={() => setSelectedPillarTab('toolkit')}
                  className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    selectedPillarTab === 'toolkit'
                      ? 'bg-terracotta text-white shadow-md font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Wrench size={14} /> Toolkit
                </button>
              </div>

              {/* Tab Details */}
              <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-subtle min-h-[220px] sm:min-h-[260px] flex flex-col justify-between">
                {selectedPillarTab === 'manuscript' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                        <PenTool size={22} />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-primary">Manuscript Studio</h4>
                        <p className="text-[11px] sm:text-xs text-secondary">Editor • Scene Planner • Visual Outline</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Focus Prose Editor:</strong> Clean rich-text editor with word counts, targets, and chapter structure.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Interactive Scene Planner:</strong> Drag and drop scene cards across narrative acts and plot points.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Visual Outline:</strong> High-level view of book structure with index card summaries and scene status.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPillarTab === 'worldbible' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-primary">World Bible & Codex</h4>
                        <p className="text-[11px] sm:text-xs text-secondary">Lore Entities • Systems • Timelines • Cross-Links</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Encyclopedic Lore Categories:</strong> Organize Locations, Factions, Magic Systems, Artifacts, Cultures, & Technologies.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Genre-Specific Fields:</strong> Automatic custom fields for fantasy realms, sci-fi propulsion, or romance tropes.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Entity Grid & Visual Search:</strong> Filter, tag, and explore your world elements effortlessly.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPillarTab === 'cast' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                        <Users size={22} />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-primary">Cast Studio & Character Engine</h4>
                        <p className="text-[11px] sm:text-xs text-secondary">Dossiers • Relationship Web • Voice Guides • Arcs</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Character Dossiers:</strong> Psychological motivations, backstories, flaws, and distinctive dialogue voice traits.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Relationship Matrix:</strong> Map dynamic alliances, rivalries, romantic links, and family trees.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Art Direction:</strong> Palette generators and prompt builders to visualize your character avatars.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPillarTab === 'toolkit' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                        <Wrench size={22} />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-primary">Author's Toolkit</h4>
                        <p className="text-[11px] sm:text-xs text-secondary">AI Brainstorms • Word Sprints • Exporters</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Word Sprint Widget:</strong> Gamify your writing sessions with timed sprints and velocity trackers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">AI Co-Pilot Drawer:</strong> Prompt the AI to brainstorm scene twists, expand prose, or critique dialogue.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-terracotta shrink-0 mt-0.5" />
                        <span><strong className="text-primary">Multi-Format Publishing Export:</strong> Compile your finished manuscript into EPUB, PDF, DOCX, or Markdown.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: AI & Privacy */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-subtle space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                      <BrainCircuit size={22} />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-primary">Privacy-First AI Intelligence</h4>
                      <p className="text-[11px] sm:text-xs text-secondary">Offline Local LLMs or Cloud High-Speed Models</p>
                    </div>
                  </div>
                  <ShieldCheck className="text-emerald-500 shrink-0 hidden sm:block" size={24} />
                </div>

                <p className="text-[11px] sm:text-xs text-secondary leading-relaxed">
                  kalam kavya gives you full sovereignty over your data and AI providers. You can write 100% offline with zero data leakage or connect powerful cloud endpoints.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-base border border-subtle">
                    <h5 className="font-bold text-xs text-primary mb-1 flex items-center gap-1.5">
                      <Zap size={14} className="text-terracotta shrink-0" /> Local Models (Ollama & LM Studio)
                    </h5>
                    <p className="text-[10px] sm:text-[11px] text-ghost leading-normal">
                      Run Llama 3, Mistral, or Gemma directly on your computer. Completely private, free, and works without internet.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-base border border-subtle">
                    <h5 className="font-bold text-xs text-primary mb-1 flex items-center gap-1.5">
                      <Sliders size={14} className="text-terracotta shrink-0" /> Cloud Endpoints
                    </h5>
                    <p className="text-[10px] sm:text-[11px] text-ghost leading-normal">
                      Connect OpenAI (GPT-4o), Groq (Instant Llama 3.1), or OpenRouter API keys with custom temperature and tone profiles.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-terracotta/5 border border-terracotta/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-terracotta shrink-0" />
                    <span className="text-[11px] sm:text-xs text-primary font-medium">Context-Aware Smart Suggestions</span>
                  </div>
                  <span className="text-[10px] text-ghost hidden sm:inline">AI reads active scene + character bios automatically</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Shortcuts & Workflows */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-subtle space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-lg font-serif font-bold text-primary flex items-center gap-2">
                  <Zap size={18} className="text-terracotta shrink-0" /> Power Shortcuts & Speed Workflows
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-base border border-subtle flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-primary">Global Search</div>
                      <div className="text-[10px] sm:text-[11px] text-ghost">Search scenes, lore, and characters</div>
                    </div>
                    <kbd className="px-2 py-1 text-[10px] sm:text-[11px] font-mono font-bold bg-surface border border-subtle rounded text-terracotta shadow-sm">
                      Ctrl + K
                    </kbd>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-base border border-subtle flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-primary">AI Assistant Drawer</div>
                      <div className="text-[10px] sm:text-[11px] text-ghost">Open side drawer for prose help</div>
                    </div>
                    <kbd className="px-2 py-1 text-[10px] sm:text-[11px] font-mono font-bold bg-surface border border-subtle rounded text-terracotta shadow-sm">
                      Sparkles Icon
                    </kbd>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-base border border-subtle flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-primary">Writing Sprint Widget</div>
                      <div className="text-[10px] sm:text-[11px] text-ghost">Launch countdown timer & word tracker</div>
                    </div>
                    <kbd className="px-2 py-1 text-[10px] sm:text-[11px] font-mono font-bold bg-surface border border-subtle rounded text-terracotta shadow-sm">
                      Timer Icon
                    </kbd>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-base border border-subtle flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-primary">Theme Toggle</div>
                      <div className="text-[10px] sm:text-[11px] text-ghost">Switch sleek dark / warm light mode</div>
                    </div>
                    <kbd className="px-2 py-1 text-[10px] sm:text-[11px] font-mono font-bold bg-surface border border-subtle rounded text-terracotta shadow-sm">
                      Sun / Moon
                    </kbd>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-base border border-subtle">
                  <h5 className="font-bold text-xs text-primary mb-1">Dynamic Genre Modules</h5>
                  <p className="text-[11px] sm:text-xs text-ghost leading-relaxed">
                    kalam kavya supports multiple genre structures. When creating a novel project, select genre modules like <span className="text-primary font-medium">Fantasy</span>, <span className="text-primary font-medium">Romance</span>, or <span className="text-primary font-medium">Sci-Fi</span> to automatically enable customized worldbuilding schemas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Getting Started Choice & Guided Tour Launcher */}
          {currentStep === 5 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-subtle text-center space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-terracotta/20 text-terracotta border border-terracotta/40 flex items-center justify-center mx-auto shadow-lg shadow-terracotta/10">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-primary">You're Ready to Architect Your Story!</h4>
                  <p className="text-xs text-secondary max-w-lg mx-auto mt-1">
                    Take the interactive guided tour with an arrow pointing to each tab, or select a pre-built sample world.
                  </p>
                </div>

                {/* Primary CTA: Launch Guided Tour */}
                <div className="pt-2">
                  <button
                    onClick={() => handleStartTour('vedic')}
                    disabled={loadingSample !== null}
                    className="w-full max-w-md mx-auto p-4 rounded-2xl bg-terracotta text-white hover:bg-terracotta/90 transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-terracotta/20 group border border-amber-300/30"
                  >
                    <div className="p-2 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform">
                      <Sparkles size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <div>Start Interactive Guided Tour</div>
                      <div className="text-[11px] font-normal text-white/80">Creates sample project and explains every tab step-by-step with arrows</div>
                    </div>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-[1px] bg-subtle" />
                  <span className="text-[10px] uppercase font-bold text-ghost tracking-wider">Or explore a sample world directly</span>
                  <div className="flex-1 h-[1px] bg-subtle" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <button
                    onClick={() => handleLoadSample('vedic')}
                    disabled={loadingSample !== null}
                    className="p-3.5 rounded-xl bg-base border border-subtle hover:border-terracotta/50 hover:bg-terracotta/5 transition-all group disabled:opacity-50"
                  >
                    <div className="p-2 w-fit rounded-lg bg-terracotta/10 text-terracotta mb-1.5 group-hover:scale-110 transition-transform">
                      <Sun size={20} />
                    </div>
                    <div className="font-bold text-xs text-primary group-hover:text-terracotta">Fantasy Epic</div>
                    <div className="text-[10px] text-ghost mt-0.5">Pre-built mythology world, characters, & lore</div>
                    {loadingSample === 'vedic' && <div className="text-[10px] text-terracotta animate-pulse mt-1 font-bold">Loading & starting tour...</div>}
                  </button>

                  <button
                    onClick={() => handleLoadSample('romcom')}
                    disabled={loadingSample !== null}
                    className="p-3.5 rounded-xl bg-base border border-subtle hover:border-terracotta/50 hover:bg-terracotta/5 transition-all group disabled:opacity-50"
                  >
                    <div className="p-2 w-fit rounded-lg bg-terracotta/10 text-terracotta mb-1.5 group-hover:scale-110 transition-transform">
                      <Coffee size={20} />
                    </div>
                    <div className="font-bold text-xs text-primary group-hover:text-terracotta">Romance</div>
                    <div className="text-[10px] text-ghost mt-0.5">Flatmate romance novel with Mumbai setting</div>
                    {loadingSample === 'romcom' && <div className="text-[10px] text-terracotta animate-pulse mt-1 font-bold">Loading & starting tour...</div>}
                  </button>

                  <button
                    onClick={() => handleLoadSample('scifi')}
                    disabled={loadingSample !== null}
                    className="p-3.5 rounded-xl bg-base border border-subtle hover:border-terracotta/50 hover:bg-terracotta/5 transition-all group disabled:opacity-50"
                  >
                    <div className="p-2 w-fit rounded-lg bg-terracotta/10 text-terracotta mb-1.5 group-hover:scale-110 transition-transform">
                      <Rocket size={20} />
                    </div>
                    <div className="font-bold text-xs text-primary group-hover:text-terracotta">Sci-Fi Mystery</div>
                    <div className="text-[10px] text-ghost mt-0.5">Generation ship investigation & tech codex</div>
                    {loadingSample === 'scifi' && <div className="text-[10px] text-terracotta animate-pulse mt-1 font-bold">Loading & starting tour...</div>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM CONTROLS & NAVIGATION */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-subtle mt-4 sm:mt-6 shrink-0">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="gap-1.5 text-xs py-1.5 px-3"
            >
              <ArrowLeft size={15} /> Back
            </Button>

            <div className="flex items-center gap-2 sm:gap-3">
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="gap-1.5 text-xs py-1.5 px-3">
                  Next Step <ArrowRight size={15} />
                </Button>
              ) : (
                <Button onClick={handleClose} variant="ghost" className="gap-1.5 text-xs py-1.5 px-3">
                  Close & Explore <CheckCircle2 size={15} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
