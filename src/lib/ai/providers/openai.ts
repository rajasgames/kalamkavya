export interface StreamProviderOptions {
  systemPrompt: string;
  userMessage: string;
  baseUrl: string;
  model: string;
  apiKey?: string;
  signal: AbortSignal;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (code: 'network' | 'auth' | 'model' | 'rate_limit' | 'aborted' | 'unknown') => void;
}

export async function streamOpenAI({
  systemPrompt,
  userMessage,
  baseUrl,
  model,
  apiKey,
  signal,
  onChunk,
  onDone,
  onError,
}: StreamProviderOptions) {
  try {
    // Ensure base URL ends properly for OpenAI spec
    const base = baseUrl.replace(/\/+$/, '');
    const url = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000
      }),
      signal
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return onError('auth');
      if (response.status === 404) return onError('model');
      if (response.status === 429) return onError('rate_limit');
      return onError('network');
    }

    if (!response.body) {
      return onError('network');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the incomplete line in the buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        
        const dataStr = trimmed.slice(6).trim();
        if (dataStr === '[DONE]') {
          onDone();
          return;
        }

        try {
          const data = JSON.parse(dataStr);
          const content = data.choices?.[0]?.delta?.content;
          if (content !== undefined && content !== null) {
            onChunk(content);
          }
        } catch (e) {
          // Ignore parse errors on partial/malformed chunks and continue
          console.warn('Failed to parse SSE line:', dataStr);
        }
      }
    }
    
    // In case stream ends without [DONE] sentinel
    onDone();

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      onError('aborted');
    } else {
      onError('network');
    }
  }
}
