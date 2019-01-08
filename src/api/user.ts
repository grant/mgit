import { AccountType, getAccountType } from './utils';

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

/**
 * Gets the number of repos (public + private) by a user.
 * @param {string} username The name of the user/org.
 */
export const getNumRepos = async (username: string) => {
  const accountType = await getAccountType(username);
  if (accountType === AccountType.USER) {
    const user = await octokit.users.getByUsername({
      username,
    });
    return user.data.public_repos; // TODO PRIVATE REPOS
  } else if (accountType === AccountType.ORG) {
    const org = await octokit.orgs.get({
      org: username,
    });
    return org.data.public_repos + org.data.owned_private_repos;
  }
  return -1; // Should never happen.
};

/**
 * Gets a list of users
 */
export const getUsers = async () => {
  const users = await octokit.users.list({

  });
  users.data.map((user) => {
    console.log(user.url);
  });
};