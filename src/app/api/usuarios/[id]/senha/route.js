import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { senhaAtual, novaSenha } = await request.json();

    // Buscar usuário
    const usuario = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      );
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { senha: novaSenhaHash }
    });

    return NextResponse.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar senha' },
      { status: 500 }
    );
  }
}
