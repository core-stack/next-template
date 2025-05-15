FROM node:20.11.1-alpine AS base

# Builder stage
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV SHELL=/bin/sh
ENV ENV=/etc/profile
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup
RUN pnpm add -g turbo@2.5.2

COPY . .
RUN pnpm turbo prune cron --docker

# Installer stage
FROM base AS installer
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV SHELL=/bin/sh
ENV ENV=/etc/profile
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/packages/prisma/schema ./packages/prisma/schema
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm db:generate
RUN pnpm turbo run build --filter=cron

FROM base AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

USER appuser

# Copy only the necessary files
COPY --from=installer --chown=appuser:nodejs /app/apps/cron/dist ./apps/cron/dist
COPY --from=installer --chown=appuser:nodejs /app/apps/cron/package.json ./apps/cron/package.json
COPY --from=installer --chown=appuser:nodejs /app/apps/cron/node_modules ./apps/cron/node_modules
COPY --from=installer --chown=appuser:nodejs /app/packages ./packages
COPY --from=installer --chown=appuser:nodejs /app/node_modules ./node_modules

CMD ["node", "apps/cron/dist/index.cjs"]