FROM node:18-alpine
WORKDIR /app
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

CMD ["pnpm", "run", "run"]
