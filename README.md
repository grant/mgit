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
mgit clean
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

### Clean

Removes all local repos that aren't found on GitHub.

```sh
mgit clean
```

### Check status of repos

```sh
mgit status
X grant/a
O grant/b
X grant/c
```

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

Prior art:

- https://hub.github.com/
- https://medium.com/@kevinsimper/how-to-clone-all-repositories-in-a-github-organization-8ccc6c4bd9df