import { KafkaConfig, EachMessagePayload } from "kafkajs";
import { KafkaManager } from "./kafkaManager";
import { EventData } from "./types/scriptInInterfaces";


const kafkaConfig: KafkaConfig = { clientId: 'your clinetId', brokers: ['your broker details'] };
const kafkaManager = new KafkaManager(kafkaConfig);
export const init = async () => {
    // Admin operations
    await kafkaManager.connectAdmin();
    await kafkaManager.createTopics([{ topic: 'your-topic-name', numPartitions: 2, replicationFactor: 1 }]);
    await kafkaManager.connectProducer();
    // await kafkaManager.deleteTopics(['user-service']);
    // await kafkaManager.disconnectAdmin();
    // Consumer operations
    const eachMessageHandler = async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log({
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value?.toString(),
        });
    };
    await kafkaManager.initializeConsumer('your-topic-name', 'group-Id', eachMessageHandler);
    await kafkaManager.disconnectConsumer('topic');
};
export const produceMessage = async (data: EventData) => {
    await kafkaManager.connectProducer();
    await kafkaManager.initializeProducer('yur-topic', data);
    await kafkaManager.disconnectProducer();
};
export const consumeMessages = async (topic: string, groupId: string) => {
    const eachMessageHandler = async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log({
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value?.toString(),
        });
    };
    await kafkaManager.initializeConsumer(topic, groupId, eachMessageHandler);
}
export const disconnectKafka = async () => {
    await kafkaManager.disconnectAdmin();
    await kafkaManager.disconnectProducer();
    await kafkaManager.disconnectConsumer('topic-name');
}