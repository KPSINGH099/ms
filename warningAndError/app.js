const amqp = require("amqplib");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange("logExchange", "direct");
//hum apne quew ka naam de rhe h is wale service k liye
  const q = await channel.assertQueue("WarningAndErrorsQueue");
//is wale queque k pass do tarah ki binding key h isliye 
//ye warning binding key k liye 
  await channel.bindQueue(q.queue, "logExchange", "Warning");
//aur ye error binding key k liye
  await channel.bindQueue(q.queue, "logExchange", "Error");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    //if we dont send ack  or acknowldege the message our messages will be still available in queq 
    //aur agar server ko close krne k baad v node app.js is file ko run krenge to hume cosole me milega 
    //kyki wo quequ me save h
    channel.ack(msg);
  });
}

consumeMessages();