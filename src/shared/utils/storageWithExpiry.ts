/**
 * Armazena item no localStorage com tempo de expiração
 * @param key - Chave para armazenar o item
 * @param value - Valor a ser armazenado
 * @param ttlMs - Tempo de vida em milissegundos
 */
export function setWithExpiry(
  key: string,
  value: unknown,
  ttlMs?: number | null,
) {
  const now = Date.now();

  const item =
    ttlMs == null
      ? { value }
      : {
          value,
          expiresAt: now + ttlMs,
        };

  localStorage.setItem(key, JSON.stringify(item));
}
/**
 * Recupera item do localStorage com tempo de expiração
 * @param key - Chave para recuperar o item
 * @returns O item se existir e não estiver expirado, caso contrário null
 */
export function getWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  let item: unknown;
  try {
    item = JSON.parse(itemStr);
  } catch {
    localStorage.removeItem(key);
    return null;
  }

  const expiresAt = (item as { expiresAt?: unknown }).expiresAt;
  if (typeof expiresAt === "number" && Date.now() > expiresAt) {
    localStorage.removeItem(key);
    return null;
  }

  return (item as { value?: unknown }).value as T;
}
