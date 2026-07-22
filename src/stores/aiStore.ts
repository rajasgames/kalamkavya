import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AIState, AIProviderSettings } from '@/types';

export const useAIStore = create<AIState>()(
  devtools(
    (set, get) => ({
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

      setProvider: (provider: string) => set({ activeProvider: provider }),
      
      updateProviderSettings: (provider: string, settings: Partial<AIProviderSettings>) => set((state) => ({
        providers: {
          ...state.providers,
          [provider]: {
            ...(state.providers[provider] || {}),
            ...settings
          }
        }
      })),

      hydrateSettings: (settings) => set((state) => ({
        activeProvider: settings.activeProvider || state.activeProvider,
        providers: {
          ...state.providers,
          ...settings.providers
        },
        profile: {
          ...state.profile,
          ...settings.profile
        }
      })),

      updateProfile: (profile) => set((state) => ({
        profile: {
          ...state.profile,
          ...profile
        }
      })),

      startStream: (controller: AbortController) => {
        set({
          isStreaming: true,
          abortController: controller,
          streamedText: '', // reset text on start
        });
      },

      cancelStream: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
        }
        set({
          isStreaming: false,
          abortController: null,
          // streamedText is intentionally not cleared so whatever we had is kept
        });
      },

      appendChunk: (text: string) => {
        set((state) => ({
          streamedText: state.streamedText + text,
        }));
      },

      clearStream: () => {
        set({ streamedText: '' });
      },
    }),
    { enabled: import.meta.env.DEV }
  )
);
