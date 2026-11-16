// Cliente HTTP para la API de Ollama (/api/chat). Usa fetch nativo de Node 18+
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3';
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 60000;

// mensajes: [{ role: 'system'|'user'|'assistant', content: string }]
async function llamarOllama(mensajes) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: mensajes,
        stream: false,
        options: { temperature: 0.4, num_predict: 400 },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Ollama respondio ${res.status}`);
    }

    const data = await res.json();
    const texto = data?.message?.content?.trim();
    if (!texto) throw new Error('Respuesta vacia de Ollama');
    return texto;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { llamarOllama };
