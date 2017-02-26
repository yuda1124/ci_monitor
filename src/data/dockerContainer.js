function dockerContainer(name, id, status, created, ports, usage) {
  this.name = name;
  this.id = id;
  this.status = status;
  this.created = created;
  this.ports = ports;
  this.usage = usage;
}
