import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Sparkles, PlusCircle, Trash2, Timer, BookOpen, HelpCircle, Sun, Coffee, Rocket, ArrowRight } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { loadVedicSampleData } from '@/lib/vedicSampleData';
import { loadRomComSampleData } from '@/lib/sampleData/romComSampleData';
import { loadScifiSampleData } from '@/lib/sampleData/scifiSampleData';
import { Scene, Project } from '@/types';
import { Card, Button, Badge } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { ProgressRing } from './ProgressRing';
import { ActivityHeatmap } from './ActivityHeatmap';
import { NewProjectModal, DeleteProjectModal } from '@/components/shared';
import { GENRE_MODULE_LIST } from '@/lib/genres/genreRegistry';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, Writer.';
  if (hour < 17) return 'Good afternoon, Writer.';
  return 'Good evening, Writer.';
};

const getRelativeTime = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysDifference === 0) {
    const hours = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.round((timestamp - Date.now()) / (1000 * 60));
      return rtf.format(minutes, 'minute');
    }
    return rtf.format(hours, 'hour');
  }
  return rtf.format(daysDifference, 'day');
};

type SampleKey = 'vedic' | 'romcom' | 'scifi';

export function Dashboard() {
  const { activeProject, setActiveProject } = useStoryStore();
  const navigate = useNavigate();
  const [recentScenes, setRecentScenes] = useState<(Scene & { chapterTitle: string })[]>([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [loadingSample, setLoadingSample] = useState<SampleKey | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Fetch all projects regardless of activeProject
  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await db.projects.toArray();
      setAllProjects(projects);
    };
    fetchProjects();
  }, [activeProject]);

  const handleLoadSample = async (key: SampleKey) => {
    setLoadingSample(key);
    try {
      let projectId: string;
      if (key === 'vedic') {
        await loadVedicSampleData();
        const projects = await db.projects.toArray();
        projectId = projects[projects.length - 1]?.id ?? '';
      } else if (key === 'romcom') {
        projectId = await loadRomComSampleData();
      } else {
        projectId = await loadScifiSampleData();
      }
      const projects = await db.projects.toArray();
      setAllProjects(projects);
      if (projectId) {
        await setActiveProject(projectId);
        navigate('/world-bible');
      }
    } catch (error) {
      console.error('Failed to load sample data:', error);
    } finally {
      setLoadingSample(null);
    }
  };

  const handleNewProjectCreated = async () => {
    const projects = await db.projects.toArray();
    setAllProjects(projects);
    navigate('/world-bible');
  };

  const handleConfirmDelete = async (projectId: string) => {
    await useStoryStore.getState().deleteProject(projectId);
    setAllProjects(prev => prev.filter(p => p.id !== projectId));
  };

  useEffect(() => {
    async function loadDashboardData() {
      if (!activeProject) {
        setRecentScenes([]);
        setTotalWordCount(0);
        return;
      }

      const scenes = await db.scenes
        .where('projectId')
        .equals(activeProject.id)
        .toArray();

      // Compute total word count
      const count = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
      setTotalWordCount(count);

      // Sort in memory since updatedAt is not indexed
      scenes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      const topScenes = scenes.slice(0, 4);

      // Fetch chapter titles
      const enrichedScenes = await Promise.all(
        topScenes.map(async (scene) => {
          let chapterTitle = 'Unassigned';
          if (scene.chapterId) {
            const chapter = await db.chapters.get(scene.chapterId);
            if (chapter) chapterTitle = chapter.title;
          }
          return { ...scene, chapterTitle };
        })
      );

      setRecentScenes(enrichedScenes);
    }

    loadDashboardData();
  }, [activeProject]);

  /** Resolve the genre display label for a project */
  const getGenreLabel = (project: Project): string => {
    const modules = project.genreModules;
    if (!modules || modules.length === 0) return project.genre || 'Universal';
    const named = modules
      .filter(m => m !== 'universal')
      .map(m => GENRE_MODULE_LIST.find(mod => mod.id === m)?.shortLabel ?? m);
    if (named.length === 0) return 'Universal';
    return named.join(' + ');
  };

  const sampleOptions = [
    { key: 'vedic' as SampleKey, Icon: Sun, label: 'Fantasy Epic', desc: 'Epic mythology — gods, realms, and cosmic war' },
    { key: 'romcom' as SampleKey, Icon: Coffee, label: 'Romance', desc: '"The Accidental Flatmates" — Mumbai romance' },
    { key: 'scifi' as SampleKey, Icon: Rocket, label: 'Sci-Fi', desc: '"The Silence Between Stars" — generation ship mystery' },
  ];

  return (
    <div className="p-4 sm:p-8 md:p-12 h-full flex flex-col overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
        {/* We moved the greeting into the main hero block when there's no project */}
        {activeProject ? (
          <h1 className="text-xl sm:text-2xl font-serif italic text-primary">{getGreeting()}</h1>
        ) : (
          <div></div>
        )}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => useUIStore.getState().setOnboardingOpen(true)}
            className="gap-2 text-xs font-semibold text-secondary hover:text-primary bg-surface hover:bg-deep border border-subtle transition-colors shadow-soft"
          >
            <HelpCircle size={15} />
            User Guide & Tour
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      {!activeProject ? (
        <div className="text-center flex flex-col items-center mb-16 pt-8">
          <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-4">{getGreeting()}</h2>
          <p className="text-secondary mb-8 max-w-lg text-lg">
            कalam काvya works for any genre — from fantasy epics to romance to sci-fi mysteries.
            Create a new project or jump in with a sample world.
          </p>

          <Button onClick={() => setIsNewProjectOpen(true)} className="gap-2 mb-12 bg-terracotta text-white hover:bg-terracotta/90 px-6 py-5 text-base rounded-xl font-semibold shadow-soft">
            <PlusCircle size={20} />
            New Project
          </Button>

          <div className="w-full max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-ghost mb-5 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Or explore a sample world
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {sampleOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleLoadSample(opt.key)}
                  disabled={loadingSample !== null}
                  className="flex flex-col items-start gap-2 p-5 bg-surface border border-subtle rounded-xl glass-card-hover text-left disabled:opacity-50 group hover:border-terracotta transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-terracotta/10 text-terracotta mb-1 group-hover:scale-110 transition-transform">
                    <opt.Icon size={24} />
                  </div>
                  <span className="font-bold text-base text-primary">{opt.label}</span>
                  <span className="text-sm text-[#A1A1AA] leading-relaxed">{opt.desc}</span>
                  {loadingSample === opt.key && (
                    <span className="text-xs text-terracotta font-bold uppercase tracking-wider animate-pulse mt-1">Loading…</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ── Active project hero — condensed: text-2xl, p-6, tighter premise margin ──
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2 p-6 flex flex-col justify-center bg-surface border border-subtle glass-card-hover">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="sage" caps>{getGenreLabel(activeProject)}</Badge>
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">{activeProject.title}</h2>
            <p className="text-secondary mb-5 line-clamp-2">{activeProject.premise}</p>
            
            <div className="flex flex-wrap gap-3">
              <Button className="gap-2 btn btn-primary" onClick={() => navigate('/manuscript/editor')}>
                <PenTool size={16} />
                Continue Writing
              </Button>
              <Button variant="ghost" className="gap-2 btn btn-ghost" onClick={() => navigate('/toolkit/ai-assistant')}>
                <Sparkles size={16} />
                Generate Lore
              </Button>
              <Button variant="ghost" className="gap-2 btn btn-ghost" onClick={() => useUIStore.getState().setSprintWidgetOpen(true)}>
                <Timer size={16} />
                Word Sprint
              </Button>
            </div>
          </Card>

          {/* Progress Ring — condensed to match hero density */}
          <Card className="col-span-1 p-6 flex flex-col items-center justify-center text-center bg-surface border border-subtle glass-card-hover">
            <h3 className="text-xs font-bold tracking-wider text-ghost uppercase mb-4">Manuscript Progress</h3>
            <ProgressRing currentWordCount={totalWordCount} targetWordCount={activeProject.targetWordCount || 50000} size={130} strokeWidth={9} />
            <div className="mt-4 text-sm text-secondary">
              <span className="font-semibold text-primary">{totalWordCount.toLocaleString()}</span>
              {' / '}{(activeProject.targetWordCount || 50000).toLocaleString()} words
            </div>
            {/* Percentage complete micro-stat */}
            <div className="mt-1 text-xs text-ghost">
              {Math.min(100, Math.round((totalWordCount / (activeProject.targetWordCount || 50000)) * 100))}% complete
            </div>
          </Card>
        </div>
      )}

      {/* Quick Resume — directly below hero */}
      {activeProject && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-primary">Quick Resume</h3>
            {recentScenes.length > 0 && (
              <button 
                onClick={() => navigate('/manuscript/editor')}
                className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
              >
                Go to Editor <ArrowRight size={13} />
              </button>
            )}
          </div>
          
          {recentScenes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentScenes.map(scene => (
                <Card 
                  key={scene.id} 
                  hoverable 
                  className="p-5 flex flex-col cursor-pointer bg-canvas border border-subtle rounded-xl glass-card-hover"
                  onClick={() => navigate('/manuscript/editor')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="sage">{scene.wordCount} words</Badge>
                    <span className="text-xs text-ghost">{getRelativeTime(scene.updatedAt || Date.now())}</span>
                  </div>
                  <h4 className="text-primary font-bold mb-1">{scene.title}</h4>
                  <span className="text-xs text-secondary mb-3">{scene.chapterTitle}</span>
                  
                  <div className="mt-auto pt-3 border-t border-subtle">
                    <p className="text-sm text-secondary line-clamp-2">
                      {scene.content.replace(/<[^>]+>/g, '') || 'Empty scene...'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-secondary border border-dashed border-subtle rounded-xl">
              <p className="text-sm">No scenes written yet. Head to the Manuscript to begin.</p>
            </div>
          )}
        </div>
      )}

      {/* Your Projects — above heatmap: switching projects is more actionable than reviewing history */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-serif font-bold text-primary">Your Projects</h3>
          <Button variant="ghost" className="gap-2" onClick={() => setIsNewProjectOpen(true)}>
            <PlusCircle size={16} />
            New
          </Button>
        </div>
        
        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allProjects.map(project => {
              const isActive = activeProject?.id === project.id;
              return (
                <Card 
                  key={project.id} 
                  className={`p-6 flex flex-col shadow-soft glass-card-hover bg-canvas rounded-xl border ${isActive ? 'border-terracotta bg-surface' : 'border-subtle hover:border-terracotta/30'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-base font-bold text-primary">{project.title}</h4>
                      <Badge variant="sage" caps>{getGenreLabel(project)}</Badge>
                    </div>
                    {isActive && (
                      <Badge variant="terracotta" caps className="shrink-0 ml-2">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary mb-5 line-clamp-2 flex-1 mt-2">{project.premise}</p>
                  <div className="flex gap-3 mt-auto">
                    <Button 
                      className="flex-1" 
                      variant={isActive ? 'primary' : 'ghost'}
                      onClick={async () => {
                        if (!isActive) {
                          await useStoryStore.getState().setActiveProject(project.id);
                        }
                        navigate('/manuscript/editor');
                      }}
                    >
                      {isActive ? 'Go to Manuscript' : 'Open Project'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-500 px-3" 
                      onClick={() => setProjectToDelete(project)}
                      title="Delete project"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-ghost border-2 border-dashed border-subtle rounded-2xl flex flex-col items-center justify-center bg-surface/50">
            <BookOpen size={48} className="mb-4 opacity-30 text-primary" strokeWidth={1} />
            <p className="text-base text-secondary font-medium">No projects yet. Create your first manuscript.</p>
          </div>
        )}
      </div>

      {/* Activity Heatmap — at the bottom: a reward/motivation widget, not a navigation step */}
      {activeProject && (
        <div className="mb-10">
          <ActivityHeatmap />
        </div>
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreated={handleNewProjectCreated}
      />

      <DeleteProjectModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        project={projectToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
