FROM node:22-bookworm-slim AS builder

WORKDIR /app/client

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client ./
RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates dumb-init \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/client/public ./public

USER nextjs
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
