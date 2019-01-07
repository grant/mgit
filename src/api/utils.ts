import { Response } from '@octokit/rest';
import { octokit } from '../github/auth';
import { spinner } from './../utils';

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
 * @param {string} name The GitHub account name.
 */
export async function getAccountType(name: string): Promise<AccountType> {
  try {
    await octokit.users.getByUsername({
      username: name,
    });
    return AccountType.USER;
  } catch(e) {
    // TODO remove
    console.log(e);
  }
  try {
    await octokit.orgs.get({
      org: name,
    });
    return AccountType.ORG;
  } catch(e) {
    // TODO remove
    console.log(e);
  }
  return AccountType.UNDEFINED;
}