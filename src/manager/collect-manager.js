const DockerContainerCollector = require('../collector/docker-container-collector');
const LinuxCollector = require('../collector/linux-collector');

function CollectManager() {
  this.dcCollector = new DockerContainerCollector();
  this.linuxCollector = new LinuxCollector();
  this.data = null;
}

CollectManager.prototype.collect = function() {
  this.dcCollector.collectContainerInfo();
  this.dcCollector.getContainerStats();
  this.linuxCollector.mergeData();

  const linux = this.linuxCollector.getData();
  this.data = {
    info: linux.info,
    usage: linux.usage,
    docker: this.dcCollector.getData()
  };
}

CollectManager.prototype.getData = function() {
  return this.data;
}

module.exports = CollectManager;