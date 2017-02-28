const exec = require('child_process').execSync;
const network_card = require('../../config_network_card.json').name;
const Host = require('../model/host');

function getHostIP() {
  return exec('ifconfig ' + network_card + ' | grep \'inet \' | awk \'{ print $2}\'').toString().trim(); // TODO: handling exception.
}

function getHostOSVersion() {
  return exec('cat /etc/redhat-release').toString().trim(); // TODO: handling exception.
}

function getKernelVersion() {
  return exec('uname -r').toString().trim(); // TODO: handling exception.
}

function getCPUInfo() {
  const stdout = exec('cat /proc/cpuinfo | grep \'model name\'').toString().trim(); // TODO: handling exception.
  return stdout.replace('model name	: ','');
}

function LinuxInfoCollector() {
  this.host = new Host(getHostIP(), getHostOSVersion(), getKernelVersion(), getCPUInfo());
}

module.exports = LinuxInfoCollector;
