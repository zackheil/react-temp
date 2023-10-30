#!/usr/bin/env node

/**
 * Builds a standard npm package:
 * - Cleans the out directory
 * - Runs the tsc build (prioritizing tsconfig.build.json if it exists)
 * - Versions the dist code according to the package.json version
 */
import { run } from '../../common/runner.js';
import { rm, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGES } from '../../constants/index.js';

const workingDir = process.cwd();
const outDir = join(workingDir, 'dist');
const versionFilePath = join(outDir, '_version.js');
// const repoRoot = join(workingDir, '..', '..');
const pkgVersion = JSON.parse((await readFile(join(workingDir, 'package.json'))).toString()).version;
const sstVersion = '0.0.0';

// Make sure this is a valid place to run this command:
const pkg = process.cwd().split('/').pop()!;
if (!PACKAGES.includes(pkg)) throw new Error(`${pkg} is not a valid package in the monorepo.`);

// Clean the out directory (if it exists)
if (existsSync(outDir)) await rm(outDir, { recursive: true });

// Determine which tsconfig to use
const tsconfig = existsSync(join(workingDir, 'tsconfig.build.json')) ? 'tsconfig.build.json' : 'tsconfig.json';

// Run the tsc build
await run(`tsc -p ${tsconfig}`, process.cwd());

// Version the dist code according to the package.json version
if (!existsSync(versionFilePath)) process.exit(0);
let contents = (await readFile(versionFilePath)).toString();
contents = contents.replace(/'(\${{version}})'/, `'${pkgVersion}'`);
contents = contents.replace(/'(\${{sstPkgVersion}})'/, `'${sstVersion}'`);
await writeFile(versionFilePath, contents);
