#!/bin/bash

echo "🔄 Resetting Kafka setup..."

# Stop and remove containers
echo "📦 Stopping containers..."
docker-compose down

# Remove volumes to clear all data
echo "🗑️  Removing volumes..."
docker volume prune -f

# Start fresh
echo "🚀 Starting fresh Kafka setup..."
docker-compose up -d

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
sleep 10

echo "✅ Kafka reset complete!"
echo "📝 You can now run: npm run macmini" 