import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import useMasterFlowStore from './masterFlowStore';

export function MasterFlowToasts() {
  const { toasts } = useMasterFlowStore();

  if (toasts.length === 0) return null;

  return (
    <div className="flowcraft-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`flowcraft-toast ${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={14} className="text-teal" />}
          {t.type === 'error' && <AlertCircle size={14} className="text-coral" />}
          {(!t.type || t.type === 'info') && <Info size={14} className="text-brass" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
