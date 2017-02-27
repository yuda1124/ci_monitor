const exec = require('child_process').execSync;
const DockerContainer = require('../model/docker-container');
const separator = ':------------:';
const fields = [
  '{{.ID}}',
  '{{.Names}}',
  '{{.Image}}',
  '{{.Ports}}',
  '{{.CreatedAt}}',
  '{{.Status}}'];
const format_ps = fields.reduce(function (prev, cur){
  return prev + separator + cur;
});

function collectDockerInfo() {
  // TODO : separate function.
  // getContainerList(which container do we monitor?) and getInformation(getInformation of specific container).
  const buf = exec('docker ps -a --format ' + format_ps); // TODO: handling exception.
  const stdout = buf.toString();
  const rows = stdout.split('\n');
  const containers = rows.map(function(value) {
    const columns = value.split(separator);
    if (columns.length !== fields.length) return null;
    return new DockerContainer(...columns); // TODO: check backward compatibility
  });
  return containers.filter(function (value){ return value !== null; });
}

module.exports = collectDockerInfo;