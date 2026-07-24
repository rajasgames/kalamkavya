import { describe, it, expect, beforeEach } from 'vitest';
import { useAIStore } from './aiStore';

describe('aiStore', () => {
  beforeEach(() => {
    useAIStore.setState({
      isStreaming: false,
      activeProvider: 'lmstudio',
      providers: {
        openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 1000 },
        ollama: { baseUrl: 'http://localhost:11434/api/chat', model: 'llama3', temperature: 0.7, maxTokens: 1000 },
        groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-8b-instant', temperature: 0.7, maxTokens: 1000 },
        openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: '', temperature: 0.7, maxTokens: 1000 },
        lmstudio: { baseUrl: 'http://localhost:1234/v1', model: 'local-model', apiKey: 'lm-studio', temperature: 0.7, maxTokens: 1000 },
      },
      profile: {
        tone: 'Epic',
        pov: 'Third Limited',
        proseStyle: ''
      },
      abortController: null,
      streamedText: '',
    });
  });

  it('should change active provider', () => {
    useAIStore.getState().setProvider('ollama');
    expect(useAIStore.getState().activeProvider).toBe('ollama');
  });

  it('should update provider settings', () => {
    useAIStore.getState().updateProviderSettings('ollama', { model: 'mistral', temperature: 0.9 });
    const provider = useAIStore.getState().providers.ollama;
    expect(provider.model).toBe('mistral');
    expect(provider.temperature).toBe(0.9);
  });

  it('should update author profile settings', () => {
    useAIStore.getState().updateProfile({ tone: 'Dark Fantasy', proseStyle: 'Atmospheric' });
    const profile = useAIStore.getState().profile;
    expect(profile.tone).toBe('Dark Fantasy');
    expect(profile.proseStyle).toBe('Atmospheric');
    expect(profile.pov).toBe('Third Limited');
  });

  it('should manage streaming lifecycle and append text chunks', () => {
    const controller = new AbortController();
    useAIStore.getState().startStream(controller);

    expect(useAIStore.getState().isStreaming).toBe(true);
    expect(useAIStore.getState().abortController).toBe(controller);

    useAIStore.getState().appendChunk('The legendary warrior ');
    useAIStore.getState().appendChunk('stood at the threshold.');

    expect(useAIStore.getState().streamedText).toBe('The legendary warrior stood at the threshold.');

    useAIStore.getState().cancelStream();
    expect(useAIStore.getState().isStreaming).toBe(false);
    expect(useAIStore.getState().streamedText).toBe('The legendary warrior stood at the threshold.');

    useAIStore.getState().clearStream();
    expect(useAIStore.getState().streamedText).toBe('');
  });
});
