export function generateShortRef(length: number = 6): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36);
  return (timestamp + random).substring(0, Math.max(length, 6));
}
