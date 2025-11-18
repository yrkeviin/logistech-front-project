import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar pedido por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const pedido = await prisma.pedido.findUnique({
      where: { id },
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
                nome: true,
                email: true,
                telefone: true
              }
            },
            veiculo: {
              select: {
                id: true,
                placa: true,
                modelo: true,
                marca: true
              }
            }
          }
        }
      }
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar pedido
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { numero_pedido, valor_total, endereco_cliente, status } = body;

    // Verificar se pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id }
    });

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    const dataToUpdate = {};

    if (numero_pedido !== undefined) {
      // Verificar se número do pedido já existe em outro pedido
      const outroPedido = await prisma.pedido.findFirst({
        where: {
          numero_pedido,
          id: { not: id }
        }
      });

      if (outroPedido) {
        return NextResponse.json(
          { error: 'Número do pedido já existe' },
          { status: 400 }
        );
      }

      dataToUpdate.numero_pedido = numero_pedido;
    }

    if (valor_total !== undefined) {
      dataToUpdate.valor_total = valor_total;
    }

    if (endereco_cliente !== undefined) {
      dataToUpdate.endereco_cliente = endereco_cliente;
    }

    if (status !== undefined) {
      dataToUpdate.status = status;
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: dataToUpdate,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
          }
        },
        entregas: true
      }
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar pedido
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Verificar se pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
      include: {
        entregas: true
      }
    });

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se pedido tem entregas
    if (pedidoExistente.entregas && pedidoExistente.entregas.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar pedido com entregas vinculadas' },
        { status: 400 }
      );
    }

    await prisma.pedido.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pedido' },
      { status: 500 }
    );
  }
}
