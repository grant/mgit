import { Spinner } from 'cli-spinner';
export const spinner = new Spinner();

export const getGitURL = (name: string) => `git@github.com:${name}.git`;

const DEFAULT_RETRIES = 3;
const DEFAULT_DELAY_MS = 2000;

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { maxAttempts?: number; delayMs?: number } = {}
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? DEFAULT_RETRIES;
  const delayMs = opts.delayMs ?? DEFAULT_DELAY_MS;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr;
}

export function formatDuration(ms: number): string {
  const sec = ms / 1000;
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const secFloor = Math.floor(sec);
  const min = Math.floor(secFloor / 60);
  const s = secFloor % 60;
  if (min < 60) return s ? `${min}m ${s}s` : `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m || s ? `${h}h ${m}m ${s}s` : `${h}h`;
}