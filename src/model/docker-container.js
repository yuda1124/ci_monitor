function DockerContainer(host_ip, id, name, image, ports, created, status) {
  this.host_ip = host_ip;
  this.id = id;
  this.name = name;
  this.image = image;
  this.ports = ports;
  this.created = created;
  this.status = status;
  // this.usage = usage;
}

module.exports = DockerContainer;