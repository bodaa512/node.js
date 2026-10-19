# HomePilot API Server (Node.js & TypeScript)

![Build & Test](https://img.shields.io/badge/tests-20%20passed-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-ready, scalable RESTful API and WebSocket backend server built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. Designed for digital home operations, warranty management, expense tracking, maintenance automation, and AI recommendations.

---

## 🚀 Key Highlights

* **Clean Architecture**: Structured with controllers, services, repositories/models, and middleware layers.
* **Deterministic Economic Engines**: Built-in 50% rule algorithms and lifespan degradation formulas for Repair vs. Replace decisions (`RepairReplaceService`).
* **Home Health Score**: Dynamic 7-factor weighted scoring engine evaluating property maintenance compliance, warranty coverage, and risks (`HomeHealthService`).
* **Automated Cron Jobs**: Background task scheduler for overdue maintenance inspections and notifications.
* **Security & Auth**: JWT authentication (access & refresh tokens), Bcrypt hashing, role-based authorization (6 roles), Helmet, and rate limiting.
* **Robust Validation**: Zod request schema validation middleware.
* **Real-time WebSockets**: Socket.IO integration for live updates and notifications.
* **Unit & Integration Tested**: Fully covered test suites powered by Jest and ts-jest.

---

## 🛠️ Tech Stack

* **Runtime**: [Node.js](https://nodejs.org/) (>= 20)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Web Framework**: [Express.js](https://expressjs.com/)
* **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Testing**: [Jest](https://jestjs.io/) & [ts-jest](https://kulshekhar.github.io/ts-jest/)
* **Real-time Engine**: [Socket.IO](https://socket.io/)
* **Validation**: [Zod](https://zod.dev/)
* **Logging & Monitoring**: [Winston](https://github.com/winstonjs/winston) & [Morgan](https://github.com/expressjs/morgan)
* **Integrations**: Stripe, Nodemailer, Cloudinary

---

## 📂 Project Structure

```text
src/
├── ai/             # AI assistant and context synthesis
├── config/         # Environment variables & database connections
├── constants/      # Application constants and default configs
├── controllers/    # Express route request handlers
├── errors/         # Custom HTTP error classes & handlers
├── jobs/           # Node-cron background schedulers
├── middleware/     # Auth, validation, rate limiting & error handling
├── models/         # 30+ Mongoose models with compound indexes
├── routes/         # Express API routers
├── seeds/          # Initial seed data for rapid prototyping
├── services/       # Core business logic & algorithms
├── sockets/        # Socket.IO handlers and event dispatchers
├── types/          # TypeScript interfaces, enums & type declarations
├── utils/          # Formatting, token generation, hashing & helpers
├── validators/     # Zod schemas for input validation
├── app.ts          # Express application setup
└── server.ts       # Server entry point & database initialization
```

---

## 🧪 Testing

The server includes automated test suites with **Jest**:

```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### Test Coverage Highlights:
* `tests/unit/services/repairReplace.test.ts`: Tests economic decision algorithm & 50% replacement rule.
* `tests/unit/utils/token.test.ts`: Tests JWT access/refresh token generation and verification.
* `tests/unit/utils/hash.test.ts`: Tests bcrypt password hashing and timing-safe comparison.
* `tests/unit/utils/date.test.ts`: Tests date calculations, expiration checks, and month increments.
* `tests/unit/utils/apiResponse.test.ts`: Tests standardized JSON API envelopes and pagination metadata.
* `tests/unit/middleware/validate.test.ts`: Tests request payload validation via Zod schemas.

---

## 🚦 Getting Started

### 1. Prerequisites
* Node.js >= 20.x
* MongoDB instance (local or MongoDB Atlas)

### 2. Installation
```bash
git clone https://github.com/bodaa512/node.js.git
cd node.js
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Seeding & Development
```bash
# Seed initial demo data, categories, and plans
npm run seed

# Run the development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
