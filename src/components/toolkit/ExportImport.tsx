import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, UploadCloud, Loader2 } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db';
import { Button, ConfirmModal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { save } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';

export function ExportImport() {
  const { activeProjectId, setActiveProject } = useStoryStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EXPORT LOGIC ---
  const handleExport = async () => {
    if (!activeProjectId) return;
    setIsExporting(true);

    try {
      const [project, entities, relationships, chapters, scenes, notes] = await Promise.all([
        db.projects.get(activeProjectId),
        db.entities.where('projectId').equals(activeProjectId).toArray(),
        db.relationships.where('projectId').equals(activeProjectId).toArray(),
        db.chapters.where('projectId').equals(activeProjectId).toArray(),
        db.scenes.where('projectId').equals(activeProjectId).toArray(),
        db.notes.where('projectId').equals(activeProjectId).toArray(),
      ]);

      if (!project) throw new Error("Project not found");

      const payload = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        project,
        entities,
        relationships,
        chapters,
        scenes,
        notes
      };

      const safeTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const defaultFilename = `${safeTitle}-${date}.inkwell`;
      const jsonContent = JSON.stringify(payload, null, 2);

      if (window.__TAURI__) {
        const filePath = await save({
          filters: [{ name: 'Inkwell Project', extensions: ['inkwell'] }],
          defaultPath: defaultFilename
        });
        if (filePath) {
          await writeTextFile(filePath, jsonContent);
          showToast("Project saved to disk successfully!", 'success');
        } else {
          // User cancelled dialog
          return;
        }
      } else {
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        a.download = defaultFilename;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Project exported successfully!", 'success');
      }

    } catch (err) {
      console.error(err);
      showToast("Failed to export project.", 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // --- IMPORT LOGIC ---
  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate Schema loosely
      if (!data.version || !Array.isArray(data.entities) || !Array.isArray(data.chapters) || !Array.isArray(data.scenes)) {
        throw new Error("Invalid schema");
      }

      setParsedData(data);
      setShowConfirm(true);
    } catch (err) {
      console.error("Import error", err);
      showToast("Invalid file format — please use a file exported from Inkwell.", 'error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const confirmImport = async () => {
    if (!parsedData || !parsedData.project) return;
    
    try {
      const { project, entities, relationships, chapters, scenes, notes } = parsedData;
      
      const existingProject = await db.projects.get(project.id);
      
      let finalProjectId = project.id;
      
      // Deep clone to avoid mutating state
      const finalProject = JSON.parse(JSON.stringify(project));
      const finalEntities = JSON.parse(JSON.stringify(entities || []));
      const finalRelationships = JSON.parse(JSON.stringify(relationships || []));
      const finalChapters = JSON.parse(JSON.stringify(chapters || []));
      const finalScenes = JSON.parse(JSON.stringify(scenes || []));
      const finalNotes = JSON.parse(JSON.stringify(notes || []));

      // COLLISION REMAPPING
      if (existingProject) {
        finalProjectId = crypto.randomUUID();
        finalProject.id = finalProjectId;
        finalProject.title = `${finalProject.title} (Imported)`;

        const entityMap = new Map<string, string>();
        const chapterMap = new Map<string, string>();
        const sceneMap = new Map<string, string>();

        finalEntities.forEach((e: any) => {
          const newId = crypto.randomUUID();
          entityMap.set(e.id, newId);
          e.id = newId;
          e.projectId = finalProjectId;
        });

        finalRelationships.forEach((r: any) => {
          r.id = crypto.randomUUID();
          r.projectId = finalProjectId;
          r.fromEntityId = entityMap.get(r.fromEntityId) || r.fromEntityId;
          r.toEntityId = entityMap.get(r.toEntityId) || r.toEntityId;
        });

        finalChapters.forEach((c: any) => {
          const newId = crypto.randomUUID();
          chapterMap.set(c.id, newId);
          c.id = newId;
          c.projectId = finalProjectId;
        });

        finalScenes.forEach((s: any) => {
          const newId = crypto.randomUUID();
          sceneMap.set(s.id, newId);
          s.id = newId;
          s.projectId = finalProjectId;
          s.chapterId = chapterMap.get(s.chapterId) || s.chapterId;
        });

        finalNotes.forEach((n: any) => {
          n.id = crypto.randomUUID();
          n.projectId = finalProjectId;
        });
      }

      await db.transaction('rw', [db.projects, db.entities, db.relationships, db.chapters, db.scenes, db.notes], async () => {
        await db.projects.put(finalProject);
        if (finalEntities.length) await db.entities.bulkPut(finalEntities);
        if (finalRelationships.length) await db.relationships.bulkPut(finalRelationships);
        if (finalChapters.length) await db.chapters.bulkPut(finalChapters);
        if (finalScenes.length) await db.scenes.bulkPut(finalScenes);
        if (finalNotes.length) await db.notes.bulkPut(finalNotes);
      });

      showToast(`Imported ${finalProject.title} successfully!`, 'success');
      
      // Auto-navigate to imported project
      await setActiveProject(finalProjectId);
      navigate('/dashboard');

    } catch (err) {
      console.error("Failed to import", err);
      showToast("An error occurred during import.", 'error');
    } finally {
      setShowConfirm(false);
      setParsedData(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* EXPORT SECTION */}
      <section className="bg-elevated border border-subtle p-6 rounded-xl">
        <h2 className="text-xl font-serif text-primary mb-2">Export Project</h2>
        <p className="text-secondary text-sm mb-6">
          Download a complete backup of your current project. This includes all entities, relationships, chapters, scenes, and notes. The resulting <code>.inkwell</code> file is fully portable and operates offline.
        </p>
        <Button 
          onClick={handleExport} 
          disabled={!activeProjectId || isExporting}
          className="gap-2 bg-amber-from hover:bg-amber-to text-black"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin text-black/70" />
              Preparing export...
            </>
          ) : (
            <>
              <Download size={16} />
              Export to .inkwell
            </>
          )}
        </Button>
      </section>

      {/* IMPORT SECTION */}
      <section className="bg-elevated border border-subtle p-6 rounded-xl flex-1 flex flex-col">
        <h2 className="text-xl font-serif text-primary mb-2">Import Project</h2>
        <p className="text-secondary text-sm mb-6">
          Upload a previously exported <code>.inkwell</code> file to add it to your library. 
          Existing projects will not be overwritten.
        </p>

        <div 
          className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
            isDragging ? 'border-amber-from bg-amber-from/5' : 'border-subtle hover:border-ghost/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud size={48} className={isDragging ? 'text-amber-from mb-4' : 'text-ghost mb-4'} />
          <p className="text-primary font-medium mb-1">Drag and drop your file here</p>
          <p className="text-secondary text-sm mb-4">Accepts .inkwell or .json</p>
          
          <input 
            type="file" 
            accept=".inkwell,.json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
              // Reset input so the same file can be selected again if needed
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />
          <Button 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </div>
      </section>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Import Project"
        message={`This will add ${parsedData?.project?.title || 'the project'} to your library. Existing projects are not affected.`}
        confirmLabel="Import Project"
        onConfirm={confirmImport}
      />

    </div>
  );
}
