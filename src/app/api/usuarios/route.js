import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET - Buscar todos os usuários
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const funcao = searchParams.get('funcao'); // Filtrar por função (ADMIN ou MOTORISTA)
    const busca = searchParams.get('busca'); // Busca por nome, email ou telefone
    const email = searchParams.get('email'); // Busca por email específico

    // Se email for fornecido, buscar usuário específico
    if (email) {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          _count: {
            select: {
              veiculos: true,
              pedidos_cliente: true,
              entregas: true
            }
          }
        }
      });

      if (!usuario) {
        return NextResponse.json(
          { erro: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(usuario);
    }

    // Construir filtros dinâmicos
    const where = {};
    
    if (funcao) {
      where.funcao = funcao;
    }

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
        { telefone: { contains: busca } }
      ];
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      include: {
        _count: {
          select: {
            veiculos: true,
            pedidos_cliente: true,
            entregas: true
          }
        }
      },
      orderBy: {
        criado_em: 'desc'
      }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar usuários' }, 
      { status: 500 }
    );
  }
}

// POST - Criar novo usuário
export async function POST(request) {
  try {
    const { nome, email, telefone, senha, funcao, veiculo_id, veiculo } = await request.json();

    // Validações
    if (!nome || !email || !telefone || !senha || !funcao) {
      return NextResponse.json(
        { erro: 'Todos os campos são obrigatórios' }, 
        { status: 400 }
      );
    }

    // Validar função
    if (funcao !== 'ADMIN' && funcao !== 'MOTORISTA') {
      return NextResponse.json(
        { erro: 'Função deve ser ADMIN ou MOTORISTA' }, 
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { erro: 'Email inválido' }, 
        { status: 400 }
      );
    }

    // Validar formato de telefone (mínimo 10 dígitos)
    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
      return NextResponse.json(
        { erro: 'Telefone inválido' }, 
        { status: 400 }
      );
    }

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return NextResponse.json(
        { erro: 'A senha deve ter no mínimo 6 caracteres' }, 
        { status: 400 }
      );
    }

    // Verifica se o email já existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (emailExistente) {
      return NextResponse.json(
        { erro: 'Email já cadastrado' }, 
        { status: 409 }
      );
    }

    // Verifica se o telefone já existe
    const telefoneExistente = await prisma.usuario.findUnique({
      where: { telefone }
    });

    if (telefoneExistente) {
      return NextResponse.json(
        { erro: 'Telefone já cadastrado' }, 
        { status: 409 }
      );
    }

    // Criar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: senhaHash,
        funcao
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        funcao: true,
        criado_em: true
      }
    });

    // Se for motorista, permitir vincular veículo existente ou criar um novo veículo inline
    if (funcao === 'MOTORISTA') {
      // Prioriza criação inline de veículo quando `veiculo` está presente
      if (veiculo && typeof veiculo === 'object') {
        const { placa, modelo, marca, ano } = veiculo;
        if (!placa) {
          return NextResponse.json({ erro: 'Placa do veículo é obrigatória' }, { status: 400 });
        }

        // Verificar se placa já existe
        const existePlaca = await prisma.veiculo.findUnique({ where: { placa } });
        if (existePlaca) {
          return NextResponse.json({ erro: 'Placa já cadastrada' }, { status: 409 });
        }

        await prisma.veiculo.create({
          data: {
            motorista_id: novoUsuario.id,
            placa,
            modelo: modelo || null,
            marca: marca || null,
            ano: ano ? Number(ano) : null
          }
        });
      } else if (veiculo_id !== undefined && veiculo_id !== null && veiculo_id !== '') {
        const vid = Number(veiculo_id);
        if (Number.isNaN(vid)) {
          return NextResponse.json({ erro: 'veiculo_id inválido' }, { status: 400 });
        }

        // Verificar se veículo existe e não está vinculado
        const veic = await prisma.veiculo.findUnique({ where: { id: vid } });
        if (!veic) {
          return NextResponse.json({ erro: 'Veículo não encontrado' }, { status: 404 });
        }
        if (veic.motorista_id) {
          return NextResponse.json({ erro: 'Veículo já está vinculado a outro motorista' }, { status: 400 });
        }

        // Atualizar veículo com o novo motorista
        await prisma.veiculo.update({ where: { id: vid }, data: { motorista_id: novoUsuario.id } });
      }
    }

    return NextResponse.json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao criar usuário' }, 
      { status: 500 }
    );
  }
}
