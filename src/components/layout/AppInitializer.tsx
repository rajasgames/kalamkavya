import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/db';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { useUIStore } from '@/stores/uiStore';
import { IntroSplash } from './IntroSplash';

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
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
        const state = useStoryStore.getState();
        if (state.activeProjectId) {
          await state.setActiveProject(state.activeProjectId);
        }

        // 4. Check if any projects exist
        const projectCount = await db.projects.count();
        if (projectCount === 0 && isMounted) {
          navigate('/');
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

  return (
    <>
      {showSplash && <IntroSplash onComplete={() => setShowSplash(false)} />}
      {!isInitializing && children}
    </>
  );
};
