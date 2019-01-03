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
