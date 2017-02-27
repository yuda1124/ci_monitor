const exec = require('child_process').execSync;
const separator = ':------------:';
const fields = [
  '{{.ID}}',
  '{{.Name}}',
  // '{{.PIDs}}',
  '{{.CPUPerc}}',
  '{{.MemUsage}}',
  '{{.MemPerc}}',
  '{{.NetIO}}',
  '{{.BlockIO}}'];
const format = fields.reduce(function (prev, cur){
  return prev + separator + cur;
});

function DockerUsageCollector(containerList) {
  // TODO : TBD : containerList contain docker container id or name which will be inspected.
}

DockerUsageCollector.prototype.getStats = function() {
  const buf = exec('docker stats --no-stream --format ' + format);
  const stdout = buf.toString();
  console.log(stdout);
  this.stats = stdout;
}




console.log(DockerUsageCollector.getStats);
new DockerUsageCollector().getStats();