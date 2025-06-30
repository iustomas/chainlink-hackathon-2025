# --- Stage 1: Build ---
    FROM node:20-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # --- Stage 2: Runtime ---
    FROM node:20-alpine
    
    WORKDIR /app
    
    COPY --from=build /app/package*.json ./
    COPY --from=build /app/node_modules ./node_modules
    COPY --from=build /app/dist ./dist
    COPY --from=build /app/agent ./agent 
    COPY --from=build /app/src/assets ./src/assets
    
    ENV NODE_ENV=production
    
    EXPOSE 3000
    
    CMD ["node", "dist/server.js"]