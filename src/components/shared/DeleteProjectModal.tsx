import { useState } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { Project } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirmDelete: (projectId: string) => Promise<void>;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  project,
  onConfirmDelete,
}: DeleteProjectModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) return null;

  const isMatch = confirmText.trim() === project.title.trim();

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const handleDelete = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete(project.id);
      handleClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Project" size="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
          <AlertTriangle size={22} className="shrink-0" />
          <div className="text-xs sm:text-sm leading-relaxed">
            This action is <strong>irreversible</strong>. All manuscript scenes, chapters, world bible lore, and characters for this project will be permanently erased.
          </div>
        </div>

        <p className="text-xs sm:text-sm text-secondary">
          To confirm deletion, type <strong className="text-primary select-all">"{project.title}"</strong> below:
        </p>

        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={project.title}
          autoFocus
          className="font-mono text-xs sm:text-sm"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
          <Button variant="ghost" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!isMatch || isDeleting}
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}
