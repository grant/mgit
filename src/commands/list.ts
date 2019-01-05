import { apilist } from '../api/list';
import { loadAPICredentials } from '../github/auth';
import { spinner } from './../utils';

/**
 * Lists the user/repo names.
 * @param {string} username The GitHub username or org name.
 */
export async function list(username: string) {
  if (typeof username !== 'string') {
    // TODO: Support (mgit list)
    return console.log('Username is required!');
  }
  await loadAPICredentials();
  const data = await apilist(username);

  // List all names.
  for (const datum of data) {
    console.log(datum.full_name);
  }
}