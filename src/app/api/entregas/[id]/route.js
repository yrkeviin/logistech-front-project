import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar entrega por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('GET /api/entregas/[id] - Buscando entrega ID:', id);

    const entrega = await prisma.entrega.findUnique({
      where: { id: parseInt(id) },
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
            marca: true,
            ano: true,
            capacidade_kg: true
          }
        },
        pedido: {
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
        }
      }
    });

    console.log('Entrega encontrada:', entrega ? 'Sim' : 'Não');

    if (!entrega) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    console.log('Retornando entrega com relações:', {
      id: entrega.id,
      temMotorista: !!entrega.motorista,
      temVeiculo: !!entrega.veiculo,
      temPedido: !!entrega.pedido,
      temCliente: !!entrega.pedido?.cliente
    });

    return NextResponse.json(entrega);
  } catch (error) {
    console.error('Erro ao buscar entrega:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar entrega', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Atualizar entrega
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { motorista_id, veiculo_id, comprovante, status } = body;

    console.log('PUT /api/entregas/[id] - ID:', id);
    console.log('Body recebido:', body);

    // Verificar se entrega existe
    const entregaExistente = await prisma.entrega.findUnique({
      where: { id: parseInt(id) }
    });

    console.log('Entrega existente:', entregaExistente);

    if (!entregaExistente) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    const dataToUpdate = {};

    if (motorista_id !== undefined) {
      // Verificar se motorista existe e é MOTORISTA
      const motorista = await prisma.usuario.findUnique({
        where: { id: motorista_id }
      });

      if (!motorista || motorista.funcao !== 'MOTORISTA') {
        return NextResponse.json(
          { error: 'Motorista não encontrado ou inválido' },
          { status: 404 }
        );
      }

      dataToUpdate.motorista_id = motorista_id;
    }

    if (veiculo_id !== undefined) {
      // Verificar se veículo existe
      const veiculo = await prisma.veiculo.findUnique({
        where: { id: veiculo_id }
      });

      if (!veiculo) {
        return NextResponse.json(
          { error: 'Veículo não encontrado' },
          { status: 404 }
        );
      }

      // Se motorista_id foi atualizado, verificar se veículo pertence ao novo motorista
      const motoristaId = motorista_id !== undefined ? motorista_id : entregaExistente.motorista_id;
      if (veiculo.motorista_id !== motoristaId) {
        return NextResponse.json(
          { error: 'Veículo não pertence ao motorista' },
          { status: 400 }
        );
      }

      dataToUpdate.veiculo_id = veiculo_id;
    }

    if (comprovante !== undefined) {
      dataToUpdate.comprovante = comprovante;
    }

    if (status !== undefined) {
      dataToUpdate.status = status;

      // Se status for ENTREGUE, registrar data de entrega
      if (status === 'ENTREGUE') {
        dataToUpdate.entregue_em = new Date();
      }
    }

    console.log('Dados para atualizar:', dataToUpdate);

    const entrega = await prisma.entrega.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
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
        },
        pedido: {
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
        }
      }
    });

    return NextResponse.json(entrega);
  } catch (error) {
    console.error('Erro ao atualizar entrega:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar entrega' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar entrega
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Verificar se entrega existe
    const entregaExistente = await prisma.entrega.findUnique({
      where: { id: parseInt(id) }
    });

    if (!entregaExistente) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    await prisma.entrega.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Entrega deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar entrega:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar entrega' },
      { status: 500 }
    );
  }
}
