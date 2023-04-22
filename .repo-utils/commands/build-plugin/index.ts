#!/usr/bin/env node

/**
 * Steps for building a plugin:
 * 1. Build the react code first, as it provides components for the static-sites projects that need to be built
 * 2. Build the static site projects, as they provide a site manifest for the /cloud project
 * 3. Build the /lambda project, as it also provides a lambda manifest for the /cloud project
 * 4. Build the /cloud project
 */

import * as fss from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { PACKAGES } from '../../constants/index.js';
import { buildCloud } from './cloud.js';
import { buildBakedLambdaFunctions } from './lambda-functions.js';
import { buildLambda } from './lambda.js';
import { buildReact } from './react.js';
import { buildStaticSites } from './static-sites.js';

// Make sure this is a valid place to run this command:
const pkg = process.cwd().split('/').pop()!;
if (!PACKAGES.includes(pkg) && pkg.startsWith('plugin')) throw new Error(`Invalid package: ${pkg}`);

const workingDirPath = process.cwd();
const mainDistPath = path.join(workingDirPath, 'dist');

// Clean the dist folder first
if (fss.existsSync(mainDistPath)) await fs.rm(mainDistPath, { recursive: true });

// Build any react library code
if (fss.existsSync(path.join(workingDirPath, 'react'))) await buildReact();

// Build any lambda library code
if (fss.existsSync(path.join(workingDirPath, 'lambda'))) await buildLambda();

// Build any static sites
if (fss.existsSync(path.join(workingDirPath, 'static-sites'))) await buildStaticSites();

// Build any fully-baked lambda functions
if (fss.existsSync(path.join(workingDirPath, 'static-sites'))) await buildBakedLambdaFunctions();

// TODO: other baked assets that a plugin might have
// // Build any fully-baked lambda@edge functions
// if (fss.existsSync(path.join(workingDirPath, 'static-sites'))) await buildStaticSites();

// // Build any fully-baked cloudfront functions
// if (fss.existsSync(path.join(workingDirPath, 'static-sites'))) await buildStaticSites();

// Build any cloud library code
if (fss.existsSync(path.join(workingDirPath, 'cloud'))) await buildCloud();
