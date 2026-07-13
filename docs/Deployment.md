# ProspectIQ AI - Enterprise Deployment Guidelines

Guidelines for hosting and scaling ProspectIQ AI in production.

## Docker Strategy
We use multi-stage builds to optimize image layers:
- `docker-compose.yml` mounts local Postgres, fastapi, node API and Nginx reverse proxy.
- Port allocations:
  - Frontend: `80` (Proxied via Nginx)
  - Core API: `5000` (Private virtual network)
  - AI Service: `8000` (Private virtual network)
  - Postgres: `5432`
