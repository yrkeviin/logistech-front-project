const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('');
  console.log('🌱 Iniciando seed...');

  await prisma.entrega.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🧹 Dados antigos removidos.');

  console.log('👤 Criando usuários...');
  const usuarios = [
    { nome: 'Ana Silva', email: 'anasilva1@logistech.com', telefone: '11987654321', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'João Santos', email: 'joao.santos@logistech.com', telefone: '11987654322', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Maria Oliveira', email: 'maria.oliveira@logistech.com', telefone: '11987654323', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Pedro Costa', email: 'pedro.costa@logistech.com', telefone: '11987654324', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Ana Rodrigues', email: 'ana.rodrigues@logistech.com', telefone: '11987654325', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Carlos Pereira', email: 'carlos.pereira@logistech.com', telefone: '11987654326', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Juliana Lima', email: 'juliana.lima@logistech.com', telefone: '11987654327', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Roberto Alves', email: 'roberto.alves@logistech.com', telefone: '11987654328', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Fernanda Martins', email: 'fernanda.martins@logistech.com', telefone: '11987654329', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Lucas Ferreira', email: 'lucas.ferreira@logistech.com', telefone: '11987654330', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Patricia Souza', email: 'patricia.souza@logistech.com', telefone: '11987654331', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Ricardo Gomes', email: 'ricardo.gomes@logistech.com', telefone: '11987654332', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Camila Ribeiro', email: 'camila.ribeiro@logistech.com', telefone: '11987654333', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Thiago Cardoso', email: 'thiago.cardoso@logistech.com', telefone: '11987654334', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Beatriz Nascimento', email: 'beatriz.nascimento@logistech.com', telefone: '11987654335', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Felipe Araújo', email: 'felipe.araujo@logistech.com', telefone: '11987654336', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Mariana Castro', email: 'mariana.castro@logistech.com', telefone: '11987654337', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Rafael Dias', email: 'rafael.dias@logistech.com', telefone: '11987654338', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
    { nome: 'Gabriela Moreira', email: 'gabriela.moreira@logistech.com', telefone: '11987654339', senha: bcrypt.hashSync('123456', 10), funcao: 'ADMIN' },
    { nome: 'Bruno Barbosa', email: 'bruno.barbosa@logistech.com', telefone: '11987654340', senha: bcrypt.hashSync('123456', 10), funcao: 'MOTORISTA' },
  ];

  for (let i = 21; i <= 100; i++) {
    const isAdmin = i % 2 === 1;
    const userNames = [
      'Amanda Carvalho', 'Rodrigo Teixeira', 'Larissa Cavalcanti', 'Diego Monteiro', 'Renata Freitas',
      'Gustavo Correia', 'Carolina Pinto', 'Marcelo Rocha', 'Vanessa Azevedo', 'Paulo Soares',
      'Bruna Mendes', 'André Cunha', 'Isabela Nunes', 'Vinicius Pires', 'Leticia Ramos',
      'Leandro Farias', 'Tatiana Borges', 'Fabio Melo', 'Natalia Campos', 'Guilherme Porto',
      'Priscila Duarte', 'Mateus Vargas', 'Aline Moura', 'Daniel Baptista', 'Viviane Fonseca',
      'Alexandre Macedo', 'Claudia Lopes', 'Henrique Silva', 'Michele Torres', 'Cristiano Rezende',
      'Adriana Siqueira', 'Edson Miranda', 'Simone Pacheco', 'Wagner Viana', 'Lucia Xavier',
      'Cesar Brito', 'Sandra Guimarães', 'Milton Lacerda', 'Rosa Tavares', 'Nelson Caldeira',
      'Rita Bezerra', 'Oscar Nogueira', 'Eliane Vieira', 'Sergio Amaral', 'Angela Matos',
      'Mauro Santana', 'Vera Paiva', 'Ivan Coelho', 'Monica Guerra', 'Jorge Barros',
      'Denise Figueiredo', 'Eduardo Leite', 'Sonia Toledo', 'Ronaldo Andrade', 'Helena Reis',
      'Alberto Pereira', 'Cristina Araujo', 'Geraldo Castro', 'Terezinha Moraes', 'Antonio Batista',
      'Marta Fernandes', 'Francisco Goncalves', 'Rosana Esteves', 'Jose Silveira', 'Margareth Prado',
      'Luiz Bueno', 'Regina Sabino', 'Manoel Leal', 'Fatima Mesquita', 'Valter Marques',
      'Gloria Sales', 'Claudio Diniz', 'Sueli Brandao', 'Jair Medeiros', 'Silvia Camargo',
      'Roberto Sampaio', 'Marcia Vasconcelos', 'Fernando Fogaca', 'Irene Quadros', 'Marcos Valente'
    ];
    
    const name = userNames[(i - 21) % userNames.length];
    const email = name.toLowerCase().replace(/\s+/g, '.').replace(/ã/g, 'a').replace(/ç/g, 'c').replace(/á/g, 'a').replace(/â/g, 'a').replace(/é/g, 'e') + `${i}@logistech.com`;
    
    usuarios.push({
      nome: name,
      email: email,
      telefone: `119876543${String(i + 20).padStart(2, '0')}`,
      senha: bcrypt.hashSync('123456', 10),
      funcao: isAdmin ? 'ADMIN' : 'MOTORISTA'
    });
  }

  await prisma.usuario.createMany({ data: usuarios });
  console.log(`✅ ${usuarios.length} usuários criados.`);

  console.log('🚐 Criando veículos...');
  const veiculos = [
    { motorista_id: 2, placa: 'ABC1234', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 4, placa: 'DEF5678', modelo: 'Master', marca: 'Renault', ano: 2019 },
    { motorista_id: 6, placa: 'GHI9012', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 8, placa: 'JKL3456', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 10, placa: 'MNO7890', modelo: 'Transit', marca: 'Ford', ano: 2022 },
  ];

  const modelos = ['Sprinter', 'Master', 'Ducato', 'Daily', 'Transit'];
  const marcas = ['Mercedes-Benz', 'Renault', 'Fiat', 'Iveco', 'Ford'];
  const placaLetters = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'YZA', 'BCD'];

  for (let i = 1; i <= 100; i++) {
    const motoristaId = (i * 2);
    if (motoristaId <= 100) {
      const modeloIndex = (i - 1) % modelos.length;
      const placaPrefix = placaLetters[(i - 1) % placaLetters.length];
      const placaSuffix = String(1000 + i).slice(-4);
      
      if (i > 5) {
        veiculos.push({
          motorista_id: motoristaId,
          placa: `${placaPrefix}${placaSuffix}`,
          modelo: modelos[modeloIndex],
          marca: marcas[modeloIndex],
          ano: 2019 + (i % 4)
        });
      }
    }
  }

  await prisma.veiculo.createMany({ data: veiculos });
  console.log(`✅ ${veiculos.length} veículos criados.`);

  console.log('📦 Criando pedidos...');
  const pedidos = [];
  const statusOptions = ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADO'];
  
  for (let i = 1; i <= 100; i++) {
    pedidos.push({
      numero_pedido: `PED${String(i).padStart(3, '0')}`,
      cliente_id: (i % 99) + 1,
      valor_total: (Math.random() * 5000 + 500).toFixed(2),
      endereco_cliente: `Endereço ${i}, Cidade ${i % 10 + 1}`,
      status: statusOptions[i % 4]
    });
  }

  await prisma.pedido.createMany({ data: pedidos });
  console.log(`✅ ${pedidos.length} pedidos criados.`);

  console.log('🚚 Criando entregas...');
  const entregas = [];
  const statusEntregaOptions = ['PENDENTE', 'EM_ROTA', 'ENTREGUE'];
  
  for (let i = 1; i <= 100; i++) {
    const motoristaId = ((i - 1) % 49 + 1) * 2;
    const veiculoId = ((i - 1) % 50) + 1;
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    
    entregas.push({
      pedido_id: i,
      motorista_id: motoristaId,
      veiculo_id: veiculoId,
      comprovante: `comprovante_${String(i).padStart(3, '0')}.jpg`,
      status: statusEntregaOptions[i % 3],
      atribuido_em: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      entregue_em: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000)
    });
  }

  await prisma.entrega.createMany({ data: entregas });
  console.log(`✅ ${entregas.length} entregas criadas.`);
}

main()
  .then(() => console.log('✅ Seed concluído com sucesso!'))
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });