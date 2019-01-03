#!/usr/bin/env node
import axios from 'axios'
import * as Octokit from '@octokit/rest';
let octokit = new Octokit()

// List all repos by grant.
const BASE_URL = 'https://api.github.com';

// Load env variables
require('dotenv').load();

async function start() {
  // const res = await axios.get('http://google.com');
  // console.log(res.data);
  // Compare: https://developer.github.com/v3/repos/#list-organization-repositories

  // https://github.com/settings/applications/960504
  const MGIT_TOKEN = process.env.MGIT_TOKEN + '';
  if (!MGIT_TOKEN) {
    return console.log(`MGIT_TOKEN env variable must be provided. See README.`);
  }
  // console.log(MGIT_GITHUB_KEY);
  // console.log(MGIT_GITHUB_SECRET);

  // OAuth
  // octokit.authenticate({
  //   type: 'oauth',
  //   key: MGIT_GITHUB_KEY,
  //   secret: MGIT_GITHUB_SECRET,
  // })

  octokit.authenticate({
    type: 'oauth',
    token: MGIT_TOKEN
  })

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

  const ff = await octokit.users.getByUsername({
    username: 'grant'
  });
  console.log(ff.data);

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
