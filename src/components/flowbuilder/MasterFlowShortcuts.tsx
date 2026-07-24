import { HelpCircle, X } from 'lucide-react';
import useMasterFlowStore from './masterFlowStore';

export function MasterFlowShortcuts() {
  const { isShortcutsOpen, toggleShortcuts, setShortcutsOpen } = useMasterFlowStore();

  const SHORTCUTS = [
    { label: 'Add New Node', key: 'Double Click Canvas' },
    { label: 'Edit Title / Spec Note', key: 'Double Click Node' },
    { label: 'Connect Relationship', key: 'Drag Node Handle' },
    { label: 'Delete Node / Edge', key: 'Del / Backspace' },
    { label: 'Undo Layout Position', key: 'Ctrl + Z' },
    { label: 'Redo Layout Position', key: 'Ctrl + Y' },
    { label: 'Pan Canvas Viewport', key: 'Left Click + Drag' },
    { label: 'Marquee Multi-Select', key: 'Shift + Drag' },
  ];

  return (
    <>
      {/* Floating help button */}
      <button
        className="flowcraft-help-btn"
        onClick={toggleShortcuts}
        title="Keyboard Shortcuts & Guidance"
      >
        <HelpCircle size={18} />
      </button>

      {/* Popover */}
      {isShortcutsOpen && (
        <div className="flowcraft-shortcuts-popover">
          <div className="flex items-center justify-between mb-3 border-b border-subtle pb-2">
            <h4 className="font-serif font-bold text-sm text-primary margin-0">Keyboard Shortcuts</h4>
            <button
              onClick={() => setShortcutsOpen(false)}
              className="text-ghost hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            {SHORTCUTS.map(({ label, key }) => (
              <div key={label} className="flowcraft-sc-row">
                <span>{label}</span>
                <kbd>{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
