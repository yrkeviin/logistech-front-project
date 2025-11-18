import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Estatísticas gerais de usuários
export async function GET() {
  try {
    // Total de usuários
    const totalUsuarios = await prisma.usuario.count();

    // Total de admins
    const totalAdmins = await prisma.usuario.count({
      where: { funcao: 'ADMIN' }
    });

    // Total de motoristas
    const totalMotoristas = await prisma.usuario.count({
      where: { funcao: 'MOTORISTA' }
    });

    // Usuários criados nos últimos 30 dias
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const usuariosRecentes = await prisma.usuario.count({
      where: {
        criado_em: {
          gte: dataLimite
        }
      }
    });

    // Motoristas mais ativos (com mais entregas)
    const motoristasAtivos = await prisma.usuario.findMany({
      where: {
        funcao: 'MOTORISTA'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        _count: {
          select: {
            entregas: true
          }
        }
      },
      orderBy: {
        entregas: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Total de veículos no sistema
    const totalVeiculos = await prisma.veiculo.count();

    // Total de pedidos
    const totalPedidos = await prisma.pedido.count();

    // Total de entregas
    const totalEntregas = await prisma.entrega.count();

    // Entregas por status
    const entregasPorStatus = await prisma.entrega.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return NextResponse.json({
      usuarios: {
        total: totalUsuarios,
        admins: totalAdmins,
        motoristas: totalMotoristas,
        recentes_30_dias: usuariosRecentes
      },
      sistema: {
        veiculos: totalVeiculos,
        pedidos: totalPedidos,
        entregas: totalEntregas
      },
      entregas_por_status: entregasPorStatus.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status;
        return acc;
      }, {}),
      motoristas_mais_ativos: motoristasAtivos.map(m => ({
        id: m.id,
        nome: m.nome,
        email: m.email,
        total_entregas: m._count.entregas
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar estatísticas' }, 
      { status: 500 }
    );
  }
}
