import { run } from '../../common/runner.js';

const CLOUD_BUILD_COMMAND = 'tsc -build ts/tsconfig.cloud.json';

export const buildCloud = async () => {
  await run(CLOUD_BUILD_COMMAND, process.cwd());
};
