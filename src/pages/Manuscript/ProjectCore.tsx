import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  BookOpen, 
  Sparkles, 
  Save, 
  Check, 
  Layers, 
  Feather, 
  Target, 
  ShieldAlert, 
  Globe,
  Sun,
  Sword,
  Rocket,
  Coffee,
  Skull,
  Scroll,
  Search
} from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { GENRE_MODULE_LIST, SUB_GENRE_MAP, getCategoriesForGenre } from '@/lib/genres/genreRegistry';

export function ProjectCore() {
  const { activeProject, updateProject } = useStoryStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState(activeProject?.title || '');
  const [premise, setPremise] = useState(activeProject?.premise || '');
  const [targetWordCount, setTargetWordCount] = useState(activeProject?.targetWordCount || 50000);
  const [selectedGenre, setSelectedGenre] = useState(activeProject?.genreModules?.[0] || 'vedic');
  const [selectedSubGenre, setSelectedSubGenre] = useState(activeProject?.subGenre || '');
  const [tone, setTone] = useState(activeProject?.tone || 'Epic');
  const [pov, setPov] = useState(activeProject?.pov || 'Third Person Limited');
  const [theme, setTheme] = useState(activeProject?.theme || 'Fate vs. Free Will');
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.title);
      setPremise(activeProject.premise);
      setTargetWordCount(activeProject.targetWordCount || 50000);
      setSelectedGenre(activeProject.genreModules?.[0] || 'vedic');
      setSelectedSubGenre(activeProject.subGenre || '');
      setTone(activeProject.tone || 'Epic');
      setPov(activeProject.pov || 'Third Person Limited');
      setTheme(activeProject.theme || 'Fate vs. Free Will');
    }
  }, [activeProject]);

  // Available sub-genres for current selected main genre
  const availableSubGenres = SUB_GENRE_MAP[selectedGenre] || [];

  // Dynamically compute World Bible preview categories based on selected genre & sub-genre
  const previewCategories = getCategoriesForGenre([selectedGenre], selectedSubGenre);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const updated = {
      ...activeProject,
      title,
      premise,
      targetWordCount: Number(targetWordCount),
      genreModules: [selectedGenre],
      genre: GENRE_MODULE_LIST.find(m => m.id === selectedGenre)?.label || selectedGenre,
      subGenre: selectedSubGenre,
      tone,
      pov,
      theme,
      updatedAt: Date.now(),
    };

    await updateProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getGenreIcon = (genreId: string) => {
    switch (genreId) {
      case 'vedic': return <Sun className="text-amber-from" size={20} />;
      case 'fantasy': return <Sword className="text-emerald-500" size={20} />;
      case 'scifi': return <Rocket className="text-blue-500" size={20} />;
      case 'contemporary': return <Coffee className="text-amber-600" size={20} />;
      case 'horror': return <Skull className="text-red-500" size={20} />;
      case 'historical': return <Scroll className="text-yellow-600" size={20} />;
      case 'mystery': return <Search className="text-purple-500" size={20} />;
      default: return <Globe className="text-primary" size={20} />;
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
          Please select or create a project from the Dashboard to configure its core architecture, genre, and world building settings.
        </p>
        <Button onClick={() => navigate('/')} className="gap-2">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-from/15 text-amber-from border border-amber-from/30 shadow-md">
            <Sliders size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              Project Core & Narrative Architecture
              {savedSuccess && (
                <span className="text-xs font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check size={13} /> Saved & Applied!
                </span>
              )}
            </h1>
            <p className="text-xs text-secondary">
              Configure genre, sub-genre, world building schema, tone, and narrative targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/world-bible')} variant="ghost" className="gap-2 text-xs">
            <BookOpen size={16} /> Open World Bible
          </Button>
          <Button onClick={handleSave} className="gap-2 text-xs bg-amber-from text-black font-bold">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4 bg-surface border-subtle">
            <h3 className="text-base font-serif font-bold text-primary flex items-center gap-2 border-b border-subtle pb-3">
              <Feather size={18} className="text-amber-from" /> Core Story Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1">
                  Project Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Silence Between Stars"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1">
                  Core Logline & Premise
                </label>
                <Textarea
                  value={premise}
                  onChange={(e) => setPremise(e.target.value)}
                  placeholder="Summarize the central conflict, protagonist's goal, and narrative stakes..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1 flex items-center gap-1">
                    <Target size={13} /> Target Word Count
                  </label>
                  <Input
                    type="number"
                    value={targetWordCount}
                    onChange={(e) => setTargetWordCount(Number(e.target.value))}
                    min={1000}
                    step={5000}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1">
                    Central Theme / Motif
                  </label>
                  <Input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Destiny vs Free Will"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Genre & Sub-Genre Architecture Selection */}
          <Card className="p-6 space-y-6 bg-surface border-subtle">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <h3 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                <Layers size={18} className="text-amber-from" /> Genre & Sub-Genre Engine
              </h3>
              <span className="text-[11px] text-ghost">Drives World Bible Categories</span>
            </div>

            {/* Main Genre Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-2">
                Select Main Genre Module
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GENRE_MODULE_LIST.map((g) => {
                  const isSelected = selectedGenre === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => {
                        setSelectedGenre(g.id);
                        const subOpts = SUB_GENRE_MAP[g.id];
                        if (subOpts && subOpts.length > 0) {
                          setSelectedSubGenre(subOpts[0].id);
                        } else {
                          setSelectedSubGenre('');
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-from/10 border-amber-from shadow-md'
                          : 'bg-base border-subtle hover:border-ghost'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {getGenreIcon(g.id)}
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-amber-from shadow-[0_0_8px_rgba(212,153,90,0.8)]" />
                        )}
                      </div>
                      <div className="font-bold text-xs text-primary">{g.label}</div>
                      <div className="text-[10px] text-ghost line-clamp-1 mt-0.5">{g.shortLabel} Schema</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Genre Selection */}
            {availableSubGenres.length > 0 && (
              <div className="pt-2 border-t border-subtle space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ghost">
                  Select Tailored Sub-Genre
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSubGenres.map((sub) => {
                    const isSubSelected = selectedSubGenre === sub.id;
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => setSelectedSubGenre(sub.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSubSelected
                            ? 'bg-amber-from/15 border-amber-from text-primary shadow-sm font-semibold'
                            : 'bg-base border-subtle text-secondary hover:text-primary hover:border-ghost'
                        }`}
                      >
                        <div className="font-bold text-xs text-primary flex items-center justify-between mb-1">
                          {sub.label}
                          {isSubSelected && <Check size={14} className="text-amber-from" />}
                        </div>
                        <div className="text-[11px] text-ghost leading-relaxed">{sub.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Tone & Style Settings */}
          <Card className="p-6 space-y-4 bg-surface border-subtle">
            <h3 className="text-base font-serif font-bold text-primary flex items-center gap-2 border-b border-subtle pb-3">
              <Sparkles size={18} className="text-amber-from" /> Voice, Tone & AI Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1">
                  Narrative Tone
                </label>
                <Select
                  value={tone}
                  onValueChange={setTone}
                  options={[
                    { value: 'Epic', label: 'Epic & Mythic' },
                    { value: 'Dark', label: 'Dark & Gritty' },
                    { value: 'Whimsical', label: 'Whimsical & Playful' },
                    { value: 'Dramatic', label: 'Dramatic & Emotional' },
                    { value: 'Analytical', label: 'Analytical & Technical' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ghost mb-1">
                  Point of View (POV)
                </label>
                <Select
                  value={pov}
                  onValueChange={setPov}
                  options={[
                    { value: 'Third Person Limited', label: 'Third Person Limited' },
                    { value: 'First Person', label: 'First Person (I / Me)' },
                    { value: 'Third Person Omniscient', label: 'Third Person Omniscient' },
                    { value: 'Dual / Multi POV', label: 'Dual / Multi POV' },
                  ]}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* World Bible Category Dynamic Preview Side Panel */}
        <div className="space-y-6">
          <Card className="p-6 bg-surface border-subtle space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <h3 className="text-sm font-serif font-bold text-primary flex items-center gap-2">
                <BookOpen size={16} className="text-amber-from" /> Dynamic World Bible Preview
              </h3>
              <span className="text-[10px] uppercase font-mono bg-amber-from/15 text-amber-from px-2 py-0.5 rounded font-bold">
                Live Schema
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Based on your selected <strong className="text-primary">{selectedGenre}</strong> genre & <strong className="text-primary">{selectedSubGenre || 'standard'}</strong> sub-genre, your World Bible automatically displays these tailored category groups:
            </p>

            <div className="space-y-4 pt-2 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
              {previewCategories.map((group, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-base border border-subtle space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-from">
                    {group.group}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.categories.map((c) => (
                      <span
                        key={c.id}
                        className="text-[11px] bg-surface border border-subtle px-2 py-1 rounded-lg text-primary font-medium"
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full gap-2 bg-amber-from text-black font-bold mt-4 shadow-sm">
              <Save size={16} /> Apply to World Bible & Project
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
