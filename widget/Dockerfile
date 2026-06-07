FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace manifests and lockfile first for better layer caching
COPY package.json bun.lock ./
COPY widget/package.json ./widget/
COPY desktop/package.json ./desktop/
COPY examples/widget/package.json ./examples/widget/

# Install all workspace dependencies
RUN bun install --frozen-lockfile

# Copy the full monorepo source
COPY . .

# Build the onyx-chat-widget library
RUN bun run --filter=onyx-chat-widget build

# ---- Runtime stage ----
FROM oven/bun:1

WORKDIR /app

# Copy workspace manifests and lockfile
COPY package.json bun.lock ./
COPY widget/package.json ./widget/
COPY desktop/package.json ./desktop/
COPY examples/widget/package.json ./examples/widget/

# Install dependencies (needed for dev server)
RUN bun install --frozen-lockfile

# Copy source and built artifacts from builder
COPY --from=builder /app/widget ./widget
COPY --from=builder /app/package.json ./package.json

EXPOSE 5173

CMD ["bun", "run", "--filter=onyx-chat-widget", "dev"]
