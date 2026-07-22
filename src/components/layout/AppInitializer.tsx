import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/db';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { useUIStore } from '@/stores/uiStore';

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const setActiveProject = useStoryStore((state) => state.setActiveProject);
  const setProvider = useAIStore((state) => state.setProvider);

  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      try {
        // 1. Open Database
        await db.open();

        // 2. Load AI Settings
        const aiSettings = await db.aiSettings.toArray();
        if (aiSettings.length > 0) {
          useAIStore.getState().hydrateSettings(aiSettings[0]);
        } else {
          const defaultSettings = {
            id: 'global' as const,
            activeProvider: 'openai',
            providers: {
              openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 1000 },
              ollama: { baseUrl: 'http://localhost:11434/api/chat', model: 'llama3', temperature: 0.7, maxTokens: 1000 },
              groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-8b-instant', temperature: 0.7, maxTokens: 1000 },
              openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: '', temperature: 0.7, maxTokens: 1000 },
              lmstudio: { baseUrl: 'http://localhost:1234/v1', model: '', temperature: 0.7, maxTokens: 1000 }
            },
            profile: {
              tone: 'Epic',
              pov: 'Third Limited',
              proseStyle: ''
            }
          };
          await db.aiSettings.put(defaultSettings);
          useAIStore.getState().hydrateSettings(defaultSettings);
        }

        // 3. Load active project logic
        // Get the active project from Zustand persist (if it exists)
        // If Zustand persisted an activeProjectId, the onRehydrateStorage will handle calling setActiveProject
        // We will just await the full project fetch to ensure it is in memory.
        const state = useStoryStore.getState();
        if (state.activeProjectId) {
          await state.setActiveProject(state.activeProjectId);
        }

        // 4. Check if any projects exist
        const projectCount = await db.projects.count();
        if (projectCount === 0 && isMounted) {
          navigate('/'); // Auto-redirect to dashboard/empty state
        }

        // 5. Trigger Onboarding for First Time User
        const hasCompletedOnboarding = localStorage.getItem('kalam-kavya_onboarding_completed') === 'true';
        if (!hasCompletedOnboarding && isMounted) {
          useUIStore.getState().setOnboardingOpen(true);
        }
      } catch (error) {
        console.error('Failed to initialize app', error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    initApp();

    return () => {
      isMounted = false;
    };
  }, [navigate, setActiveProject, setProvider]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base">
        <svg
          className="animate-spin h-12 w-12 text-amber-from"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return <>{children}</>;
};
