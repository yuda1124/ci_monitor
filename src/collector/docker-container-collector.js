const exec = require('child_process').execSync;
const DockerContainer = require('../model/docker-container');
const separator = ':------------:';

function DockerContainerCollector(inspectList) {
  // TODO (TBD) : inspectList contain docker container id or name which will be inspected.
  this.collectContainerInfo();
  this.getContainerStats();
  console.log(this.containerList);
  console.log(this.stats);
}

DockerContainerCollector.prototype.collectContainerInfo = function() {
  const fields = [
    '{{.ID}}',
    '{{.Names}}',
    '{{.Image}}',
    '{{.Ports}}',
    '{{.CreatedAt}}',
    '{{.Status}}'];
  const format = fields.reduce(function (prev, cur){
    return prev + separator + cur;
  });
  // TODO : separate function.
  // getContainerList(which container do we monitor?) and getInformation(getInformation of specific container).
  const buf = exec('docker ps -a --format ' + format); // TODO: handling exception.
  const stdout = buf.toString();
  const rows = stdout.split('\n');
  const containers = rows.map(function(value) {
    const columns = value.split(separator);
    if (columns.length !== fields.length) return null;
    return new DockerContainer(...columns); // TODO: check backward compatibility
  });
  this.containerList = containers.filter(function (value){ return value !== null; });
}

DockerContainerCollector.prototype.getContainerStats = function() {
  const fields = [
    // '{{.ID}}',
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
  const buf = exec('docker stats --no-stream --format ' + format);
  const stdout = buf.toString();
  const stats = stdout.split('\n');
  stats.map(function (stat){
    const usage = stat.split(separator);
    if (usage.length !== fields.length) return;
    this.assignUsage(usage);
  });
}

DockerContainerCollector.prototype.assignUsage = function() {
}

module.exports = DockerContainerCollector;

new DockerContainerCollector();