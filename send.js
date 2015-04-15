//Simple app to send a message to a rabbit MQ every minute

console.log('Running app - preparing to send messages to RabbitMQ');

var amqp = require('amqplib');
var when = require('when');


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

var randomWord = require('random-words');
var CronJob = require('cron').CronJob;

//Cron equivalent to make the connection and send every minute tick (based on host clock)
new CronJob('0 * * * * *', function() {

      connectAndSend("Hello " + randomWord());

}, null, true);

