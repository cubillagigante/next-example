# Gestión de Clientes - Next.js + Prisma + Docker

Este proyecto es una aplicación de gestión de clientes desarrollada con **Next.js**, **Prisma** y **PostgreSQL**, lista para ejecutarse con **Docker**. Permite listar, crear, actualizar y buscar clientes con paginación.

---

## 🔹 Requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) (opcional, para probar la API)
- pnpm (opcional si se usa docker, es para instalar dependencias)

---

## 🔹 Levantar la aplicación con Docker

1. Clonar el repositorio:

```bash
git clone git@github.com:cubillagigante/next-example.git
cd next-example/
```

2. Levantar Docker

```bash
docker compose up --build -d
```
## 🔹 Prueba en Postman

3. El import .json se encuentra en la siguiente ruta:

```bash
cd app/api/clients/apijson.json
```
