import { z } from "zod";

export const createClientSchema = z.object({
  fullname: z.string().min(3, "El nombre debe tener al menos 3 caracteres").regex(/^[A-Za-zÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z.string().email("Email inválido"),
  status: z.boolean().default(true),
});

export const editClientSchema = z.object({
  fullname: z.string().min(3, "El nombre debe tener al menos 3 caracteres").regex(/^[A-Za-zÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios").optional(),
  email: z.string().email("Email inválido").optional(),
  status: z.boolean().optional(),
});

export type CreateClientDTO = z.infer<typeof createClientSchema>;
export type EditClientDTO = z.infer<typeof editClientSchema>;