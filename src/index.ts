#!/usr/bin/env node

import { createRequire } from "node:module";
import { Command } from "commander";
import { clone } from "./commands/clone.js";
import { status } from "./commands/status.js";
import { init } from "./commands/init.js";
import { printInitPrompt } from "./globalConfig.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const program = new Command();

program
  .name("mgit")
  .description("Clone all repos for a GitHub user or organization")
  .version(pkg.version);

program
  .command("clone [owner]")
  .description("Clone all repos for a user/org (default: authenticated user)")
  .option("--pull", "git pull in existing repos")
  .option("--timeout <seconds>", "timeout per clone in seconds (default: 300)")
  .action(async (owner: string, opts: { pull?: boolean; timeout?: string }) => {
    try {
      await clone(owner, opts);
    } catch (err) {
      if (err instanceof Error && err.message.includes('mgit is not set up')) {
        printInitPrompt('mgit is not set up.');
        process.exit(1);
      }
      throw err;
    }
  });

program
  .command("status")
  .description("List repos cloned for the current user/org")
  .action(status);

program
  .command("init [token]")
  .description("Create ~/.mgit.json with your GitHub token (one-time setup)")
  .action(init);

program.showHelpAfterError();

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  program.parse(process.argv);
}
