import * as simplegit from 'simple-git/promise';

import { join } from 'path';

const git = simplegit(process.env.PWD);

/**
 * Clones the repo using git.
 * @param {string} gitURL The GitHub URL.
 * @param {string} path The clone path.
 */
export async function clone(gitURL: string, path = '.') {
  return git.clone(gitURL, path);
}

/**
 * Gets the status of the repo.
 * @param {string} path The path of the git repo.
 */
export async function status(path: string) {
  const repoPath = join(path);
  const git = simplegit(repoPath);
  return git.status();
}