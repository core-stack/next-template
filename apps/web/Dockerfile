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

RUN pnpm turbo prune web --docker

FROM base AS installer

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV SHELL=/bin/sh
ENV ENV=/etc/profile
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup
RUN pnpm add dotenv-cli

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

RUN pnpm db:generate
RUN pnpm turbo run build --filter=web

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD ["node", "apps/web/server.js"]