import { ChildProcess, execSync, spawn } from 'child_process';

interface dictionaryOfStringChildProcessArray {
  [key: string]: ChildProcess[];
}
const children: dictionaryOfStringChildProcessArray = {};

export const killSubProcesses = function (owner: string) {
  console.log(`killing ${owner} child processes (${children[owner].length})`);

  children[owner].forEach((c) => {
    try {
      if (c.pid) {
        if (process.platform === 'win32') {
          execSync(`taskkill /pid ${c.pid} /T /F`);
        } else {
          process.kill(-c.pid);
        }
      }
    } catch {}
  });
};

process.on('exit', () => Object.keys(children).forEach((owner) => killSubProcesses(owner)));

const spawnSubProcess = (owner: string, command: string, showOutput: boolean) => {
  const [binary, ...rest] = command.split(' ');
  const childProcess = spawn(binary, rest, {
    stdio: showOutput ? 'inherit' : 'ignore',
    detached: true,
  });

  children[owner] = children[owner] || [];
  children[owner].push(childProcess);

  return childProcess;
};

const spawnSubProcessOnWindows = (owner: string, command: string, showOutput: boolean) => {
  const childProcess = spawn(process.env.comspec || 'cmd.exe', ['/c', ...command.split(' ')], {
    stdio: showOutput ? 'inherit' : 'ignore',
  });

  children[owner] = children[owner] || [];
  children[owner].push(childProcess);

  return childProcess;
};

export const subProcess = (owner: string, command: string, showOutput: boolean) => {
  if (process.platform === 'win32') {
    spawnSubProcessOnWindows(owner, command, showOutput);
  } else {
    spawnSubProcess(owner, command, showOutput);
  }
};

export const subProcessSync = (command: string, showOutput: boolean) => {
  return execSync(command, { stdio: showOutput ? 'inherit' : 'ignore' });
};
