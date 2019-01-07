import * as simplegit from 'simple-git/promise';

import { apilist } from '../api/list';
import { loadAPICredentials } from '../github/auth';
import { spinner } from './../utils';

const git = simplegit(process.env.PWD);

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
  console.log(`Cloning ${data.length} repos...`);

  // List all names.
  spinner.setSpinnerTitle('Cloning repos');
  for (const datum of data) {
    const gitURL = `git@github.com:${datum.full_name}.git`;
    // TODO Clone in folder.
    // TODO Skip already cloned directories.
    await git.clone(gitURL, '.');
    console.log(`Cloned: ${gitURL}`);
  }
}