#!/usr/bin/env node

import { appendFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const getNextDrawFileNumber = (assetPath: string, mdName: string, extension: string) => {
  const hits: string[] = [];

  // Ensure directory exists
  if (!existsSync(assetPath)) {
    console.log('Creating a directory for assets at ', assetPath);
    mkdirSync(assetPath, { recursive: true });
  }

  const files = readdirSync(assetPath);
  for (let i = 0; i < files.length; i++) {
    const filename = join(assetPath, files[i]);

    // e.g.: demo-1.drawio, demo-1.png
    const localFilename = filename.split('/').slice(-1).join();

    // filter out files that aren't drawio (no png) and that aren't related to current *.md file
    if (localFilename.indexOf(extension) >= 0 && localFilename.indexOf(mdName) >= 0) {
      hits.push(filename.split('/').slice(-1).join());
    }
  }

  // If there is no file that follows *-#.drawio, we are at index 1
  if (!hits.length) return 1;

  // convert hits to an array of numbers from the filenames in indices: demo-7.drawio -> 7
  const nums = hits.map((item) => {
    let strNum = item.replace(mdName + '-', '').replace('.drawio', '');
    return parseInt(strNum);
  });

  // Sort to get highest number, get highest index, then add 1
  return nums.sort()[hits.length - 1] + 1;
};

if (process.argv.length < 3) {
  console.error('Usage: npm run draw <abs-path-to-docFile.md>');
  process.exit(1);
}

// Get first usable directory
const filePath = process.argv[2]; // gets abs/path/to/docs/Documentation.md (e.g.)
const docDir = filePath.split('/').slice(0, -1).join('/'); // gets abs/path/to/docs
let docFilename = filePath.split('/').slice(-1).join(); // gets "Documentation.md"
docFilename = docFilename.split('.').slice(0, 1).join(); // gets "Documentation" (chops extension)
const assetDir = docDir + '/assets'; // gets abs/path/to/docs/assets

// if there are ex-1.drawio, ex-2.drawio, and ex-3.drawio, find the next numerical index for a file (4)
const nextImgIndex = getNextDrawFileNumber(assetDir, docFilename, '.drawio');

const fileToCreate = `${docFilename}-${nextImgIndex}.drawio`;
appendFileSync(filePath, `![](./assets/${fileToCreate.replace('drawio', 'drawio.svg')})\n`);
writeFileSync(join(assetDir, `${docFilename}-${nextImgIndex}.drawio.svg`), '');
