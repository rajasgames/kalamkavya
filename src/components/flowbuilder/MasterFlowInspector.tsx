import { useState, useMemo } from 'react';
import { X, Copy, Check, Trash2, ExternalLink, GitCommit } from 'lucide-react';
import useMasterFlowStore from './masterFlowStore';
import { useStoryStore } from '@/stores/storyStore';
import { getEntityTypeConfig, formatSpecId } from './entityTypeConfig';

const ENTITY_TYPE_OPTIONS = [
  { type: 'CHARACTER', label: 'Character' },
  { type: 'GOD', label: 'God / Cosmic' },
  { type: 'FACTION', label: 'Faction / Army' },
  { type: 'LOCATION', label: 'Location / Loka' },
  { type: 'WEAPON', label: 'Weapon / Astra' },
  { type: 'CULTURE', label: 'Culture / Vamsha' },
  { type: 'LORE', label: 'Lore / Knowledge' },
  { type: 'SCENE', label: 'Scene / Process' },
];

interface MasterFlowInspectorProps {
  onEntitySelect?: (entityId: string) => void;
}

export function MasterFlowInspector({ onEntitySelect }: MasterFlowInspectorProps) {
  const {
    selectedNodeId,
    selectedEdgeId,
    isInspectorOpen,
    setInspectorOpen,
    addToast,
    selectNode,
  } = useMasterFlowStore();

  const { entities, relationships, updateEntity, deleteEntity, deleteRelationship, addRelationship } = useStoryStore();

  const [copiedId, setCopiedId] = useState(false);

  // Selected Entity Node lookup
  const selectedEntity = useMemo(() => {
    if (!selectedNodeId) return null;
    return entities.find((e) => e.id === selectedNodeId) || null;
  }, [selectedNodeId, entities]);

  // Selected Edge Relationship lookup
  const selectedRelationship = useMemo(() => {
    if (!selectedEdgeId) return null;
    return relationships.find((r) => r.id === selectedEdgeId) || null;
  }, [selectedEdgeId, relationships]);

  // Incoming and outgoing relationships for the active node
  const nodeConnections = useMemo(() => {
    if (!selectedEntity) return [];
    return relationships
      .filter((r) => r.fromEntityId === selectedEntity.id || r.toEntityId === selectedEntity.id)
      .map((r) => {
        const isSource = r.fromEntityId === selectedEntity.id;
        const otherId = isSource ? r.toEntityId : r.fromEntityId;
        const otherEntity = entities.find((e) => e.id === otherId);
        return {
          relId: r.id,
          type: r.type,
          direction: isSource ? 'outgoing' : 'incoming',
          otherId,
          otherName: otherEntity?.name || 'Unknown Entity',
          otherType: otherEntity?.type || 'CHARACTER',
        };
      });
  }, [selectedEntity, relationships, entities]);

  if (!isInspectorOpen || (!selectedEntity && !selectedRelationship)) {
    return null;
  }

  const handleCopySpecId = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    setCopiedId(true);
    addToast(`Copied ${idStr} to clipboard`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleTypeChange = (newType: string) => {
    if (!selectedEntity) return;
    updateEntity({
      ...selectedEntity,
      type: newType,
      categorySlug: `${newType.toLowerCase()}s`,
    });
    addToast(`Changed type to ${newType}`, 'success');
  };

  const handleClassToggle = (newClass: 'MASTER' | 'INSTANCE') => {
    if (!selectedEntity) return;
    updateEntity({ ...selectedEntity, entityClass: newClass });
    addToast(`Updated entity class to ${newClass}`, 'info');
  };

  const handleDeleteNode = () => {
    if (!selectedEntity) return;
    deleteEntity(selectedEntity.id);
    addToast(`Deleted ${selectedEntity.name}`, 'info');
    setInspectorOpen(false);
  };

  const handleDeleteRel = (relId: string) => {
    deleteRelationship(relId);
    addToast('Removed relationship', 'info');
  };

  const getEntityNotes = (e: typeof selectedEntity) => {
    if (!e) return '';
    return ((e.data as Record<string, unknown>)?.notes || (e.data as Record<string, unknown>)?.description || '') as string;
  };

  return (
    <div className={`flowcraft-inspector ${isInspectorOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="flowcraft-insp-head">
        <div className="flex items-center gap-2">
          <GitCommit size={16} className="text-brass" />
          <h3>{selectedEntity ? 'Node Spec Inspector' : 'Edge Inspector'}</h3>
        </div>
        <button className="flowcraft-insp-close" onClick={() => setInspectorOpen(false)}>
          <X size={16} />
        </button>
      </div>

      {/* Body for Node Inspector */}
      {selectedEntity && (
        <div className="flowcraft-insp-body">
          {/* Spec ID Chip */}
          <div className="flowcraft-insp-field">
            <label>Spec Tag Identifier</label>
            <div className="flowcraft-insp-id">
              <span>{formatSpecId(selectedEntity.type, selectedEntity.id)}</span>
              <button
                onClick={() => handleCopySpecId(formatSpecId(selectedEntity.type, selectedEntity.id))}
                title="Copy Spec Tag ID"
              >
                {copiedId ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Title / Name */}
          <div className="flowcraft-insp-field">
            <label>Entity Title</label>
            <input
              type="text"
              className="flowcraft-insp-input"
              value={selectedEntity.name}
              onChange={(e) => updateEntity({ ...selectedEntity, name: e.target.value })}
              placeholder="Entity Name"
            />
          </div>

          {/* Description / Spec Notes */}
          <div className="flowcraft-insp-field">
            <label>Spec Notes / Summary</label>
            <textarea
              className="flowcraft-insp-input"
              rows={3}
              value={getEntityNotes(selectedEntity)}
              onChange={(e) =>
                updateEntity({
                  ...selectedEntity,
                  data: { ...(selectedEntity.data || {}), notes: e.target.value },
                })
              }
              placeholder="Add technical specification or scene notes..."
            />
          </div>

          {/* Type Selector Grid */}
          <div className="flowcraft-insp-field">
            <label>Node Category / Archetype</label>
            <div className="flowcraft-type-grid">
              {ENTITY_TYPE_OPTIONS.map(({ type, label }) => {
                const cfg = getEntityTypeConfig(type);
                const isActive = selectedEntity.type.toUpperCase() === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`flowcraft-type-opt ${isActive ? 'active' : ''}`}
                    style={isActive ? ({ '--accent': cfg.color } as React.CSSProperties) : undefined}
                  >
                    <span className="text-sm">{cfg.icon}</span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entity Class Toggle (MASTER vs INSTANCE) */}
          <div className="flowcraft-insp-field">
            <label>Entity Hierarchy Scope</label>
            <div className="flowcraft-style-toggle">
              <button
                className={selectedEntity.entityClass === 'MASTER' ? 'active' : ''}
                onClick={() => handleClassToggle('MASTER')}
              >
                Master Root
              </button>
              <button
                className={selectedEntity.entityClass === 'INSTANCE' ? 'active' : ''}
                onClick={() => handleClassToggle('INSTANCE')}
              >
                Derived Instance
              </button>
            </div>
          </div>

          {/* Connected Entities */}
          <div className="flowcraft-insp-field">
            <label>Linked Node Connections ({nodeConnections.length})</label>
            <div className="flowcraft-conn-list">
              {nodeConnections.length === 0 ? (
                <div className="flowcraft-conn-empty">No active connections. Drag node handles to connect.</div>
              ) : (
                nodeConnections.map((conn) => {
                  const cfg = getEntityTypeConfig(conn.otherType);
                  return (
                    <div key={conn.relId} className="flowcraft-conn-item">
                      <span className="dir font-mono">{conn.direction === 'outgoing' ? '→' : '←'}</span>
                      <span style={{ color: cfg.color }}>{cfg.icon}</span>
                      <span
                        className="flex-1 truncate font-medium hover:text-brass cursor-pointer"
                        onClick={() => selectNode(conn.otherId)}
                      >
                        {conn.otherName}
                      </span>
                      <span className="text-[10px] font-mono opacity-60 uppercase">{conn.type}</span>
                      <button
                        onClick={() => handleDeleteRel(conn.relId)}
                        className="text-ghost hover:text-coral transition-colors"
                        title="Unlink connection"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inspector Actions */}
          <div className="flowcraft-insp-actions">
            {onEntitySelect && (
              <button
                className="btn btn-ghost-outline"
                onClick={() => onEntitySelect(selectedEntity.id)}
              >
                <ExternalLink size={13} /> Full Dossier
              </button>
            )}
            <button className="btn btn-danger" onClick={handleDeleteNode}>
              <Trash2 size={13} /> Delete Node
            </button>
          </div>
        </div>
      )}

      {/* Body for Edge Inspector */}
      {selectedRelationship && (
        <div className="flowcraft-insp-body">
          <div className="flowcraft-insp-field">
            <label>Relationship Spec Type</label>
            <input
              type="text"
              className="flowcraft-insp-input font-mono uppercase"
              value={selectedRelationship.type}
              onChange={(e) => {
                const newType = e.target.value.toUpperCase().replace(/\s+/g, '_');
                deleteRelationship(selectedRelationship.id);
                addRelationship({
                  ...selectedRelationship,
                  type: newType,
                });
              }}
              placeholder="e.g. ALLY_OF, LOCATED_IN, WIELDS"
            />
          </div>

          <div className="flowcraft-insp-actions">
            <button
              className="btn btn-danger w-full"
              onClick={() => {
                deleteRelationship(selectedRelationship.id);
                addToast('Deleted edge connection', 'info');
                setInspectorOpen(false);
              }}
            >
              <Trash2 size={13} /> Unlink Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
