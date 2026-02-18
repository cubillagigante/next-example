import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { editClientSchema } from "@/app/api/clients/dtos/clients";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params; 
    const idStr = resolvedParams.id;

    if (!idStr || isNaN(Number(idStr))) {
      return NextResponse.json({ error: "Id cliente no existe" }, { status: 400 });
    }

    const cliente = await prisma.clients.findUnique({
      where: { id: Number(idStr) },
    });

    if (!cliente)
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Id cliente no existe" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = editClientSchema.parse(body);

    if (body.email) {
        const existing = await prisma.clients.findUnique({
        where: { email: validatedData.email }
        });

        if (existing && existing.id !== id) {
            return NextResponse.json(
                { error: "El email ya está registrado por otro cliente" },
                { status: 400 }
            );
        }
    }

    const client = await prisma.clients.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(client);

    } catch (error: any) {
        console.error("PATCH Error:", error);

        if (error instanceof ZodError) {
            const fieldErrors: Record<string, string[]> = {};

            error.issues.forEach(issue => {
                const field = issue.path[0] as string;
                if (!fieldErrors[field]) fieldErrors[field] = [];
                fieldErrors[field].push(issue.message);
            });

            return NextResponse.json(
                {
                error: "Datos inválidos",
                details: fieldErrors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
        { error: "Error al actualizar cliente" },
        { status: 500 }
        );
    }
}
