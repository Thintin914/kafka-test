# Simple Kafka TypeScript Demo

A beginner-friendly Kafka system built with TypeScript that demonstrates how to send and receive messages.

## What This Demo Does

- **Producer**: Sends messages to a Kafka topic
- **Consumer**: Reads messages from the same topic
- **Real-time Communication**: Shows how different parts of a system can communicate

## Prerequisites

Before running this demo, you need to have Kafka running locally. Here are the easiest ways:

### Option 1: Docker (Recommended)

```bash
# Create a docker-compose.yml file
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
EOF

# Start Kafka
docker-compose up -d
```

### Option 2: Local Installation

Follow the [Apache Kafka Quickstart](https://kafka.apache.org/quickstart) guide.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure Kafka is running** (see Prerequisites above)

## Usage

### Run the Complete Demo

This will start a consumer and then send messages to it:

```bash
npm run dev
```

### Run Producer and Consumer Separately

**Terminal 1 - Start the consumer:**
```bash
npm run consumer
```

**Terminal 2 - Send messages:**
```bash
npm run producer
```

## What You'll See

### Producer Output
```
🚀 Starting Kafka Producer...
📤 Sending message: "Hello from TypeScript!"
✅ Message sent successfully!
📤 Sending message: "This is a test message"
✅ Message sent successfully!
```

### Consumer Output
```
🔌 Consumer connected to Kafka
📥 Subscribed to topic: test-topic
👂 Listening for messages... (Press Ctrl+C to stop)

📨 Received message:
   Topic: test-topic
   Partition: 0
   Offset: 0
   Timestamp: 2024-01-15T10:30:00.000Z
   Message: "Hello from TypeScript!"
──────────────────────────────────────────────────
```

## Project Structure

```
src/
├── config.ts      # Kafka configuration
├── producer.ts    # Sends messages to Kafka
├── consumer.ts    # Reads messages from Kafka
└── index.ts       # Main demo file
```

## Key Concepts Demonstrated

- **Topics**: Messages are organized into topics (like categories)
- **Producers**: Applications that send messages
- **Consumers**: Applications that read messages
- **Brokers**: Kafka servers that store and manage messages
- **Real-time Communication**: Messages are delivered instantly

## Next Steps

- Try sending different types of messages
- Run multiple consumers to see load balancing
- Experiment with different topics
- Add message filtering or processing logic

## Troubleshooting

**"ECONNREFUSED" Error:**
- Make sure Kafka is running on `localhost:9092`
- Check if Docker containers are up: `docker-compose ps`

**"Topic not found" Error:**
- Kafka will automatically create topics when messages are sent
- The first message might take a moment to create the topic

## Clean Up

Stop Kafka when you're done:
```bash
docker-compose down
``` 