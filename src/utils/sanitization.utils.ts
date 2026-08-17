/**
 * Trims leading/trailing whitespace and replaces multiple consecutive spaces with a single space.
 */
export function sanitizeString(input?: string): string {
  if (!input) return '';
  return input.trim().replace(/\s+/g, ' ');
}
