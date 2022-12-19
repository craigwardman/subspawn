# subspawn
An npm library for spawning (and killing) synchronous and asynchronous sub processes from node.

This package is a wrapper around Node's `child_process` library, which offers the ability to create child processes but isn't as easy
to get working as you might hope. 

The idea behind this code is to provide:

1) A cross platform way of creating child processes that will share the stdout of the parent (including 'npm' scripts)
2) Synchronous and asynchronous methods of running the sub processes
3) A cross plaform way of killing the child processes, including any descendants of those child processes

The original use-case for this module was for use in a complex npm build script, whereby writing the build sequence as TypeScript made
more sense than daisy chaining lots of "npm" commands together. You can read more about this too on my blog: http://www.craigwardman.com/Blogging/BlogEntry/writing-an-npm-startup-script-in-typescript-to-support-complex-scenarios

# usage
Install the package into your application of choice the usual way (`npm i subspawn`)

Import the module into your JavaScript or TypeScript node file (`import { subProcess, subProcessSync } from 'subspawn'`)

&nbsp;

Use the appropriate function to run a child process, 
```
subProcessSync(<command>, <showOutput>)
subProcess(<owner>, <command>, <showOutput>)
```

e.g.

Synchronous:
`subProcessSync('npm run tsc', true)`

This will block execution until the command completes, so no "child process" needs to be cleaned up at the end.

Asynchronous:
`subProcess('build', 'npm run start-bg-service', true)`

This will not block execution, and the "child process" will be killed when the parent process exits (or earlier if you call `killSubProcesses('build')`)
