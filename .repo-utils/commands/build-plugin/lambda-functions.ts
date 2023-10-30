import { run } from '../../common/runner.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const LAMBDA_FN_BUILD_COMMAND = 'tsc -p lambda-functions/tsconfig.json';
const workingDirPath = process.cwd();
const lambdaFunctionsSrcPath = path.join(workingDirPath, 'lambda-functions');
const lambdaFunctionsDistPath = path.join(workingDirPath, 'dist', 'lambda-functions');

export const buildBakedLambdaFunctions = async () => {
  await run(LAMBDA_FN_BUILD_COMMAND, process.cwd());
  await fs.cp(lambdaFunctionsSrcPath, lambdaFunctionsDistPath, { recursive: true });
};
