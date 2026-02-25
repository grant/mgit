import { simpleGit } from 'simple-git';
import chalk from 'chalk';
import fs from 'fs-extra';
import { spinner } from '../utils.js';

const git = simpleGit(process.cwd());

export async function clone(gitURL: string, path: string): Promise<void> {
  const exists = await fs.pathExists(path);
  if (!exists) {
    spinner.setSpinnerTitle(`Cloning ${gitURL}...`).start();
    await git.clone(gitURL, path);
    spinner.stop(true);
    console.log(chalk.green(`New: ${gitURL}`));
  } else {
    console.log(chalk.yellow(`Exists: ${path}`));
  }
}
