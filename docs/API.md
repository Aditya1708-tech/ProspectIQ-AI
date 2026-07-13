# ProspectIQ AI - Core REST API Specification

All services communicate through JSON-REST API endpoints:

## 1. Authentication Endpoints
- `POST /api/v1/auth/login`: Authenticate relationship manager.
- `POST /api/v1/auth/logout`: End active JWT session.
- `POST /api/v1/auth/refresh`: Issue new access token.
- `GET /api/v1/auth/me`: Fetch active user profile context.

## 2. Customer Intelligence Foundation
- `GET /api/v1/customers`: List segmented customer base.
- `GET /api/v1/customers/:id/profile`: Fetch specific customer profile.
- `GET /api/v1/customers/:id/analyze`: Fetch complete cognitive engine analysis.
- `POST /api/v1/customers/import`: Upload branch spreadsheet records.
