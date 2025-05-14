FROM node:20.11.1-alpine AS base
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

FROM base AS installer

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV SHELL=/bin/sh
ENV ENV=/etc/profile
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/packages/prisma/schema ./packages/prisma/schema
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

RUN pnpm db:generate
RUN pnpm turbo run build --filter=cron

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

COPY --from=installer --chown=appuser:nodejs /app .

CMD ["node", "apps/cron/dist/index.cjs"]