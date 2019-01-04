import * as Octokit from '@octokit/rest';
const octokit = new Octokit();

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

/**
 * Gets a list of repos for a user.
 * @param {string} username The username.
 */
export async function getRepos(username: string) {
  const repos = await octokit.repos.listForUser({
    username,
    per_page: 100,
  });
  repos.data.map((repo: any) => {
    console.log(repo.full_name);
  });
  return [];
}