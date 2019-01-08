import { Spinner } from 'cli-spinner';
export const spinner = new Spinner();

/**
 * Gets the git URL.
 * @param {string} name The name of the repo.
 * @example getGitURL('grant/ts2gas')
 */
export const getGitURL = (name: string) => {
  return `git@github.com:${name}.git`;
};