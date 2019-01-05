# mgit

> Warning: This tool is currently being developed!

A tool for managing multiple git repositories

```
npm i @grant/mgit
```

## Commands

```sh
mgit list [user|org]
mgit clone [user|org]
mgit pull [user|org]
mgit push [user|org]
mgit status
```

### List

Lists all repos for a user/org.

```sh
mgit list
mgit list grant
mgit list google
```

### Clones all repos by a user/organization

Clones all repositories located at github.com/<name> where name is a user or org.

```sh
mgit clone grant
...
Cloning 120 repositories...
grant/a
grant/b
grant/c
```

### Pull

```sh
mgit pull
```

### Push

```sh
mgit push
```

### Check status of repos

```sh
mgit status
X grant/a
O grant/b
X grant/c
```

## Notes

Num commits between HEAD and master:
`git rev-list HEAD...origin/master --count`
URL: https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git

## Ideas

- List all pending GitHub PRs
- List all pending GitHub Issues

## Develop

### Setup Auth

Create a **personal access token**. Example:
- https://github.com/settings/applications/960504
- https://github.com/settings/tokens

## Install the CLI

```
echo 'MGIT_TOKEN=<token>' > .env
sudo npm run build
mgit
```

## Technology

- CLI: https://github.com/tj/commander.js
- Git Commands: https://github.com/steveukx/git-js
- GitHub API: https://github.com/octokit/rest.js

Also see:
- https://hub.github.com/