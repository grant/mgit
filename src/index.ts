#!/usr/bin/env node

import { createRequire } from "node:module";
import { Command } from "commander";
import { clone } from "./commands/clone.js";
import { status } from "./commands/status.js";
import "dotenv/config";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const program = new Command();

program
  .name("mgit")
  .description("Clone all repos for a GitHub user or organization")
  .version(pkg.version);

program
  .command("clone [owner]")
  .description(
    "Clone all repos for a user/org (default: authenticated user from MGIT_TOKEN)",
  )
  .action((owner: string) => clone(owner));

program
  .command("status")
  .description("List repos cloned for the current user/org")
  .action(status);

program.showHelpAfterError();

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  program.parse(process.argv);
}
