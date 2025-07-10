import { Kafka, AdminConfig, Producer, ProducerConfig, KafkaConfig, Admin, ITopicConfig, ConsumerConfig, EachMessagePayload, Message } from "kafkajs";
import { EventData } from "./types/scriptInInterfaces";


export class KafkaManager {
    private kafka: Kafka;
    private admin: Admin;
    private producer: Producer;
    private consumers: Map<string, any> = new Map(); // Track consumers by topic

    constructor(kafkaConfig: KafkaConfig, adminConfig?: AdminConfig) {
        this.kafka = new Kafka(kafkaConfig);
        this.admin = this.kafka.admin(adminConfig);
        this.producer = this.kafka.producer();
    }

    async connectAdmin() {
        try {
            console.log('Connecting Kafka admin...');
            await this.admin.connect();
            console.log('Kafka admin connected.');
        } catch (error) {
            console.error('Failed to connect Kafka admin:', error);
        }
    }

    async disconnectAdmin() {
        try {
            console.log('Disconnecting Kafka admin...');
            await this.admin.disconnect();
            console.log('Kafka admin disconnected.');
        } catch (error) {
            console.error('Failed to disconnect Kafka admin:', error);
        }
    }

    async createTopics(topicConfig: { topic: string; numPartitions: number; replicationFactor: number }[]) {
        try {
            const result = await this.admin.createTopics({
                topics: topicConfig,
                timeout: 30000,
                waitForLeaders: true,
            });
           if (result) {
                console.log('Kafka topics created successfully.');
            } else {
                console.log('Kafka topics were already created.');
            }
        } catch (error) {
            console.error('Failed to create Kafka topics:', error);
        }
    }

    async deleteTopics(topics: string[]) {
        try {
            console.log('Deleting Kafka topics:', topics);
            await this.admin.deleteTopics({
                topics: topics,
                timeout: 30000,
            });
            console.log('Kafka topics deleted successfully.');
        } catch (error) {
            console.error('Failed to delete Kafka topics:', error);
        }
    }

    async connectProducer() {
        try {
            console.log("Connecting producer...");
            await this.producer.connect();
            console.log("Producer connected successfully.");
        } catch (error) {
            console.error('Failed to connect Kafka producer:', error);
        }
    }

    async sendProducerMessage(topic: string, data: EventData) {
        try {
            const msg: Message = {
                value: JSON.stringify(data)
            }
            await this.producer.send({
                topic: topic,
                messages: [msg]
            })
            console.log(`Message sent to topic ${topic}`);
        } catch (error) {
            console.error('Failed to initialize producer:', error);
        }
    }

    async disconnectProducer() {
        try {
            console.log("Disconnecting producer...");
            await this.producer.disconnect();
            console.log("Producer disconnected successfully.");
        } catch (error) {
            console.error('Failed to disconnect Kafka producer:', error);
        }
    }

    async initializeConsumer(topic: string, groupId: string, eachMessageHandler: (payload: EachMessagePayload) => Promise<void>) {
        try {
            const consumerConfig: ConsumerConfig = { groupId: groupId };
            const consumer = this.kafka.consumer(consumerConfig);
            console.log(`Connecting Kafka consumer for topic: ${topic}`);
            await consumer.connect();
            console.log(`Kafka consumer connected for topic: ${topic}`);
            await consumer.subscribe({ topic, fromBeginning: true });
            console.log(`Subscribed to topic ${topic}`);
            await consumer.run({
                eachMessage: async (payload) => {
                    await eachMessageHandler(payload);
                },
            });
            this.consumers.set(topic, consumer); // Save the consumer for later use
        } catch (error) {
            console.error('Failed to initialize Kafka consumer:', error);
        }
    }

    async disconnectConsumer(topic: string) {
        const consumer = this.consumers.get(topic);
        if (consumer) {
            try {
                console.log(`Disconnecting Kafka consumer for topic: ${topic}`);
                await consumer.disconnect();
                console.log(`Kafka consumer disconnected for topic: ${topic}`);
                this.consumers.delete(topic); // Remove the consumer from the map
            } catch (error) {
                console.error(`Failed to disconnect Kafka consumer for topic: ${topic}`, error);
            }
        } else {
            console.log(`No consumer found for topic: ${topic}`);
        }
    }

    async consumeMessages(topic: string, groupId: string) {
        const eachMessageHandler = async (payload: EachMessagePayload) => {
            const { topic, partition, message } = payload;
            console.log({
                topic,
                partition,
                key: message.key?.toString(),
                value: message.value?.toString(),
            });
        };
        await this.initializeConsumer(topic, groupId, eachMessageHandler);
    }

    async initializeKafka(topic: string) {
        await this.connectAdmin();
        await this.createTopics([{ topic: topic, numPartitions: 2, replicationFactor: 1 }]);
        await this.connectProducer();
    }
    
    async disconnectKafka(topic: string){
        await this.disconnectAdmin();
        await this.disconnectProducer();
        await this.disconnectConsumer(topic);
    }

}