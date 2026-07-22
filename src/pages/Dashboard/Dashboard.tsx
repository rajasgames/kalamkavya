import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Sparkles, PlusCircle, Trash2, Timer, BookOpen, HelpCircle, Sun, Coffee, Rocket } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { loadVedicSampleData } from '@/lib/vedicSampleData';
import { loadRomComSampleData } from '@/lib/sampleData/romComSampleData';
import { loadScifiSampleData } from '@/lib/sampleData/scifiSampleData';
import { Scene, Project } from '@/types';
import { Card, Button } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { ProgressRing } from './ProgressRing';
import { ActivityHeatmap } from './ActivityHeatmap';
import { NewProjectModal } from '@/components/shared';
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

  const handleNewProjectCreated = async (_projectId: string) => {
    const projects = await db.projects.toArray();
    setAllProjects(projects);
    navigate('/world-bible');
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
    if (!modules || modules.length === 0) return project.genre || 'Vedic';
    const named = modules
      .filter(m => m !== 'universal')
      .map(m => GENRE_MODULE_LIST.find(mod => mod.id === m)?.shortLabel ?? m);
    if (named.length === 0) return 'Universal';
    return named.join(' + ');
  };

  const sampleOptions = [
    { key: 'vedic' as SampleKey, Icon: Sun, label: 'Vedic & Puranic', desc: 'Epic mythology — gods, realms, and cosmic war' },
    { key: 'romcom' as SampleKey, Icon: Coffee, label: 'Contemporary', desc: '"The Accidental Flatmates" — Mumbai rom-com' },
    { key: 'scifi' as SampleKey, Icon: Rocket, label: 'Sci-Fi', desc: '"The Silence Between Stars" — generation ship mystery' },
  ];

  return (
    <div className="p-4 sm:p-8 md:p-12 h-full flex flex-col overflow-y-auto max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
        <h1 className="text-xl sm:text-2xl font-serif italic text-primary">{getGreeting()}</h1>
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
        <Card className="p-8 text-center flex flex-col items-center mb-12 bg-surface shadow-soft border-subtle">
          <div className="text-terracotta/20 mb-6 drop-shadow-sm">
            <PenTool size={64} strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Start Your Story</h2>
          <p className="text-secondary mb-8 max-w-lg">
            InkwellPro works for any genre — from Vedic epics to rom-coms to sci-fi mysteries.
            Create a new project or jump in with a sample world.
          </p>

          <Button onClick={() => setIsNewProjectOpen(true)} className="gap-2 mb-8">
            <PlusCircle size={18} />
            New Project
          </Button>

          <div className="w-full border-t border-subtle pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ghost mb-4 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Or explore a sample world
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {sampleOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleLoadSample(opt.key)}
                  disabled={loadingSample !== null}
                  className="flex flex-col items-start gap-1.5 p-4 bg-canvas border border-subtle rounded-xl hover:border-terracotta/30 shadow-soft hover:shadow-hover hover:-translate-y-[2px] transition-all text-left disabled:opacity-50 group"
                >
                  <div className="p-2 rounded-lg bg-terracotta/10 text-terracotta mb-1 group-hover:scale-110 transition-transform">
                    <opt.Icon size={22} />
                  </div>
                  <span className="font-bold text-sm text-primary">{opt.label}</span>
                  <span className="text-[11px] text-ghost leading-snug">{opt.desc}</span>
                  {loadingSample === opt.key && (
                    <span className="text-[10px] text-terracotta font-bold uppercase tracking-wider animate-pulse mt-0.5">Loading…</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="col-span-1 lg:col-span-2 p-8 flex flex-col justify-center bg-surface shadow-soft border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 rounded-full px-2.5 py-0.5">
                {getGenreLabel(activeProject)}
              </span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-2">{activeProject.title}</h2>
            <p className="text-secondary mb-8">{activeProject.premise}</p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="gap-2" onClick={() => setIsNewProjectOpen(true)}>
                <PlusCircle size={18} />
                New Project
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => navigate('/toolkit/ai')}>
                <Sparkles size={18} />
                Generate Lore
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => useUIStore.getState().setSprintWidgetOpen(true)}>
                <Timer size={18} />
                Word Sprint
              </Button>
            </div>
          </Card>

          <Card className="col-span-1 p-8 flex flex-col items-center justify-center text-center shadow-soft border-subtle">
            <h3 className="text-sm font-bold tracking-wider text-ghost uppercase mb-6">Manuscript Progress</h3>
            <ProgressRing currentWordCount={totalWordCount} targetWordCount={activeProject.targetWordCount || 50000} size={140} strokeWidth={10} />
            <div className="mt-6 text-sm text-secondary">
              <span className="font-medium text-primary">{totalWordCount.toLocaleString()}</span> / {activeProject.targetWordCount?.toLocaleString() || '50,000'} words
            </div>
          </Card>
        </div>
      )}

      {/* Activity Heatmap */}
      {activeProject && (
        <div className="mb-12">
          <ActivityHeatmap />
        </div>
      )}

      {/* Your Projects Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold text-primary">Your Projects</h3>
          <Button variant="ghost" className="gap-2" onClick={() => setIsNewProjectOpen(true)}>
            <PlusCircle size={16} />
            New
          </Button>
        </div>
        
        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map(project => {
              const isActive = activeProject?.id === project.id;
              return (
                <Card 
                  key={project.id} 
                  className={`p-6 flex flex-col transition-all duration-300 shadow-soft hover:shadow-hover hover:-translate-y-0.5 bg-canvas ${isActive ? 'border-terracotta bg-surface' : 'border-subtle hover:border-terracotta/30'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-lg font-bold text-primary">{project.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sage bg-sage/10 rounded-full px-2 py-0.5 w-fit">
                        {getGenreLabel(project)}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/10 px-2 py-1 rounded-full shrink-0 ml-2">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-secondary mb-6 line-clamp-3 flex-1 mt-2">{project.premise}</p>
                  <div className="flex gap-3 mt-auto">
                    <Button 
                      className="flex-1" 
                      variant={isActive ? 'ghost' : 'primary'}
                      disabled={isActive}
                      onClick={() => useStoryStore.getState().setActiveProject(project.id)}
                    >
                      {isActive ? 'Current Project' : 'Open Project'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-500 px-3" 
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) {
                          await useStoryStore.getState().deleteProject(project.id);
                          setAllProjects(prev => prev.filter(p => p.id !== project.id));
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-secondary border border-dashed border-subtle rounded-xl">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p>No projects yet. Create one above or load a sample world.</p>
          </div>
        )}
      </div>

      {/* Quick Resume */}
      {activeProject && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-primary">Quick Resume</h3>
          </div>
          
          {recentScenes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {recentScenes.map(scene => (
                <Card key={scene.id} hoverable className="p-5 flex flex-col cursor-pointer bg-canvas shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300" onClick={() => navigate('/manuscript/editor')}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-sage bg-sage/10 px-2.5 py-0.5 rounded-full">
                      {scene.wordCount} words
                    </span>
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
            <div className="py-12 mb-12 text-center text-secondary border border-dashed border-subtle rounded-xl">
              <p>No scenes written yet. Head to the Manuscript to begin.</p>
            </div>
          )}
        </>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreated={handleNewProjectCreated}
      />
    </div>
  );
}
