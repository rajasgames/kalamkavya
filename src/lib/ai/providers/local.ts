import { StreamProviderOptions } from './openai';

export async function streamOllama({
  systemPrompt,
  userMessage,
  baseUrl,
  model,
  signal,
  onChunk,
  onDone,
  onError,
}: StreamProviderOptions) {
  try {
    const base = baseUrl.replace(/\/+$/, '');
    const url = base.endsWith('/api/chat') ? base : `${base}/api/chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      if (response.status === 404) return onError('model');
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
        if (!trimmed) continue;

        try {
          const data = JSON.parse(trimmed);
          
          if (data.message?.content) {
            onChunk(data.message.content);
          }
          
          if (data.done) {
            onDone();
            return;
          }
        } catch (e) {
          console.warn('Failed to parse Ollama NDJSON line:', trimmed);
        }
      }
    }
    
    onDone();

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      onError('aborted');
    } else {
      onError('network');
    }
  }
}
