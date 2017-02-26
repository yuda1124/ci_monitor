const exec = require('child_process').execSync;
const Host = require('../model/host');

function getHostOSVersion() {
  return exec('cat /etc/redhat-release').toString();
}

function getKernelVersion() {
  return exec('uname -r').toString();
}

function getCPUInfo() {
  const stdout = exec('cat /proc/cpuinfo | grep \'model name\'').toString();
  return stdout.replace('model name	: ','');
}

function LinuxInfoCollector() {
  this.host = new Host(getHostOSVersion(), getKernelVersion(), getCPUInfo());
}

module.exports = LinuxInfoCollector;
