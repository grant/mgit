import { AccountType, getAccountType } from './utils.js';
import { getNumRepos } from './user.js';
import { getOctokit } from '../github/auth.js';
import { spinner, withRetry } from '../utils.js';

const MAX_PAGE_SIZE = 100;

export interface RepoInfo {
  full_name: string;
  name: string;
  archived: boolean;
}

export async function apilist(owner: string): Promise<RepoInfo[]> {
  const accountType = await getAccountType(owner);
  if (accountType === AccountType.UNDEFINED) {
    throw new Error(`Unknown user or org: ${owner}`);
  }

  let allData: RepoInfo[] = [];
  let page = 1;
  let listIsEmpty = false;
  const totalRepos = await getNumRepos(owner);

  const octokit = getOctokit();
  const getList = async (p: number) => {
    const rangeStart = (p - 1) * MAX_PAGE_SIZE;
    const rangeEnd = Math.min(p * MAX_PAGE_SIZE, totalRepos);
    spinner.setSpinnerTitle(`Getting repos from ${owner} ${rangeStart}-${rangeEnd}/${totalRepos}...`);
    if (accountType === AccountType.ORG) {
      return await octokit.rest.repos.listForOrg({
        org: owner,
        per_page: MAX_PAGE_SIZE,
        page: p,
      });
    }
    return await octokit.rest.repos.listForUser({
      username: owner,
      per_page: MAX_PAGE_SIZE,
      page: p,
    });
  };

  spinner.start();
  while (!listIsEmpty) {
    const list = await withRetry(() => getList(page), { maxAttempts: 3, delayMs: 1000 });
    const pageData = list.data.map((r) => ({
      full_name: r.full_name,
      name: r.name,
      archived: r.archived ?? false,
    }));
    allData = allData.concat(pageData);
    if (list.data.length < MAX_PAGE_SIZE) {
      listIsEmpty = true;
    } else {
      page++;
    }
  }
  spinner.stop(true);
  return allData;
}
