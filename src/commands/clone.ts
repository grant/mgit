import chalk from 'chalk';
import { getGitURL, formatDuration, spinner } from '../utils.js';
import { apilist } from '../api/list.js';
import type { RepoInfo } from '../api/list.js';
import { getAuthenticatedUserLogin } from '../api/user.js';
import { clone as gitClone } from '../git/git.js';
import { loadAPICredentials } from '../github/auth.js';
import { readConfig, writeConfig } from '../config.js';

const CHECK = '✓';
const EXISTS = '−';
const CROSS = '✗';
const SKIP = '⏱';
const FAST_MS = 1000;
const DEFAULT_CLONE_TIMEOUT_SEC = 5 * 60; // 5 minutes
const TIMEOUT_NOTE_AFTER_MS = 1 * 60 * 1000; // show " / Xm" after 1 min
const ELAPSED_INTERVAL_MS = 100;
const INDEX_WIDTH = 7; // "  1/305"
const TIME_WIDTH = 10; // "    14s", "  1m 58s"

const CLONE_TIMEOUT_ERR = Symbol('CLONE_TIMEOUT');

function tableRow(
  status: string,
  ms: number,
  index: number,
  total: number,
  name: string,
  nameWidth: number,
  opts: { failed?: boolean; skipped?: boolean; fast?: boolean },
): string {
  const time = formatDuration(ms).padStart(TIME_WIDTH);
  const idx = `${index}/${total}`.padStart(INDEX_WIDTH);
  const nameCol = name.padEnd(nameWidth);
  const line = `${status} ${time}  ${idx}  ${nameCol}`;
  if (opts.failed) return chalk.red(line);
  if (opts.skipped) return chalk.yellow(line);
  const colored = chalk.green(line);
  return opts.fast ? chalk.dim(colored) : colored;
}

export async function clone(
  ownerArg?: string,
  opts?: { pull?: boolean; timeout?: string },
) {
  const start = Date.now();
  await loadAPICredentials();
  const owner = ownerArg?.trim()
    ? ownerArg.trim()
    : await getAuthenticatedUserLogin();
  const allRepos = await apilist(owner);
  const archivedCount = allRepos.filter((r) => r.archived).length;
  const data = allRepos.filter((r) => !r.archived);
  if (archivedCount > 0) {
    console.log(chalk.dim(`Skipping ${archivedCount} archived repos.`));
  }

  const rawTimeout =
    opts?.timeout != null
      ? Number(String(opts.timeout))
      : DEFAULT_CLONE_TIMEOUT_SEC;
  const timeoutSec = Number.isNaN(rawTimeout)
    ? DEFAULT_CLONE_TIMEOUT_SEC
    : Math.max(1, rawTimeout);
  const cloneTimeoutMs = timeoutSec * 1000;
  const timeoutLabel = formatDuration(cloneTimeoutMs);

  const total = data.length;
  const nameWidth = Math.min(
    50,
    Math.max(28, ...data.map((d) => d.full_name.length)),
  );
  console.log(`Cloning ${total} repositories from ${owner}...`);
  const header =
    `  ${'Time'.padStart(TIME_WIDTH)}  ${'#'.padStart(INDEX_WIDTH)}  ${'Repo'.padEnd(nameWidth)}`;
  console.log(chalk.dim(header));

  const repoNames: string[] = [];
  const skipped: RepoInfo[] = [];
  let newCount = 0;
  let existsCount = 0;
  let failedCount = 0;

  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    const repoStart = Date.now();
    let clonePercent: number | null = null;

    const updateSpinnerWithElapsed = () => {
      const repoElapsed = Date.now() - repoStart;
      const totalElapsed = Date.now() - start;
      const totalSec = totalElapsed / 1000;
      const totalElapsedStr =
        totalSec >= 60
          ? `${Math.floor(totalSec / 60)}m ${(totalSec % 60).toFixed(1)}s`
          : `${totalSec.toFixed(1)}s`;
      const percent = Math.round(((i + 1) / total) * 100);
      const clonePctStr = clonePercent != null ? ` (${clonePercent}%)` : '';
      const timePart =
        repoElapsed >= TIMEOUT_NOTE_AFTER_MS
          ? `${formatDuration(repoElapsed)} / ${timeoutLabel}`
          : formatDuration(repoElapsed);
      const time = timePart.padStart(TIME_WIDTH);
      const idx = `${i + 1}/${total}`.padStart(INDEX_WIDTH);
      const nameCol = datum.full_name.padEnd(nameWidth);
      spinner.setSpinnerTitle(
        `${time}  ${idx}  ${nameCol} · Total progress ${percent}% - Elapsed ${totalElapsedStr}${clonePctStr}`,
      );
    };

    updateSpinnerWithElapsed();
    spinner.start();
    const interval = setInterval(updateSpinnerWithElapsed, ELAPSED_INTERVAL_MS);

    let rowToPrint: string | null = null;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(CLONE_TIMEOUT_ERR), cloneTimeoutMs);
      });
      const clonePromise = gitClone(
        getGitURL(datum.full_name),
        datum.name,
        undefined,
        {
          noSpinner: true,
          onProgress: (p) => {
            clonePercent = p;
            updateSpinnerWithElapsed();
          },
          pullIfExists: opts?.pull,
        },
      );
      const result = await Promise.race([clonePromise, timeoutPromise]);
      repoNames.push(datum.name);
      if (result === 'new') newCount++;
      else existsCount++;
      const repoMs = Date.now() - repoStart;
      rowToPrint = tableRow(
        result === 'new' ? CHECK : EXISTS,
        repoMs,
        i + 1,
        total,
        datum.full_name,
        nameWidth,
        { fast: repoMs < FAST_MS },
      );
    } catch (err) {
      const repoMs = Date.now() - repoStart;
      if (err === CLONE_TIMEOUT_ERR) {
        skipped.push(datum);
        rowToPrint = tableRow(
          SKIP,
          cloneTimeoutMs,
          i + 1,
          total,
          datum.full_name + ' (skipped)',
          nameWidth,
          { skipped: true },
        );
      } else {
        failedCount++;
        rowToPrint = tableRow(
          CROSS,
          repoMs,
          i + 1,
          total,
          datum.full_name,
          nameWidth,
          { failed: true },
        );
      }
    } finally {
      clearInterval(interval);
      spinner.stop(true);
      if (rowToPrint) process.stdout.write('\r' + rowToPrint + '\n');
    }
  }

  if (skipped.length > 0) {
    console.log(
      chalk.dim(`Retrying ${skipped.length} skipped (timeout) repos...`),
    );
    const retryTotal = skipped.length;
    for (let r = 0; r < skipped.length; r++) {
      const datum = skipped[r];
      const repoStart = Date.now();
      try {
        const result = await gitClone(
          getGitURL(datum.full_name),
          datum.name,
          undefined,
          { noSpinner: true },
        );
        repoNames.push(datum.name);
        if (result === 'new') newCount++;
        else existsCount++;
        const repoMs = Date.now() - repoStart;
        const row = tableRow(
          result === 'new' ? CHECK : EXISTS,
          repoMs,
          r + 1,
          retryTotal,
          datum.full_name,
          nameWidth,
          { fast: repoMs < FAST_MS },
        );
        process.stdout.write('\r' + row + '\n');
      } catch {
        failedCount++;
        const repoMs = Date.now() - repoStart;
        const row = tableRow(
          CROSS,
          repoMs,
          r + 1,
          retryTotal,
          datum.full_name,
          nameWidth,
          { failed: true },
        );
        process.stdout.write('\r' + row + '\n');
      }
    }
  }

  const existing = await readConfig();
  await writeConfig({
    owner,
    repos:
      existing && existing.owner === owner
        ? Array.from(new Set([...existing.repos, ...repoNames]))
        : repoNames,
  });

  const elapsed = Date.now() - start;
  const parts = [`Done in ${formatDuration(elapsed)}`];
  if (newCount) parts.push(`${newCount} new`);
  if (existsCount) parts.push(`${existsCount} existing`);
  if (archivedCount > 0) {
    parts.push(chalk.dim(`${archivedCount} archived (skipped)`));
  }
  if (skipped.length > 0) {
    parts.push(chalk.yellow(`${skipped.length} skipped (timeout)`));
  }
  if (failedCount) parts.push(chalk.red(`${failedCount} failed`));
  console.log(parts.join('. ') + '.');
  process.exit(0);
}
