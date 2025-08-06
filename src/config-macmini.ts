// Configuration for Mac Mini (Consumer)
export const kafkaConfig = {
  clientId: 'macmini-consumer',
  brokers: ['localhost:9092'], // Kafka running on this machine
  topic: 'test-messages',
  groupId: 'macmini-consumer-group'
}; 