const DockerContainerCollector = require('../collector/docker-container-collector');

function CollectManager() {
  this.dcCollector = new DockerContainerCollector();
  this.data = null;
}

CollectManager.prototype.collect = function() {
  this.dcCollector.collectContainerInfo();
  this.dcCollector.getContainerStats();
  this.data = this.dcCollector.getData();
}

CollectManager.prototype.getData = function() {
  return this.data;
}

module.exports = CollectManager;