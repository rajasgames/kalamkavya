import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input, Textarea, Select, Label, Card } from '@/components/ui';
import { ProgressRing } from '@/pages/Dashboard/ProgressRing';
import { db } from '@/lib/db/database';
import { useStoryStore } from '@/stores/storyStore';
import { useUIStore } from '@/stores/uiStore';
import { Minus, Plus, ChevronRight, ChevronLeft, Sparkles, PenTool, Sun, Rocket, Heart } from 'lucide-react';
import { loadVedicSampleData } from '@/lib/vedicSampleData';
import { loadRomComSampleData } from '@/lib/sampleData/romComSampleData';
import { loadScifiSampleData } from '@/lib/sampleData/scifiSampleData';
import { GENRE_MODULE_LIST } from '@/lib/genres/genreRegistry';

const GENRE_OPTIONS = GENRE_MODULE_LIST.map(mod => ({
  value: mod.id,
  label: mod.label
}));

export function ProjectCreationModal() {
  const { openModal, setOpenModal } = useUIStore();
  const { setActiveProject } = useStoryStore();
  const navigate = useNavigate();
  
  const isOpen = openModal === 'project-creation';
  const onClose = () => setOpenModal(null);

  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<'blank' | 'vedic' | 'romcom' | 'scifi'>('vedic');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('action');
  const [premise, setPremise] = useState('');
  const [targetWordCount, setTargetWordCount] = useState(50000);
  const [isInitializing, setIsInitializing] = useState(false);

  // Transitions
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = async () => {
    if (step === 1 && template !== 'blank') {
      setIsInitializing(true);
      try {
        if (template === 'vedic') {
          await loadVedicSampleData(true);
        } else if (template === 'romcom') {
          const newProjectId = await loadRomComSampleData();
          await useStoryStore.getState().setActiveProject(newProjectId);
        } else if (template === 'scifi') {
          const newProjectId = await loadScifiSampleData();
          await useStoryStore.getState().setActiveProject(newProjectId);
        }
        onClose();
        navigate('/world-bible');
        resetState();
      } catch (error) {
        console.error('Failed to load template:', error);
      } finally {
        setIsInitializing(false);
      }
      return;
    }

    if (step < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const resetState = () => {
    setTimeout(() => {
      setStep(1);
      setTemplate('vedic');
      setTitle('');
      setGenre('action');
      setPremise('');
      setTargetWordCount(50000);
    }, 300);
  };

  const handleInitialize = async () => {
    const newProject = {
      id: crypto.randomUUID(),
      title,
      genre,
      premise,
      targetWordCount,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.projects.add(newProject);
    setActiveProject(newProject.id);
    onClose();
    navigate('/manuscript/editor');
    
    resetState();
  };

  const isStep2Valid = title.trim().length > 0 && title.length <= 80;
  const isStep3Valid = premise.length <= 500;

  const contentClass = `transition-all duration-150 ease-in-out ${
    isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
  }`;

  // If a prebuilt template is selected, step 1 loads it immediately
  const totalSteps = template === 'blank' ? 4 : 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Universe" size="md">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const s = i + 1;
          return (
            <div 
              key={s} 
              className={`h-2 w-2 rounded-full transition-colors ${
                s === step ? 'bg-amber-from' : 'bg-border-subtle'
              }`}
            />
          );
        })}
      </div>

      <div className="min-h-[320px] flex flex-col overflow-hidden px-1">
        {step === 1 && (
          <div className={`flex flex-col gap-4 flex-1 ${contentClass}`}>
            <Label className="block mb-2 text-center text-lg font-serif">Choose a Universe Starter Template</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card 
                hoverable 
                className={`p-3.5 cursor-pointer text-center flex flex-col items-center gap-1.5 transition-all ${template === 'vedic' ? 'border-amber-from bg-amber-from/5 shadow-[0_0_15px_rgba(212,153,90,0.15)]' : 'border-subtle'}`}
                onClick={() => setTemplate('vedic')}
              >
                <Sun size={26} className={template === 'vedic' ? 'text-amber-from' : 'text-ghost'} />
                <span className="font-bold text-xs text-primary">Vedic Cosmology</span>
                <span className="text-[10px] text-secondary">Complete epic Puranic realms & astras.</span>
              </Card>

              <Card 
                hoverable 
                className={`p-3.5 cursor-pointer text-center flex flex-col items-center gap-1.5 transition-all ${template === 'romcom' ? 'border-amber-from bg-amber-from/5 shadow-[0_0_15px_rgba(212,153,90,0.15)]' : 'border-subtle'}`}
                onClick={() => setTemplate('romcom')}
              >
                <Heart size={26} className={template === 'romcom' ? 'text-amber-from' : 'text-ghost'} />
                <span className="font-bold text-xs text-primary">Rom-Com Universe</span>
                <span className="text-[10px] text-secondary">Contemporary romance beats & character tropes.</span>
              </Card>

              <Card 
                hoverable 
                className={`p-3.5 cursor-pointer text-center flex flex-col items-center gap-1.5 transition-all ${template === 'scifi' ? 'border-amber-from bg-amber-from/5 shadow-[0_0_15px_rgba(212,153,90,0.15)]' : 'border-subtle'}`}
                onClick={() => setTemplate('scifi')}
              >
                <Rocket size={26} className={template === 'scifi' ? 'text-amber-from' : 'text-ghost'} />
                <span className="font-bold text-xs text-primary">Sci-Fi Colony Ship</span>
                <span className="text-[10px] text-secondary">Colony ship factions, AI logs & mysteries.</span>
              </Card>

              <Card 
                hoverable 
                className={`p-3.5 cursor-pointer text-center flex flex-col items-center gap-1.5 transition-all ${template === 'blank' ? 'border-amber-from bg-amber-from/5 shadow-[0_0_15px_rgba(212,153,90,0.15)]' : 'border-subtle'}`}
                onClick={() => setTemplate('blank')}
              >
                <PenTool size={26} className={template === 'blank' ? 'text-amber-from' : 'text-ghost'} />
                <span className="font-bold text-xs text-primary">Blank Universe</span>
                <span className="text-[10px] text-secondary">Custom project setup from scratch.</span>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`flex flex-col gap-6 flex-1 ${contentClass}`}>
            <div>
              <Label htmlFor="project-title" className="mb-2 block">Project Name *</Label>
              <Input 
                id="project-title"
                placeholder="e.g. The Stormlight Archive" 
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                className="w-full"
                autoFocus
              />
              <div className="text-right text-xs text-ghost mt-1">{title.length} / 80</div>
            </div>

            <div>
              <Label htmlFor="project-genre" className="mb-2 block">Genre</Label>
              <Select 
                value={genre} 
                onValueChange={(val) => setGenre(val)}
                options={GENRE_OPTIONS}
                className="w-full"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`flex flex-col gap-4 flex-1 ${contentClass}`}>
            <div>
              <Label htmlFor="project-premise" className="mb-2 block">Story Premise</Label>
              <Textarea 
                id="project-premise"
                placeholder="A brief logline or core concept of your universe..." 
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                rows={6}
                className="w-full resize-none"
              />
              <div className={`text-right text-xs mt-1 ${premise.length > 500 ? 'text-destructive-from' : 'text-ghost'}`}>
                {premise.length} / 500
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={`flex flex-col items-center justify-center flex-1 gap-6 ${contentClass}`}>
            <Label className="block mb-2 text-center">Manuscript Goal</Label>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setTargetWordCount(Math.max(5000, targetWordCount - 5000))}
                className="h-12 w-12 rounded-full p-0 flex items-center justify-center"
              >
                <Minus size={20} />
              </Button>
              
              <div className="text-3xl font-serif font-bold text-primary w-32 text-center">
                {targetWordCount.toLocaleString()}
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => setTargetWordCount(Math.min(500000, targetWordCount + 5000))}
                className="h-12 w-12 rounded-full p-0 flex items-center justify-center"
              >
                <Plus size={20} />
              </Button>
            </div>
            
            <div className="mt-4 flex flex-col items-center">
              <ProgressRing currentWordCount={0} targetWordCount={targetWordCount} size={140} strokeWidth={8} />
              <span className="text-secondary mt-4 text-sm">0 / {targetWordCount.toLocaleString()} words</span>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-subtle flex justify-between items-center shrink-0">
          {step > 1 ? (
            <Button variant="ghost" onClick={handlePrev} className="gap-2">
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <div /> // Spacer
          )}
          
          {step < totalSteps ? (
            <Button 
              onClick={handleNext} 
              disabled={
                (step === 2 && !isStep2Valid) || 
                (step === 3 && !isStep3Valid)
              } 
              className="gap-2 bg-surface hover:bg-elevated border-subtle text-primary"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              onClick={template !== 'blank' ? handleNext : handleInitialize} 
              disabled={isInitializing}
              className="gap-2 bg-amber-from hover:bg-amber-to text-white border-transparent font-bold"
            >
              {isInitializing ? 'Loading Template...' : template !== 'blank' ? 'Load Starter Template' : 'Initialize Universe'}
              {!isInitializing && <Sparkles size={16} />}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
