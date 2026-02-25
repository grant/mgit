import { getGitURL } from '../utils.js';
import { apilist } from '../api/list.js';
import { getAuthenticatedUserLogin } from '../api/user.js';
import { clone as gitClone } from '../git/git.js';
import { loadAPICredentials } from '../github/auth.js';
import { readConfig, writeConfig } from '../config.js';

export async function clone(ownerArg?: string) {
  await loadAPICredentials();
  const owner = ownerArg && ownerArg.trim() ? ownerArg.trim() : await getAuthenticatedUserLogin();
  const data = await apilist(owner);

  console.log(`Cloning ${data.length} repositories...`);
  const repoNames: string[] = [];
  for (const datum of data) {
    const gitURL = getGitURL(datum.full_name);
    await gitClone(gitURL, datum.name);
    repoNames.push(datum.name);
  }

  const existing = readConfig();
  writeConfig({
    owner,
    repos: existing && existing.owner === owner ? Array.from(new Set([...existing.repos, ...repoNames])) : repoNames,
  });
}
