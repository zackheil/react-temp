import { run } from '../../common/runner.js';

const REACT_BUILD_COMMAND = 'tsc -build react/tsconfig.json';

export const buildReact = async () => {
  await run(REACT_BUILD_COMMAND, process.cwd());
};
