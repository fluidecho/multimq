var preview = require('preview')('pull');
var multimq = require('./../../');

var service = multimq.service();

var options = {
  service: 'myService',
  mq: 'hypermq',
  pattern: 'pull',
  socket: 'connect',
  hostname: '127.0.0.1',
  port: 3443,
  secure: false,
  apikey: 'za91j2bk72f483ap62x',
  protocol: 'amp',
  rejectUnauthorized: false
};

var myService = new service(options);

myService.on('message', function(msg){
  preview('myService', 'message', msg);
});

