import { Kafka } from 'kafkajs';
import { kafkaConfig } from './config-macmini';

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
    console.log('🔌 [Mac Mini] Consumer connected to Kafka');
    
    // Subscribe to the topic
    await consumer.subscribe({ 
      topic: kafkaConfig.topic, 
      fromBeginning: true
    });
    
    console.log(`📥 Subscribed to topic: ${kafkaConfig.topic}`);
    console.log('👂 Waiting for messages from MacBook... (Press Ctrl+C to stop)');
    console.log('─'.repeat(60));
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const timestamp = message.timestamp ? new Date(parseInt(message.timestamp.toString())).toISOString() : 'Unknown';
        
        console.log('\n📨 [Mac Mini] Received message from MacBook:');
        console.log(`   📱 From: MacBook`);
        console.log(`   📍 Topic: ${topic}`);
        console.log(`   🕐 Timestamp: ${timestamp}`);
        console.log(`   💬 Message: "${message.value?.toString()}"`);
        console.log('─'.repeat(60));
      },
    });
    
  } catch (error) {
    console.error('❌ Error in consumer:', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Mac Mini consumer...');
  await consumer.disconnect();
  process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
  startConsumer().catch(console.error);
}

export { startConsumer }; 