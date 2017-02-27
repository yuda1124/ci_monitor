const DockerContainerCollector = require('../collector/docker-container-collector');
const LinuxCollector = require('../collector/linux-collector');

function CollectManager() {
  this.dcCollector = new DockerContainerCollector();
  this.linuxCollector = new LinuxCollector();
}

CollectManager.prototype.collect = function() {
  this.dcCollector.collectContainerInfo();
  this.dcCollector.getContainerStats();
  this.linuxCollector.mergeData();
}

CollectManager.prototype.getHostData = function() {
  const linux = this.linuxCollector.getData();
  const data = {
    info: linux.info,
    usage: linux.usage
  };
  return JSON.stringify(data);
}

CollectManager.prototype.getDockerData = function() {
  // const containerList = this.dcCollector.getData();
  // return containerList.map(function(value) {
  //   return JSON.stringify(value);
  // });
  const data = this.dcCollector.getData();

  return data;
}

module.exports = CollectManager;