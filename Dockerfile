FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl bash curl

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
