import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar entregas com filtros
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const motorista_id = searchParams.get('motorista_id');
    const data = searchParams.get('data');

    const where = {};

    if (status) {
      where.status = status;
    }

    if (motorista_id) {
      where.motorista_id = parseInt(motorista_id);
    }

    if (data) {
      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setDate(dataFim.getDate() + 1);

      where.atribuido_em = {
        gte: dataInicio,
        lt: dataFim
      };
    }

    const entregas = await prisma.entrega.findMany({
      where,
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
      },
      orderBy: {
        atribuido_em: 'desc'
      }
    });

    return NextResponse.json(entregas);
  } catch (error) {
    console.error('Erro ao buscar entregas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar entregas' },
      { status: 500 }
    );
  }
}

// POST - Criar nova entrega
export async function POST(request) {
  try {
    const body = await request.json();
    const { pedido_id, motorista_id, veiculo_id, comprovante, status } = body;

    // Validações
    if (!pedido_id || !motorista_id || !veiculo_id) {
      return NextResponse.json(
        { error: 'Pedido, motorista e veículo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedido_id }
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

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

    // Verificar se veículo existe e pertence ao motorista
    const veiculo = await prisma.veiculo.findUnique({
      where: { id: veiculo_id }
    });

    if (!veiculo || veiculo.motorista_id !== motorista_id) {
      return NextResponse.json(
        { error: 'Veículo não encontrado ou não pertence ao motorista' },
        { status: 404 }
      );
    }

    // Verificar se já existe entrega para este pedido
    const entregaExistente = await prisma.entrega.findFirst({
      where: { pedido_id }
    });

    if (entregaExistente) {
      return NextResponse.json(
        { error: 'Já existe uma entrega para este pedido' },
        { status: 400 }
      );
    }

    const entrega = await prisma.entrega.create({
      data: {
        pedido_id,
        motorista_id,
        veiculo_id,
        comprovante: comprovante || null,
        status: status || 'PENDENTE',
        atribuido_em: new Date()
      },
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

    return NextResponse.json(entrega, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar entrega:', error);
    return NextResponse.json(
      { error: 'Erro ao criar entrega' },
      { status: 500 }
    );
  }
}
