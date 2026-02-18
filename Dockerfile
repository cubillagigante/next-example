FROM node:20-alpine

# Instalar dependencias que Prisma necesita
RUN apk add --no-cache libc6-compat openssl bash curl

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Generar Prisma (ahora sí funcionará)
RUN pnpm prisma generate

# Construir Next.js
RUN pnpm build

EXPOSE 3000

# Ejecutar migraciones y luego start
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
