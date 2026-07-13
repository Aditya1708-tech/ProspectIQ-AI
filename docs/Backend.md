# ProspectIQ Core API Backend Reorganization

## Structure Overview
Reorganized into layered architecture pattern to scale development across features:
- `src/routes/`: Route handling declarations mapped to path sub-modules.
- `src/controllers/`: Handle HTTP requests, responses, status code routing.
- `src/services/`: Contain core business transactions logic and integrations.
- `src/services/repositories/`: Execute direct database access operations.

## Reorganized Services
- `src/services/ai/ai-client.ts`: Integrates node backend to python AI microservice.
- `src/services/auth/auth-service.ts`: Handles JWT session operations and authentication encryption.
- `src/services/analytics/`: Consolidates customer data synthesis and imports.
