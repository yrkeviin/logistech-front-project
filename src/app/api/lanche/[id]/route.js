import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    // extrai o id dos parâmetros da rota
    // atualiza o lanche no banco de dados com os dados do corpo da requisição
    return NextResponse.json(lanche); // retorna o lanche atualizado
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao atualizar lanche' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // extrai o id dos parâmetros da rota
    // deleta o lanche do banco de dados
    return NextResponse.json({ sucesso: true }); // retorna sucesso
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao deletar lanche' }, { status: 500 });
  }
}