import * as path from 'path';
import * as fs from 'fs';

const CONFIG_FILENAME = '.mgit.json';

export interface MgitConfig {
  owner: string;
  repos: string[];
}

function configPath(cwd: string = process.cwd()): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export function readConfig(cwd: string = process.cwd()): MgitConfig | null {
  const p = configPath(cwd);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(raw) as MgitConfig;
  } catch {
    return null;
  }
}

export function writeConfig(config: MgitConfig, cwd: string = process.cwd()): void {
  const p = configPath(cwd);
  fs.writeFileSync(p, JSON.stringify(config, null, 2), 'utf8');
}
