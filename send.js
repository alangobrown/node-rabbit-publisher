//Simple app to send a message to a rabbit MQ




console.log('About to send message')

var amqp = require('amqplib');
var when = require('when');

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}


function connectAndSend(msg){


  //For testing, connecting to a real IP address
  //amqp.connect('amqp://guest:guest@46.101.46.152:5672').then(function(conn) {


    // FOR DOCKER WHEN A LINK IS CALLED rabbit
  amqp.connect('amqp://' + 'rabbit' + ':' + process.env.RABBIT_PORT_5672_TCP_PORT).then(function(conn) {


    return when(conn.createChannel().then(function(ch) {
      var q = 'hello';
      //var msg = 'Hello World!';

      var ok = ch.assertQueue(q, {durable: false});
      
      return ok.then(function(_qok) {

            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [x] Sent '%s'", msg);

        
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);

  
}


    connectAndSend("Hello world!");
    connectAndSend("Hello world!");
    connectAndSend("Hello world!");
    connectAndSend("Hello world!");
