FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
CMD ["node", "boot.mjs"]
