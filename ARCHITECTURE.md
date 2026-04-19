# Smart Booking Campus - Architecture & Documentation

## 1. Polymorphic Space Modeling (Module A)
The system unifies Academic and Sports resources using **Class Table Inheritance (CTI)**.
- **Academic Spaces**: Modeled as atomic resources. The system enforces an **invisible 5-minute buffer** between reservations. This is achieved at the service layer by extending the overlap check window without modifying the user-visible end time.
- **Sports Facilities**: Modeled as composable resources. Reservations for a "Full Court" automatically block its constituent "Half Courts" and vice versa.

## 2. High-Concurrency Event System (Module B)
To handle "flash sale" scenarios for campus events:
- **Redis Pre-warming**: Ticket stocks are pre-loaded into Redis.
- **Atomic Operations**: `DECR` operations in Redis ensure no overselling.
- **Traffic Smoothing**: Valid purchase requests are pushed to a **RabbitMQ** queue for asynchronous processing into the main database.
- **Distributed Locking**: **Redlock** is used to ensure consistency across multiple instances.

## 3. Order Lifecycle & Rule Engine (Module C)
- **FSM**: Orders transition through `PENDING`, `CONFIRMED`, `CANCELED`, and `NO_SHOW`.
- **Race Condition Prevention**: Database **optimistic locking** (versioning) prevents "ghost payments" during timeout transitions.
- **Dynamic Rules**: A **Chain of Responsibility** pattern is used for reservation rules, allowing easy extension for new policies (e.g., credit score penalties, role-based limits).

## 4. Frontend & Accessibility
- **Next.js (App Router)**: Optimized for performance and SEO.
- **Mobile First**: Fully responsive design.
- **WCAG 2.2**: Follows AA standards for accessibility.
- **Core Web Vitals**: Optimized for LCP < 2.5s and CLS < 0.1.

## 5. Deployment
The project is fully containerized using **Docker** and **Docker Compose**.
```bash
docker-compose up --build
```
CI/CD is configured via **GitHub Actions** for automated linting, testing, and build verification.
