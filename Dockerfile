# ----------------------------
# 1️⃣ Base build stage
# ----------------------------
FROM node:20-bullseye-slim AS build

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-full \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------------
# 2️⃣ Final runtime stage (smaller)
# ----------------------------
FROM node:18-bullseye-slim

# Copy only necessary files
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Install system deps for yt-dlp
RUN apt-get update && apt-get install -y \
    python3-full \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Expose a port for pinging
EXPOSE 5000

# Start the bot
CMD ["node", "dist/index.js"]
