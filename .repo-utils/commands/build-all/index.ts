#!/usr/bin/env node

/**
 * This script builds all packages in the correct order
 */
import { run } from '../../common/runner.js';
import { PACKAGES } from '../../constants/index.js';

const buildCommands = PACKAGES.map((pkg) => `npm run build -w packages/${pkg}`);

for (const command of buildCommands) {
  await run(command, process.cwd());
}
