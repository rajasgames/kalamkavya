import { useState, useMemo } from 'react';
import { X, Copy, Download, Check, FileCode, FileText, GitBranch } from 'lucide-react';
import useMasterFlowStore from './masterFlowStore';
import { useStoryStore } from '@/stores/storyStore';
import { formatSpecId } from './entityTypeConfig';

export function MasterFlowExportModal() {
  const { isExportModalOpen, setExportModalOpen, addToast, layoutDirection } = useMasterFlowStore();
  const { activeProject, entities, relationships } = useStoryStore();

  const [activeTab, setActiveTab] = useState<'json' | 'markdown' | 'mermaid'>('json');
  const [copied, setCopied] = useState(false);

  // Helper for notes/description
  const getDesc = (e: (typeof entities)[0]) =>
    (((e.data as Record<string, unknown>)?.notes || (e.data as Record<string, unknown>)?.description || '') as string);

  // 1. JSON Export Content
  const jsonContent = useMemo(() => {
    const data = {
      project: activeProject?.title || 'Kalam Kavya World Bible',
      exportedAt: new Date().toISOString(),
      nodesCount: entities.length,
      edgesCount: relationships.length,
      entities: entities.map((e) => ({
        id: e.id,
        specId: formatSpecId(e.type, e.id),
        name: e.name,
        type: e.type,
        entityClass: e.entityClass,
        description: getDesc(e),
      })),
      relationships: relationships.map((r) => ({
        id: r.id,
        fromEntityId: r.fromEntityId,
        toEntityId: r.toEntityId,
        type: r.type,
      })),
    };
    return JSON.stringify(data, null, 2);
  }, [activeProject, entities, relationships]);

  // 2. Markdown Narrative Export Content
  const markdownContent = useMemo(() => {
    let md = `# Flowcraft Specification — ${activeProject?.title || 'World Bible'}\n\n`;
    md += `> Exported from Kalam Kavya Studio on ${new Date().toLocaleDateString()}\n\n`;

    md += `## 1. Process & Entity Roster (${entities.length})\n\n`;
    entities.forEach((e) => {
      const specId = formatSpecId(e.type, e.id);
      const desc = getDesc(e);
      md += `### ${e.name} (\`${specId}\`)\n`;
      md += `- **Type**: ${e.type}\n`;
      md += `- **Hierarchy**: ${e.entityClass}\n`;
      if (desc) md += `- **Spec Notes**: ${desc}\n`;
      md += `\n`;
    });

    md += `## 2. Relationship Network Matrix (${relationships.length})\n\n`;
    md += `| Source Entity | Relationship | Target Entity |\n`;
    md += `| :--- | :---: | :--- |\n`;
    relationships.forEach((r) => {
      const source = entities.find((e) => e.id === r.fromEntityId)?.name || r.fromEntityId;
      const target = entities.find((e) => e.id === r.toEntityId)?.name || r.toEntityId;
      md += `| **${source}** | \`${r.type}\` | **${target}** |\n`;
    });

    return md;
  }, [activeProject, entities, relationships]);

  // 3. Mermaid Diagram Syntax Content
  const mermaidContent = useMemo(() => {
    const dir = layoutDirection === 'TB' ? 'TD' : 'LR';
    let mm = `graph ${dir}\n`;
    mm += `    %% Flowcraft Master Flowchart — ${activeProject?.title || 'World Bible'}\n\n`;

    const cleanLabel = (str: string) => str.replace(/["'()]/g, '');

    entities.forEach((e) => {
      const safeId = `node_${e.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const label = cleanLabel(e.name);
      mm += `    ${safeId}["${label}<br/><i>(${e.type})</i>"]\n`;
    });

    mm += `\n`;
    relationships.forEach((r) => {
      const sourceId = `node_${r.fromEntityId.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const targetId = `node_${r.toEntityId.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const relLabel = cleanLabel(r.type.replace(/_/g, ' '));
      mm += `    ${sourceId} -->|"${relLabel}"| ${targetId}\n`;
    });

    return mm;
  }, [activeProject, entities, relationships, layoutDirection]);

  if (!isExportModalOpen) return null;

  const currentText =
    activeTab === 'json' ? jsonContent : activeTab === 'markdown' ? markdownContent : mermaidContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    addToast(`Copied ${activeTab.toUpperCase()} format to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'json' ? 'json' : activeTab === 'markdown' ? 'md' : 'mmd';
    const mime = activeTab === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([currentText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowcraft-blueprint-${activeProject?.title || 'world'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`Downloaded ${a.download}`, 'info');
  };

  return (
    <div className="flowcraft-modal-overlay" onClick={() => setExportModalOpen(false)}>
      <div className="flowcraft-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flowcraft-modal-head">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-brass" />
            <h2>Export Flowcraft Diagram & Spec</h2>
          </div>
          <button className="flowcraft-insp-close" onClick={() => setExportModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flowcraft-modal-tabs">
          <button
            className={`flowcraft-mtab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            <FileCode size={13} className="inline mr-1" /> JSON Spec
          </button>
          <button
            className={`flowcraft-mtab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
          >
            <FileText size={13} className="inline mr-1" /> Markdown Narrative
          </button>
          <button
            className={`flowcraft-mtab ${activeTab === 'mermaid' ? 'active' : ''}`}
            onClick={() => setActiveTab('mermaid')}
          >
            <GitBranch size={13} className="inline mr-1" /> Mermaid.js Syntax
          </button>
        </div>

        {/* Body Code Preview */}
        <div className="flowcraft-modal-body">
          <pre className="flowcraft-code-block">{currentText}</pre>
        </div>

        {/* Footer Actions */}
        <div className="flowcraft-modal-foot">
          <button className="btn btn-ghost-outline" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={14} />
            <span>Download .{activeTab === 'json' ? 'json' : activeTab === 'markdown' ? 'md' : 'mmd'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
