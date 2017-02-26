const exec = require('child_process').execSync;

function getContainerList() {
  const buf = exec('sudo docker ps -a'); // TODO: handling exception.
  const stdout = buf.toString();
  const rows = stdout.split('\n');
}

getContainerList();