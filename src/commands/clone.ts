import { getGitURL, spinner } from './../utils';

import { apilist } from '../api/list';
import { clone as gitClone } from '../git/git';
import { loadAPICredentials } from '../github/auth';

/**
 * Clones all user/org repos.
 * @param {string} username The GitHub username or org name.
 */
export async function clone(username: string) {
  if (typeof username !== 'string') {
    // TODO: Support (mgit clone)
    return console.log('user/repo is required!');
  }
  await loadAPICredentials();
  const data = await apilist(username);

  // Clone all repos
  console.log(`Cloning ${data.length} repos...`);
  for (const datum of data) {
    const gitURL = getGitURL(datum.full_name);
    await gitClone(gitURL, datum.name);
  }
}