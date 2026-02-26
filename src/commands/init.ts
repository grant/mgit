import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeGlobalConfig, getGlobalConfigPath, printInitPrompt } from '../globalConfig.js';

export async function init(tokenArg?: string): Promise<void> {
  let token = tokenArg?.trim();
  if (!token) {
    printInitPrompt('No token provided.', true);
    const rl = readline.createInterface({ input, output });
    token = (await rl.question('Paste your token (then press Enter): ')).trim();
    rl.close();
    if (!token) {
      console.error('No token entered.');
      process.exit(1);
    }
  }
  await writeGlobalConfig({ token });
  console.log('Token saved to ' + getGlobalConfigPath());
}
