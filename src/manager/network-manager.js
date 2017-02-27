const http = require('http');

function NetworkManager() {}

NetworkManager.prototype.post = function (config, data) {
  // An object of options to indicate where to post to
  const options = {
    host: config.address,
    port: config.port,
    path: config.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Set up the request
  const req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });

  // post the data
  if (Array.isArray(data)) {
    data.map(function(value) {
      console.log(data);
      req.write(data);
    });
  } else {
    console.log(data);
    req.write(data);
  }
  req.end();
  // console.log(data);
  // console.log(req);
}

module.exports = NetworkManager;