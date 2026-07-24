import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Scene, ConflictEntry } from '@/types';
import { BentoBox } from '@/components/ui/BentoBox';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Plus, CheckCircle2, Circle } from 'lucide-react';

interface ConflictRegisterCardProps {
  scene: Scene;
}

export function ConflictRegisterCard({ scene }: ConflictRegisterCardProps) {
  const { updateScene } = useStoryStore();
  const [entries, setEntries] = useState<ConflictEntry[]>(scene.planning?.conflictEntries || []);
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<ConflictEntry['severity']>('Medium');
  const [filter, setFilter] = useState<'All' | 'Open' | 'Resolved'>('Open');

  useEffect(() => {
    setEntries(scene.planning?.conflictEntries || []);
  }, [scene.id, scene.planning]);

  const saveEntries = async (newEntries: ConflictEntry[]) => {
    setEntries(newEntries);
    const newPlanning = { ...scene.planning, conflictEntries: newEntries };
    await updateScene({ ...scene, planning: newPlanning, updatedAt: Date.now() });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const entry: ConflictEntry = {
      id: crypto.randomUUID(),
      description: newDesc.trim(),
      severity: newSeverity,
      status: 'Open',
    };

    await saveEntries([...entries, entry]);
    setNewDesc('');
    setNewSeverity('Medium');
  };

  const toggleStatus = async (id: string) => {
    const newEntries = entries.map(e => 
      e.id === id ? { ...e, status: e.status === 'Open' ? 'Resolved' as const : 'Open' as const } : e
    );
    await saveEntries(newEntries);
  };

  const filteredEntries = entries.filter(e => filter === 'All' || e.status === filter);

  const getSeverityColor = (severity: ConflictEntry['severity']) => {
    switch (severity) {
      case 'High': return 'text-destructive bg-destructive/10 border-destructive/30';
      case 'Medium': return 'text-amber-from bg-amber-from/10 border-amber-from/30';
      case 'Low': return 'text-sage bg-sage/10 border-sage/30';
    }
  };

  return (
    <BentoBox title="Conflict Register" icon={<ShieldAlert size={18} />} variant="default">
      <div className="flex flex-col gap-4 mt-2">
        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          {(['All', 'Open', 'Resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === f 
                  ? 'bg-elevated border border-subtle text-primary font-medium shadow-sm' 
                  : 'text-ghost hover:text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-4 text-xs text-ghost italic border border-dashed border-subtle rounded-md">
              No {filter.toLowerCase()} conflicts found.
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                  entry.status === 'Resolved' ? 'bg-surface/50 border-subtle opacity-70' : 'bg-elevated border-subtle shadow-sm'
                }`}
              >
                <button onClick={() => toggleStatus(entry.id)} className="mt-0.5 shrink-0 hover:scale-110 transition-transform">
                  {entry.status === 'Resolved' ? (
                    <CheckCircle2 size={16} className="text-sage" />
                  ) : (
                    <Circle size={16} className="text-ghost hover:text-amber-from" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${entry.status === 'Resolved' ? 'line-through text-ghost' : 'text-primary'}`}>
                    {entry.description}
                  </p>
                  <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(entry.severity)}`}>
                    {entry.severity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New */}
        <form onSubmit={handleAdd} className="mt-2 pt-3 border-t border-subtle flex flex-col gap-2">
          <Input 
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Describe the conflict..."
            className="text-sm"
          />
          <div className="flex items-center gap-2">
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value as ConflictEntry['severity'])}
              className="bg-elevated border border-subtle rounded-lg px-2 py-1.5 text-xs text-primary focus:outline-none focus:border-amber-from"
            >
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
            <Button type="submit" variant="ghost" size="sm" className="ml-auto text-amber-from hover:bg-amber-from/10 hover:text-amber-from">
              <Plus size={16} /> Add
            </Button>
          </div>
        </form>
      </div>
    </BentoBox>
  );
}
