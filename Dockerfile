FROM node:20-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
# DATABASE_URL is only needed so prisma/next can load; no connection is made during the build
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build" DIRECT_URL="postgresql://build:build@localhost:5432/build"
RUN npx prisma generate && npm run build

FROM base AS run
ENV NODE_ENV=production PORT=3000 UPLOAD_DIR=/data/uploads
COPY --from=build /app ./
RUN mkdir -p /data/uploads
VOLUME ["/data/uploads"]
EXPOSE 3000
# apply pending migrations, then start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
