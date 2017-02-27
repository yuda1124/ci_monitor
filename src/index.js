// OS - name

// manger = new CollectManager();
// manager.setHostName(name);
// // manager.setDockerContainerList(name);
// info = manager.collect();

// Network.send(info);

// check docker service active or not.
const config_host = require('../config_host.json');
const config_docker = require('../config_docker.json');
const CollectManager = require('./manager/collect-manager');
const NetworkManager = require('./manager/network-manager');

const collectManager = new CollectManager();
const networkManager = new NetworkManager();

collectManager.collect();

const hostData = collectManager.getHostData();
networkManager.post(config_host, hostData);

const dockerData = collectManager.getDockerData();
networkManager.post(config_docker, dockerData);