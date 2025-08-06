import { Kafka } from 'kafkajs';
import { kafkaConfig } from './config';

// Create Kafka client
const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
});

// Create consumer
const consumer = kafka.consumer({ 
  groupId: kafkaConfig.groupId 
});

async function startConsumer() {
  try {
    await consumer.connect();
    console.log('🔌 Consumer connected to Kafka');
    
    // Subscribe to the topic
    await consumer.subscribe({ 
      topic: kafkaConfig.topic, 
      fromBeginning: true // Start reading from the beginning
    });
    
    console.log(`📥 Subscribed to topic: ${kafkaConfig.topic}`);
    console.log('👂 Listening for messages... (Press Ctrl+C to stop)');
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const timestamp = message.timestamp ? new Date(parseInt(message.timestamp.toString())).toISOString() : 'Unknown';
        
        console.log('\n📨 Received message:');
        console.log(`   Topic: ${topic}`);
        console.log(`   Partition: ${partition}`);
        console.log(`   Offset: ${message.offset}`);
        console.log(`   Timestamp: ${timestamp}`);
        console.log(`   Message: "${message.value?.toString()}"`);
        console.log('─'.repeat(50));
      },
    });
    
  } catch (error) {
    console.error('❌ Error in consumer:', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down consumer...');
  await consumer.disconnect();
  process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
  startConsumer().catch(console.error);
}

export { startConsumer }; 