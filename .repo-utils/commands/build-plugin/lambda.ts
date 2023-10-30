import { run } from '../../common/runner.js';

const LAMBDA_BUILD_COMMAND = 'tsc -build lambda/tsconfig.json';

export const buildLambda = async () => {
  await run(LAMBDA_BUILD_COMMAND, process.cwd());
};
