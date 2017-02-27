function host(ipAddress, osVersion, kernelVersion, cpuinfo) {
  this.ipAddress = ipAddress;
  this.osVersion = osVersion;
  this.kernelVersion = kernelVersion;
  this.cpuinfo = cpuinfo;
//  this.dockerContainers = dockerContainers;
//  this.usage = usage;
}

module.exports = host;
