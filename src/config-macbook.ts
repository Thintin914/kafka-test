// Configuration for MacBook (Producer)
export const kafkaConfig = {
  clientId: 'macbook-producer',
  brokers: ['172.18.30.193:9092'], // Replace with your Mac Mini's IP address
  topic: 'cross-device-topic',
  groupId: 'macbook-consumer-group'
}; 