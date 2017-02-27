// OS - name

// manger = new CollectManager();
// manager.setHostName(name);
// // manager.setDockerContainerList(name);
// info = manager.collect();

// Network.send(info);

// check docker service active or not.


const CollectManager = require('./manager/collect-manager');
const NetworkManager = require('./manager/network-manager');

const collectManager = new CollectManager();
const networkManager = new NetworkManager();

collectManager.collect();
const data = collectManager.getData();

networkManager.post(data);