import { Octokit } from '@octokit/rest';
import { readGlobalConfig } from '../globalConfig.js';

let octokitInstance: Octokit | null = null;

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    throw new Error('Run loadAPICredentials() first.');
  }
  return octokitInstance;
}

export async function loadAPICredentials(): Promise<void> {
  const globalConfig = await readGlobalConfig();
  const token = globalConfig?.token ?? null;
  if (!token) {
    throw new Error('mgit is not set up.');
  }
  octokitInstance = new Octokit({ auth: token });
}
