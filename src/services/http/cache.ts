export function getFromStorage<T>(key: string, maxAgeMs: number): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const { data, timestamp } = JSON.parse(raw) as { data: T; timestamp: number };
        const isExpired = Date.now() - timestamp > maxAgeMs;
        return isExpired ? null : data;
    } catch {
        return null;
    }
}

export function saveToStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}