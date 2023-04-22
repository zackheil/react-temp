#!/usr/bin/env node

/**
 * This script publishes all packages to a npm registry.
 */
import { run } from '../../common/runner.js';
import { join } from 'node:path';
import { PACKAGES } from '../../constants/index.js';

const prerelease = process.argv.includes('prerelease');
const packagePaths = PACKAGES.map((pkg) => join(process.cwd(), 'packages', pkg));

for (const path of packagePaths) {
  await run(prerelease ? `npm publish --tag next` : `npm publish`, path);
}
