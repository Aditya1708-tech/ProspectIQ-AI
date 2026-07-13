from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
  title="ProspectIQ AI - Inference Service",
  description="Data Integrity and Behavioral Credit Intelligence Engines",
  version="1.0.0"
)

# Configure CORS
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Mount Routers
app.include_router(router)

@app.get("/health")
def health():
  return {"status": "healthy", "service": "ProspectIQ AI Service"}
