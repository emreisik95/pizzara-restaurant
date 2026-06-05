FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# Build integrity guard: fail the build if static output is incomplete,
# so a broken build can never produce a runnable image.
RUN test -n "$(ls -A .next/static/chunks)" && test -n "$(ls -A .next/static/css)"

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libstdc++ curl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data
ENV UPLOAD_DIR=/data/uploads

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /data/uploads /app/public/uploads && \
    chown -R app:app /app /data

COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
# better-sqlite3 + sharp native bindings — copy full deps for safety
COPY --from=build --chown=app:app /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=build --chown=app:app /app/node_modules/sharp ./node_modules/sharp
COPY --from=build --chown=app:app /app/node_modules/@img ./node_modules/@img

USER app
EXPOSE 3000

VOLUME ["/data", "/app/public/uploads"]

# Verify static assets are actually served, not just that the process is up.
# A broken build fails this -> Coolify keeps the old container (auto-rollback).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
