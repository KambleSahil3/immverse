# Tic-Tac-Toe

A two-player Tic-Tac-Toe game in the browser, served via Express.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (optional)

## Run locally

```bash
cd app
npm install
npm start
```

Open http://localhost:3000

## Run with Docker

```bash
cd app
docker build -t tictactoe .
docker run -p 3000:3000 tictactoe
```

Open http://localhost:3000

## Environment Variables

| Variable | Default | Description          |
|----------|---------|----------------------|
| `PORT`   | `3000`  | Port the server listens on |

## Tech Stack

- Node.js + Express — serves the game as a single HTML page
- Vanilla JS — game logic and UI (no frontend framework)
