import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db';
import { Project } from '@/types';
import { Modal, Input, Button, Label } from '@/components/ui';
import { GENRE_MODULE_LIST } from '@/lib/genres/genreRegistry';




interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (projectId: string) => void;
}

export function NewProjectModal({ isOpen, onClose, onCreated }: NewProjectModalProps) {
  const { setActiveProject } = useStoryStore();
  const [step, setStep] = useState<'genre' | 'details'>('genre');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['universal']);
  const [title, setTitle] = useState('');
  const [premise, setPremise] = useState('');
  const [targetWordCount, setTargetWordCount] = useState(80000);
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setStep('genre');
    setSelectedGenres(['universal']);
    setTitle('');
    setPremise('');
    setTargetWordCount(80000);
    onClose();
  };

  const toggleGenre = (id: string) => {
    // 'universal' is always on (implicit), clicking it has no effect
    if (id === 'universal') return;
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id],
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setIsCreating(true);

    try {
      const now = Date.now();
      const newProject: Project = {
        id: crypto.randomUUID(),
        title: title.trim(),
        genre: selectedGenres[0] ?? 'universal',
        genreModules: selectedGenres.includes('universal')
          ? selectedGenres
          : ['universal', ...selectedGenres],
        premise: premise.trim(),
        targetWordCount,
        kanbanColumns: [
          { id: 'idea', name: 'Idea', order: 0 },
          { id: 'draft', name: 'Draft', order: 1 },
          { id: 'revision', name: 'Revision', order: 2 },
          { id: 'final', name: 'Final', order: 3 },
        ],
        createdAt: now,
        updatedAt: now,
      };

      await db.projects.put(newProject);
      await setActiveProject(newProject.id);
      onCreated?.(newProject.id);
      handleClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Project">
      {step === 'genre' ? (
        <div className="flex flex-col gap-5 mt-2">
          <div>
            <p className="text-sm text-secondary mb-1">
              Choose the genre(s) your story lives in.{' '}
              <span className="text-ghost">You can always change this later.</span>
            </p>
            <p className="text-xs text-ghost">
              Universal building blocks (Characters, Places, Factions…) are always available.
              Selecting a genre adds specialized sub-types for your world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
            {GENRE_MODULE_LIST.map(mod => {
              const isSelected = selectedGenres.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => toggleGenre(mod.id)}
                  className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? 'border-amber-from/60 bg-amber-from/5 shadow-sm'
                      : 'border-subtle bg-elevated hover:border-amber-from/30 hover:bg-amber-from/3'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-1.5 rounded-lg bg-surface border border-subtle text-xl">
                      {mod.icon}
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${
                        isSelected
                          ? 'bg-amber-from border-amber-from'
                          : 'border-subtle bg-transparent'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-primary leading-tight">{mod.label}</p>
                    <p className="text-[11px] text-ghost mt-1 line-clamp-2 leading-snug">
                      {mod.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-subtle">
            <div className="flex-1 text-xs text-ghost">
              {selectedGenres.filter(g => g !== 'universal').length === 0
                ? 'Universal — genre-agnostic building blocks only'
                : `Selected: ${selectedGenres.filter(g => g !== 'universal').map(g => GENRE_MODULE_LIST.find(m => m.id === g)?.shortLabel ?? g).join(', ')}`}
            </div>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => setStep('details')}>
              Next →
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={e => { e.preventDefault(); handleCreate(); }}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex flex-wrap gap-1.5 p-3 bg-surface rounded-lg border border-subtle">
            {selectedGenres.filter(g => g !== 'universal').map(g => {
              const mod = GENRE_MODULE_LIST.find(m => m.id === g);
              return (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-from/10 border border-amber-from/20 text-amber-from text-xs font-bold rounded-md"
                >
                  <span className="text-sm">{mod?.icon}</span> {mod?.shortLabel}
                </span>
              );
            })}
            {selectedGenres.filter(g => g !== 'universal').length === 0 && (
              <span className="text-xs text-ghost">Universal (genre-agnostic)</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Project Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. The Sundered Crown"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Premise / Logline</Label>
            <textarea
              value={premise}
              onChange={e => setPremise(e.target.value)}
              placeholder="A one-sentence summary of your story..."
              className="w-full bg-base border border-subtle rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-amber-from/50 focus:ring-1 focus:ring-amber-from/20 resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Target Word Count</Label>
            <Input
              type="number"
              value={targetWordCount}
              onChange={e => setTargetWordCount(Number(e.target.value))}
              min={1000}
              step={1000}
            />
          </div>

          <div className="flex justify-between gap-3 mt-2 pt-4 border-t border-subtle">
            <Button type="button" variant="ghost" onClick={() => setStep('genre')}>
              ← Back
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || isCreating}>
                {isCreating ? 'Creating…' : 'Create Project'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
