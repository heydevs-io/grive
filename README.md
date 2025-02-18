<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A NestJS template with built-in authentication (OAuth, JWT), database integration (TypeORM), and best practices.</p>

## Features

- 🔐 Authentication & Authorization
- 📊 Database integration with TypeORM
- 🔍 Environment configuration & validation
- 🛡️ Security best practices
- 🧪 Testing setup (Unit & E2E)s
- 📝 API documentation with Swagger
- 🚀 Production-ready configuration

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

### Development

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Project Structure

```
src/
├── common/          # Shared resources (filters, guards, etc.)
├── config/          # Configuration files
├── modules/         # Feature modules
├── database/        # Database entities and migrations
└── main.ts         # Application entry point
```

## Documentation

API documentation is available at `/api/docs` when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [TypeORM](https://typeorm.io/) - Database ORM
- [Jest](https://jestjs.io/) - Testing framework
