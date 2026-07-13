#!/bin/bash
echo "Launching local servers..."
# Start python service
cd ai-service
PYTHONPATH=app ./.venv/bin/python -m uvicorn main:app --port 8000 &
# Start core API
cd ../backend
npm run dev &
# Start Vite UI
cd ../frontend
npm run dev &
echo "Local workspace processes running in background."
