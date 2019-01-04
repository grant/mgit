import * as Octokit from '@octokit/rest';
const octokit = new Octokit();

/**
 * This file uses the octokit module to request GitHub's API
 * @see https://github.com/octokit/rest.js
 */

/**
 * Setup auth for GitHub.
 */
export async function auth() {
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

export async function test() {
  const d = await octokit.repos.listForUser({
    username: 'grant',
    per_page: 100,
    page: 3,
  });
  for (const datum of d.data) {
    console.log(datum.full_name);
  }
}

/**
 * Gets a list of repos for a user.
 * @param {string} username The username.
 */
export async function getRepos(username: string) {
  const data: any = await getAllAPIResults(octokit.repos.listForUser, {
    username,
    type: 'all',
    // sort?: "created" | "updated" | "pushed" | "full_name";
    // direction?: "asc" | "desc";
  });
  // const data: any = await getAllAPIResults(octokit.repos.list, {
  //   visibility: 'all',
  //   // affiliation: 'organization_member', //'owner, organization_member',
  //   sort:'full_name',
  //   direction:'desc',
  // });
  // const data: any = await getAllAPIResults(octokit.repos.listForks, {
  //   // type: 'all', // Can be one of `all`, `owner`, `member`.
  //   // sort: "created" | "updated" | "pushed" | "full_name"
    
  //   // sort: 'updated',
  //   username,
  // });
  for (const datum of data) {
    console.log(datum.full_name);
  }
  
  // const repos = await octokit.repos.listForUser({
  //   username,
  //   per_page: 100,
  //   page: 1,
  // });
  // return repos.data;
}

async function getAllAPIResults(apiMethod: Function, params: object) {
  const MAX_RESULTS_PER_PAGE = 100;

  let page = 1;
  let numResults = MAX_RESULTS_PER_PAGE;

  // We store all the data in a single array.
  let allData: object[] = [];
  // Method for calling the API
  async function callAPI() {
    console.log(`Calling API ${page}`);
    const res = await apiMethod({
      ...params,
      per_page: MAX_RESULTS_PER_PAGE,
      page,
    });
    numResults = res.data.length;
    allData = allData.concat(res.data);
  }

  // Call the API in a loop
  while(numResults === MAX_RESULTS_PER_PAGE) {
    ++page;
    await callAPI();
  }

  return allData;
}