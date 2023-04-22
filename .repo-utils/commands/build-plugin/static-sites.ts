import path from 'node:path';
import * as fss from 'node:fs';
import * as fs from 'node:fs/promises';
import { run } from '../../common/runner.js';

const workingDirPath = process.cwd();
const staticSitesPath = path.join(workingDirPath, 'static-sites');
const staticSitesDistPath = path.join(workingDirPath, 'dist', 'static-sites');
const tsDistPath = staticSitesDistPath;
const pkgVersion = JSON.parse((await fs.readFile(path.join(workingDirPath, 'package.json'))).toString()).version;

export const buildStaticSites = async () => {
  // This package has 3 functions accomplished by this build:
  //   1. It generates typescript types for the environments of the baked sites (including the version)
  //   2. It generates a ts file that exports the paths of the baked sites
  //   3. It takes all the outputs from the static-sites/* and moves the contents to dist/

  // First, get the directories that are in sites/:
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

  const sitesDirPaths = sitesDirectories.map((site) => path.join(staticSitesPath, site));

  // For each directory, run the npm build script in parallel, then move all build files to package root dist/:
  const commandThreads = sitesDirPaths.map(async (dir) =>
    run('npm run build -- --mode types -l silent', dir, { APP_VERSION: `v${pkgVersion}` })
  );
  await Promise.all(commandThreads);

  await fs.mkdir(staticSitesDistPath, { recursive: true });
  // await fs.mkdir(tsDistPath);

  const copyThreads = sitesDirPaths.map(async (dir) => {
    const siteName = dir.split('/').pop()!;
    const innerDistPath = path.join(dir, 'dist');
    await fs.mkdir(path.join(staticSitesDistPath, siteName));
    await fs.cp(innerDistPath, path.join(staticSitesDistPath, siteName), { recursive: true });
  });
  await Promise.all(copyThreads);

  // Now, generate the typescript types for the environments of the baked sites.
  // We need the typescript to provide intellisense for the react baked construct in the cloud package.

  let dTsFileContents = [`export declare const PKG_VERSION: "v${pkgVersion}";`, '', ''].join('\r\n');
  let jsFileContents = [
    `import * as path from 'node:path';`,
    'const __dirname = path.dirname(new URL(import.meta.url).pathname);',
    '',
    `export const PKG_VERSION = "v${pkgVersion}";`,
    '',
    '',
  ].join('\r\n');

  let typeManifest: string[] = [
    `// -----------------------------------------------------------------------`,
    'export type TypeManifest = {',
  ];

  let typeofPathManifest: string[] = ['', '', 'export declare const PathManifest: {'];

  let pathManifest: string[] = [
    `// -----------------------------------------------------------------------`,
    'export const PathManifest = {',
  ];

  await Promise.all(
    sitesDirPaths.map(async (dir) => {
      const siteName = dir.split('/').pop()!;
      const envFileName = fss
        .readdirSync(path.join(staticSitesDistPath, siteName, 'assets'))
        .find((file) => file.startsWith('env'));
      const indexFileName = fss
        .readdirSync(path.join(staticSitesDistPath, siteName, 'assets'))
        .find((file) => file.startsWith('index'));

      // Find out all the assets that were in the public folder that could be swapped out in the build:
      const publicFilenames = (await fs.readdir(path.join(staticSitesDistPath, siteName))).filter(
        (name) => name !== 'assets' && name !== 'index.html'
      );
      publicFilenames.push('robots.txt');

      // Find the built env file:
      const distPath = path.join(dir, 'dist', 'assets');
      const envFile = fss.readdirSync(distPath).find((file) => file.startsWith('env'));
      const envPath = path.join(distPath, envFile!);

      // Import this env file and convert it to a typescript type:
      const envObject = (await import(envPath)).default;
      const envKeys = Object.keys(envObject);
      const envTypeObject = envKeys.reduce((acc, key) => {
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

      const declaration = [
        `// Site ${siteName} types ------------------------------------------------`,
        `export type ${siteName}Env = {`,
        ...Object.entries(envTypeObject).map(([key, type]) => `  ${key}: ${type};`),
        `};`,
        ``,
        `export type ${siteName}Assets = {`,
        ...publicFilenames.map((filename) => `  '${filename}'?: string;`),
        `};`,
        ``,
        ``,
      ].join('\r\n');
      dTsFileContents += declaration;

      typeManifest.push(`  ${siteName}: {`);
      typeManifest.push(`    environment: ${siteName}Env;`);
      typeManifest.push(`    assets: ${siteName}Assets;`);
      typeManifest.push(`  };`);
      pathManifest.push(`  ${siteName}: {`);
      pathManifest.push(`    dir: path.join(__dirname, '${siteName}'),`);
      pathManifest.push(`    html: path.join(__dirname, '${siteName}', 'index.html'),`);
      pathManifest.push(`    env: '${envFileName}',`);
      pathManifest.push(`    index: '${indexFileName}',`);
      pathManifest.push(`  },`);
      typeofPathManifest.push(`  ${siteName}: {`);
      typeofPathManifest.push(`    dir: string;`);
      typeofPathManifest.push(`    html: string;`);
      typeofPathManifest.push(`    env: string;`);
      typeofPathManifest.push(`    index: string;`);
      typeofPathManifest.push(`  };`);

      await fs.rm(path.join(dir, 'dist'), { recursive: true });
    })
  );

  typeManifest.push(`};`, '', '');
  typeManifest.push(
    `export type SiteList = ${sitesDirPaths
      .map((dir) => {
        const name = dir.split('/').pop()!;
        return `"${name}"`;
      })
      .join(' | ')} `
  );

  pathManifest.push(`};`);
  typeofPathManifest.push(`};`);

  dTsFileContents += typeManifest.join('\r\n');
  dTsFileContents += typeofPathManifest.join('\r\n');
  jsFileContents += pathManifest.join('\r\n');

  await fs.writeFile(path.join(tsDistPath, 'index.d.ts'), dTsFileContents);
  await fs.writeFile(path.join(tsDistPath, 'index.js'), jsFileContents);
};
