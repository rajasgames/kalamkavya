import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  PenTool, 
  ShieldAlert, 
  ArrowRight,
  FileText,
  Search,
  Zap,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { Button, Card, Input } from '@/components/ui';
import { StructureTemplate, TEMPLATE_LIBRARY } from './templatesData';


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
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-base border border-subtle text-center text-xs">
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
