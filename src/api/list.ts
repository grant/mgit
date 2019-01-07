import { Response } from '@octokit/rest';
import { octokit } from '../github/auth';
import { spinner } from './../utils';

// Page page size with GitHub API
const MAX_PAGE_SIZE = 100;

/**
 * Lists the user/repo names.
 * @param {string} username The GitHub username or org name.
 */
export async function apilist(username: string): Promise<any> {
  // Setup
  let allData: any[] = [];
  let page = 1;
  let listIsEmpty = false;

  // Gets a list of repos as a specific page.
  const getList: (page: number) => Promise<Response<any>> = async (page: number) => {
    const rangeStart = (page - 1) * MAX_PAGE_SIZE;
    const rangeEnd = page * MAX_PAGE_SIZE;
    const rangeString = `Getting repos ${rangeStart}-${rangeEnd}...`;
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