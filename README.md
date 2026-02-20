# Gestión de Clientes - Next.js + Prisma + Docker

Este proyecto es una aplicación de gestión de clientes desarrollada con **Next.js**, **Prisma** y **SQLite**. Permite listar, crear, actualizar y buscar clientes con paginación.

---

## 🔹 Requisitos

- [Postman](https://www.postman.com/) (opcional, para probar la API)
- pnpm

1. Clonar el repositorio:

```bash
git clone git@github.com:cubillagigante/next-example.git
cd next-example/
```

## 🔹 Levantar la aplicación en local

```bash
pnpm install
```

```bash
npx prisma migrate dev --name init
```

```bash
npx prisma generate
```

```bash
pnpm dev
```

---

## 🔹 Prueba en Postman

3. El import .json se encuentra en la siguiente ruta:

```bash
cd app/api/clients/apijson.json
```
