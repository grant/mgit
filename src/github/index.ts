
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