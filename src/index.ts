#!/usr/bin/env node

import * as commander from 'commander';

import {auth, getRepos, test} from './api';

// List all repos by grant.
const BASE_URL = 'https://api.github.com';

// Load env variables
require('dotenv').load();

const PROJECT_NAME = 'mgit';
/**
 * Set global CLI configurations
 */
commander
  .name(PROJECT_NAME)
  .usage(`<command> [options]`)
  .description(`${PROJECT_NAME} - A tool for managing multiple git repositories`);

async function start() {
  await auth();
  const repos = await test();
}

// OAuth
// octokit.authenticate({
//   type: 'oauth',
//   key: MGIT_GITHUB_KEY,
//   secret: MGIT_GITHUB_SECRET,
// })

// const res = await octokit.repos.listForOrg({
//   org: 'google',
//   type: 'public',
//   page: 14, // starts at 1
//   per_page: 100, // max
// })
// console.log(res.data.length);
// TODO: Paginate

// const clones = await octokit.repos.listCollaborators({
//   owner: 'google',
//   repo: 'clasp'
// })

// ORG MEMBERSHIP
// const orgs = await octokit.orgs.listForUser({
//   username: 'grant',
// });
// console.log(orgs.data);

// const repos = await getRepos('grant');
// const repos = await getRepos('foo');
// const repos = await test();

// repos.map((repo: any) => {
//   console.log(repo.full_name);
// });

// const ff = await octokit.users.getByUsername({
//   username: 'grant',
// });
// console.log(ff.data);

// README
// const clones = await octokit.repos.getReadme({
//   repo: 'clasp',
//   owner: 'google',
// });
// console.log(clones.data);
// clones.data.map((user) => {
//   console.log(user.login);
// })

// const repo = await octokit.repos.get({ owner: 'octokit', repo: 'rest.js' })

commander
  .command('pull')
  .description('Update the remote project')
  // .option('-f, --force', 'Forcibly overwrites the remote manifest.')
  .action(() => {
    console.log('hi');
  });

/**
 * All other commands are given a help message.
 * @example random
 */
commander
  .command('*', undefined, { isDefault: true })
  .description('Any other command is not supported')
  .action((args) => {
    console.log('Command not supported.');
  });

/**
 * Displays version
 */
commander.option('-v, --version').on('option:version', () => {
  console.log(require('../package.json').version);
});

// defaults to help if commands are not provided
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
// User input is provided from the process' arguments
commander.parse(process.argv);