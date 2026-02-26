import path from 'node:path';
import fs from 'node:fs/promises';

const CONFIG_FILENAME = '.mgit.json';

export interface MgitConfig {
  owner: string;
  repos: string[];
}

function configPath(cwd: string = process.cwd()): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export async function readConfig(cwd: string = process.cwd()): Promise<MgitConfig | null> {
  const p = configPath(cwd);
  try {
    await fs.access(p);
  } catch {
    return null;
  }
  try {
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw) as MgitConfig;
  } catch {
    return null;
  }
}

export async function writeConfig(config: MgitConfig, cwd: string = process.cwd()): Promise<void> {
  const p = configPath(cwd);
  await fs.writeFile(p, JSON.stringify(config, null, 2), 'utf8');
}
