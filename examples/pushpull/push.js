var preview = require('preview')('push');
var multimq = require('./../../');

var service = multimq.service();

var options = {
  service: 'myService',
  mq: 'hypermq',
  pattern: 'push',
  socket: 'bind',
  hostname: '127.0.0.1',
  port: 3443,
  secure: false,
  key: __dirname + '/key.pem',
  cert: __dirname + '/cert.pem',
  apikey: 'za91j2bk72f483ap62x',
  protocol: 'amp'
};

var myService = new service(options);
preview('myService:push server started');

var x = 0;
setInterval(function(){
  myService.send({foo: 'bar', x: x++});
}, 1000);

