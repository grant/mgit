#!/usr/bin/env node

import * as commander from 'commander';

import { auth, getRepos, test } from './github/api';

import { clone } from './commands/clone';
import { list } from './commands/list';
import { pull } from './commands/pull';
import { push } from './commands/push';
import { status } from './commands/status';

// List all repos by grant.
const BASE_URL = 'https://api.github.com';

// Load env variables
require('dotenv').load();

const PROJECT_NAME = 'mgit';
const PROJECT_DESCRIPTION = `${PROJECT_NAME} - A tool for managing multiple git repositories`;
/**
 * Set global CLI configurations
 */
commander.name(PROJECT_NAME).usage(`<command> [options]`).description(PROJECT_DESCRIPTION);

// Commands
commander.command('list').description('Lists all repos').action(list);
commander.command('clone').description('Clones all repos').action(clone);
commander.command('pull').description('Pulls all repos').action(pull);
commander.command('push').description('Pushes all repos').action(push);
commander.command('status').description('Lists the status of all repos').action(status);

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