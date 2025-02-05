FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev"]