import chalk from 'chalk';
import { status as gitStatus } from '../git/git';
import { loadAPICredentials } from '../github/auth';
import { promises } from 'fs';

/**
 * Gets the status of all git repos.
 */
export async function status() {
  await loadAPICredentials();
  const folders = await getFoldersInDir();
  folders.map(async (folder: string) => {
    const status = await gitStatus(folder);
    if (!status) return;

    // Color text
    const hasBehind = !!status.behind;
    const hasAhead = !!status.ahead;
    let behindText = `(behind ${status.behind})`;
    let aheadText = `(ahead ${status.ahead})`;
    if (hasBehind) {
      behindText = chalk.black.bgRed(behindText);
    } else {
      behindText = chalk.red.bgBlack(behindText);
    }
    if (hasAhead) {
      aheadText = chalk.black.bgYellow(aheadText);
    } else {
      aheadText = chalk.yellow.bgBlack(aheadText);
    }
    console.log(`${behindText} ${aheadText} ${folder}`);
  });
}

/**
 * Gets the folder names in a directory.
 * @param {string} folder The folder to search.
 * @return {string[]} The list of folder names.
 */
const getFoldersInDir: () => Promise<string[]> = async (folder = process.env.PWD || '') => {
  const subpaths = await promises.readdir(folder);
  const fileAndFolderStatsPromises = subpaths.map(async (path) => {
    return {
      path,
      isFile: (await promises.stat(path)).isFile(),
    };
  });
  const fileAndFolderStats = await Promise.all(fileAndFolderStatsPromises);
  const folderStats = fileAndFolderStats.filter((folderStat) => {
    return !folderStat.isFile;
  });
  const folderNames = folderStats.map((fileStat) => fileStat.path).sort();
  return folderNames;
};