import path from 'node:path';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

let octokitInstance: Octokit | null = null;

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    throw new Error('MGIT_TOKEN env variable is required. Run loadAPICredentials() first.');
  }
  return octokitInstance;
}

export async function loadAPICredentials(): Promise<void> {
  dotenv.config({ path: path.join(process.cwd(), '.env') });

  const token = process.env.MGIT_TOKEN;
  if (!token) {
    throw new Error(
      'MGIT_TOKEN is not set. Create a .env file in this directory with MGIT_TOKEN=your_github_token (or export MGIT_TOKEN). See README.'
    );
  }

  octokitInstance = new Octokit({ auth: token });
}
