# 1️⃣ Base image
FROM node:18-slim

# 2️⃣ Install yt-dlp (system-level)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3️⃣ Create app directory
WORKDIR /app

# 4️⃣ Copy package files first (better caching)
COPY package*.json ./

# 5️⃣ Install dependencies
RUN npm install

# 6️⃣ Copy the rest of the project
COPY . .

# 7️⃣ Build TypeScript
RUN npm run build

# 8️⃣ Start bot
CMD ["node", "dist/index.js"]
