import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar veículo específico
export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    const veiculo = await prisma.veiculo.findUnique({
      where: { id },
      include: {
        motorista: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    if (!veiculo) {
      return NextResponse.json(
        { erro: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(veiculo);
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar veículo' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar veículo
export async function PUT(request, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const { placa, modelo, marca, ano } = body;

    // Verificar se o veículo existe
    const veiculoExistente = await prisma.veiculo.findUnique({
      where: { id }
    });

    if (!veiculoExistente) {
      return NextResponse.json(
        { erro: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Validar placa (obrigatória)
    if (!placa || placa.trim() === '') {
      return NextResponse.json(
        { erro: 'Placa é obrigatória' },
        { status: 400 }
      );
    }

    // Verificar se a placa já existe em outro veículo
    if (placa !== veiculoExistente.placa) {
      const placaExistente = await prisma.veiculo.findUnique({
        where: { placa }
      });

      if (placaExistente) {
        return NextResponse.json(
          { erro: 'Placa já cadastrada em outro veículo' },
          { status: 409 }
        );
      }
    }

    // Atualizar veículo
    const veiculoAtualizado = await prisma.veiculo.update({
      where: { id },
      data: {
        placa: placa.trim(),
        modelo: modelo?.trim() || null,
        marca: marca?.trim() || null,
        ano: ano ? parseInt(ano) : null
      },
      include: {
        motorista: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(veiculoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar veículo', detalhes: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Deletar veículo
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    // Verificar se o veículo existe
    const veiculoExistente = await prisma.veiculo.findUnique({
      where: { id }
    });

    if (!veiculoExistente) {
      return NextResponse.json(
        { erro: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Deletar veículo
    await prisma.veiculo.delete({
      where: { id }
    });

    return NextResponse.json({ mensagem: 'Veículo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    return NextResponse.json(
      { erro: 'Erro ao deletar veículo' },
      { status: 500 }
    );
  }
}
