# Tic-Tac-Toe

A two-player Tic-Tac-Toe game in the browser, served via Express.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) (optional)

## Project Structure

```
immverse/
├── app/
│   ├── app.js          # Express server + game UI
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile      # 2-stage build, non-root user
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` before running:

```bash
cp .env.example .env
```

| Variable | Default | Description               |
|----------|---------|---------------------------|
| `PORT`   | `3000`  | Port the server listens on |

## Run locally

```bash
cd app
npm install
npm start
```

Open http://localhost:3000

## Run with Docker Compose (recommended)

```bash
docker compose up -d --build
```

Open http://localhost:3000

To stop:

```bash
docker compose down
```

## Run with Docker directly

```bash
cd app
docker build -t tictactoe .
docker run -p 3000:3000 --env-file ../.env tictactoe
```

Open http://localhost:3000

## Tech Stack

- Node.js + Express — serves the game as a single HTML page
- Vanilla JS — game logic and UI (no frontend framework)
- Docker — 2-stage build (`node:24-alpine`), runs as non-root user
