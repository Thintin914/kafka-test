# Simple Kafka TypeScript Demo

A beginner-friendly Kafka system built with TypeScript that demonstrates how to send and receive messages, including cross-device communication between different machines.

## What This Demo Does

- **Producer**: Sends messages to a Kafka topic
- **Consumer**: Reads messages from the same topic
- **Real-time Communication**: Shows how different parts of a system can communicate
- **Cross-Device Messaging**: Send messages from one machine to another

## Prerequisites

Before running this demo, you need to have Kafka running locally. Here are the easiest ways:

### Option 1: Docker (Recommended)

The project includes a `docker-compose.yml` file with a working Kafka setup:

```bash
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

### Local Demo (Single Machine)

**Run the complete demo:**
```bash
npm run dev
```

**Run producer and consumer separately:**
```bash
# Terminal 1 - Consumer
npm run consumer

# Terminal 2 - Producer  
npm run producer
```

### Cross-Device Communication

**On Mac Mini (Server):**
```bash
# Start Kafka
docker-compose up -d

# Start consumer
npm run macmini
```

**On MacBook (Client):**
```bash
# Start producer
npm run macbook
```

## Configuration

### Local Configuration
- `src/config.ts` - Default local configuration
- `src/producer.ts` - Local producer
- `src/consumer.ts` - Local consumer

### Cross-Device Configuration
- `src/config-macbook.ts` - MacBook producer configuration
- `src/config-macmini.ts` - Mac Mini consumer configuration
- `src/producer-macbook.ts` - Interactive producer for MacBook
- `src/consumer-macmini.ts` - Consumer for Mac Mini

## What You'll See

### Local Demo Output

**Producer:**
```
🚀 Starting Kafka Producer...
📤 Sending message: "Hello from TypeScript!"
✅ Message sent successfully!
```

**Consumer:**
```
🔌 Consumer connected to Kafka
📥 Subscribed to topic: test-topic
👂 Listening for messages...

📨 Received message:
   Topic: test-topic
   Partition: 0
   Offset: 0
   Timestamp: 2024-01-15T10:30:00.000Z
   Message: "Hello from TypeScript!"
```

### Cross-Device Demo Output

**MacBook Producer:**
```
🚀 MacBook Producer Started
📱 Sending messages to Mac Mini...
💬 Enter message: Hello Mac Mini!
📤 [MacBook] Sending message: "Hello Mac Mini!"
✅ Message sent successfully to Mac Mini!
```

**Mac Mini Consumer:**
```
🔌 [Mac Mini] Consumer connected to Kafka
📥 Subscribed to topic: cross-device-topic
👂 Waiting for messages from MacBook...

📨 [Mac Mini] Received message from MacBook:
   📱 From: MacBook
   📍 Topic: cross-device-topic
   🕐 Timestamp: 2024-01-15T10:30:00.000Z
   💬 Message: "Hello Mac Mini!"
```

## Project Structure

```
src/
├── config.ts              # Local Kafka configuration
├── config-macbook.ts      # MacBook producer configuration
├── config-macmini.ts      # Mac Mini consumer configuration
├── producer.ts            # Local producer
├── producer-macbook.ts    # Interactive producer for MacBook
├── consumer.ts            # Local consumer
├── consumer-macmini.ts    # Consumer for Mac Mini
└── index.ts               # Main demo file
```

## Key Concepts Demonstrated

- **Topics**: Messages are organized into topics (like categories)
- **Producers**: Applications that send messages
- **Consumers**: Applications that read messages
- **Brokers**: Kafka servers that store and manage messages
- **Real-time Communication**: Messages are delivered instantly
- **Distributed Messaging**: Communication between different machines
- **Network Configuration**: Cross-device connectivity

## Cross-Device Setup

### Prerequisites
- Both machines need Node.js and npm
- Both machines need Docker
- Both machines must be on the same network

### Setup Steps

1. **Find Mac Mini's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Update MacBook configuration:**
   Edit `src/config-macbook.ts` and replace the IP with your Mac Mini's actual IP.

3. **Start Kafka on Mac Mini:**
   ```bash
   docker-compose up -d
   npm run macmini
   ```

4. **Send messages from MacBook:**
   ```bash
   npm run macbook
   ```

## Next Steps

- Try sending different types of messages
- Run multiple consumers to see load balancing
- Experiment with different topics
- Add message filtering or processing logic
- Set up multiple producers and consumers
- Implement message persistence and replay

## Troubleshooting

**"ECONNREFUSED" Error:**
- Make sure Kafka is running on the correct machine
- Check if Docker containers are up: `docker-compose ps`
- Verify network connectivity between machines

**"Replication-factor is invalid" Error:**
- Restart Kafka with `docker-compose down && docker-compose up -d`
- This ensures consistent replication factor settings

**"Topic not found" Error:**
- Kafka will automatically create topics when messages are sent
- The first message might take a moment to create the topic

**Cross-device connection issues:**
- Check if both machines are on the same network
- Verify the IP address in `src/config-macbook.ts`
- Test connectivity with `ping [mac-mini-ip]`

## Clean Up

Stop Kafka when you're done:
```bash
docker-compose down
```

## Available Scripts

- `npm run dev` - Run complete local demo
- `npm run producer` - Run local producer
- `npm run consumer` - Run local consumer
- `npm run macbook` - Run interactive producer for MacBook
- `npm run macmini` - Run consumer for Mac Mini 