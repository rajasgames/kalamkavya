import React, { useState, useEffect } from 'react';
import { useAIStore } from '@/stores/aiStore';
import { db } from '@/lib/db';
import { ChevronDown, ChevronRight, Check, Loader2, Play } from 'lucide-react';
import { Input, Label, Textarea, Select, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

const PROVIDER_NAMES = {
  openai: 'OpenAI',
  ollama: 'Ollama',
  groq: 'Groq',
  openrouter: 'OpenRouter',
  lmstudio: 'LM Studio'
};

const TONE_OPTIONS = [
  { value: 'Epic', label: 'Epic' },
  { value: 'Intimate', label: 'Intimate' },
  { value: 'Gritty', label: 'Gritty' },
  { value: 'Whimsical', label: 'Whimsical' },
  { value: 'Clinical', label: 'Clinical' },
];

const POV_OPTIONS = [
  { value: 'First Person', label: 'First Person' },
  { value: 'Third Limited', label: 'Third Limited' },
  { value: 'Third Omniscient', label: 'Third Omniscient' },
  { value: 'Second', label: 'Second' },
];

export function AISettings() {
  const { 
    activeProvider, setProvider, 
    providers, updateProviderSettings,
    profile, updateProfile 
  } = useAIStore();

  const { showToast } = useToast();

  const [expandedProvider, setExpandedProvider] = useState<string | null>('openai');
  const [isDirty, setIsDirty] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Connection testing state per provider
  const [testingProviders, setTestingProviders] = useState<Record<string, boolean>>({});
  const [fetchedModels, setFetchedModels] = useState<Record<string, string[]>>({});
  const [showSetupGuide, setShowSetupGuide] = useState<Record<string, boolean>>({});

  // Debounced auto-save to IndexedDB
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isDirty) {
        try {
          await db.aiSettings.put({
            id: 'global',
            activeProvider,
            providers,
            profile
          });
          setIsDirty(false);
          setShowSaved(true);
          setTimeout(() => setShowSaved(false), 2000);
        } catch (e) {
          console.error("Failed to save AI settings to DB", e);
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [activeProvider, providers, profile, isDirty]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvider(e.target.value);
    setIsDirty(true);
  };

  const handleSettingChange = (providerKey: string, field: string, value: string | number) => {
    updateProviderSettings(providerKey, { [field]: value });
    setIsDirty(true);
  };

  const handleProfileChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
    setIsDirty(true);
  };

  const handleTestConnection = async (providerKey: string) => {
    const settings = providers[providerKey];
    if (!settings || !settings.baseUrl) {
      showToast("Endpoint not found — check your Base URL.", "error");
      return;
    }

    setTestingProviders(prev => ({ ...prev, [providerKey]: true }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      let url = `${settings.baseUrl}/models`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      // Ollama specific adjustments
      if (providerKey === 'ollama') {
        // Base URL is typically http://localhost:11434/api/chat
        // Let's strip anything after /api and append /tags
        const urlObj = new URL(settings.baseUrl);
        let path = urlObj.pathname;
        if (path.endsWith('/chat')) path = path.replace(/\/chat$/, '');
        if (path.endsWith('/api')) path = `${path}/tags`;
        else path = `${path}/api/tags`; // fallback
        url = `${urlObj.origin}${path}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        showToast("Invalid API Key — verify it in the field above.", "error");
        setTestingProviders(prev => ({ ...prev, [providerKey]: false }));
        return;
      }

      if (response.status === 404) {
        showToast("Endpoint not found — check your Base URL.", "error");
        setTestingProviders(prev => ({ ...prev, [providerKey]: false }));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let models: string[] = [];

      if (providerKey === 'ollama') {
        models = data.models ? data.models.map((m: { name: string }) => m.name) : [];
      } else {
        models = data.data ? data.data.map((m: { id: string }) => m.id) : [];
      }

      setFetchedModels(prev => ({ ...prev, [providerKey]: models }));
      showToast(`Connected! Found ${models.length} models.`, "success");

    } catch (e: unknown) {
      const err = e as Error;
      if (err.name === 'AbortError') {
        showToast("Connection timed out. Is the AI running?", "error");
      } else if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
        let msg = "Connection refused. Is the AI running?";
        if (!window.__TAURI__) {
          const origin = window.location.origin;
          msg += " Did you configure CORS?";
          if (providerKey === 'ollama') {
            msg = `Set OLLAMA_ORIGINS=${origin} before starting Ollama.`;
          } else if (providerKey === 'lmstudio') {
            msg = `In LM Studio → Local Server → CORS, add ${origin}`;
          }
        }
        showToast(msg, "error");
      } else {
        showToast(`Connection failed: ${err.message}`, "error");
      }
    } finally {
      setTestingProviders(prev => ({ ...prev, [providerKey]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 relative">
      <div className={`fixed bottom-8 right-8 bg-sage/20 border border-sage/50 text-sage px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-opacity duration-300 z-50 ${showSaved ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Check size={16} /> <span className="text-sm font-medium">Saved</span>
      </div>

      <section className="bg-surface border border-subtle rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-serif text-primary mb-4">Active Provider</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(PROVIDER_NAMES).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <input
                type="radio"
                name="activeProvider"
                value={key}
                checked={activeProvider === key}
                onChange={handleProviderChange}
                className="accent-amber-from w-4 h-4 cursor-pointer"
              />
              <span className="text-primary font-medium">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-serif text-primary">Provider Configurations</h2>
        {Object.entries(PROVIDER_NAMES).map(([key, label]) => {
          const isExpanded = expandedProvider === key;
          const settings = providers[key] || {};
          const isTesting = testingProviders[key] || false;
          const modelsList = fetchedModels[key] || [];
          const isLocalProvider = key === 'ollama' || key === 'lmstudio';
          
          return (
            <div key={key} className="border border-subtle rounded-xl bg-surface overflow-hidden shadow-sm">
              <button 
                onClick={() => setExpandedProvider(isExpanded ? null : key)}
                className="w-full px-6 py-4 flex items-center justify-between bg-surface hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{label}</span>
                  {activeProvider === key && (
                    <span className="text-[10px] uppercase tracking-wider bg-amber-from/20 text-amber-from px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                {isExpanded ? <ChevronDown size={20} className="text-ghost" /> : <ChevronRight size={20} className="text-ghost" />}
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-subtle flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Base URL</Label>
                      <Input
                        value={settings.baseUrl || ''}
                        onChange={(e) => handleSettingChange(key, 'baseUrl', e.target.value)}
                        className="font-mono text-[12px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Model ID</Label>
                      <Input
                        value={settings.model || ''}
                        onChange={(e) => handleSettingChange(key, 'model', e.target.value)}
                        className="font-mono text-[12px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        value={settings.apiKey || ''}
                        onChange={(e) => handleSettingChange(key, 'apiKey', e.target.value)}
                        className="font-mono text-[12px]"
                        placeholder={isLocalProvider ? 'Not required for local providers' : 'sk-...'}
                      />
                      <p className="text-ghost text-[11px] mt-1 italic">
                        Stored locally on your device only. Never sent to कalam काvya servers.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Temperature ({settings.temperature ?? 0.7})</Label>
                      <input 
                        type="range"
                        min="0" max="2" step="0.1"
                        value={settings.temperature ?? 0.7}
                        onChange={(e) => handleSettingChange(key, 'temperature', parseFloat(e.target.value))}
                        className="w-full accent-amber-from"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Tokens</Label>
                      <Input
                        type="number"
                        value={settings.maxTokens ?? 1000}
                        onChange={(e) => handleSettingChange(key, 'maxTokens', parseInt(e.target.value, 10))}
                        className="font-mono text-[12px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-subtle pt-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleTestConnection(key)}
                        disabled={isTesting}
                        className="shrink-0 flex items-center gap-2 bg-amber-from/10 text-amber-from hover:bg-amber-from/20 border border-amber-from/30"
                      >
                        {isTesting ? (
                          <><Loader2 size={16} className="animate-spin text-amber-from" /> Testing...</>
                        ) : (
                          <><Play size={16} /> Test Connection</>
                        )}
                      </Button>
                      
                      {isLocalProvider && (
                        <button
                          onClick={() => setShowSetupGuide(prev => ({ ...prev, [key]: !prev[key] }))}
                          className="text-xs font-medium text-ghost hover:text-primary transition-colors underline underline-offset-2"
                        >
                          {showSetupGuide[key] ? 'Hide Setup Guide' : 'View Setup Guide'}
                        </button>
                      )}
                    </div>

                    {modelsList.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Available Models</span>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {modelsList.map(model => (
                            <button
                              key={model}
                              onClick={() => handleSettingChange(key, 'model', model)}
                              className="px-2 py-1 bg-elevated border border-subtle rounded text-[11px] font-mono text-primary hover:border-amber-from hover:bg-amber-from/5 transition-colors"
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isLocalProvider && showSetupGuide[key] && !window.__TAURI__ && (
                      <div className="bg-elevated border border-subtle p-4 rounded-md text-sm mt-2">
                        <h4 className="font-semibold text-primary mb-2">Critical Configuration Notes for Local AI</h4>
                        <div className="text-secondary space-y-2">
                          <p><strong>The CORS Problem:</strong> Browsers block `fetch()` from `{window.location.origin}` to the local AI servers by default.</p>
                          {key === 'ollama' && (
                            <p className="text-destructive font-medium">
                              * <strong>Ollama Fix:</strong> Users must set env var: `OLLAMA_ORIGINS={window.location.origin}` before starting Ollama.
                            </p>
                          )}
                          {key === 'lmstudio' && (
                            <p className="text-destructive font-medium">
                              * <strong>LM Studio Fix:</strong> Users must enter `{window.location.origin}` in the LM Studio local server CORS box.
                            </p>
                          )}
                          <p>
                            * <strong>Safety Net:</strong> `ai.js` fetch must be wrapped in `try/catch`. On `TypeError: Failed to fetch`, UI must show: *"Connection refused. Is the AI running? Did you configure CORS?"*
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="bg-surface border border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-4">
        <h2 className="text-lg font-serif text-primary">Writing Profile</h2>
        <p className="text-secondary text-sm -mt-3 mb-2">Configure the inherent tone and style the AI uses when generating text.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={profile.tone}
              onValueChange={(val) => handleProfileChange('tone', val)}
              options={TONE_OPTIONS}
            />
          </div>
          <div className="space-y-2">
            <Label>Point of View (POV)</Label>
            <Select
              value={profile.pov}
              onValueChange={(val) => handleProfileChange('pov', val)}
              options={POV_OPTIONS}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Prose Style Notes</Label>
            <Textarea
              value={profile.proseStyle}
              onChange={(e) => handleProfileChange('proseStyle', e.target.value)}
              placeholder="e.g. Focus on sensory details, use short punchy sentences..."
              rows={3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
