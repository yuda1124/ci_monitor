const exec = require('child_process').execSync;
const network_card = require('../../config_network_card.json').name;
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
  this.host_ip = exec('ifconfig ' + network_card + ' | grep \'inet \' | awk \'{ print $2}\'').toString().trim().replace('addr:',''); // TODO: handling exception.

  // TODO : separate function.
  // getContainerList(which container do we monitor?) and getInformation(getInformation of specific container).
  const buf = exec('docker ps -a --format ' + format); // TODO: handling exception.
  const stdout = buf.toString();
  const rows = stdout.split('\n');
  const self = this;
  const containers = rows.map(function(value) {
    var columns = value.split(separator);
    if (columns.length !== fields.length) return null;
    if (columns[5].substr(0,4) !== 'Exit' &&
      (columns[1] === 'docker_ws_1' ||
       columns[1] === 'docker_wuf_1' ||
       columns[1] === 'docker_mhp_1'))
      columns[2] = self.checkVersion(columns[1], columns[2]);
    return new DockerContainer(self.host_ip, ...columns); // TODO: check backward compatibility
  });
  this.containerList = containers.filter(function (value){ return value !== null; });
}

DockerContainerCollector.prototype.checkVersion = function(name, image) { // TODO: refactoring! this function is just temporary function.
  const findVersion = 'docker exec ' + name + ' find / -name VERSION';
  const path = exec(findVersion).toString();
  if(path === '') return image;
  const nameToken = image.split(':');
  const versionIndex = nameToken.length - 1;
  const version = nameToken[versionIndex];
  if (version === 'latest') {
    const catVersion = 'docker exec ' + name + ' cat ' + path;
    const buildVersion = exec(catVersion).toString().trim();
    image = image.replace(version, buildVersion);
  }
  return image;
}

DockerContainerCollector.prototype.getContainerStats = function() {
  const buf = exec('cat /etc/system-release');
  const stdout = buf.toString();
  if (stdout.indexOf('Amazon') === 0) {
    this.getAMIContainerStats();
    return;
  }
  this.getCentContainerStats();
}

DockerContainerCollector.prototype.getCentContainerStats = function() {
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
  stats.map(function(stat) {
    const status = stat.split(separator);
    if (status.length !== fields.length) return;
    // exec('docker exec ' + status[0] + ' df | grep -v overlay')
    self.assignUsage(status);
  });
}

DockerContainerCollector.prototype.getAMIContainerStats = function() {
  const buf = exec('docker stats --no-stream');
  const stdout = buf.toString();
  const stats = stdout.split('\n');
  const self = this;
  stats.map(function(stat, index) {
    if (index === 0) return null; // ignore label
    const splitted = stat.split(' ');
    const strList = splitted.filter(function (str) {
      return str.length > 0;
    });
    // console.log(strList);
    const status = [];
    status.push(strList[0]);
    status.push(strList[1]);
    status.push(strList[2] + ' ' + strList[3] + ' ' + strList[4] + ' ' + strList[5] + ' ' + strList[6]);
    status.push(strList[7]);
    status.push(strList[8] + ' ' + strList[9] + ' ' + strList[10] + ' ' + strList[11] + ' ' + strList[12]);
    status.push(strList[13] + ' ' + strList[14] + ' ' + strList[15] + ' ' + strList[16] + ' ' + strList[17]);
    // console.log(status);

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
    if ((container.name !== status[0]) && container.id !== status[0]) return;
    container.usage = usage;
  });
}

DockerContainerCollector.prototype.getData = function() {
  return JSON.stringify(this.containerList);
  // return this.containerList;
}

module.exports = DockerContainerCollector;
