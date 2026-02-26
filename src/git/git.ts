import { simpleGit, SimpleGit } from 'simple-git';
import fs from 'node:fs/promises';
import { spinner, withRetry } from '../utils.js';

const defaultGit = simpleGit(process.cwd());

const GIT_CLONE_PERCENT = /(\d+)%/g;

function createGitWithProgress(onProgress: (percent: number) => void): SimpleGit {
  return simpleGit(process.cwd()).outputHandler((_cmd, _stdout, stderr) => {
    if (!stderr) return;
    const onData = (chunk: Buffer | string) => {
      const s = chunk.toString();
      let last = 0;
      let m: RegExpExecArray | null;
      GIT_CLONE_PERCENT.lastIndex = 0;
      while ((m = GIT_CLONE_PERCENT.exec(s)) !== null) last = parseInt(m[1], 10);
      if (last) onProgress(Math.min(100, last));
    };
    stderr.on('data', onData);
  });
}

export type CloneResult = 'new' | 'exists';

export async function clone(
  gitURL: string,
  path: string,
  spinnerTitle?: string,
  opts?: { noSpinner?: boolean; onProgress?: (percent: number) => void }
): Promise<CloneResult> {
  const exists = await fs.access(path).then(() => true).catch(() => false);
  if (exists) {
    return 'exists';
  }
  if (!opts?.noSpinner) {
    const title = spinnerTitle ?? `Cloning ${gitURL}...`;
    spinner.setSpinnerTitle(title).start();
  }
  const git = opts?.onProgress ? createGitWithProgress(opts.onProgress) : defaultGit;
  await withRetry(() => git.clone(gitURL, path), { maxAttempts: 3, delayMs: 2000 });
  if (!opts?.noSpinner) spinner.stop(true);
  return 'new';
}
