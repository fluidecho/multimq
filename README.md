# MutiMQ

Wrapper for using different message queue systems, such as: [zeromq](https://github.com/JustinTulloss/zeromq.node), [axon](https://github.com/visionmedia/axon) and [hypermq](https://github.com/kurunt/hypermq).  

Allows use of multiple message queueing systems within this single module, providing a universal set of common commands. Message queues supported:  

  - [zeromq](https://github.com/JustinTulloss/zeromq.node) (zeromq), @2.7.0
  - [axon](https://github.com/visionmedia/axon), @2.0.0
  - [hypermq](https://github.com/kurunt/hypermq), @0.0.3  

## Installation

From your terminal, requires [node.js](http://nodejs.org/).

```
npm install multimq
```

The `zmq` module is a __binding__ so it is not installed by default, if you wish to use zmq (zeromq) you will need to install it separately within the `multimq` folder:

```
npm install zmq
```

## Options

  - `service` set a service/socket name
  - `mq` axon, zmq, hypermq
  - `pattern` push / pull, pub / sub, req / rep (axon, zmq), chit / chat (hypermq), pub-emitter / sub-emitter (axon), router / dealer (zmq)
  - `socket` bind, connect, bindSync (zmq)
  - `hostname` hostname address
  - `port` host port
  - `secure` _hypermq_ boolean
  - `key` _hypermq_ ssl/tls key filename
  - `cert` _hypermq_ ssl/tls certificate filename
  - `apikey` _hypermq_ apikey string
  - `protocol` _hypermq_ amp, ldjson

## Events

  - `closed` when peer closes.
  - `error` (err) when an un-handled socket error occurs.
  - `reconnect attempt` when a reconnection attempt is made.
  - `connected` (any url queries sent as object) when connected to the peer, or a peer connection is accepted.
  - `queued` (msg) when a message is enqueued, can use to save unsent messages.
  - `flushed` (total messages) queued when messages are flushed on connection.
  - `message` (msg) the message received by peer.

## Example

`bind`:

```js
var multimq = require('multimq');

var options = {
  service: 'myService',
  mq: 'hypermq',
  pattern: 'pub',
  socket: 'bind',
  hostname: '127.0.0.1',
  port: 3443,
  secure: false,
  key: __dirname + '/key.pem',
  cert: __dirname + '/cert.pem',
  apikey: 'za91j2bk72f483ap62x',
  protocol: 'amp'
};

var myService = new multimq(options);
console.log('MQ push service bound at: tcp://localhost:5555');

setInterval(function(){
  console.log('sending...');
  sock.send('hello world');
}, 500);

```
`connect`:

```js
var multimq = require('multimq');

var options = {
  service: 'myService',
  mq: 'hypermq',
  pattern: 'sub',
  socket: 'connect',
  hostname: '127.0.0.1',
  port: 3443,
  secure: false,
  apikey: 'za91j2bk72f483ap62x',
  protocol: 'amp',
  rejectUnauthorized: false
};

var myService = new multimq(options);
console.log('MQ pull service connected to: tcp://localhost:5555');

myService.on('message', function(msg){
  console.log(msg.toString());
});

```

## License

Choose either: [MIT](http://opensource.org/licenses/MIT) or [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).

