import * as simplegit from 'simple-git/promise';

import chalk from 'chalk';
import { exec } from 'child_process';
import { join } from 'path';
import { spinner } from './../utils';

const fs = require('fs-extra');

const git = simplegit(process.env.PWD);

/**
 * Clones the repo using git.
 * @param {string} gitURL The GitHub URL.
 * @param {string} path The clone path.
 */
export async function clone(gitURL: string, path: string) {
  const exists = await fs.exists(path);
  if (!exists) {
    spinner.setSpinnerTitle(`Cloning ${gitURL}...`).start();
    await git.clone(gitURL, path);
    spinner.stop(true);
    console.log(chalk.green(`New: ${gitURL}`));
  } else {
    console.log(chalk.yellow(`Old: ${gitURL}`));
  }
}

/**
 * Gets the status of the repo.
 * @param {string} path The path of the git repo.
 */
export async function status(path: string) {
  const repoPath = join(path);
  const git = simplegit(repoPath);

  // We need to update the local version of our git repo.
  // git remote update && git status
  await git.remote(['update']);
  return git.status();
}

/**
 * Does a git pull on the git repo.
 * @param {string} path The path to the git repo.
 */
export async function pull(path: string) {
  const git = simplegit(path);
  const url = await getRemoteURL(path);
  // await git.pull(url);
}

/**
 * Does a git pushto the git repo.
 * @param {string} path The path to the git repo.
 */
export async function push(path: string) {
  const git = simplegit(path);
  await git.push(path);
}

/**
 * Gets the remote url for a git repo.
 * @param {string} path The relative path.
 */
async function getRemoteURL(path: string) {
  const url = exec(`cd ${path} && git config --get remote.origin.url`);
  console.log(url);
  return url;
}