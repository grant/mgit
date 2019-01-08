import { apilist } from '../api/list';
import { getGitURL } from '../utils';
import { pull as gitPull } from '../git/git';
import { loadAPICredentials } from '../github/auth';

/**
 * Pulls all repos.
 * @param {string} username The GitHub username.
 */
export async function pull(username: string) {
  if (typeof username !== 'string') {
    // TODO: Support (mgit pull)
    return console.log('Username is required!');
  }
  await loadAPICredentials();
  const data = await apilist(username);
  for (const datum of data) {
    console.log(datum.full_name);
    const gitURL = getGitURL(datum.full_name);
    gitPull(gitURL);
  }
}