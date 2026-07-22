import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Upload, Map as MapIcon, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { SketchModeToggle } from '@/components/shared';

interface InteractiveMapProps {
  onMapImageLoad?: (file: File) => void;
}

export function InteractiveMap({ onMapImageLoad }: InteractiveMapProps) {
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSketchMode, setIsSketchMode] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMapImageUrl(url);
      if (onMapImageLoad) {
        onMapImageLoad(file);
      }
    }
  };

  useEffect(() => {
    if (!svgRef.current || !mapImageUrl) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g.map-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial transform to center the image slightly
    const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1);
    svg.call(zoom.transform, initialTransform);

    return () => {
      svg.on('.zoom', null);
    };
  }, [mapImageUrl]);

  if (!mapImageUrl) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center border-2 border-dashed border-subtle rounded-xl bg-black/5 dark:bg-white/5 m-8">
        <MapIcon size={48} className="text-secondary mb-4 opacity-50" />
        <h3 className="text-xl font-serif text-primary mb-2">No Map Loaded</h3>
        <p className="text-secondary mb-6 text-center max-w-md">
          Upload an image of your map (.png, .jpg, .svg) exported from Azgaar's Fantasy Map Generator.
        </p>
        <label>
          <input
            type="file"
            className="hidden"
            accept="image/*,.svg"
            onChange={handleFileUpload}
          />
          <Button onClick={(e) => {
            const el = e.currentTarget.previousElementSibling as HTMLInputElement;
            if (el) el.click();
          }}>
            <Upload size={16} className="mr-2" /> Upload Map Image
          </Button>
        </label>
      </div>
    );
  }

  return (
    <div className={`flex-1 h-full relative overflow-hidden transition-all duration-150 ${isSketchMode ? 'bg-terracotta/5' : 'bg-surface'}`} ref={containerRef}>
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <g className="map-container">
          <image
            href={mapImageUrl}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <SketchModeToggle 
          storageKey="inkwell-sketchmode-atlas" 
          isSketchMode={isSketchMode} 
          onToggle={setIsSketchMode} 
        />
        <Button 
          variant="ghost" 
          onClick={() => {
            setMapImageUrl(null);
          }}
          className="bg-surface/80 backdrop-blur"
        >
          <X size={16} className="mr-2" /> Clear Map
        </Button>
      </div>
    </div>
  );
}
