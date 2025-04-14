# Run Redis using docker
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

# Environment Variables
## Redis
- REDIS_HOST=localhost
- REDIS_PORT=6379

## Mail
- SMTP_HOST=
- SMTP_PORT=
- SMTP_USER=
- SMTP_PASSWORD=