// This file is stupid but necessary because of how npm works.

// There are a bunch of ts command scripts that are built into js shebang'd executables
// on npm postinstall, but npm install determines what winds up in .bin, so you end up
// needing to run npm install twice to get the executables in .bin. This hack makes the
// files exist so npm will go ahead and put them in .bin on the first install.

import * as fs from 'fs/promises';
import * as path from 'path';

const outDir = path.join(process.cwd(), 'bin', 'commands');
const commandsDir = path.join(process.cwd(), 'commands');

// each command is a index.ts file in a dir within the commands dir
const folderNames = await fs.readdir(commandsDir);

// create the final file paths
const commandFiles = folderNames.map((folderName) => path.join(outDir, folderName, 'index.js'));

// write an empty file with the shebang for node at each of the command file paths
await Promise.all(
  commandFiles.map(async (commandFile) => {
    await fs.mkdir(path.dirname(commandFile), { recursive: true });
    await fs.writeFile(commandFile, '#!/usr/bin/env node\n');
    fs.chmod(commandFile, 0o755);
  })
);
