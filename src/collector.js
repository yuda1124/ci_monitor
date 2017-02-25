const exec = require('child_process').exec;

function getHostOSVersion() {
  exec('cat /etc/redhat-release', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

getHostOSVersion();
