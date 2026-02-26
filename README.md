# mgit

[![CI](https://github.com/grant/mgit/actions/workflows/ci.yml/badge.svg)](https://github.com/grant/mgit/actions/workflows/ci.yml) [![Release Please](https://github.com/grant/mgit/actions/workflows/release-please.yml/badge.svg)](https://github.com/grant/mgit/actions/workflows/release-please.yml) [![npm](https://img.shields.io/npm/v/@grant/mgit.svg)](https://www.npmjs.com/package/@grant/mgit)

Clone all repos for a GitHub user or organization.

```sh
npm i -g @grant/mgit
```

## Features

- Clones every repo for a user or org in the current directory
- Skips archived repos (reported in summary)
- Optional `--pull` to git pull in existing repos (off by default)
- Progress table: new vs existing, per-repo time, total progress with elapsed time
- Configurable timeout per clone (default 5m) with `--timeout=SECONDS`; timed-out repos retried at end; slow/skip/fail clearly marked

## Commands

```sh
mgit clone [owner]   # Clone all repos (default: authenticated user)
mgit init [token]    # One-time: create ~/.mgit.json with your token
mgit status          # List repos cloned for this user/org
```

### clone

Clones every repository at `github.com/<owner>` (user or org) into the current directory. If you omit `owner`, it uses the GitHub user for your saved token.

```sh
mgit clone                # clone all repos for the authenticated user
mgit clone google         # clone all of google's repos
mgit clone --pull         # clone missing repos and git pull in existing ones
mgit clone --timeout=120  # 2-minute timeout per clone (default: 300)
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

## Setup (one-time)

Create the global config with your GitHub token. Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) (scope: `repo`), then:

```sh
mgit init <your-token>
```

This creates `~/.mgit.json` with your token.

## Develop

1. **Install dependencies:** `npm install`
2. **Install the CLI from this repo (one-time):** `npm run build` — puts `mgit` on your PATH using this checkout.
3. **Create global config (one-time):** `mgit init <token>` — use a [GitHub token](https://github.com/settings/tokens) with `repo` scope.

**Watch:** Use two terminals.

1. Terminal 1: `npm run dev` — recompiles when you save a `.ts` file.
2. Terminal 2: `mgit clone`, `mgit status`, etc. — each run uses the latest code.

## Publish (npm)

Publishing is manual. Release Please still handles version bumps and CHANGELOG via conventional commits on `main`; merge its release PR to update the version in the repo, then publish to npm from your machine.

1. **Version** — Merge the Release Please PR (or bump `package.json` / `npm version patch|minor|major`).
2. **Build**: `npm run build:ci`
3. **Log in** to npm (one-time per machine): `npm login` — username, password, and OTP if you use 2FA.
4. **Publish**: `npm run release` (runs `npm publish --access public`). With 2FA use `npm publish --access public --otp=123456`.

Then `npm i -g @grant/mgit` installs the new version.

## Tech

- CLI: [commander](https://github.com/tj/commander.js)
- Git: [simple-git](https://github.com/steveukx/git-js)
- GitHub API: [@octokit/rest](https://github.com/octokit/rest.js)
