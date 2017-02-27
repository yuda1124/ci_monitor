function Usage(cpu, mem, disk, network) {
  this.cpu = cpu;
  this.mem = mem;
  this.disk = disk;
  this.network = network;
}

module.exports = Usage;
