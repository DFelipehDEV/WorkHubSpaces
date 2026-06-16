const esbuild = require('esbuild');
const { spawn } = require('child_process');

let nodeProcess = null;

const runNodePlugin = {
  name: 'run-node',
  setup(build) {
    build.onEnd(result => {
      if (result.errors.length > 0) return;
      
      if (nodeProcess) {
        nodeProcess.kill();
      }
      
      console.log('Build finished, restarting node...');
      nodeProcess = spawn('node', ['--env-file=.env', 'dist/index.js'], { stdio: 'inherit' });
    });
  },
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    packages: 'external',
    outfile: 'dist/index.js',
    plugins: [runNodePlugin],
  });

  await ctx.watch();
  console.log('Watching for changes...');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
