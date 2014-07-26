
var multimq = require('..')
  , program = require('commander');

program
  .option('-m, --mq <n>', 'message queue system [hypermq]')
  .option('-t, --per-tick <n>', 'messages per tick [10]', parseInt)
  .option('-s, --size <n>', 'message size in bytes [200]', parseInt)
  .option('-d, --duration <n>', 'duration of test [5000]', parseInt)
  .parse(process.argv)

var perTick = program.perTick || 1000;

var mq = program.mq || 'hypermq';

var service = multimq.service();

var options = {
  service: 'myService',
  mq: mq,
  pattern: 'pub',
  socket: 'bind',
	hostname: '127.0.0.1',
	port: 3443,
	secure: false,
	key: __dirname + '/keys/test-key.pem',
	cert: __dirname + '/keys/test-cert.pem',
	apikey: 'za91j2bk72f483ap62x',
	protocol: 'amp'
};

var myService = new service(options);

console.log('pub bound');

myService.on('closed', function(msg){
  // connect peer has closed, so can exit this program.
  process.exit();
});

var buf = new Buffer(Array(program.size || 200).join('a'));
console.log('sending %d per tick', perTick);
console.log('sending %d byte messages', buf.length);

function more() {
  for (var i = 0; i < perTick; ++i) myService.send(buf);
  setImmediate(more);
}

more();


