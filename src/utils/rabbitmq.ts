import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();
export async function connectRabbitMQ() {
  try {
   let connection = await amqp.connect(process.env.RABBITMQ_URL!);
   let channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    const sendToExchange = async (
      exchange: string,
      routingKey: string,
      message: object
    ) => {
      try {
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue('rabbit',{ durable: true });
        await channel.bindQueue('rabbit',exchange,routingKey)
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to exchange: ${exchange}, routing key: ${routingKey}`);
      } catch (error) {
        console.error('Failed to send message to exchange:', error);
        throw error;
      }
    };
    return {
      sendToExchange,
    };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
}