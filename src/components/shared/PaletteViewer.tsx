import React, { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { Input, Select } from '@/components/ui';

export interface Swatch {
  hex: string;
  label: string;
}

export interface PaletteViewerProps {
  swatches: Swatch[];
  onChange?: (swatches: Swatch[]) => void;
  readOnly?: boolean;
}

const ROLE_OPTIONS = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'Accent', label: 'Accent' },
  { value: 'Hair', label: 'Hair' },
  { value: 'Skin', label: 'Skin' },
  { value: 'Eyes', label: 'Eyes' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Other', label: 'Other' },
];

export function PaletteViewer({ swatches, onChange, readOnly = false }: PaletteViewerProps) {
  const handleUpdate = (index: number, updates: Partial<Swatch>) => {
    if (!onChange || readOnly) return;
    const newSwatches = [...swatches];
    newSwatches[index] = { ...newSwatches[index], ...updates };
    onChange(newSwatches);
  };

  return (
    <div className="flex flex-wrap gap-6">
      {swatches.map((swatch, index) => (
        <SwatchItem 
          key={index} 
          swatch={swatch} 
          readOnly={readOnly}
          onUpdate={(updates) => handleUpdate(index, updates)}
        />
      ))}
    </div>
  );
}

interface SwatchItemProps {
  swatch: Swatch;
  onUpdate: (updates: Partial<Swatch>) => void;
  readOnly: boolean;
}

function SwatchItem({ swatch, onUpdate, readOnly }: SwatchItemProps) {
  const [copied, setCopied] = useState(false);
  const [hexInput, setHexInput] = useState(swatch.hex);

  // Sync internal input state with prop if changed externally
  useEffect(() => {
    setHexInput(swatch.hex);
  }, [swatch.hex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(swatch.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    
    // Loosely validate hex before emitting update to render the color
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      onUpdate({ hex: val });
    }
  };

  const handleHexBlur = () => {
    // Force sync back to valid prop if invalid
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexInput)) {
      setHexInput(swatch.hex);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-24">
      <div className="relative group cursor-pointer" onClick={handleCopy}>
        {/* Color Square */}
        <div 
          className="w-[60px] h-[60px] rounded-xl shadow-sm border border-subtle transition-transform group-hover:scale-105"
          style={{ backgroundColor: swatch.hex }}
        />
        
        {/* Copy Indicator Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
          <Check size={24} className="text-white drop-shadow-md" />
        </div>
        
        {/* Hover Icon (only when not copied) */}
        {!copied && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100">
            <Copy size={20} className="text-white drop-shadow-md" />
          </div>
        )}
      </div>

      <div className="w-full space-y-2 text-center">
        {readOnly ? (
          <>
            <div className="font-mono text-sm text-primary uppercase">{swatch.hex}</div>
            <div className="text-xs text-secondary">{swatch.label}</div>
          </>
        ) : (
          <>
            <Input 
              value={hexInput} 
              onChange={handleHexChange}
              onBlur={handleHexBlur}
              className="font-mono text-center text-xs h-8 px-2 uppercase"
              placeholder="#000000"
            />
            <Select 
              value={swatch.label} 
              onValueChange={(val) => onUpdate({ label: val })}
              options={ROLE_OPTIONS}
              className="text-xs h-8 px-2"
            />
          </>
        )}
      </div>
    </div>
  );
}
