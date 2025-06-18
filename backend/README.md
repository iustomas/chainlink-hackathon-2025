# Backend API

A modern backend API built with Hono, TypeScript, and ESM modules.

## Features

- 🚀 Built with Hono for high performance
- 📝 TypeScript for type safety
- ✅ Zod for request validation
- 🔄 ESM modules
- 🛠️ Scripts support with tsx

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```bash
PORT=3000
```

3. Run the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build for production

## Project Structure

```
/backend
  ├── src/
  │   ├── api/             # Domain-specific routes and logic
  │   ├── lib/             # Shared utilities
  │   ├── config/          # Configuration
  │   ├── middlewares/     # Custom middlewares
  │   ├── app.ts           # Hono app setup
  │   └── server.ts        # Server entry point
  ├── scripts/             # Utility scripts
  └── ...
```

## API Endpoints

### Health

- `GET /health` - Basic health check

  ```json
  {
    "status": "ok",
    "timestamp": "2024-02-20T12:00:00.000Z",
    "uptime": 123.45
  }
  ```

- `GET /health/details` - Detailed system information
  ```json
  {
    "status": "ok",
    "timestamp": "2024-02-20T12:00:00.000Z",
    "uptime": 123.45,
    "system": {
      "memory": {
        "total": 1234567,
        "used": 123456,
        "external": 12345
      },
      "cpu": {
        "user": 123456,
        "system": 12345
      },
      "node": {
        "version": "v20.11.1",
        "platform": "darwin",
        "arch": "arm64"
      }
    }
  }
  ```

## Development

The project uses:

- Hono for routing and middleware
- Zod for request validation
- TypeScript for type safety
- ESM modules for modern JavaScript
- tsx for running TypeScript files directly
