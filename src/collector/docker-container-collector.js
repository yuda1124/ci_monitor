const exec = require('child_process').execSync;
const DockerContainer = require('../model/docker-container');
const separator = ':------------:';

function DockerContainerCollector(inspectList) {
  // TODO (TBD) : inspectList contain docker container id or name which will be inspected.
  this.containerList = null;
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

  // TODO : duplicate code with linux-info-DockerContainerCollector
  this.host_ip = exec('ifconfig ens160 | grep \'inet \' | awk \'{ print $2}\'').toString().trim(); // TODO: handling exception.

  // TODO : separate function.
  // getContainerList(which container do we monitor?) and getInformation(getInformation of specific container).
  const buf = exec('docker ps -a --format ' + format); // TODO: handling exception.
  const stdout = buf.toString();
  const rows = stdout.split('\n');
  const containers = rows.map(function(value) {
    const columns = value.split(separator);
    if (columns.length !== fields.length) return null;
    return new DockerContainer(this.host_ip, ...columns); // TODO: check backward compatibility
  });
  this.containerList = containers.filter(function (value){ return value !== null; });
}

DockerContainerCollector.prototype.getContainerStats = function() {
  // The order of fileds array is used in assignUsage function.
  const fields = [
    // '{{.ID}}',
    // '{{.PIDs}}',
    '{{.Name}}',
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
  const self = this;
  stats.map(function (stat){
    const status = stat.split(separator);
    if (status.length !== fields.length) return;
    // exec('docker exec ' + status[0] + ' df | grep -v overlay')
    self.assignUsage(status);
  });
}

DockerContainerCollector.prototype.assignUsage = function(status) {
  const usage = {
    cpu: {
      perc: status[1]
    },
    memory: {
      perc: status[3],
      usage: status[2]
    },
    network: {
      io: status[4]
    },
    disk: {
      io: status[5]
    }
  };
  this.containerList.map(function(container){
    if (container.name !== status[0]) return;
    container.usage = usage;
  });
}

DockerContainerCollector.prototype.getData = function() {
  // return JSON.stringify(this.containerList);
  return this.containerList;
}

module.exports = DockerContainerCollector;