//Simple app to send a message to a rabbit MQ




console.log('About to send message')

var amqp = require('amqplib');
var when = require('when');

amqp.connect('amqp://guest:guest@46.101.46.152:5672').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    var ok = ch.assertQueue(q, {durable: false});
    
    return ok.then(function(_qok) {

      for (var i = 0; i < 2; i++) {
      ch.sendToQueue(q, new Buffer(msg + ' ' +i));
      console.log(" [x] Sent '%s'", msg);
      }
      return ch.close();
    });
  })).ensure(function() { conn.close(); });;
}).then(null, console.warn);