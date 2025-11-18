import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { erro: 'Email e senha são obrigatórios' }, 
        { status: 400 }
      );
    }

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        senha: true,
        funcao: true,
        criado_em: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { erro: 'Email ou senha inválidos' }, 
        { status: 401 }
      );
    }

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { erro: 'Email ou senha inválidos' }, 
        { status: 401 }
      );
    }

    // Remove a senha dos dados retornados
    const { senha: _, ...usuarioSemSenha } = usuario;

    return NextResponse.json({ 
      usuario: usuarioSemSenha,
      mensagem: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}