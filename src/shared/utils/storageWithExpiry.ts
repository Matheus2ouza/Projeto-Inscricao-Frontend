/**
 * Set item in localStorage with expiry time
 * @param key - Key to store the item
 * @param value - Value to store
 * @param ttlMs - Time to live in milliseconds
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
 * Get item from localStorage with expiry time
 * @param key - Key to retrieve the item
 * @returns The item if it exists and is not expired, otherwise null
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
