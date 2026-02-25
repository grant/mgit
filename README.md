# mgit

Clone all repos for a GitHub user or organization.

```sh
npm i -g @grant/mgit
```

## Commands

```sh
mgit clone [owner]   # Clone all repos (default: authenticated user from MGIT_TOKEN)
mgit status          # List repos cloned for this user/org
```

### clone

Clones every repository at `github.com/<owner>` (user or org) into the current directory. If you omit `owner`, it uses the GitHub user for your `MGIT_TOKEN`.

```sh
mgit clone           # clone all repos for the authenticated user
mgit clone google    # clone all of google's repos
```

After cloning, mgit writes a `.mgit.json` file in the current directory with the owner and list of repo names so `mgit status` knows what you have.

### status

Prints the owner and list of repos that were cloned in this directory (from `.mgit.json`).

```sh
mgit status
# grant (42 repos)
#   grant/mgit
#   grant/other-repo
#   ...
```

## Setup

Create a [GitHub personal access token](https://github.com/settings/tokens) with `repo` scope, then:

```sh
export MGIT_TOKEN=<your-token>
# or
echo 'MGIT_TOKEN=<your-token>' > .env
```

## Develop

```sh
npm install
echo 'MGIT_TOKEN=<token>' > .env
npm run build
mgit clone
```

**Watch mode (rebuild on save):** Run `npm run dev` in one terminal; it recompiles whenever you change `.ts` files. Use `mgit` in another terminal to test—each run uses the latest build.

## Tech

- CLI: [commander](https://github.com/tj/commander.js)
- Git: [simple-git](https://github.com/steveukx/git-js)
- GitHub API: [@octokit/rest](https://github.com/octokit/rest.js)
