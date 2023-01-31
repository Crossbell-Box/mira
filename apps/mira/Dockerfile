FROM node:19 AS builder
# Set working directory
WORKDIR /app
RUN npm i pnpm@latest turbo -g
COPY . .
RUN turbo prune --scope=mira --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:19 AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN npm i pnpm@latest -g
RUN pnpm i

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm run build --filter=mira...

# Run the app
FROM node:19 AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/mira/next.config.js .
COPY --from=installer /app/apps/mira/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/mira/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/mira/.next/static ./apps/mira/.next/static

CMD node apps/mira/server.js