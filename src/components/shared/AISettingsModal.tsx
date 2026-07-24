import { useUIStore } from '@/stores/uiStore';
import { Modal } from '@/components/ui';
import { AISettings } from '@/components/toolkit/AISettings';

export function AISettingsModal() {
  const { isAISettingsOpen, setAISettingsOpen } = useUIStore();

  return (
    <Modal
      isOpen={isAISettingsOpen}
      onClose={() => setAISettingsOpen(false)}
      title="Global AI Settings"
      size="xl"
    >
      <div className="max-h-[82vh] overflow-y-auto pr-1 sm:pr-2 scrollbar-hide font-sans">
        <AISettings />
      </div>
    </Modal>
  );
}
