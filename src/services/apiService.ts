// Serviço de Conexão com API Backend & Coletores - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

import { Mention } from '../types/monitor';

export async function runSocialListeningScan(
  term: string,
  sensitiveTerms: string[] = [],
  channels: string[] = ['instagram']
): Promise<Mention[]> {
  try {
    const response = await fetch('api/collector/runner.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term,
        sensitive_terms: sensitiveTerms,
        channels
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.mentions)) {
      return data.mentions;
    }
    return [];
  } catch (error) {
    console.warn('Falha na requisição ao coletor backend, utilizando gerador contextual:', error);
    return [];
  }
}

export async function fetchPersistedMentions(
  channel?: string,
  sentiment?: string
): Promise<Mention[]> {
  try {
    const params = new URLSearchParams();
    if (channel && channel !== 'all') params.append('channel', channel);
    if (sentiment && sentiment !== 'all') params.append('sentiment', sentiment);

    const response = await fetch(`api/mentions/feed.php?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.mentions)) {
      return data.mentions;
    }
    return [];
  } catch (error) {
    console.warn('Falha ao carregar menções persistidas do backend:', error);
    return [];
  }
}
