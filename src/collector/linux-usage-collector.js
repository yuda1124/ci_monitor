const exec = require('child_process').execSync;
const Usage = require('../model/usage');

function getCPUUsage() {
  const stdout = exec('top -bn2 | grep "Cpu(s)"').toString(); // TODO: handling exception.
  const stdoutArray = stdout.split('\n');
  // we will use second value, because we detect that first value is always same.
  const CPUInfo = stdoutArray[1];
  const idIndex = CPUInfo.indexOf('id');
  const idle =  CPUInfo.substring(idIndex-6, idIndex-1).trim();
  const cpuUsage =  100 - idle;
  return cpuUsage.toFixed(1);
};

function getMemoryUsage() {
  const memTotal = exec('cat /proc/meminfo | grep "MemTotal"').toString().replace(/\D/g, ''); // TODO: handling exception.
  const memFree = exec('cat /proc/meminfo | grep "MemFree"').toString().replace(/\D/g, ''); // TODO: handling exception.
  const cpuUsage = (1 - (memFree / memTotal)) * 100;
  return cpuUsage.toFixed(1);
}

function getDiskUsage() {
  const totalSize = exec('df -l --total --output=source,size | grep "total"').toString().replace(/\D/g, ''); // TODO: handling exception.
  const totalUsed = exec('df -l --total --output=source,used | grep "total"').toString().replace(/\D/g, ''); // TODO: handling exception.
  const diskUsage = {
    size: totalSize,
    used: totalUsed
  };
  return diskUsage;
}

function getNetworkStat() {
  const rx = exec('cat /sys/class/net/ens160/statistics/rx_bytes').toString().replace(/\D/g, ''); // TODO: handling exception.
  const tx = exec('cat /sys/class/net/ens160/statistics/tx_bytes').toString().replace(/\D/g, ''); // TODO: handling exception.
  const networkStat = {
    rx: rx,
    tx: tx
  };
  return networkStat;
}

function linuxUsageCollector() {
  this.usage = new Usage(getCPUUsage(), getMemoryUsage(), getDiskUsage(), getNetworkStat());
}

module.exports = linuxUsageCollector;
