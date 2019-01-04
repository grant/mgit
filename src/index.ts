#!/usr/bin/env node

import {auth, getRepos} from './api';

import axios from 'axios';

// List all repos by grant.
const BASE_URL = 'https://api.github.com';

// Load env variables
require('dotenv').load();

async function start() {
  await auth();

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

  await getRepos('grant');

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
}

// const octokit = require('@octokit/rest')()

console.log('mgit works!');
start();
