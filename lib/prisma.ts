import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// El constructor pide 'Config', que requiere la propiedad 'url'
const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db",
});

// Definimos la interfaz global para evitar el error de "Cannot find name"
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;