import { AccountType, getAccountType } from './utils.js';
import { getOctokit } from '../github/auth.js';

/** Returns the authenticated user's login (requires MGIT_TOKEN to be set and loaded). */
export async function getAuthenticatedUserLogin(): Promise<string> {
  const { data } = await getOctokit().rest.users.getAuthenticated();
  return data.login;
}

export const getNumRepos = async (username: string): Promise<number> => {
  const octokit = getOctokit();
  const accountType = await getAccountType(username);
  if (accountType === AccountType.USER) {
    const user = await octokit.rest.users.getByUsername({ username });
    return user.data.public_repos ?? 0;
  }
  if (accountType === AccountType.ORG) {
    const org = await octokit.rest.orgs.get({ org: username });
    return (org.data.public_repos ?? 0) + (org.data.owned_private_repos ?? 0);
  }
  return -1;
};
