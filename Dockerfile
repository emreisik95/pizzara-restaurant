FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libstdc++
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data
ENV UPLOAD_DIR=/app/public/uploads

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /data /app/public/uploads && \
    chown -R app:app /app /data

COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
# better-sqlite3 native binding lives in node_modules — copy full deps for safety
COPY --from=build --chown=app:app /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

USER app
EXPOSE 3000

VOLUME ["/data", "/app/public/uploads"]

CMD ["node", "server.js"]
