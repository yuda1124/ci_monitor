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
  const stdout = exec('df -hl --total --output=source,pcent | grep "total"').toString(); // TODO: handling exception.
  const diskUsage = stdout.replace(/\D/g, '');
  return diskUsage;
}

function linuxUsageCollector() {

}
