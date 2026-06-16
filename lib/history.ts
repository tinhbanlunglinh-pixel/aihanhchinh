import { DocTemplate } from './templateData';

const HISTORY_KEY = 'ai_doc_history_v1';

export interface HistoryItem {
  id: string;
  timestamp: number;
  doc: DocTemplate;
}

export function saveHistory(doc: DocTemplate) {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const newItem: HistoryItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    doc
  };
  
  history.unshift(newItem);
  
  // Clean up old history (> 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const filtered = history.filter(item => item.timestamp > oneWeekAgo);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}
