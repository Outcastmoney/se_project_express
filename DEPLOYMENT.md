# WTWR API Deployment

## Healthcheck
- GET `/healthz` returns `{ "status": "ok" }`

## Environment
- Copy `.env.example` to `.env` and update values.

## Start (Node)
```
npm run start:prod
```

## PM2 (recommended)
```
pm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 status
```

## Docker
```
docker build -t wtwr-api:latest .
docker run --name wtwr-api --env-file .env -p 3001:3001 wtwr-api:latest
```

## Logs
- PM2 logs: `pm2 logs wtwr-api`
- Health: `curl http://localhost:3001/healthz`
