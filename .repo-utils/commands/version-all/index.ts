#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { sync } from 'glob';
import { ORG } from '../../constants/index.js';

const newVersionArg = process.argv[2];

if (!newVersionArg) throw new Error('No version specified');
const newVersion = newVersionArg.startsWith('v') ? newVersionArg.slice(1) : newVersionArg;
if (!/^(\d+\.\d+\.\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Fa-f]{7})?))?(?:\+[0-9A-Za-z-]+)?$/.test(newVersion))
  throw new Error('Invalid version');

const packageJsonFiles = sync('**/package.json', {
  cwd: process.cwd(),
  ignore: '**/node_modules/**/package.json',
});

packageJsonFiles.forEach((file) => {
  const packageJson = JSON.parse(readFileSync(file, 'utf8'));

  // Update the top level version
  console.log(`'${file}' version: ${packageJson.version} → ${newVersion}`);
  packageJson.version = newVersion;

  // Update any @org/* dependencies to that version
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  const updatedOrgDeps = (Object.entries(dependencies) as [string, string][])
    .filter(([name]) => name.startsWith(`@${ORG}`))
    ?.reduce((acc, [name]) => {
      acc[name] = newVersion;
      console.log(`    ${name}:*`, '→', newVersion);
      return acc;
    }, {} as Record<string, string>);

  const updatedOrgDevDeps = (Object.entries(devDependencies) as [string, string][])
    .filter(([name]) => name.startsWith(`@${ORG}`))
    ?.reduce((acc, [name]) => {
      acc[name] = newVersion;
      console.log(`    ${name}:*`, '→', newVersion);
      return acc;
    }, {} as Record<string, string>);

  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...updatedOrgDeps,
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...updatedOrgDevDeps,
  };

  writeFileSync(file, JSON.stringify(packageJson, null, 2));
});
