function DockerContainer(id, name, image, ports, created, status) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.ports = ports;
  this.created = created;
  this.status = status;
  // this.usage = usage;
}

module.exports = DockerContainer;