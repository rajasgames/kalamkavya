import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Modal, Input, Button, Label } from '@/components/ui';
import { GENRE_MODULE_LIST, SUB_GENRE_MAP, UNIVERSAL_ENTITY_TYPES } from '@/lib/genres/genreRegistry';
import { GenreCategory } from '@/types';
import { Layers, Plus, Trash2, Sliders, CheckCircle2, Sparkles } from 'lucide-react';

interface SchemaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemaEditorModal({ isOpen, onClose }: SchemaEditorModalProps) {
  const { activeProject, updateProject } = useStoryStore();

  const [selectedGenre, setSelectedGenre] = useState('fantasy');
  const [selectedSubGenre, setSelectedSubGenre] = useState('');
  const [customCategories, setCustomCategories] = useState<{ group: string; categories: GenreCategory[] }[]>([]);

  // Form states for adding custom category
  const [newGroup, setNewGroup] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState('character');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen && activeProject) {
      const activeModule = activeProject.genreModules?.[0] || 'fantasy';
      setSelectedGenre(activeModule === 'universal' ? 'fantasy' : activeModule);
      setSelectedSubGenre(activeProject.subGenre || '');
      setCustomCategories(activeProject.customCategories || []);
    }
  }, [isOpen, activeProject]);

  if (!activeProject) return null;

  const availableSubGenres = SUB_GENRE_MAP[selectedGenre] || [];

  const handleAddCustomCategory = () => {
    if (!newLabel.trim()) return;

    const groupName = newGroup.trim() || 'Custom World Schema';
    const catId = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const updated = [...customCategories];
    const groupIdx = updated.findIndex(g => g.group.toLowerCase() === groupName.toLowerCase());

    const newCatObj: GenreCategory = {
      id: catId,
      label: newLabel.trim(),
      types: [newType],
    };

    if (groupIdx >= 0) {
      if (!updated[groupIdx].categories.some(c => c.id === catId)) {
        updated[groupIdx].categories.push(newCatObj);
      }
    } else {
      updated.push({
        group: groupName,
        categories: [newCatObj],
      });
    }

    setCustomCategories(updated);
    setNewLabel('');
  };

  const handleRemoveCategory = (groupIndex: number, catIndex: number) => {
    const updated = [...customCategories];
    updated[groupIndex].categories.splice(catIndex, 1);
    if (updated[groupIndex].categories.length === 0) {
      updated.splice(groupIndex, 1);
    }
    setCustomCategories(updated);
  };

  const handleSave = async () => {
    await updateProject({
      ...activeProject,
      genreModules: [selectedGenre],
      subGenre: selectedSubGenre,
      customCategories,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reframe World Schema & Genre Modules">
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1 scrollbar-hide">
        
        {/* Header Intro */}
        <div className="p-4 rounded-xl bg-amber-from/10 border border-amber-from/20 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-from text-black shrink-0">
            <Sliders size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary">Genre-Centric Worldbuilding Engine</h4>
            <p className="text-xs text-secondary mt-0.5">
              Reframe your universe categories, adapt schema templates to any subgenre, or build vast custom categories for massive worldbibles.
            </p>
          </div>
        </div>

        {/* 1. Primary Genre Selector */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-xs uppercase tracking-wider text-ghost">
            Primary Genre Module
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GENRE_MODULE_LIST.slice(0, 15).map(g => {
              const isSelected = selectedGenre === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGenre(g.id);
                    setSelectedSubGenre('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-from/15 border-amber-from text-amber-from font-bold shadow-sm'
                      : 'bg-surface border-subtle text-secondary hover:text-primary hover:border-subtle/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{g.icon}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-amber-from" />}
                  </div>
                  <div className="text-xs font-semibold mt-2">{g.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Subgenre Selector */}
        {availableSubGenres.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-xs uppercase tracking-wider text-ghost">
              Subgenre Spec (Tailored Focus)
            </Label>
            <select
              value={selectedSubGenre}
              onChange={(e) => setSelectedSubGenre(e.target.value)}
              className="w-full bg-surface border border-subtle rounded-xl p-2.5 text-xs font-semibold text-primary outline-none focus:border-amber-from"
            >
              <option value="">Standard {GENRE_MODULES_MAP[selectedGenre]?.label || selectedGenre}</option>
              {availableSubGenres.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Reframe Category Groups (Custom World Schemas) */}
        <div className="flex flex-col gap-3 pt-2 border-t border-subtle">
          <div className="flex items-center justify-between">
            <Label className="font-bold text-xs uppercase tracking-wider text-ghost flex items-center gap-1.5">
              <Layers size={14} className="text-amber-from" /> Custom World Categories
            </Label>
            <span className="text-[11px] text-ghost font-medium">Add unlimited custom categories</span>
          </div>

          {/* Form to add custom category */}
          <div className="p-3.5 bg-surface border border-subtle rounded-xl flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-ghost uppercase block mb-1">Group Name</span>
                <Input
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  placeholder="e.g. Multiverse Planes"
                  className="text-xs py-1.5"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-ghost uppercase block mb-1">Category Label</span>
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Celestial Realms"
                  className="text-xs py-1.5"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-ghost uppercase block mb-1">Entity Type</span>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-base border border-subtle rounded-lg py-1.5 px-2 text-xs font-semibold text-primary outline-none"
                >
                  {UNIVERSAL_ENTITY_TYPES.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={handleAddCustomCategory}
              disabled={!newLabel.trim()}
              className="gap-1.5 text-xs w-full justify-center mt-1 border border-dashed border-subtle"
            >
              <Plus size={14} /> Add Category to Schema
            </Button>
          </div>

          {/* Display configured custom categories */}
          {customCategories.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {customCategories.map((group, gi) => (
                <div key={gi} className="p-3 bg-base border border-subtle rounded-xl flex flex-col gap-2">
                  <div className="text-xs font-bold text-primary">{group.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((cat, ci) => (
                      <div
                        key={ci}
                        className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface border border-subtle text-xs text-primary font-medium"
                      >
                        <span>{cat.label}</span>
                        <span className="text-[9px] text-ghost uppercase font-mono">({cat.types[0]})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(gi, ci)}
                          className="text-ghost hover:text-destructive transition-colors ml-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-subtle">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={handleSave} className="gap-2">
          {savedNotice ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-400" /> Saved!
            </>
          ) : (
            <>
              <Sparkles size={16} /> Apply World Schema
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
}

const GENRE_MODULES_MAP: Record<string, { label: string }> = {
  fantasy: { label: 'Fantasy' },
  scifi: { label: 'Science Fiction' },
  cyberpunk: { label: 'Cyberpunk' },
  romance: { label: 'Romance' },
  mystery: { label: 'Mystery' },
  historical: { label: 'Historical' },
  horror: { label: 'Horror' },
  action: { label: 'Action' },
  thriller: { label: 'Thriller' },
};
