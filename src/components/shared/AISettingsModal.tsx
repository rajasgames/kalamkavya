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
      <div className="h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        <AISettings />
      </div>
    </Modal>
  );
}
