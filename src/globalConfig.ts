import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const GLOBAL_CONFIG_FILENAME = '.mgit.json';

export interface GlobalConfig {
  token: string;
}

function globalConfigPath(): string {
  return path.join(os.homedir(), GLOBAL_CONFIG_FILENAME);
}

export async function readGlobalConfig(): Promise<GlobalConfig | null> {
  const p = globalConfigPath();
  try {
    await fs.access(p);
  } catch {
    return null;
  }
  try {
    const raw = await fs.readFile(p, 'utf8');
    const data = JSON.parse(raw) as { token?: string };
    return data.token ? { token: data.token } : null;
  } catch {
    return null;
  }
}

export async function writeGlobalConfig(config: GlobalConfig): Promise<void> {
  const p = globalConfigPath();
  await fs.writeFile(p, JSON.stringify(config, null, 2), 'utf8');
}

export function getGlobalConfigPath(): string {
  return globalConfigPath();
}

const INIT_RUN_LINE = 'Run: mgit init';
const TOKEN_URL_LINE =
  'Create a token at https://github.com/settings/tokens (repo scope)';

export function printInitPrompt(prefix: string, includeTokenUrl = false): void {
  console.error(prefix);
  console.error('');
  console.error(INIT_RUN_LINE);
  if (includeTokenUrl) {
    console.error('');
    console.error(TOKEN_URL_LINE);
  }
}
