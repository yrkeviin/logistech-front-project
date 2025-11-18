import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const motoristaId = searchParams.get('motorista_id');

    const where = motoristaId ? { motorista_id: parseInt(motoristaId) } : {};

    const veiculos = await prisma.veiculo.findMany({
      where,
      include: {
        motorista: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(veiculos);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar veículos' },
      { status: 500 }
    );
  }
}
