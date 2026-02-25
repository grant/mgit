import chalk from 'chalk';
import { readConfig } from '../config.js';

export async function status() {
  const config = readConfig();
  if (!config) {
    console.log('No .mgit.json found. Run `mgit clone [owner]` first.');
    return;
  }

  console.log(chalk.bold(`${config.owner} (${config.repos.length} repos)`));
  config.repos.sort().forEach((name) => {
    console.log(`  ${config.owner}/${name}`);
  });
}
