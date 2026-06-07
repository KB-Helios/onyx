FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace manifests and lockfile first for better layer caching
COPY package.json bun.lock ./
COPY examples/widget/package.json ./examples/widget/
COPY widget/package.json ./widget/
COPY desktop/package.json ./desktop/

# Install all workspace dependencies
RUN bun install --frozen-lockfile

# Copy the full monorepo source
COPY . .

# Build the widget Next.js app
RUN bun run --filter=widget build

# ---- Runtime stage ----
FROM oven/bun:1

WORKDIR /app

# Copy workspace manifests and lockfile
COPY package.json bun.lock ./
COPY examples/widget/package.json ./examples/widget/
COPY widget/package.json ./widget/
COPY desktop/package.json ./desktop/

# Install production dependencies only
RUN bun install --frozen-lockfile

# Copy built Next.js output and source from builder
COPY --from=builder /app/examples/widget ./examples/widget
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "--filter=widget", "start"]
