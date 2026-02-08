# Todo App Helm Chart

This Helm chart deploys the Todo Full-Stack Web Application with separate frontend (Next.js), backend (FastAPI), and database (PostgreSQL) components.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Minikube or kind for local development
- Docker for building local images

## Quick Start

To install the chart with the release name `todo-app`:

```bash
# Add the necessary CRDs if using ingress/gateway API
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml

# Install the chart
helm install todo-app .
```

## Configuration

The following table lists the configurable parameters of the todo-app chart and their default values.

### Frontend Parameters

| Parameter                          | Description                                      | Default                      |
|------------------------------------|--------------------------------------------------|------------------------------|
| `frontend.replicaCount`           | Number of frontend replicas                      | `1`                          |
| `frontend.image.repository`       | Frontend image repository                        | `todo-frontend`              |
| `frontend.image.pullPolicy`       | Frontend image pull policy                       | `IfNotPresent`               |
| `frontend.image.tag`              | Frontend image tag                               | `latest`                     |
| `frontend.service.type`           | Frontend service type                            | `ClusterIP`                  |
| `frontend.service.port`           | Frontend service port                            | `3000`                       |
| `frontend.env.NEXT_PUBLIC_BETTER_AUTH_URL` | Frontend auth URL                        | `"http://localhost:3000"`    |
| `frontend.env.NEXT_PUBLIC_BACKEND_URL` | Frontend backend URL                         | `"http://todo-backend:8000"` |

### Backend Parameters

| Parameter                          | Description                                      | Default                      |
|------------------------------------|--------------------------------------------------|------------------------------|
| `backend.replicaCount`            | Number of backend replicas                       | `1`                          |
| `backend.image.repository`        | Backend image repository                         | `todo-backend`               |
| `backend.image.pullPolicy`        | Backend image pull policy                        | `IfNotPresent`               |
| `backend.image.tag`               | Backend image tag                                | `latest`                     |
| `backend.service.type`            | Backend service type                             | `ClusterIP`                  |
| `backend.service.port`            | Backend service port                             | `8000`                       |
| `backend.env.DATABASE_URL`        | Database connection URL                          | `"postgresql://..."`         |
| `backend.env.BETTER_AUTH_SECRET`  | JWT secret for authentication                    | `"your-super-secret..."`     |

### Database Parameters

| Parameter                          | Description                                      | Default                      |
|------------------------------------|--------------------------------------------------|------------------------------|
| `database.replicaCount`           | Number of database replicas                      | `1`                          |
| `database.image.repository`       | Database image repository                        | `postgres`                   |
| `database.image.pullPolicy`       | Database image pull policy                       | `IfNotPresent`               |
| `database.image.tag`              | Database image tag                               | `15`                         |
| `database.service.type`           | Database service type                            | `ClusterIP`                  |
| `database.service.port`           | Database service port                            | `5432`                       |
| `database.env.POSTGRES_DB`        | PostgreSQL database name                         | `todo_app`                   |
| `database.env.POSTGRES_USER`      | PostgreSQL username                              | `postgres`                   |
| `database.env.POSTGRES_PASSWORD`  | PostgreSQL password                              | `postgres`                   |
| `database.persistence.enabled`    | Enable database persistence                      | `true`                       |
| `database.persistence.size`       | Database persistent volume size                  | `1Gi`                        |

## Local Development

For local development with Minikube:

1. Build your frontend and backend Docker images locally:
   ```bash
   # From the project root
   cd frontend && docker build -t todo-frontend . && cd ..
   cd backend && docker build -t todo-backend . && cd ..
   ```

2. Load the images into Minikube:
   ```bash
   minikube image load todo-frontend:latest
   minikube image load todo-backend:latest
   ```

3. Install the chart:
   ```bash
   helm install todo-app .
   ```

4. Access the application:
   ```bash
   # Forward frontend port
   kubectl port-forward svc/todo-app-frontend 3000:3000

   # Forward backend port (optional)
   kubectl port-forward svc/todo-app-backend 8000:8000
   ```

## Uninstalling the Chart

To uninstall/delete the `todo-app` release:

```bash
helm delete todo-app
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Values Override Example

To customize the installation, create a `values.yaml` file with your overrides:

```yaml
frontend:
  image:
    tag: "local-dev"
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "200m"

backend:
  image:
    tag: "local-dev"
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "300m"

database:
  persistence:
    enabled: true
    size: 2Gi
```

Then install with:
```bash
helm install todo-app -f values.yaml .
```