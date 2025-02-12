# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN npm install -g pnpm && pnpm install

# Expose the port
EXPOSE 5173

# Start the application
CMD ["pnpm", "preview"]