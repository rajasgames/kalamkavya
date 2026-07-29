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
  Sword,
  Rocket,
  Coffee,
  Skull,
  Scroll,
  Search,
  ChevronDown,
  Plus,
  Trash2
} from 'lucide-react';
import { GenreCategory } from '@/types';
import { useStoryStore } from '@/stores/storyStore';
import { Button, Card, Input, Textarea } from '@/components/ui';
import { GENRE_MODULE_LIST, SUB_GENRE_MAP, getCategoriesForGenre } from '@/lib/genres/genreRegistry';

export function ProjectCore() {
  const { activeProject, updateProject } = useStoryStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState(activeProject?.title || '');
  const [premise, setPremise] = useState(activeProject?.premise || '');
  const [targetWordCountInput, setTargetWordCountInput] = useState(
    activeProject?.targetWordCount?.toLocaleString() || '50,000'
  );
  const [selectedGenre, setSelectedGenre] = useState(activeProject?.genreModules?.[0] || 'fantasy');
  const [selectedSubGenre, setSelectedSubGenre] = useState(activeProject?.subGenre || '');
  const [tone, setTone] = useState(activeProject?.tone || 'Epic');
  const [pov, setPov] = useState(activeProject?.pov || 'Third Person Limited');
  const [theme, setTheme] = useState(activeProject?.theme || 'Fate vs. Free Will');
  const [customCategories, setCustomCategories] = useState<{ group: string; categories: GenreCategory[] }[]>(
    activeProject?.customCategories || []
  );

  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatGroup, setNewCatGroup] = useState('Custom World Schema');
  const [newCatType, setNewCatType] = useState('system');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.title);
      setPremise(activeProject.premise);
      setTargetWordCountInput(activeProject.targetWordCount?.toLocaleString() || '50,000');
      setSelectedGenre(activeProject.genreModules?.[0] || 'fantasy');
      setSelectedSubGenre(activeProject.subGenre || '');
      setTone(activeProject.tone || 'Epic');
      setPov(activeProject.pov || 'Third Person Limited');
      setTheme(activeProject.theme || 'Fate vs. Free Will');
      setCustomCategories(activeProject.customCategories || []);
    }
  }, [activeProject]);

  const isDirty = 
    title !== (activeProject?.title || '') ||
    premise !== (activeProject?.premise || '') ||
    targetWordCountInput.replace(/,/g, '') !== (activeProject?.targetWordCount?.toString() || '50000') ||
    selectedGenre !== (activeProject?.genreModules?.[0] || 'fantasy') ||
    selectedSubGenre !== (activeProject?.subGenre || '') ||
    tone !== (activeProject?.tone || 'Epic') ||
    pov !== (activeProject?.pov || 'Third Person Limited') ||
    theme !== (activeProject?.theme || 'Fate vs. Free Will') ||
    JSON.stringify(customCategories) !== JSON.stringify(activeProject?.customCategories || []);

  const availableSubGenres = SUB_GENRE_MAP[selectedGenre] || [];
  const previewCategories = getCategoriesForGenre([selectedGenre], selectedSubGenre, customCategories);

  const handleAddCustomCategory = () => {
    if (!newCatLabel.trim()) return;
    const catId = newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const targetGroup = newCatGroup.trim() || 'Custom Lore Context';

    const newCategory: GenreCategory = {
      id: catId,
      label: newCatLabel.trim(),
      types: [newCatType]
    };

    setCustomCategories(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const existing = copy.find((g: { group: string }) => g.group.toLowerCase() === targetGroup.toLowerCase());
      if (existing) {
        existing.categories = [...existing.categories.filter((c: GenreCategory) => c.id !== catId), newCategory];
      } else {
        copy.push({ group: targetGroup, categories: [newCategory] });
      }
      return copy;
    });

    setNewCatLabel('');
  };

  const handleRemoveCustomCategory = (groupName: string, catId: string) => {
    setCustomCategories(prev => {
      return prev.map(g => {
        if (g.group.toLowerCase() === groupName.toLowerCase()) {
          return {
            ...g,
            categories: g.categories.filter(c => c.id !== catId)
          };
        }
        return g;
      }).filter(g => g.categories.length > 0);
    });
  };

  const saveProject = async () => {
    if (!activeProject) return;

    const updated = {
      ...activeProject,
      title,
      premise,
      targetWordCount: Number(targetWordCountInput.replace(/,/g, '')),
      genreModules: [selectedGenre],
      genre: GENRE_MODULE_LIST.find(m => m.id === selectedGenre)?.label || selectedGenre,
      subGenre: selectedSubGenre,
      tone,
      pov,
      theme,
      customCategories,
      updatedAt: Date.now(),
    };

    await updateProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await saveProject();
  };

  const handleOpenWorldBible = async () => {
    if (isDirty) {
      await saveProject();
    }
    navigate('/world-bible');
  };

  const getGenreIcon = (genreId: string) => {
    switch (genreId) {
      case 'fantasy': return <Sword className="text-emerald-500" size={18} />;
      case 'scifi': return <Rocket className="text-blue-500" size={18} />;
      case 'contemporary': return <Coffee className="text-amber-600" size={18} />;
      case 'horror': return <Skull className="text-red-500" size={18} />;
      case 'historical': return <Scroll className="text-yellow-600" size={18} />;
      case 'mystery': return <Search className="text-purple-500" size={18} />;
      default: return <Globe className="text-primary" size={18} />;
    }
  };

  if (!activeProject) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-4 rounded-2xl bg-amber-from/10 border border-amber-from/30 w-fit mx-auto text-amber-from">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">No Active Project Selected</h2>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
          Please select or create a project from the Dashboard to configure its core architecture, genre, and world building settings.
        </p>
        <Button onClick={() => navigate('/')} className="gap-2 text-xs">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-subtle pb-4 sm:pb-6 gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-from/15 text-amber-from border border-amber-from/30 shadow-sm shrink-0">
            <Sliders size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-serif font-bold text-primary flex items-center gap-2 flex-wrap">
              Project Core Architecture
              {savedSuccess && (
                <span className="text-[11px] font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check size={12} /> Saved!
                </span>
              )}
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              Configure genre, sub-genre, world-building schema, tone, and narrative targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleOpenWorldBible} variant="ghost" size="sm" className="gap-1.5 text-xs">
            <BookOpen size={15} /> World Bible
          </Button>
          <Button onClick={handleSave} size="sm" className="gap-1.5 text-xs bg-amber-from text-black font-bold">
            <Save size={15} /> Save
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 sm:p-6 space-y-4 bg-surface border-subtle">
            <h3 className="text-sm sm:text-base font-serif font-bold text-primary flex items-center gap-2 border-b border-subtle pb-3">
              <Feather size={17} className="text-amber-from" /> Core Story Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-1">
                  Project Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Silence Between Stars"
                  required
                  className="text-xs sm:text-sm h-9"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-1">
                  Core Logline & Premise
                </label>
                <Textarea
                  value={premise}
                  onChange={(e) => setPremise(e.target.value)}
                  placeholder="Summarize the central conflict, protagonist's goal, and narrative stakes..."
                  rows={3}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-1 flex items-center gap-1">
                    <Target size={12} /> Target Word Count
                  </label>
                  <Input
                    type="text"
                    value={targetWordCountInput}
                    onChange={(e) => setTargetWordCountInput(e.target.value)}
                    onBlur={(e) => {
                      const num = parseInt(e.target.value.replace(/,/g, ''), 10);
                      if (!isNaN(num)) {
                        setTargetWordCountInput(num.toLocaleString());
                      }
                    }}
                    placeholder="e.g. 50,000"
                    className="text-xs sm:text-sm h-9"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-1">
                    Central Theme / Motif
                  </label>
                  <Input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Destiny vs Free Will"
                    className="text-xs sm:text-sm h-9"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Genre & Sub-Genre Architecture Selection */}
          <Card className="p-4 sm:p-6 space-y-5 bg-surface border-subtle">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <h3 className="text-sm sm:text-base font-serif font-bold text-primary flex items-center gap-2">
                <Layers size={17} className="text-amber-from" /> Genre Engine
              </h3>
              <span className="text-[10px] text-ghost">Drives World Bible Categories</span>
            </div>

            {/* Main Genre Dropdown */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost">
                Select Main Genre Module
              </label>
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    const newGenre = e.target.value;
                    setSelectedGenre(newGenre);
                    const subOpts = SUB_GENRE_MAP[newGenre];
                    if (subOpts && subOpts.length > 0) {
                      setSelectedSubGenre(subOpts[0].id);
                    } else {
                      setSelectedSubGenre('');
                    }
                  }}
                  className="w-full appearance-none bg-base border border-subtle rounded-xl py-3 pl-4 pr-10 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-amber-from/50 cursor-pointer shadow-sm"
                >
                  {GENRE_MODULE_LIST.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.label} ({g.shortLabel})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ghost">
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Active Main Genre Preview Card */}
              {(() => {
                const activeMod = GENRE_MODULE_LIST.find(m => m.id === selectedGenre);
                if (!activeMod) return null;
                return (
                  <div className="p-3 bg-base border border-subtle rounded-xl flex items-start gap-3 mt-2">
                    <div className="p-2 rounded-lg bg-surface border border-subtle flex items-center gap-1.5 shrink-0 mt-0.5">
                      {getGenreIcon(activeMod.id)}
                      <span className="text-sm">{activeMod.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-primary">{activeMod.label} ({activeMod.shortLabel} Schema)</div>
                      <div className="text-[11px] text-ghost leading-relaxed">{activeMod.description || 'Configures custom worldbuilding categories for your project.'}</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Sub-Genre Dropdown */}
            {availableSubGenres.length > 0 && (
              <div className="pt-3 border-t border-subtle space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost">
                  Select Tailored Sub-Genre
                </label>
                <div className="relative">
                  <select
                    value={selectedSubGenre}
                    onChange={(e) => setSelectedSubGenre(e.target.value)}
                    className="w-full appearance-none bg-base border border-subtle rounded-xl py-3 pl-4 pr-10 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-amber-from/50 cursor-pointer shadow-sm"
                  >
                    <option value="">-- Standard / Default --</option>
                    {availableSubGenres.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ghost">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Active Sub-Genre Preview */}
                {(() => {
                  const activeSub = availableSubGenres.find(s => s.id === selectedSubGenre);
                  if (!activeSub) return null;
                  return (
                    <div className="p-3 bg-amber-from/10 border border-amber-from/30 rounded-xl text-xs text-primary flex items-start gap-2.5">
                      <Check size={16} className="text-amber-from shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{activeSub.label}: </span>
                        <span className="text-ghost">{activeSub.description || 'Applies tailored schema and categories to World Bible.'}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </Card>

          {/* Tone & Style Settings */}
          <Card className="p-4 sm:p-6 space-y-4 bg-surface border-subtle">
            <h3 className="text-sm sm:text-base font-serif font-bold text-primary flex items-center gap-2 border-b border-subtle pb-3">
              <Sparkles size={17} className="text-amber-from" /> Voice, Tone & AI Profile
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-2">
                  Narrative Tone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'Epic', label: 'Epic & Mythic' },
                    { value: 'Dark', label: 'Dark & Gritty' },
                    { value: 'Whimsical', label: 'Whimsical & Playful' },
                    { value: 'Dramatic', label: 'Dramatic & Emotional' },
                    { value: 'Analytical', label: 'Analytical & Technical' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setTone(opt.value)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        tone === opt.value
                          ? 'bg-amber-from/15 border-amber-from text-primary shadow-sm font-semibold'
                          : 'bg-base border-subtle text-secondary hover:text-primary hover:border-ghost'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.label}</span>
                      {tone === opt.value && <Check size={13} className="text-amber-from shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost mb-2">
                  Point of View (POV)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { value: 'Third Person Limited', label: 'Third Person Limited' },
                    { value: 'First Person', label: 'First Person (I / Me)' },
                    { value: 'Third Person Omniscient', label: 'Third Person Omniscient' },
                    { value: 'Dual / Multi POV', label: 'Dual / Multi POV' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setPov(opt.value)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        pov === opt.value
                          ? 'bg-amber-from/15 border-amber-from text-primary shadow-sm font-semibold'
                          : 'bg-base border-subtle text-secondary hover:text-primary hover:border-ghost'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.label}</span>
                      {pov === opt.value && <Check size={13} className="text-amber-from shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic World Bible Schema Preview Side Panel */}
        <div className="space-y-6">
          <Card className="p-4 sm:p-6 bg-surface border-subtle space-y-3.5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <h3 className="text-xs sm:text-sm font-serif font-bold text-primary flex items-center gap-2">
                <BookOpen size={15} className="text-amber-from" /> Dynamic World Schema
              </h3>
              <span className="text-[9px] font-mono bg-amber-from/15 text-amber-from px-2 py-0.5 rounded font-bold uppercase">
                Live Schema
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Based on your selected <strong className="text-primary">{selectedGenre}</strong> genre & <strong className="text-primary">{selectedSubGenre || 'standard'}</strong> sub-genre, your World Bible automatically builds these categories:
            </p>

            <div className="space-y-3 pt-1 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
              {previewCategories.map((group, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-base border border-subtle space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-from flex items-center justify-between">
                    <span>{group.group}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.categories.map((c) => {
                      const isCustom = customCategories.some(cg =>
                        cg.categories.some(cc => cc.id === c.id)
                      );
                      return (
                        <span
                          key={c.id}
                          className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border ${
                            isCustom
                              ? 'bg-amber-from/15 border-amber-from text-amber-from font-semibold'
                              : 'bg-surface border-subtle text-primary'
                          }`}
                        >
                          {c.label}
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomCategory(group.group, c.id)}
                              className="text-ghost hover:text-destructive ml-0.5"
                              title="Remove custom category"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Schema Category Creator */}
            <div className="pt-3 border-t border-subtle space-y-2.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ghost">
                Customize Schema (Add Category)
              </label>

              <div className="space-y-2 bg-base p-3 rounded-xl border border-subtle">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-ghost font-semibold">Category Group Name</span>
                  <Input
                    value={newCatGroup}
                    onChange={(e) => setNewCatGroup(e.target.value)}
                    placeholder="e.g. Cosmic Planes, Magic Systems, Guilds"
                    className="text-xs py-1.5"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-ghost font-semibold">Category Label</span>
                  <Input
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    placeholder="e.g. Secret Societies, Arcane Artifacts"
                    className="text-xs py-1.5"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-ghost font-semibold">Primary Entity Type</span>
                  <select
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                    className="w-full bg-surface border border-subtle rounded-lg py-1.5 px-2 text-xs font-semibold text-primary outline-none"
                  >
                    <option value="system">Power System / Laws (system)</option>
                    <option value="location">Location / Realm (location)</option>
                    <option value="landmark">Landmark / Place (landmark)</option>
                    <option value="character">Character / Archetype (character)</option>
                    <option value="faction">Faction / Order (faction)</option>
                    <option value="family">Dynasty / Lineage (family)</option>
                    <option value="object">Object / Artifact / Weapon (object)</option>
                    <option value="lore_text">Lore / Document / Myth (lore_text)</option>
                  </select>
                </div>

                <Button
                  type="button"
                  onClick={handleAddCustomCategory}
                  disabled={!newCatLabel.trim()}
                  className="w-full text-xs py-1.5 gap-1.5 mt-1"
                >
                  <Plus size={14} /> Add Schema Category
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
