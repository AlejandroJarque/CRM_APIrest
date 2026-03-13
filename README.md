# CRM REST API

## Description

This repository contains a RESTful CRM (Customer Relationship Management) API built with Laravel. The main purpose of the project is to provide a backend service that allows companies to manage their clients and the activities associated with them, while supporting secure user authentication and authorization.

The API is designed to be stateless, JSON-based, and easily consumable by web or mobile frontends. Each authenticated user can manage their own data, ensuring separation and security between company employees.

## Project Overview

The project is implemented as a Laravel application following REST and clean architecture principles. Instead of traditional server-rendered views, all interactions are performed through HTTP endpoints that return JSON responses.

Key goals of the project:

* Centralize client information for a company
* Track activities related to each client
* Provide secure authentication for users
* Expose a clear and versioned REST API
* Maintain a clean, scalable, and testable codebase

## Architecture

The application is structured around a layered architecture inspired by Domain-Driven Design (DDD):

### Controllers (HTTP Layer)

* Handle incoming HTTP requests
* Validate request intent and format
* Delegate business logic to the Application layer
* Return standardized JSON responses

### Application Layer

* Contains use cases and services
* Coordinates domain logic
* Acts as an intermediary between Controllers and Domain logic

### Domain Layer

* Represents the core business logic
* Contains domain events and entities
* Is independent of framework-specific details

### Infrastructure

* Database access via Eloquent ORM
* Authentication and authorization mechanisms
* Configuration and environment setup

## Authentication

Authentication is handled using token-based security suitable for REST APIs.

* OAuth2-based authentication using Laravel Passport
* Users authenticate via a login endpoint
* A valid access token is required to access protected endpoints
* Tokens are sent using the `Authorization: Bearer <token>` header

This approach ensures the API remains stateless and secure.

## Database Design

The database is intentionally simple and normalized. It consists of the following main entities:

* **Users**: Application users who authenticate and perform actions
* **Clients**: Customers managed by users
* **Contacts**: People associated with a client
* **Activities**: Actions or events associated with a client

Relationships:

* A User can have many Clients
* A Client belongs to a User
* A Client can have many Contacts
* A Contact belongs to a Client
* A Client can have many Activities
* An Activity belongs to both a Client and a User

Migrations and seeders are provided to simplify setup and local development.

## API Versioning

All current endpoints are grouped under the base path:

* Base path: `/api`

Any change that breaks backward compatibility requires a new version.

## API Documentation

Swagger UI is available at:
```
http://localhost:8080/swagger/index.html
```

The OpenAPI specification is located at `public/openapi.yaml`.

## Mailing and Events

The project includes support for domain events and notifications:

* Domain events are triggered on relevant actions (e.g. client creation, activity registration)
* The structure allows easy extension for email notifications or asynchronous processing
* The system is ready to be integrated with external mailing services if required

## Technologies Used

* Laravel 12
* PHP 8.2
* Composer
* Laravel Passport
* MySQL 8.0
* Docker + Nginx
* RESTful API principles
* JSON
* OpenAPI 3.0 (Swagger UI)
* PHPUnit (TDD)
* Git & GitHub
* Visual Studio Code

## Installation

### With Docker (recommended)

1. Clone the repository
```bash
   git clone <repository-url>
   cd crm-apirest
```

2. Copy environment file
```bash
   cp .env.docker .env
```

3. Start containers
```bash
   docker compose up -d
```

4. Run migrations and seeders
```bash
   docker exec crm_app php artisan migrate --seed
```

5. Create Passport personal access client
```bash
   docker exec crm_app php artisan passport:client --personal --no-interaction
```

API available at: `http://localhost:8080`

### Without Docker

1. Clone the repository
```bash
   git clone <repository-url>
```

2. Install PHP dependencies
```bash
   composer install
```

3. Copy environment configuration
```bash
   cp .env.example .env
```

4. Generate application key
```bash
   php artisan key:generate
```

5. Configure database credentials in `.env`

6. Run migrations and seeders
```bash
   php artisan migrate --seed
```

7. Create Passport personal access client
```bash
   php artisan passport:client --personal --no-interaction
```

8. Start the development server
```bash
   php artisan serve
```

### Environment Configuration (.env)

This project relies on environment-specific configuration. After copying
.env.example to .env, the following variables must be properly configured.

Application
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crm
DB_USERNAME=your_username
DB_PASSWORD=your_password

Frontend (CORS)
FRONTEND_URL=http://localhost:5173

## Project Structure
```
app/
 ├── Application/
 │   ├── Activities/
 │   ├── Clients/
 │   ├── Contacts/
 │   └── Dashboard/
 ├── Domain/
 │   └── Events/
 ├── Http/
 │   └── Controllers/
 │       └── Api/
 │           ├── Auth/
 │           └── V1/
 └── Models/

database/
 ├── migrations/
 └── seeders/

public/
 ├── openapi.yaml
 └── swagger/
     └── index.html

routes/
 └── api.php
```

## Running Tests
```bash
docker exec crm_app php artisan test
```

## Development Notes

* Controllers are kept thin and focused on HTTP concerns
* Business logic is encapsulated in service classes
* Domain events decouple side effects from core logic
* The codebase follows Laravel and REST best practices
* The project is designed to be easily extendable


