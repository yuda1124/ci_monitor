const exec = require('child_process').exec;

function getHostOSVersion() {
  exec('cat /etc/redhat-release', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    return stdout;
  });
}

function getKernelVersion() {
  exec('uname -r', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    return stdout;
  });
}

function getCPU() {
  exec('top -bn2 | grep "Cpu(s)"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    return stderr;
  });
}

getCPU();
getHostOSVersion();
getKernelVersion();

usage = new usage()
dockercontainers.push(new dockerContaiers())
