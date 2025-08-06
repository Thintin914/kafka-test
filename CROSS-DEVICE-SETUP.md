# Cross-Device Kafka Communication Setup

This guide shows you how to send messages from your MacBook to your Mac Mini using Kafka.

## 🏗️ Setup Overview

- **Mac Mini**: Runs Kafka server + Consumer (receives messages)
- **MacBook**: Runs Producer (sends messages to Mac Mini)

## 📋 Prerequisites

1. **Both machines need Node.js and npm installed**
2. **Both machines need Docker installed**
3. **Both machines must be on the same network**

## 🔧 Step-by-Step Setup

### Step 1: Find Your Mac Mini's IP Address

On your **Mac Mini**, open Terminal and run:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for an IP like `192.168.1.XXX` or `10.0.0.XXX`. Note this IP address.

### Step 2: Configure the MacBook

On your **MacBook**, edit the configuration file:

1. Open `src/config-macbook.ts`
2. Replace `192.168.1.XXX` with your Mac Mini's actual IP address:

```typescript
brokers: ['192.168.1.50:9092'], // Use your Mac Mini's IP here
```

### Step 3: Start Kafka on Mac Mini

On your **Mac Mini**:

1. **Clone/copy this project to your Mac Mini**
2. **Start Kafka:**
   ```bash
   docker-compose up -d
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the consumer:**
   ```bash
   npm run macmini
   ```

You should see:
```
🔌 [Mac Mini] Consumer connected to Kafka
📥 Subscribed to topic: cross-device-topic
👂 Waiting for messages from MacBook... (Press Ctrl+C to stop)
```

### Step 4: Send Messages from MacBook

On your **MacBook**:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the producer:**
   ```bash
   npm run macbook
   ```

You should see:
```
🚀 MacBook Producer Started
📱 Sending messages to Mac Mini...
Type your messages (or "quit" to exit):

💬 Enter message:
```

## 🎯 Testing the Communication

1. **On MacBook**, type a message and press Enter
2. **On Mac Mini**, you should see the message appear immediately

**MacBook Output:**
```
💬 Enter message: Hello from MacBook!
📤 [MacBook] Sending message: "Hello from MacBook!"
✅ Message sent successfully to Mac Mini!
```

**Mac Mini Output:**
```
📨 [Mac Mini] Received message from MacBook:
   📱 From: MacBook
   📍 Topic: cross-device-topic
   🕐 Timestamp: 2024-01-15T10:30:00.000Z
   💬 Message: "Hello from MacBook!"
```

## 🔍 Troubleshooting

### "ECONNREFUSED" Error
- Make sure Kafka is running on Mac Mini
- Check if the IP address is correct
- Ensure both machines are on the same network

### "Connection timeout" Error
- Check your Mac Mini's firewall settings
- Make sure port 9092 is accessible
- Try pinging the Mac Mini from MacBook: `ping 192.168.1.XXX`

### "Topic not found" Error
- The topic will be created automatically when the first message is sent
- Wait a moment and try again

## 🛠️ Advanced Configuration

### Custom Topics
Edit the `topic` field in both config files:
```typescript
topic: 'my-custom-topic',
```

### Multiple Consumers
You can run multiple consumers on different machines by using different `groupId` values.

### Security
For production use, consider:
- Using SSL/TLS encryption
- Adding authentication
- Using SASL for security

## 🧹 Cleanup

When you're done:
1. **On Mac Mini:** `docker-compose down`
2. **On MacBook:** Press Ctrl+C to stop the producer

## 🎉 What You've Accomplished

You've successfully set up:
- **Distributed messaging** between two machines
- **Real-time communication** using Kafka
- **Decoupled architecture** where producers and consumers don't need to know about each other
- **Scalable messaging** that can handle multiple producers and consumers

This is the foundation for building distributed systems and microservices! 