import { getOctokit } from '../github/auth.js';
import { spinner } from '../utils.js';

/**
 * The GitHub account type.
 */
export enum AccountType {
  USER,
  ORG,
  UNDEFINED,
}

/**
 * Gets the GitHub account type (user or organization).
 */
export async function getAccountType(name: string): Promise<AccountType> {
  const octokit = getOctokit();
  try {
    await octokit.rest.users.getByUsername({
      username: name,
    });
    return AccountType.USER;
  } catch {
    // not a user
  }
  try {
    await octokit.rest.orgs.get({
      org: name,
    });
    return AccountType.ORG;
  } catch {
    // not an org
  }
  return AccountType.UNDEFINED;
}
