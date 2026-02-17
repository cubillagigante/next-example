import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params; 
    const idStr = resolvedParams.id;

    if (!idStr || isNaN(Number(idStr))) {
      return NextResponse.json({ error: "ID no proporcionado o inválido" }, { status: 400 });
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
    const body = await request.json();

    const client = await prisma.clients.update({
      where: { id },
      data: {
        fullname: body.fullname,
        email: body.email,
        status: body.status,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}