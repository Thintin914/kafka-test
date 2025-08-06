import { sendMessage } from './producer';
import { startConsumer } from './consumer';

async function main() {
  console.log('🎯 Simple Kafka TypeScript Demo');
  console.log('================================');
  
  // Start the consumer in the background
  console.log('\n1️⃣ Starting consumer...');
  startConsumer();
  
  // Wait a moment for consumer to connect
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Send some messages
  console.log('\n2️⃣ Sending messages...');
  const messages = [
    'Welcome to Kafka!',
    'This is a TypeScript demo',
    'Messages are being sent and received in real-time',
    'Kafka makes distributed systems easy!'
  ];
  
  for (const message of messages) {
    await sendMessage(message);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n✅ Demo completed! Consumer will continue listening...');
  console.log('Press Ctrl+C to stop the consumer');
}

// Run the demo
if (require.main === module) {
  main().catch(console.error);
} 