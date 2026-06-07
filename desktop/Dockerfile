FROM oven/bun:1 AS base

# Install system dependencies required for Tauri (Rust build toolchain + WebKit/GTK for Linux)
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev \
    pkg-config \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf \
    && rm -rf /var/lib/apt/lists/*

# Install Rust via rustup
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app

# Copy workspace manifests and lockfile first for better layer caching
COPY package.json bun.lock ./
COPY desktop/package.json ./desktop/
COPY widget/package.json ./widget/
COPY examples/widget/package.json ./examples/widget/

# Install all workspace dependencies
RUN bun install --frozen-lockfile

# Copy the full monorepo source
COPY . .

# Build the Tauri application
RUN bun run --filter=onyx-desktop build

EXPOSE 8080

CMD ["bun", "run", "--filter=onyx-desktop", "dev"]
