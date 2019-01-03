# mgit

A tool for managing multiple git repositories

```
npm i @grant/mgit
```

## Commands

```sh
mgit i <user>
mgit i <org>
mgit status
```

## Install all repos by a user/organization

```sh
mgit clone grant
```

Clones all repositories located at github.com/grant.

```sh
Cloning 120 repositories...
grant/a
grant/b
grant/c
```

## Check status of repos

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

```
sudo npm run build
mgit
```
