# Smart Booking Campus Web Platform

## Architecture Overview
- **Frontend**: Next.js (App Router), Tailwind CSS, Headless UI (for a11y)
- **Backend**: Node.js (NestJS or Express), TypeScript
- **Database**: PostgreSQL (Relational data), Redis (Caching & High Concurrency)
- **Messaging**: RabbitMQ or Redis Pub/Sub (for traffic smoothing)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Features
- **Module A**: Polymorphic Space Modeling (Academic vs Sports)
- **Module B**: High-Concurrency Event Flash Sale
- **Module C**: FSM-based Order Lifecycle & Dynamic Rule Engine

## Development
```bash
docker-compose up --build
```
