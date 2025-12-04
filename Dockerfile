# ----------------------------
# 1️⃣ Base build stage
# ----------------------------
FROM node:20-bullseye-slim AS build

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------------
# 2️⃣ Final runtime stage
# ----------------------------
FROM node:20-bullseye-slim  # Node 20 runtime to fix File issue

# Set working directory
WORKDIR /app

# Copy build artifacts and dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Install system deps for yt-dlp at runtime
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Expose port for Render health checks / pings
EXPOSE 5000

# Start the bot
CMD ["node", "dist/index.js"]
