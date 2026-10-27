type ContentRow = { key: string; locale: string; value: string; type?: string };

export function getContent(
  rows: ContentRow[],
  key: string,
  fallback = "",
): string {
  return rows.find((row) => row.key === key)?.value ?? fallback;
}

export function getJsonContent<T>(
  rows: ContentRow[],
  key: string,
  fallback: T,
): T {
  const row = rows.find((entry) => entry.key === key);
  if (!row?.value) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}
