import { Kafka } from 'kafkajs';
import { kafkaConfig } from './config';

// Create Kafka client
const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
});

// Create producer
const producer = kafka.producer();

async function sendMessage(message: string) {
  try {
    await producer.connect();
    
    console.log(`📤 Sending message: "${message}"`);
    
    await producer.send({
      topic: kafkaConfig.topic,
      messages: [
        { 
          value: message,
          timestamp: Date.now()
        },
      ],
    });
    
    console.log('✅ Message sent successfully!');
  } catch (error) {
    console.error('❌ Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

// Example usage
async function runProducer() {
  console.log('🚀 Starting Kafka Producer...');
  
  // Send a few test messages
  const messages = [
    'Hello from TypeScript!',
    'This is a test message',
    'Kafka is awesome!',
    'Message with timestamp: ' + new Date().toISOString()
  ];
  
  for (const message of messages) {
    await sendMessage(message);
    // Wait a bit between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Producer finished!');
}

// Run if this file is executed directly
if (require.main === module) {
  runProducer().catch(console.error);
}

export { sendMessage }; 