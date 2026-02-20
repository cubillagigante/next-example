import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClientSchema } from "@/app/api/clients/dtos/clients";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const total = await prisma.clients.count({
      where: {
        OR: [
          { fullname: { contains: q } },
          { email: { contains: q } },
        ],
      },
    });

    const clients = await prisma.clients.findMany({
      where: {
        OR: [
          { fullname: { contains: q } },
          { email: { contains: q } },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error en GET /api/clients:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    body.status = true;
    const validatedData = createClientSchema.parse(body);

    const existing = await prisma.clients.findUnique({
      where: { email: validatedData.email }
    });

    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const client = await prisma.clients.create({
      data: validatedData,
    });

    return NextResponse.json(client, { status: 201 });

  } catch (error: any) {
    console.error("Error POST /api/clients:", error);

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
      { error: "Error inesperado al crear cliente" },
      { status: 500 }
    );
  }
}

