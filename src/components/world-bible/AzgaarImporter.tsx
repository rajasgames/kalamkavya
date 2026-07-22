import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { useToast } from '@/components/ui';

interface AzgaarImporterProps {
  onComplete: () => void;
}

export function AzgaarImporter({ onComplete }: AzgaarImporterProps) {
  const { activeProjectId, addEntity } = useStoryStore();
  const { showToast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProjectId) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        let importCount = 0;

        // Process Burgs (Cities/Towns)
        if (json.pack?.burgs && Array.isArray(json.pack.burgs)) {
          for (const burg of json.pack.burgs) {
            // Burg 0 is often empty/null in Azgaar
            if (!burg || !burg.name || burg.name === 'Unknown') continue;
            
            await addEntity({
              id: crypto.randomUUID(),
              projectId: activeProjectId,
              type: 'location',
              name: burg.name,
              categorySlug: 'atlas',
              hasAIRule: false,
              data: {
                population: burg.population,
                type: burg.type || 'Town',
                description: `Imported from Azgaar. Population: ${Math.floor((burg.population || 0) * 1000)}.`,
                azgaarId: burg.i
              }
            });
            importCount++;
          }
        }

        // Process States (Regions/Countries)
        if (json.pack?.states && Array.isArray(json.pack.states)) {
          for (const state of json.pack.states) {
            if (!state || !state.name || state.name === 'Unknown') continue;
            
            await addEntity({
              id: crypto.randomUUID(),
              projectId: activeProjectId,
              type: 'region',
              name: state.name,
              categorySlug: 'atlas',
              hasAIRule: false,
              data: {
                type: 'State',
                description: `Imported from Azgaar. Form: ${state.formName || 'State'}.`,
                azgaarId: state.i
              }
            });
            importCount++;
          }
        }

        // Process Provinces
        if (json.pack?.provinces && Array.isArray(json.pack.provinces)) {
          for (const prov of json.pack.provinces) {
            if (!prov || !prov.name || prov.name === 'Unknown') continue;
            
            await addEntity({
              id: crypto.randomUUID(),
              projectId: activeProjectId,
              type: 'region',
              name: prov.name,
              categorySlug: 'atlas',
              hasAIRule: false,
              data: {
                type: 'Province',
                description: `Imported from Azgaar. Province.`,
                azgaarId: prov.i
              }
            });
            importCount++;
          }
        }

        showToast("Successfully imported " + importCount + " geographic entities.", "success");
        
        onComplete();
      } catch (error) {
        console.error("Error parsing Azgaar JSON:", error);
        showToast("Could not parse the provided JSON file. Ensure it is a valid Azgaar JSON export.", "error");
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 bg-surface border border-subtle rounded-xl max-w-sm">
      <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
        <Upload size={16} /> Import Azgaar Data
      </h3>
      <p className="text-sm text-secondary mb-4">
        Upload a `.json` file exported from Azgaar's Fantasy Map Generator to automatically create Locations and Regions.
      </p>
      
      <div className="bg-amber-from/10 border border-amber-from/20 rounded-lg p-3 flex gap-3 mb-4">
        <AlertCircle size={16} className="text-amber-from shrink-0 mt-0.5" />
        <p className="text-xs text-amber-from/80 leading-relaxed">
          Use the <strong>"Export to JSON (full)"</strong> or <strong>"minimal"</strong> option in Azgaar. 
        </p>
      </div>

      <label>
        <input
          type="file"
          className="hidden"
          accept=".json,application/json"
          onChange={handleFileUpload}
          disabled={isImporting || !activeProjectId}
        />
        <Button className="w-full" disabled={isImporting || !activeProjectId} onClick={(e) => {
          const el = e.currentTarget.previousElementSibling as HTMLInputElement;
          if (el) el.click();
        }}>
          {isImporting ? 'Importing...' : 'Select JSON File'}
        </Button>
      </label>
    </div>
  );
}
