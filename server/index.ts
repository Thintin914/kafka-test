import { KafkaConfig, EachMessagePayload } from "kafkajs";
import { KafkaManager } from "./kafkaManager";
import { EventData } from "./types/scriptInInterfaces";
import express from 'express';

const kafkaConfig: KafkaConfig = { 
    clientId: 'kafka-test-client', 
    brokers: ['localhost:9092'] 
};
const kafkaManager = new KafkaManager(kafkaConfig);

const app = express();
const PORT = process.env.PORT || 3000;

// Function to send Event A (simplified - no connection management)
async function sendEventA() {
    try {
        // Create Event A data
        const eventA: EventData = {
            email: 'user@example.com',
            subject: 'Event A Occurred',
            message: 'This is event A data',
            data: {
                timestamp: new Date().toISOString(),
                userId: '12345',
                action: 'user_login'
            }
        };
        
        await kafkaManager.sendProducerMessage('test-topic', eventA);
        console.log('Event A sent successfully!');
        
    } catch (error) {
        console.error('Error sending Event A:', error);
    }
}

// API endpoint to trigger Event A
app.post('/send-event', async (req, res) => {
    try {
        await sendEventA();
        res.json({ success: true, message: 'Event A sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send event' });
    }
});

// Start server with Kafka initialization
const startServer = async () => {
    try {
        // Initialize Kafka first
        await kafkaManager.initializeKafka('test-topic');
        
        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        
        // Handle graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
            
            // Close HTTP server
            server.close(() => {
                console.log('HTTP server closed');
            });
            
            // Disconnect Kafka
            await kafkaManager.disconnectKafka('test-topic');
            
            console.log('Graceful shutdown completed');
            process.exit(0);
        };
        
        // Listen for shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();