"use strict";
//
// multimq: Wrapper for using different message queue systems, such as: zeromq, axon and hypermq.
//
// Version: 0.0.3
// Author: Mark W. B. Ashcroft (mark [at] kurunt [dot] com)
// License: MIT or Apache 2.0.
//
// Copyright (c) 2014 Mark W. B. Ashcroft.
// Copyright (c) 2014 Kurunt.
//


var util = require('util');
var events = require('events');
var preview = require('preview')('multimq');

// message quque services:
var hypermq = require('hypermq');
var axon = require('axon');
try {
  var zmq = require('zmq');
  var Message = require('amp-message');
} catch(e) {
  var zmq = undefined;    // module not installed by default as is a binding.
  preview('zmq not installed!');
}


// public api:
exports.service = service;

// pass settings via 'options' DO NOT SET/CHANGE HERE!
var settings = { 
  throw_error: false        // if true throw.
};


function service() {
  return Service;
}


function Service(options) {

  preview('new Service', options);

  var self = this;
  
  self.options = options;

  if ( options.mq === 'hypermq' ) {
    self.service = mq_hypermq(options, self);
  } else if ( options.mq === 'axon' ) {
    self.service = mq_axon(options, self);
  } else if ( options.mq === 'zmq' ) {
    self.service = mq_zmq(options, self);
  } else {
    throw new Error('invalid message queue');
  }

}
util.inherits(Service, events.EventEmitter);  


// send prototype.
Service.prototype.send = function send(m) {
  preview('send service', this.options.service);
  _send(m, this);
};  



function _send(m, self) {
  preview('_send to service: ' + self.options.service + ', using mq: ' + self.options.mq + ', message', m);
  
  if ( self.options.mq === 'zmq' ) {
    // serialize the message using AMP.
    var msg = new Message;
    msg.push(m);
    msg = msg.toBuffer();
    self.service.send(msg);
  } else {
    self.service.send(m);
  }
}


function mq_hypermq(options, self) {

  preview('mq_hypermq', 'bind: ' + options.socket + ', service: ' + options.service); 

  if ( options.socket === 'bind' ) {
    var service = hypermq.bind(options);
  } else {
    var service = hypermq.connect(options);
  }

  var theService = new service(options.service, options.pattern);

  theService.on('message', function(msg){
    preview('mq_hypermq', 'on message, emit to self for service: ' + options.service);
    self.emit('message', msg);
  });

  theService.on('error', function(e){
    preview('mq_hypermq', 'on error, emit to self');
    self.emit('error', e);
  });

  theService.on('closed', function(){
    preview('mq_hypermq', 'on closed, emit to self');
    self.emit('closed', true);    // emit 'closed'
  });

  theService.on('connected', function(query){
    preview('mq_hypermq', 'on connected, emit to self');
    self.emit('connected', query);
  });
  
  theService.on('queued', function(m){
    preview('mq_hypermq', 'on queued, emit to self');
    self.emit('queued', m);
  });

  theService.on('flushed', function(n){
    preview('mq_hypermq', 'on flushed, emit to self');
    self.emit('queued', n);
  });
    
  return theService;

}



function mq_axon(options, self) {

  preview('mq_axon', 'bind: ' + options.socket + ', service: ' + options.service); 

  var sock = axon.socket(options.pattern);

  if ( options.socket === 'bind' ) {
    sock.bind('tcp://' + options.hostname + ':' + options.port);
  } else {
    sock.connect('tcp://' + options.hostname + ':' + options.port);
  }

  sock.on('message', function(msg){
    preview('mq_axon', 'on message, emit to self');
    self.emit('message', msg);
  });

  sock.on('error', function(e){
    preview('mq_axon', 'on error, emit to self');
    self.emit('error', e);
  });

  sock.on('close', function(){
    preview('mq_axon', 'on closed, emit to self');
    self.emit('closed', true);    // emit 'closed'
  });

  sock.on('disconnect', function(){
    preview('mq_axon', 'on disconnect, emit to self');
    self.emit('closed', true);    // emit 'closed'
  });

  sock.on('connect', function(){
    preview('mq_axon', 'on connected, emit to self');
    self.emit('connected', true);
  });
  
  sock.on('flush', function(){
    preview('mq_axon', 'on flushed, emit to self');
    self.emit('queued', true);
  });
    
  return sock;

}



function mq_zmq(options, self) {

  preview('mq_zmq', 'bind: ' + options.socket + ', service: ' + options.service); 

  var sock = zmq.socket(options.pattern);

  if ( options.socket === 'bind'  ) {
    sock.bind('tcp://' + options.hostname + ':' + options.port);
  } else if ( options.socket === 'bindSync'  ) {
    sock.bindSync('tcp://' + options.hostname + ':' + options.port);
  } else {
    sock.connect('tcp://' + options.hostname + ':' + options.port);
  }

  sock.on('message', function(msg){
    preview('mq_zmq', 'on message, emit to self');
    // de-seriazlize the message using AMP.
    var m = new Message(msg);
    self.emit('message', m.shift());
  });

  sock.on('error', function(e){
    preview('mq_zmq', 'on error, emit to self');
    self.emit('error', e);
  });

  sock.on('close', function(){
    preview('mq_zmq', 'on closed, emit to self');
    self.emit('closed', true);    // emit 'closed'
  });

  sock.on('disconnect', function(){
    preview('mq_zmq', 'on disconnect, emit to self');
    self.emit('closed', true);    // emit 'closed'
  });

  sock.on('connect', function(){
    preview('mq_zmq', 'on connected, emit to self');
    self.emit('connected', true);
  });
  
  sock.on('flush', function(){
    preview('mq_zmq', 'on flushed, emit to self');
    self.emit('queued', true);
  });
    
  return sock;

}
