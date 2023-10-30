import path from 'node:path';
import * as fss from 'node:fs';
import * as fs from 'node:fs/promises';
import { run } from '../../common/runner.js';

const workingDirPath = process.cwd();
// const staticSitesPath = path.join(workingDirPath, 'static-sites');
const staticSitesDistPath = path.join(workingDirPath, 'dist', 'static-sites');
const tsDistPath = path.join(workingDirPath, 'static-sites');
const pkgVersion = JSON.parse((await fs.readFile(path.join(workingDirPath, 'package.json'))).toString()).version;

export const buildStaticSites = async () => {
  // This package has 3 functions accomplished by this build:
  //   1. It generates typescript types for the environments of the baked sites (including the version)
  //   2. It generates a ts file that exports the paths of the baked sites
  //   3. It takes all the outputs from the static-sites/* and moves the contents to dist/

  // First, get the directories that are in static sites portion of the plugin:
  const sitesDirPaths = await getSitePaths(workingDirPath);

  // For each directory, run the npm build script in parallel, then move all build files to package root dist/:
  await buildViteSites(sitesDirPaths);

  // Now, generate the typescript types for the environments of the baked sites.
  // We need the typescript to provide intellisense for the react baked construct in the cloud package.

  const manifest = [
    `/* eslint-disable */`,
    `import * as path from 'node:path';`,
    'const __dirname = path.dirname(new URL(import.meta.url).pathname);',
    `export const pkgVersion = '${pkgVersion}';`,
  ];

  manifest.push(`export const SiteManifest = {`);
  await Promise.all(
    sitesDirPaths.map(async (dir) => {
      await createSiteManifest(manifest, dir);
    })
  );

  manifest.push(`};`);

  const file = manifest.join('\r\n');

  // await fs.writeFile(path.join(tsDistPath, 'index.d.ts'), dts);
  await fs.writeFile(path.join(tsDistPath, 'index.ts'), file);
};

async function getSitePaths(workingDir: string) {
  const staticSitesPath = path.join(workingDir, 'static-sites');
  const sitesDirContents = await fs.readdir(staticSitesPath);
  const sitesDirectories = sitesDirContents.filter((name) => {
    const stat = fss.statSync(path.join(staticSitesPath, name));
    return stat.isDirectory();
  });

  // Ensure directory names don't have spaces, dashes, or start with numbers:
  sitesDirectories.forEach((dir) => {
    if (dir.includes(' ')) throw new Error(`Directory name "${dir}" cannot contain spaces`);
    if (dir.includes('-')) throw new Error(`Directory name "${dir}" cannot contain dashes`);
    if (dir.match(/^\d/)) throw new Error(`Directory name "${dir}" cannot start with a number`);
  });

  return sitesDirectories.map((site) => path.join(staticSitesPath, site));
}

async function buildViteSites(sitesDirPaths: string[]) {
  // Build
  const commandThreads = sitesDirPaths.map(async (dir) => {
    await run('npx tsc', dir);
    await run('npx vite build --mode types -l silent', dir, { APP_VERSION: `v${pkgVersion}` });
  });
  await Promise.all(commandThreads);
  await fs.mkdir(staticSitesDistPath, { recursive: true });

  // Copy individual sites to the dist folder:
  const copyThreads = sitesDirPaths.map(async (dir) => {
    const siteName = dir.split('/').pop()!;
    const innerDistPath = path.join(dir, 'dist');
    await fs.mkdir(path.join(staticSitesDistPath, siteName));
    await fs.cp(innerDistPath, path.join(staticSitesDistPath, siteName), { recursive: true });
  });
  await Promise.all(copyThreads);
}

async function createSiteManifest(tsRef: string[], sitePath: string) {
  const siteName = sitePath.split('/').pop()!;
  const envFileName = fss
    .readdirSync(path.join(staticSitesDistPath, siteName, 'assets'))
    .find((file) => file.startsWith('env'));
  const indexFileName = fss
    .readdirSync(path.join(staticSitesDistPath, siteName, 'assets'))
    .find((file) => file.startsWith('index'));

  const assetFiles = (await fs.readdir(path.join(staticSitesDistPath, siteName))).filter(
    (name) => name !== 'assets' && name !== 'index.html'
  );
  assetFiles.push('robots.txt');

  const environment = await convertEnvFileToTS(sitePath);

  /* 
  dir: string;
  html: string;
  env: string;
  index: string;
  environment: Record<string, string>;
  assets: Record<string, string | undefined>;
  */

  // At the end:
  tsRef.push(`  ${siteName}: {`);
  {
    tsRef.push(`    dir: path.join(__dirname, '${siteName}'),`);
    tsRef.push(`    html: path.join(__dirname, '${siteName}', 'index.html'),`);
    tsRef.push(`    pkgVersion: '${pkgVersion}',`);
    tsRef.push(`    env: '${envFileName}',`);
    tsRef.push(`    index: '${indexFileName}',`);

    // Environment:
    tsRef.push(`    environment: {`);
    {
      Object.keys(environment).forEach((key) => {
        tsRef.push(`      '${key}': undefined as unknown as ${environment[key]},`);
      });
    }
    tsRef.push(`    },`);

    // Assets:
    tsRef.push(`    assets: {`);
    {
      assetFiles.forEach((file) => {
        tsRef.push(`      '${file}': undefined as unknown as string,`);
      });
    }
    tsRef.push(`    },`);
  }
  tsRef.push(`  },`);
}

async function convertEnvFileToTS(siteDir: string) {
  const distPath = path.join(siteDir, 'dist', 'assets');
  const envFile = fss.readdirSync(distPath).find((file) => file.startsWith('env'));
  const envPath = path.join(distPath, envFile!);

  // Import this env file and convert it to a typescript type:
  const envObject = (await import(envPath)).default;
  const envKeys = Object.keys(envObject);
  return envKeys.reduce((acc, key) => {
    // skip the version key:
    if (key === 'version') return acc;

    // extract the data type from the value: {{ type }}
    const type = envObject[key]
      .toString()
      .substring(2, envObject[key].toString().length - 2)
      .trim();

    if (type === 'number') throw new Error('Number types are not supported in env.ts files. Use strings instead.');
    acc[key] = type;
    return acc;
  }, {} as Record<string, string>);
}
