import { useState, useRef, useEffect, useCallback } from 'react';
import { ChapterPanel } from './ChapterPanel';
import { ScenePanel } from './ScenePanel';
import { ManuscriptEditor } from './ManuscriptEditor';

export function ManuscriptLayout() {
  const [panel1Width, setPanel1Width] = useState(180);
  const [panel2Width, setPanel2Width] = useState(220);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag states
  const [isDraggingP1, setIsDraggingP1] = useState(false);
  const [isDraggingP2, setIsDraggingP2] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    if (isDraggingP1) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      if (newWidth >= 120 && newWidth <= 380) {
        setPanel1Width(newWidth);
      }
    } else if (isDraggingP2) {
      const rect = containerRef.current.getBoundingClientRect();
      // Panel 2 width is the total x distance minus panel 1 width
      const newWidth = e.clientX - rect.left - panel1Width;
      if (newWidth >= 120 && newWidth <= 380) {
        setPanel2Width(newWidth);
      }
    }
  }, [isDraggingP1, isDraggingP2, panel1Width]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingP1(false);
    setIsDraggingP2(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isDraggingP1 || isDraggingP2) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingP1, isDraggingP2, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-base overflow-hidden relative select-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `${panel1Width}px ${panel2Width}px 1fr`,
      }}
    >
      {/* Panel 1 */}
      <div className="relative h-full z-10">
        <ChapterPanel />
        {/* Resizer 1 */}
        <div 
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-amber-from/50 active:bg-amber-from transition-colors z-20"
          onMouseDown={() => setIsDraggingP1(true)}
        />
      </div>

      {/* Panel 2 */}
      <div className="relative h-full z-10">
        <ScenePanel />
        {/* Resizer 2 */}
        <div 
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-amber-from/50 active:bg-amber-from transition-colors z-20"
          onMouseDown={() => setIsDraggingP2(true)}
        />
      </div>

      {/* Panel 3 */}
      <div className="h-full relative z-0">
        {/* Provide select-auto to allow text selection inside editor even when container is select-none during drag */}
        <div className="h-full w-full select-text">
          <ManuscriptEditor />
        </div>
      </div>
    </div>
  );
}
