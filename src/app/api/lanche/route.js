import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // busca todos os lanches
    return NextResponse.json(lanches); // retorna a lista de lanches
  } catch {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao buscar lanches' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // extrai os dados do corpo da requisição
    // cria um novo lanche no banco de dados
    return NextResponse.json(lanche); // retorna o lanche criado
  } catch {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao criar lanche' }, { status: 500 });
  }
}