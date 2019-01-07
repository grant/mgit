import { Response } from '@octokit/rest';
import { octokit } from '../github/auth';

/**
 * Gets data for a user/org
 * @param {string} username The GitHub username or org name.
 */
export async function get(username: string): Promise<Response<any>> {
  return await octokit.orgs.get({
    org: username,
  });
}