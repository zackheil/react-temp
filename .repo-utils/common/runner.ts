import { spawn } from 'node:child_process';

export const run = async (command: string, inDir: string, env?: Record<string, string>) =>
  new Promise((resolve, reject) => {
    const ps = spawn(command, {
      cwd: inDir,
      env: { ...process.env, ...env },
      shell: true,
      stdio: 'inherit',
    });
    ps.on('error', (err) => reject(err));
    ps.on('close', (code) =>
      !code ? resolve(code) : reject(new Error(`code ${code} returned from command: ${command}`))
    );
  });
