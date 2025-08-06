import { Kafka } from 'kafkajs';
import { kafkaConfig } from './config-macbook';

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
    
    console.log(`📤 [MacBook] Sending message: "${message}"`);
    
    await producer.send({
      topic: kafkaConfig.topic,
      messages: [
        { 
          value: message,
          timestamp: Date.now()
        },
      ],
    });
    
    console.log('✅ Message sent successfully to Mac Mini!');
  } catch (error) {
    console.error('❌ Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

// Interactive message sending
async function runInteractiveProducer() {
  console.log('🚀 MacBook Producer Started');
  console.log('📱 Sending messages to Mac Mini...');
  console.log('Type your messages (or "quit" to exit):\n');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askForMessage = () => {
    rl.question('💬 Enter message: ', async (input: string) => {
      if (input.toLowerCase() === 'quit') {
        console.log('👋 Goodbye!');
        rl.close();
        process.exit(0);
      }
      
      await sendMessage(input);
      console.log(''); // Empty line for readability
      askForMessage();
    });
  };
  
  askForMessage();
}

// Run if this file is executed directly
if (require.main === module) {
  runInteractiveProducer().catch(console.error);
}

export { sendMessage }; 