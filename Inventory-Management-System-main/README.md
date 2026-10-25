# Inventory Management System

A microservice-based inventory management system built with React, TypeScript, and .NET 8, deployable via Kubernetes.

---

## Architecture Overview

```
Browser
  │
  └─► Frontend (nginx, NodePort 30080)
        │
        ├─► /api/*       ──► InventoryAPI  (ClusterIP :80 → pod :8080)
        │                        │
        │                        └─► PostgreSQL (ClusterIP :5432, PersistentVolume)
        │
        └─► /api/stats   ──► StatsService  (ClusterIP :80 → pod :8080)
                                 │
                                 └─► InventoryAPI (cluster-internal HTTP call)
```

### Microservices

| Service | Language | Role | Port (NodePort) |
|---|---|---|---|
| **InventoryAPI** | C# .NET 8 | Core REST API — products, transactions, suppliers | 30081 |
| **StatsService** | C# .NET 8 | Aggregation service — calls InventoryAPI and returns summary stats | 30082 |
| **Frontend** | React + nginx | SPA served by nginx, which also reverse-proxies API calls | 30080 |
| **PostgreSQL** | postgres:16 | Persistent relational database (not externally exposed) | — |

All three application microservices are horizontally scalable independently (each has its own Kubernetes `Deployment`). The database is intentionally a single replica.

---

## Quick Start

### Option A — Kubernetes (assignment submission)

**Prerequisites:** Docker, kubectl, a running cluster (minikube / Docker Desktop), and a Docker Hub account.

```bash
# 1. Log in to Docker Hub
docker login

# 2. Build, push, and deploy everything
./deploy.sh <your-dockerhub-username>

# 3. Open the app (minikube example)
open http://$(minikube ip):30080
```

The script builds all three images, pushes them to Docker Hub, patches the Kubernetes manifests with your username, and applies them.

### Option B — Docker Compose (local development)

```bash
docker-compose up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend |
| http://localhost:8080/swagger | InventoryAPI Swagger |
| http://localhost:8081/swagger | StatsService Swagger |

---

## API Reference

### InventoryAPI (`/api/products`, `/api/transactions`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/low-stock` | Products below minimum stock |
| GET | `/api/products/reorder-suggestions` | Smart reorder list |
| GET | `/api/products/export` | CSV export |
| POST | `/api/products` | Create product |
| POST | `/api/products/import` | Bulk CSV import |
| PUT | `/api/products/{id}` | Update product |
| PATCH | `/api/products/{id}/stock` | Adjust stock quantity |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/transactions` | All stock transactions |
| GET | `/api/transactions/product/{id}` | Transactions for one product |
| POST | `/api/transactions` | Record a transaction |

### StatsService (`/api/stats`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/stats` | Aggregated inventory statistics |
| GET | `/api/stats/health` | Health check |

**Sample response from `/api/stats`:**
```json
{
  "totalProducts": 42,
  "totalStockUnits": 3150,
  "totalStockValue": 189420.50,
  "lowStockCount": 5,
  "categories": [
    { "category": "Storage", "count": 12, "totalStock": 900 },
    { "category": "Seating", "count": 8,  "totalStock": 600 }
  ]
}
```

---

## Project Structure

```
├── backend/InventoryAPI/      # Core REST API (.NET 8 + PostgreSQL)
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   ├── Repositories/
│   └── Dockerfile
├── stats-service/             # Aggregation microservice (.NET 8)
│   ├── Program.cs
│   └── Dockerfile
├── frontend/inventory-client/ # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   └── services/api.ts    # calls both InventoryAPI and StatsService
│   ├── nginx.conf             # reverse-proxies /api/ and /api/stats
│   └── Dockerfile
├── k8s/
│   ├── postgres.yaml          # PVC + Deployment + ClusterIP Service
│   ├── inventory-api.yaml     # Deployment (2 replicas) + NodePort Service
│   ├── stats-service.yaml     # Deployment (2 replicas) + NodePort Service
│   └── frontend.yaml          # Deployment (2 replicas) + NodePort Service
├── docker-compose.yml         # Local dev
└── deploy.sh                  # One-shot build + push + deploy script
```

---

## Kubernetes Details

- **Persistent storage:** `postgres-pvc` (1 Gi `PersistentVolumeClaim`) — survives pod restarts and redeployments.
- **Secrets:** DB credentials stored in a Kubernetes `Secret` (`postgres-secret`), referenced by env vars in the postgres and inventory-api pods.
- **Health probes:** All application deployments define `readinessProbe` and `livenessProbe` so Kubernetes only routes traffic to healthy pods.
- **Scaling:** To scale a service independently, e.g. `kubectl scale deployment inventory-api --replicas=4`.
- **External access:** NodePort services on 30080 (frontend), 30081 (API), 30082 (stats). In production this would be an `Ingress` controller.

---

## Features

- Product CRUD with supplier and warehouse location tracking
- Real-time low-stock alerts
- Stock transaction history (Purchase / Sale / Adjustment / Return)
- Smart reorder suggestions (grouped by supplier, prioritised by urgency)
- Bulk CSV import / export
- Barcode generation (CODE128 from SKU)
- Interactive dashboard with charts — stat cards sourced from **StatsService**, charts from **InventoryAPI**
