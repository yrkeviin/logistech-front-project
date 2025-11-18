import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para calcular o estoque atual com base nas movimentações, seja de entrada ou saída
// Se o tipo for 'entrada', soma a quantidade; se for 'saída', subtrai a quantidade

export async function GET() {
  try {
    // busca todos os lanches com suas movimentações
    // mapeia os lanches para retornar apenas os campos necessários
    // calcula o estoque atual usando a função calcularEstoque
    return NextResponse.json(lanches); // retorna a lista de lanches com id, nome, estoque_minimo e estoque_atual
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // extrai os dados do corpo da requisição
    // busca o lanche pelo id com suas movimentações
    // se o lanche não existir, retorna erro 404
    // cria uma nova movimentação no banco de dados
    // calcula o estoque atual do lanche
    // verifica se deve gerar um alerta (saída e estoque abaixo do mínimo)
    return NextResponse.json({ sucesso: true, estoqueAtual, alerta }); // retorna sucesso, estoqueAtual e alerta se necessário
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao registrar movimentação' }, { status: 500 });
  }
}