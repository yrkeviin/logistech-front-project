import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar pedidos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const cliente_id = searchParams.get('cliente_id');

    const where = {};

    if (status) {
      where.status = status;
    }

    if (cliente_id) {
      where.cliente_id = parseInt(cliente_id);
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
          }
        },
        entregas: {
          include: {
            motorista: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        criado_em: 'desc'
      }
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST - Criar pedido
export async function POST(request) {
  try {
    const body = await request.json();
    const { numero_pedido, cliente_id, valor_total, endereco_cliente, status } = body;

    // Validações
    if (!numero_pedido || !cliente_id || !valor_total || !endereco_cliente) {
      return NextResponse.json(
        { error: 'Número do pedido, cliente, valor e endereço são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se número do pedido já existe
    const pedidoExistente = await prisma.pedido.findFirst({
      where: { numero_pedido }
    });

    if (pedidoExistente) {
      return NextResponse.json(
        { error: 'Número do pedido já existe' },
        { status: 400 }
      );
    }

    // Verificar se cliente existe
    const cliente = await prisma.usuario.findUnique({
      where: { id: cliente_id }
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    const pedido = await prisma.pedido.create({
      data: {
        numero_pedido,
        cliente_id,
        valor_total,
        endereco_cliente,
        status: status || 'PENDENTE'
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
          }
        }
      }
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
