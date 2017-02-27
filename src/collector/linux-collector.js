const InfoCollector = require('./linux-info-collector');
const UsageCollector = require('./linux-usage-collector');

function LinuxCollector () {
  this.infoCollector = new InfoCollector();
  this.usageCollector = new UsageCollector();
}

LinuxCollector.prototype.mergeData = function() {
  this.data = {
    info: this.infoCollector.host,
    usage: this.usageCollector.usage
  };
}

LinuxCollector.prototype.getData = function() {
  return this.data;
}

module.exports = LinuxCollector;