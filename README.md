## TaskXpert - Docker Setup

### Requirements
- Docker Desktop 4.x+
- Optional: MongoDB Atlas if you don't want the local Mongo instance

### Build & Run
```sh
docker compose up --build
```
Services:
- `server` -> http://localhost:8800
- `client` -> http://localhost:4173
- `mongo` -> MongoDB running locally (port 27017)

The `server/env.example` file is loaded automatically. Duplicate it as `server/.env` if you need private overrides. Make sure to set a strong `JWT_SECRET` before deploying.

### Customizing Environment Variables
- API: edit `server/env.example` or supply overrides via `docker compose --env-file`.
- Frontend: set `VITE_API_URL` under `client` service to point to the deployed backend (defaults to the local API).

### Useful Commands
```sh
# Rebuild after code changes
docker compose up --build server client

# Stop everything
docker compose down

# Remove containers, network, and volumes
docker compose down -v
```

Once everything is running, open the frontend URL to interact with the app. The client talks to the API via the internal Docker network, and MongoDB persists data inside the `mongo-data` named volume.
