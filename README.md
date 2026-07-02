# Tic-Tac-Toe — Submission

A two-player Tic-Tac-Toe game in the browser, served via Express.

---

## 1. GitHub Repository

> https://github.com/KambleSahil3/immverse

---

## 2. Project Structure

```
immverse/
├── app/
│   ├── app.js               # Express server + game UI
│   ├── test.js              # Basic HTTP smoke test
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile           # 2-stage build, non-root user
├── k8s/
│   ├── deployment.yaml      # Kubernetes Deployment (2 replicas)
│   └── service.yaml         # Kubernetes NodePort Service
├── docker-compose.yml
├── Jenkinsfile              # CI/CD pipeline
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Dockerfile

Located at `app/Dockerfile`. 2-stage build using `node:24-alpine`, runs as non-root user (`appuser`).

- Stage 1 (`build`) — installs production dependencies via `npm ci --omit=dev`
- Stage 2 (`runtime`) — copies only `node_modules` and `app.js`, switches to non-root user

---

## 4. Jenkins Pipeline

Located at `Jenkinsfile`. 5 stages:

| Stage | Description |
|---|---|
| Checkout | Pulls code from GitHub via `checkout scm` |
| Build & Test | Installs deps and runs `npm test` |
| Build Docker Image | Builds image tagged with `BUILD_NUMBER` |
| Push to ECR | Authenticates with AWS and pushes image to ECR |
| Deploy | Runs `kubectl set image` + `kubectl rollout status` using kubeconfig |

### Jenkins Credentials Required

| Credential ID           | Type          | Description                   |
|-------------------------|---------------|-------------------------------|
| `AWS_ACCESS_KEY_ID`     | Secret text   | AWS access key                |
| `AWS_SECRET_ACCESS_KEY` | Secret text   | AWS secret key                |
| `AWS_ACCOUNT_ID`        | Secret text   | AWS account ID                |
| `KUBECONFIG`            | Secret file   | Kubernetes cluster kubeconfig |

---

## 5. Running Application

### Local

```bash
cp .env.example .env
cd app && npm install && npm start
```

Open http://localhost:3000

### Docker Compose

```bash
docker compose up -d --build
```

Open http://localhost:3000

### Docker directly

```bash
cd app
docker build -t tictactoe .
docker run -p 3000:3000 --env-file ../.env tictactoe
```

---

## 6. Deployment Configuration

### Kubernetes Deployment (`k8s/deployment.yaml`)

- 2 replicas
- Image: `<REGISTRY_URL>/tictactoe:latest`
- Resource limits: 250m CPU / 256Mi memory
- Liveness + readiness probes on `GET /`

### Kubernetes Service (`k8s/service.yaml`)

- Type: `NodePort`
- External port: `30000` → container port `3000`

### Apply

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Access the app at: `http://<NODE_IP>:30000`

---

## Environment Variables

Copy `.env.example` to `.env` before running:

```bash
cp .env.example .env
```

| Variable | Default | Description                |
|----------|---------|----------------------------|
| `PORT`   | `3000`  | Port the server listens on |

---

## Tech Stack

- Node.js + Express — serves the game as a single HTML page
- Vanilla JS — game logic and UI (no frontend framework)
- Docker — 2-stage build (`node:24-alpine`), runs as non-root user
- Jenkins — CI/CD pipeline (build, test, push, deploy)
- Kubernetes — Deployment + NodePort Service
- AWS ECR — container image registry
