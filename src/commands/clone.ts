import { apilist } from '../api/list';
import { loadAPICredentials } from '../github/auth';
import { spinner } from './../utils';

const simpleGit = require('simple-git')(process.env.PWD);

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

  // List all names.
  spinner.setSpinnerTitle('Cloning repos');
  for (const datum of data) {
    const gitURL = `git@github.com:${datum.full_name}.git`;
    simpleGit.clone(gitURL, () => {
      console.log(`Cloned: ${gitURL}`);
    });
  }
}