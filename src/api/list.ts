import { AccountType, getAccountType } from './utils';

import { Response } from '@octokit/rest';
import { octokit } from '../github/auth';
import { spinner } from './../utils';

// Page page size with GitHub API
const MAX_PAGE_SIZE = 100;

/**
 * Gets the number of repos (public + private) by a user.
 * @param {string} username The name of the user/org.
 */
const getNumRepos = async (username: string) => {
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
 * Lists the user/repo names.
 * @param {string} username The GitHub username or org name.
 */
export async function apilist(username: string): Promise<any> {
  // Setup
  let allData: any[] = [];
  let page = 1;
  let listIsEmpty = false;

  const totalRepos = await getNumRepos(username);

  // Gets a list of repos as a specific page.
  const getList: (page: number) => Promise<Response<any>> = async (page: number) => {
    const rangeStart = (page - 1) * MAX_PAGE_SIZE;
    const rangeEnd = Math.min(page * MAX_PAGE_SIZE, totalRepos);
    const rangeString = `Getting repos ${rangeStart}-${rangeEnd}/${totalRepos}...`;
    spinner.setSpinnerTitle(rangeString);
    return await octokit.repos.listForUser({
      username,
      per_page: MAX_PAGE_SIZE,
      page,
    });
  };

  // Get full list until empty.
  spinner.start();
  while (!listIsEmpty) {
    const list = await getList(page);
    allData = allData.concat(list.data);
    if (list.data.length < MAX_PAGE_SIZE) {
      listIsEmpty = true;
    } else {
      ++page;
    }
  }

  // List all names.
  spinner.stop(true);
  return allData;
}