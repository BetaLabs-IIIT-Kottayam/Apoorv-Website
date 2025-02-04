FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

RUN pnpm install

COPY . .

# RUN pnpm run build

EXPOSE 5000

CMD ["pnpm", "dev"]