const { exec } = require('child_process');

exec('cargo run --example interactive-sample', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});
