import * as Octokit from '@octokit/rest';

/**
 * This file uses the octokit module to request GitHub's API
 * @see https://github.com/octokit/rest.js
 */
export const octokit = new Octokit();

/**
 * Setup auth for GitHub.
 */
export async function loadAPICredentials() {
  // https://github.com/settings/applications/960504
  // Personal Access Token
  const MGIT_TOKEN = process.env.MGIT_TOKEN;
  if (!MGIT_TOKEN) {
    return console.log(`MGIT_TOKEN env variable must be provided. See README.`);
  }

  octokit.authenticate({
    type: 'oauth',
    token: MGIT_TOKEN,
  });
}
