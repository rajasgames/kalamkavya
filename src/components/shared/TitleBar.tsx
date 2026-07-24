import { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

export function TitleBar() {
  const [isWindowed, setIsWindowed] = useState(true);

  // Note: __TAURI__ won't exist in standard browser mode
  // The component won't even be rendered if not in Tauri, but just to be safe:
  useEffect(() => {
    if (window.__TAURI__) {
      appWindow.isMaximized().then(maximized => setIsWindowed(!maximized));
      const unlisten = appWindow.onResized(async () => {
        const maximized = await appWindow.isMaximized();
        setIsWindowed(!maximized);
      });
      return () => {
        unlisten.then(f => f());
      };
    }
  }, []);

  if (!window.__TAURI__) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-8 bg-elevated border-b border-subtle flex items-center justify-between z-50 select-none"
      data-tauri-drag-region
    >
      <div className="flex-1 flex items-center pl-4 gap-2 h-full whitespace-nowrap shrink-0" data-tauri-drag-region>
        <img src="/brand_logo.png" className="w-5 h-5 shrink-0 object-contain" alt="Brand Logo" data-tauri-drag-region />
        <span className="text-xs font-bold text-primary font-serif whitespace-nowrap" data-tauri-drag-region>कalam काvya Engine</span>
      </div>
      
      <div className="flex items-center h-full text-secondary">
        <button 
          className="h-full px-3 hover:bg-surface hover:text-primary transition-colors flex items-center justify-center"
          onClick={() => appWindow.minimize()}
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button 
          className="h-full px-3 hover:bg-surface hover:text-primary transition-colors flex items-center justify-center"
          onClick={() => appWindow.toggleMaximize()}
          title={isWindowed ? "Maximize" : "Restore Down"}
        >
          <Square size={12} />
        </button>
        <button 
          className="h-full px-3 hover:bg-clay/20 hover:text-clay transition-colors flex items-center justify-center"
          onClick={() => appWindow.close()}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
