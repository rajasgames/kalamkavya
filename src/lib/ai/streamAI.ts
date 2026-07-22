import { useAIStore } from '@/stores/aiStore';
import { streamOpenAI } from './providers/openai';
import { streamOllama } from './providers/local';

interface StreamAIParams {
  systemPrompt: string;
  userMessage: string;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (code: 'network' | 'auth' | 'model' | 'rate_limit' | 'aborted' | 'unknown') => void;
}

export async function streamAI({
  systemPrompt,
  userMessage,
  onChunk,
  onDone,
  onError,
}: StreamAIParams) {
  const store = useAIStore.getState();
  const abortController = new AbortController();
  
  store.startStream(abortController);
  
  const providerKey = store.activeProvider;
  const settings = store.providers[providerKey];
  
  const isLocalProvider = providerKey === 'lmstudio' || providerKey === 'ollama';
  const modelToUse = settings?.model || (isLocalProvider ? 'local-model' : '');

  if (!settings || !settings.baseUrl || !modelToUse) {
    useAIStore.setState({ isStreaming: false, abortController: null });
    onError('unknown');
    return;
  }

  const options = {
    systemPrompt,
    userMessage,
    baseUrl: settings.baseUrl,
    model: modelToUse,
    apiKey: settings.apiKey,
    signal: abortController.signal,
    onChunk: (text: string) => {
      useAIStore.getState().appendChunk(text);
      onChunk(text);
    },
    onDone: () => {
      useAIStore.setState({ isStreaming: false, abortController: null });
      onDone();
    },
    onError: (code: 'network' | 'auth' | 'model' | 'rate_limit' | 'aborted' | 'unknown') => {
      useAIStore.setState({ isStreaming: false, abortController: null });
      onError(code);
    }
  };

  if (providerKey === 'ollama') {
    await streamOllama(options);
  } else {
    // openai, groq, openrouter, lmstudio all use standard OpenAI SSE format
    await streamOpenAI(options);
  }
}
