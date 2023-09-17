const amqp = require("amqplib");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

//function to consume the messages

async function consumeMessages() {
    //create connection
  const connection = await amqp.connect("amqp://localhost");
  //create channel
  const channel = await connection.createChannel();
//assert our same logexhange on the newly created channel for consumer  pass exchange name type
  await channel.assertExchange("logExchange", "direct");
//create queque pass queqname if we dont give anything it will take default as raabitmq probably
  const q = await channel.assertQueue("InfoQueue");
//create bindind 1st parameter quename 2nd exchangename 3rd pattern (info)   pattern should match routing key 
//if we want to recieve message here
  await channel.bindQueue(q.queue, "logExchange", "Info");
//consume messages on q.que  2nd parameter is function since we were sending string of json data so we have parse it our content will be present on msg.content and also we can acknowldege our channel that msg has been recieved

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}
//in nutshell newly created queq which has name infoque is bound to exchange called logexchange with binding key info



//note we have created new channel on our consumer so there will be now 2 channels availbe in rbbitmq ui

//also we have 2 connection now one connection is used by publisher and another by consumer 

//calling the consumefunction 
consumeMessages();