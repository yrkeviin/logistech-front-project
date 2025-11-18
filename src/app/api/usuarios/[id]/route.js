import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET - Buscar usuário por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' }, 
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        funcao: true,
        criado_em: true,
        veiculos: {
          select: {
            id: true,
            placa: true,
            modelo: true,
            capacidade_kg: true,
            disponivel: true
          }
        },
        pedidos_cliente: {
          select: {
            id: true,
            numero_pedido: true,
            valor_total: true,
            endereco_cliente: true,
            status: true,
            criado_em: true
          },
          orderBy: {
            criado_em: 'desc'
          },
          take: 10
        },
        entregas: {
          select: {
            id: true,
            comprovante: true,
            status: true,
            atribuido_em: true,
            entregue_em: true,
            pedido: {
              select: {
                numero_pedido: true,
                endereco_cliente: true
              }
            },
            veiculo: {
              select: {
                placa: true,
                modelo: true
              }
            }
          },
          orderBy: {
            atribuido_em: 'desc'
          },
          take: 10
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
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar usuário' }, 
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' }, 
        { status: 400 }
      );
    }

    const { nome, email, telefone, senha, funcao } = await request.json();

    // Verifica se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' }, 
        { status: 404 }
      );
    }

    // Construir objeto de atualização
    const dataToUpdate = {};

    if (nome) {
      dataToUpdate.nome = nome;
    }

    if (email) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { erro: 'Email inválido' }, 
          { status: 400 }
        );
      }

      // Verifica se o email já está em uso por outro usuário
      if (email !== usuarioExistente.email) {
        const emailEmUso = await prisma.usuario.findUnique({
          where: { email }
        });

        if (emailEmUso) {
          return NextResponse.json(
            { erro: 'Email já cadastrado por outro usuário' }, 
            { status: 409 }
          );
        }
      }

      dataToUpdate.email = email;
    }

    if (telefone) {
      // Validar formato de telefone
      const telefoneNumeros = telefone.replace(/\D/g, '');
      if (telefoneNumeros.length < 10) {
        return NextResponse.json(
          { erro: 'Telefone inválido' }, 
          { status: 400 }
        );
      }

      // Verifica se o telefone já está em uso por outro usuário
      if (telefone !== usuarioExistente.telefone) {
        const telefoneEmUso = await prisma.usuario.findUnique({
          where: { telefone }
        });

        if (telefoneEmUso) {
          return NextResponse.json(
            { erro: 'Telefone já cadastrado por outro usuário' }, 
            { status: 409 }
          );
        }
      }

      dataToUpdate.telefone = telefone;
    }

    if (senha) {
      // Validar senha (mínimo 6 caracteres)
      if (senha.length < 6) {
        return NextResponse.json(
          { erro: 'A senha deve ter no mínimo 6 caracteres' }, 
          { status: 400 }
        );
      }

      // Criar hash da nova senha
      dataToUpdate.senha = await bcrypt.hash(senha, 10);
    }

    if (funcao) {
      // Validar função
      if (funcao !== 'ADMIN' && funcao !== 'MOTORISTA') {
        return NextResponse.json(
          { erro: 'Função deve ser ADMIN ou MOTORISTA' }, 
          { status: 400 }
        );
      }

      dataToUpdate.funcao = funcao;
    }

    // Verifica se há dados para atualizar
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { erro: 'Nenhum dado fornecido para atualização' }, 
        { status: 400 }
      );
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        funcao: true,
        criado_em: true
      }
    });

    return NextResponse.json({
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar usuário' }, 
      { status: 500 }
    );
  }
}

// DELETE - Deletar usuário
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' }, 
        { status: 400 }
      );
    }

    // Verifica se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id },
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

    // Verifica se o usuário tem relações ativas
    if (usuario._count.veiculos > 0 || usuario._count.pedidos_cliente > 0 || usuario._count.entregas > 0) {
      return NextResponse.json(
        { 
          erro: 'Não é possível deletar usuário com veículos, pedidos ou entregas associadas',
          detalhes: {
            veiculos: usuario._count.veiculos,
            pedidos: usuario._count.pedidos_cliente,
            entregas: usuario._count.entregas
          }
        }, 
        { status: 409 }
      );
    }

    await prisma.usuario.delete({
      where: { id }
    });

    return NextResponse.json({ 
      mensagem: 'Usuário deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    
    // Verifica se é erro de constraint de chave estrangeira
    if (error.code === 'P2003') {
      return NextResponse.json(
        { erro: 'Não é possível deletar usuário com relações ativas no sistema' }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { erro: 'Erro ao deletar usuário' }, 
      { status: 500 }
    );
  }
}
