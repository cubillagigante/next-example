import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const clients = await prisma.clients.findMany({
      where: {
        OR: [
          { fullname: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error en GET /api/clients:", error);
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await prisma.clients.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        status: body.status,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error POST /api/clients:", error);
    return NextResponse.json({ error: "No se pudo crear el cliente (email duplicado?)" }, { status: 400 });
  }
}