import { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  PenTool, 
  Settings, 
  BookOpen, 
  Users, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

interface TourStepDef {
  id: string;
  targetId: string;
  mobileTargetId?: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badgeText: string;
}

const TOUR_STEPS: TourStepDef[] = [
  {
    id: 'header-brand',
    targetId: 'header-brand',
    title: 'kalam kavya Engine',
    subtitle: 'Command Center',
    description: 'Welcome to your workspace header. Click here anytime to return to your main Dashboard, view total word count, or switch themes.',
    icon: Compass,
    badgeText: 'Step 1 of 8'
  },
  {
    id: 'pillar-home',
    targetId: 'pillar-home',
    mobileTargetId: 'mobile-pillar-home',
    title: 'Home Dashboard',
    subtitle: 'Writer Cockpit',
    description: 'Your central hub. View active project stats, writing streak heatmaps, manuscript progress rings, and quick-resume your recent scenes.',
    icon: Home,
    badgeText: 'Step 2 of 8'
  },
  {
    id: 'pillar-manuscript',
    targetId: 'pillar-manuscript',
    mobileTargetId: 'mobile-pillar-manuscript',
    title: 'Manuscript Studio',
    subtitle: 'Prose & Planning',
    description: 'Write distraction-free prose in the Editor, organize scene index cards on the Kanban Planner, or inspect your chapter tree Outline.',
    icon: PenTool,
    badgeText: 'Step 3 of 8'
  },
  {
    id: 'pillar-project',
    targetId: 'pillar-project',
    mobileTargetId: 'mobile-pillar-project',
    title: 'Project Settings',
    subtitle: 'Core & Schemas',
    description: 'Configure novel title, premise, word count targets, and attach active Genre Modules (Fantasy, Sci-Fi, Romance) or narrative templates.',
    icon: Settings,
    badgeText: 'Step 4 of 8'
  },
  {
    id: 'pillar-worldbible',
    targetId: 'pillar-worldbible',
    mobileTargetId: 'mobile-pillar-worldbible',
    title: 'World Bible & Codex',
    subtitle: 'Encyclopedia',
    description: 'Organize locations, factions, magic systems, artifacts, and cultures into cross-linked entities with dynamic custom fields.',
    icon: BookOpen,
    badgeText: 'Step 5 of 8'
  },
  {
    id: 'pillar-cast',
    targetId: 'pillar-cast',
    mobileTargetId: 'mobile-pillar-cast',
    title: 'Cast Studio',
    subtitle: 'Character Engine',
    description: 'Build character dossiers, map dynamic relationship networks, define dialogue voice profiles, and generate AI art prompts.',
    icon: Users,
    badgeText: 'Step 6 of 8'
  },
  {
    id: 'pillar-toolkit',
    targetId: 'pillar-toolkit',
    mobileTargetId: 'mobile-pillar-toolkit',
    title: "Author's Toolkit",
    subtitle: 'Utilities & Export',
    description: 'Launch timed Word Sprints, explore the Concepts Lab for story ideas, view writing analytics, or export to EPUB, PDF, and DOCX.',
    icon: Wrench,
    badgeText: 'Step 7 of 8'
  },
  {
    id: 'ai-assistant',
    targetId: 'ai-assistant',
    mobileTargetId: 'mobile-pillar-toolkit',
    title: 'AI Co-Pilot',
    subtitle: 'Local & Cloud AI',
    description: 'Your context-aware writing partner. Trigger side-drawer suggestions to brainstorm scene twists, expand prose, or critique dialogue.',
    icon: Sparkles,
    badgeText: 'Step 8 of 8'
  }
];

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function GuidedTour() {
  const { isTourActive, setTourActive, tourStep, setTourStep } = useUIStore();
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const currentStepIndex = Math.max(0, Math.min(tourStep - 1, TOUR_STEPS.length - 1));
  const currentStep = TOUR_STEPS[currentStepIndex];

  // Update element rect on step or window resize
  useLayoutEffect(() => {
    if (!isTourActive) return;

    const updatePosition = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const isMobile = window.innerWidth < 768;
      const targetId = (isMobile && currentStep.mobileTargetId) ? currentStep.mobileTargetId : currentStep.targetId;
      const element = document.querySelector(`[data-tour-id="${targetId}"]`);

      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        // Fallback to center screen if element not found
        setTargetRect(null);
      }
    };

    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isTourActive, tourStep, currentStep]);

  if (!isTourActive) return null;

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length) {
      setTourStep(tourStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('kalam-kavya_tour_completed', 'true');
    setTourActive(false);
    setTourStep(1);
  };

  const isMobile = windowSize.width < 768;
  const StepIcon = currentStep.icon;

  // Calculate tooltip card coordinates
  let tooltipTop = windowSize.height / 2 - 120;
  let tooltipLeft = windowSize.width / 2 - 160;
  let arrowDirection: 'left' | 'top' | 'bottom' | 'none' = 'none';

  if (targetRect) {
    const padding = 8;
    if (!isMobile) {
      // Desktop: place tooltip to the right of sidebar icons or below header
      if (currentStep.targetId === 'header-brand') {
        tooltipTop = targetRect.top + targetRect.height + 16;
        tooltipLeft = Math.max(16, targetRect.left + 16);
        arrowDirection = 'top';
      } else {
        tooltipTop = Math.min(windowSize.height - 300, Math.max(16, targetRect.top - 20));
        tooltipLeft = targetRect.left + targetRect.width + padding + 16;
        arrowDirection = 'left';
      }
    } else {
      // Mobile: place tooltip above bottom bar or below header
      if (currentStep.targetId === 'header-brand') {
        tooltipTop = targetRect.top + targetRect.height + 16;
        tooltipLeft = Math.max(16, Math.min(windowSize.width - 340, targetRect.left));
        arrowDirection = 'top';
      } else {
        tooltipTop = Math.max(16, targetRect.top - 260);
        tooltipLeft = Math.max(16, Math.min(windowSize.width - 340, targetRect.left - 120));
        arrowDirection = 'bottom';
      }
    }
  }

  const spotlightPadding = 6;
  const spotX = targetRect ? targetRect.left - spotlightPadding : windowSize.width / 2 - 40;
  const spotY = targetRect ? targetRect.top - spotlightPadding : windowSize.height / 2 - 40;
  const spotW = targetRect ? targetRect.width + spotlightPadding * 2 : 80;
  const spotH = targetRect ? targetRect.height + spotlightPadding * 2 : 80;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto font-sans overflow-hidden">
      {/* SVG Mask Overlay for Spotlight Cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White covers entire screen (opaque overlay) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout creates transparent hole for highlighted element */}
            <rect
              x={spotX}
              y={spotY}
              width={spotW}
              height={spotH}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>

        {/* Dark backdrop with hole cutout */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#tour-spotlight-mask)"
        />

        {/* Glowing Amber Ring around spotlight cutout */}
        <rect
          x={spotX}
          y={spotY}
          width={spotW}
          height={spotH}
          rx="12"
          fill="none"
          stroke="var(--terracotta)"
          strokeWidth="2.5"
          className="animate-pulse"
        />
      </svg>

      {/* SVG Animated Arrow pointing to target */}
      {targetRect && (
        <motion.div
          key={`arrow-${currentStep.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-[10001] pointer-events-none"
          style={{
            top: arrowDirection === 'left' ? targetRect.top + targetRect.height / 2 - 16 :
                 arrowDirection === 'top' ? targetRect.top + targetRect.height + 6 :
                 targetRect.top - 36,
            left: arrowDirection === 'left' ? targetRect.left + targetRect.width + 6 :
                  targetRect.left + targetRect.width / 2 - 16
          }}
        >
          <div className={`text-terracotta ${arrowDirection === 'left' ? 'animate-tour-arrow-horiz' : 'animate-tour-arrow-vert'}`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {arrowDirection === 'left' && <path d="M19 12H5M12 19l-7-7 7-7" />}
              {arrowDirection === 'top' && <path d="M12 19V5M5 12l7-7 7 7" />}
              {arrowDirection === 'bottom' && <path d="M12 5v14M5 12l7 7 7-7" />}
            </svg>
          </div>
        </motion.div>
      )}

      {/* Floating Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute z-[10002] w-[calc(100vw-32px)] max-w-[340px] sm:max-w-[380px] bg-surface border border-terracotta/40 rounded-2xl shadow-2xl p-5 backdrop-blur-xl"
          style={{
            top: tooltipTop,
            left: tooltipLeft
          }}
        >
          {/* Card Header & Badge */}
          <div className="flex items-center justify-between mb-3 border-b border-subtle pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-terracotta/15 text-terracotta border border-terracotta/30">
                <StepIcon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-primary flex items-center gap-1.5">
                  {currentStep.title}
                </h3>
                <span className="text-[10px] text-ghost font-mono uppercase tracking-wider">{currentStep.subtitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-terracotta/15 text-terracotta border border-terracotta/30 px-2 py-0.5 rounded-full">
                {currentStep.badgeText}
              </span>
              <button
                onClick={handleComplete}
                className="p-1 text-ghost hover:text-primary rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Skip tour"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body Text */}
          <p className="text-xs text-secondary leading-relaxed mb-4">
            {currentStep.description}
          </p>

          {/* Progress Indicators & Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-subtle">
            {/* Step Dots */}
            <div className="flex items-center gap-1">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTourStep(idx + 1)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    tourStep === idx + 1 
                      ? 'w-5 bg-terracotta' 
                      : tourStep > idx + 1
                      ? 'w-1.5 bg-terracotta/50'
                      : 'w-1.5 bg-subtle'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-2">
              {tourStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-2.5 py-1.5 rounded-xl border border-subtle text-xs font-semibold text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded-xl bg-terracotta text-white font-semibold text-xs hover:bg-terracotta/90 transition-all flex items-center gap-1 shadow-soft"
              >
                {tourStep === TOUR_STEPS.length ? (
                  <>
                    Finish <CheckCircle2 size={14} />
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
