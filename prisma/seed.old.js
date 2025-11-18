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
  const usuariosData = [
    { nome: 'Ana Silva', email: 'anasilva1@logistech.com', telefone: '11987654321', funcao: 'ADMIN' },
    { nome: 'João Santos', email: 'joao.santos@logistech.com', telefone: '11987654322', funcao: 'MOTORISTA' },
    { nome: 'Maria Oliveira', email: 'maria.oliveira@logistech.com', telefone: '11987654323', funcao: 'ADMIN' },
    { nome: 'Pedro Costa', email: 'pedro.costa@logistech.com', telefone: '11987654324', funcao: 'MOTORISTA' },
    { nome: 'Ana Rodrigues', email: 'ana.rodrigues@logistech.com', telefone: '11987654325', funcao: 'ADMIN' },
    { nome: 'Carlos Pereira', email: 'carlos.pereira@logistech.com', telefone: '11987654326', funcao: 'MOTORISTA' },
    { nome: 'Juliana Lima', email: 'juliana.lima@logistech.com', telefone: '11987654327', funcao: 'ADMIN' },
    { nome: 'Roberto Alves', email: 'roberto.alves@logistech.com', telefone: '11987654328', funcao: 'MOTORISTA' },
    { nome: 'Fernanda Martins', email: 'fernanda.martins@logistech.com', telefone: '11987654329', funcao: 'ADMIN' },
    { nome: 'Lucas Ferreira', email: 'lucas.ferreira@logistech.com', telefone: '11987654330', funcao: 'MOTORISTA' },
    { nome: 'Patricia Souza', email: 'patricia.souza@logistech.com', telefone: '11987654331', funcao: 'ADMIN' },
    { nome: 'Ricardo Gomes', email: 'ricardo.gomes@logistech.com', telefone: '11987654332', funcao: 'MOTORISTA' },
    { nome: 'Camila Ribeiro', email: 'camila.ribeiro@logistech.com', telefone: '11987654333', funcao: 'ADMIN' },
    { nome: 'Thiago Cardoso', email: 'thiago.cardoso@logistech.com', telefone: '11987654334', funcao: 'MOTORISTA' },
    { nome: 'Beatriz Nascimento', email: 'beatriz.nascimento@logistech.com', telefone: '11987654335', funcao: 'ADMIN' },
    { nome: 'Felipe Araújo', email: 'felipe.araujo@logistech.com', telefone: '11987654336', funcao: 'MOTORISTA' },
    { nome: 'Mariana Castro', email: 'mariana.castro@logistech.com', telefone: '11987654337', funcao: 'ADMIN' },
    { nome: 'Rafael Dias', email: 'rafael.dias@logistech.com', telefone: '11987654338', funcao: 'MOTORISTA' },
    { nome: 'Gabriela Moreira', email: 'gabriela.moreira@logistech.com', telefone: '11987654339', funcao: 'ADMIN' },
    { nome: 'Bruno Barbosa', email: 'bruno.barbosa@logistech.com', telefone: '11987654340', funcao: 'MOTORISTA' },
    { nome: 'Amanda Carvalho', email: 'amanda.carvalho@logistech.com', telefone: '11987654341', funcao: 'ADMIN' },
    { nome: 'Rodrigo Teixeira', email: 'rodrigo.teixeira@logistech.com', telefone: '11987654342', funcao: 'MOTORISTA' },
    { nome: 'Larissa Cavalcanti', email: 'larissa.cavalcanti@logistech.com', telefone: '11987654343', funcao: 'ADMIN' },
    { nome: 'Diego Monteiro', email: 'diego.monteiro@logistech.com', telefone: '11987654344', funcao: 'MOTORISTA' },
    { nome: 'Renata Freitas', email: 'renata.freitas@logistech.com', telefone: '11987654345', funcao: 'ADMIN' },
    { nome: 'Gustavo Correia', email: 'gustavo.correia@logistech.com', telefone: '11987654346', funcao: 'MOTORISTA' },
    { nome: 'Carolina Pinto', email: 'carolina.pinto@logistech.com', telefone: '11987654347', funcao: 'ADMIN' },
    { nome: 'Marcelo Rocha', email: 'marcelo.rocha@logistech.com', telefone: '11987654348', funcao: 'MOTORISTA' },
    { nome: 'Vanessa Azevedo', email: 'vanessa.azevedo@logistech.com', telefone: '11987654349', funcao: 'ADMIN' },
    { nome: 'Paulo Soares', email: 'paulo.soares@logistech.com', telefone: '11987654350', funcao: 'MOTORISTA' },
    { nome: 'Bruna Mendes', email: 'bruna.mendes@logistech.com', telefone: '11987654351', funcao: 'ADMIN' },
    { nome: 'André Cunha', email: 'andre.cunha@logistech.com', telefone: '11987654352', funcao: 'MOTORISTA' },
    { nome: 'Isabela Nunes', email: 'isabela.nunes@logistech.com', telefone: '11987654353', funcao: 'ADMIN' },
    { nome: 'Vinicius Pires', email: 'vinicius.pires@logistech.com', telefone: '11987654354', funcao: 'MOTORISTA' },
    { nome: 'Leticia Ramos', email: 'leticia.ramos@logistech.com', telefone: '11987654355', funcao: 'ADMIN' },
    { nome: 'Leandro Farias', email: 'leandro.farias@logistech.com', telefone: '11987654356', funcao: 'MOTORISTA' },
    { nome: 'Tatiana Borges', email: 'tatiana.borges@logistech.com', telefone: '11987654357', funcao: 'ADMIN' },
    { nome: 'Fabio Melo', email: 'fabio.melo@logistech.com', telefone: '11987654358', funcao: 'MOTORISTA' },
    { nome: 'Natalia Campos', email: 'natalia.campos@logistech.com', telefone: '11987654359', funcao: 'ADMIN' },
    { nome: 'Guilherme Porto', email: 'guilherme.porto@logistech.com', telefone: '11987654360', funcao: 'MOTORISTA' },
    { nome: 'Priscila Duarte', email: 'priscila.duarte@logistech.com', telefone: '11987654361', funcao: 'ADMIN' },
    { nome: 'Mateus Vargas', email: 'mateus.vargas@logistech.com', telefone: '11987654362', funcao: 'MOTORISTA' },
    { nome: 'Aline Moura', email: 'aline.moura@logistech.com', telefone: '11987654363', funcao: 'ADMIN' },
    { nome: 'Daniel Baptista', email: 'daniel.baptista@logistech.com', telefone: '11987654364', funcao: 'MOTORISTA' },
    { nome: 'Viviane Fonseca', email: 'viviane.fonseca@logistech.com', telefone: '11987654365', funcao: 'ADMIN' },
    { nome: 'Alexandre Macedo', email: 'alexandre.macedo@logistech.com', telefone: '11987654366', funcao: 'MOTORISTA' },
    { nome: 'Claudia Lopes', email: 'claudia.lopes@logistech.com', telefone: '11987654367', funcao: 'ADMIN' },
    { nome: 'Henrique Silva', email: 'henrique.silva@logistech.com', telefone: '11987654368', funcao: 'MOTORISTA' },
    { nome: 'Michele Torres', email: 'michele.torres@logistech.com', telefone: '11987654369', funcao: 'ADMIN' },
    { nome: 'Cristiano Rezende', email: 'cristiano.rezende@logistech.com', telefone: '11987654370', funcao: 'MOTORISTA' },
    { nome: 'Adriana Siqueira', email: 'adriana.siqueira@logistech.com', telefone: '11987654371', funcao: 'ADMIN' },
    { nome: 'Edson Miranda', email: 'edson.miranda@logistech.com', telefone: '11987654372', funcao: 'MOTORISTA' },
    { nome: 'Simone Pacheco', email: 'simone.pacheco@logistech.com', telefone: '11987654373', funcao: 'ADMIN' },
    { nome: 'Wagner Viana', email: 'wagner.viana@logistech.com', telefone: '11987654374', funcao: 'MOTORISTA' },
    { nome: 'Lucia Xavier', email: 'lucia.xavier@logistech.com', telefone: '11987654375', funcao: 'ADMIN' },
    { nome: 'Cesar Brito', email: 'cesar.brito@logistech.com', telefone: '11987654376', funcao: 'MOTORISTA' },
    { nome: 'Sandra Guimarães', email: 'sandra.guimaraes@logistech.com', telefone: '11987654377', funcao: 'ADMIN' },
    { nome: 'Milton Lacerda', email: 'milton.lacerda@logistech.com', telefone: '11987654378', funcao: 'MOTORISTA' },
    { nome: 'Rosa Tavares', email: 'rosa.tavares@logistech.com', telefone: '11987654379', funcao: 'ADMIN' },
    { nome: 'Nelson Caldeira', email: 'nelson.caldeira@logistech.com', telefone: '11987654380', funcao: 'MOTORISTA' },
    { nome: 'Rita Bezerra', email: 'rita.bezerra@logistech.com', telefone: '11987654381', funcao: 'ADMIN' },
    { nome: 'Oscar Nogueira', email: 'oscar.nogueira@logistech.com', telefone: '11987654382', funcao: 'MOTORISTA' },
    { nome: 'Eliane Vieira', email: 'eliane.vieira@logistech.com', telefone: '11987654383', funcao: 'ADMIN' },
    { nome: 'Sergio Amaral', email: 'sergio.amaral@logistech.com', telefone: '11987654384', funcao: 'MOTORISTA' },
    { nome: 'Angela Matos', email: 'angela.matos@logistech.com', telefone: '11987654385', funcao: 'ADMIN' },
    { nome: 'Mauro Santana', email: 'mauro.santana@logistech.com', telefone: '11987654386', funcao: 'MOTORISTA' },
    { nome: 'Vera Paiva', email: 'vera.paiva@logistech.com', telefone: '11987654387', funcao: 'ADMIN' },
    { nome: 'Ivan Coelho', email: 'ivan.coelho@logistech.com', telefone: '11987654388', funcao: 'MOTORISTA' },
    { nome: 'Monica Guerra', email: 'monica.guerra@logistech.com', telefone: '11987654389', funcao: 'ADMIN' },
    { nome: 'Jorge Barros', email: 'jorge.barros@logistech.com', telefone: '11987654390', funcao: 'MOTORISTA' },
    { nome: 'Denise Figueiredo', email: 'denise.figueiredo@logistech.com', telefone: '11987654391', funcao: 'ADMIN' },
    { nome: 'Eduardo Leite', email: 'eduardo.leite@logistech.com', telefone: '11987654392', funcao: 'MOTORISTA' },
    { nome: 'Sonia Toledo', email: 'sonia.toledo@logistech.com', telefone: '11987654393', funcao: 'ADMIN' },
    { nome: 'Ronaldo Andrade', email: 'ronaldo.andrade@logistech.com', telefone: '11987654394', funcao: 'MOTORISTA' },
    { nome: 'Helena Reis', email: 'helena.reis@logistech.com', telefone: '11987654395', funcao: 'ADMIN' },
    { nome: 'Alberto Pereira', email: 'alberto.pereira@logistech.com', telefone: '11987654396', funcao: 'MOTORISTA' },
    { nome: 'Cristina Araujo', email: 'cristina.araujo@logistech.com', telefone: '11987654397', funcao: 'ADMIN' },
    { nome: 'Geraldo Castro', email: 'geraldo.castro@logistech.com', telefone: '11987654398', funcao: 'MOTORISTA' },
    { nome: 'Terezinha Moraes', email: 'terezinha.moraes@logistech.com', telefone: '11987654399', funcao: 'ADMIN' },
    { nome: 'Antonio Batista', email: 'antonio.batista@logistech.com', telefone: '11987654400', funcao: 'MOTORISTA' },
    { nome: 'Marta Fernandes', email: 'marta.fernandes@logistech.com', telefone: '11987654401', funcao: 'ADMIN' },
    { nome: 'Francisco Goncalves', email: 'francisco.goncalves@logistech.com', telefone: '11987654402', funcao: 'MOTORISTA' },
    { nome: 'Rosana Esteves', email: 'rosana.esteves@logistech.com', telefone: '11987654403', funcao: 'ADMIN' },
    { nome: 'Jose Silveira', email: 'jose.silveira@logistech.com', telefone: '11987654404', funcao: 'MOTORISTA' },
    { nome: 'Margareth Prado', email: 'margareth.prado@logistech.com', telefone: '11987654405', funcao: 'ADMIN' },
    { nome: 'Luiz Bueno', email: 'luiz.bueno@logistech.com', telefone: '11987654406', funcao: 'MOTORISTA' },
    { nome: 'Regina Sabino', email: 'regina.sabino@logistech.com', telefone: '11987654407', funcao: 'ADMIN' },
    { nome: 'Manoel Leal', email: 'manoel.leal@logistech.com', telefone: '11987654408', funcao: 'MOTORISTA' },
    { nome: 'Fatima Mesquita', email: 'fatima.mesquita@logistech.com', telefone: '11987654409', funcao: 'ADMIN' },
    { nome: 'Valter Marques', email: 'valter.marques@logistech.com', telefone: '11987654410', funcao: 'MOTORISTA' },
    { nome: 'Gloria Sales', email: 'gloria.sales@logistech.com', telefone: '11987654411', funcao: 'ADMIN' },
    { nome: 'Claudio Diniz', email: 'claudio.diniz@logistech.com', telefone: '11987654412', funcao: 'MOTORISTA' },
    { nome: 'Sueli Brandao', email: 'sueli.brandao@logistech.com', telefone: '11987654413', funcao: 'ADMIN' },
    { nome: 'Jair Medeiros', email: 'jair.medeiros@logistech.com', telefone: '11987654414', funcao: 'MOTORISTA' },
    { nome: 'Silvia Camargo', email: 'silvia.camargo@logistech.com', telefone: '11987654415', funcao: 'ADMIN' },
    { nome: 'Roberto Sampaio', email: 'roberto.sampaio@logistech.com', telefone: '11987654416', funcao: 'MOTORISTA' },
    { nome: 'Marcia Vasconcelos', email: 'marcia.vasconcelos@logistech.com', telefone: '11987654417', funcao: 'ADMIN' },
    { nome: 'Fernando Fogaca', email: 'fernando.fogaca@logistech.com', telefone: '11987654418', funcao: 'MOTORISTA' },
    { nome: 'Irene Quadros', email: 'irene.quadros@logistech.com', telefone: '11987654419', funcao: 'ADMIN' },
    { nome: 'Marcos Valente', email: 'marcos.valente@logistech.com', telefone: '11987654420', funcao: 'MOTORISTA' },
  ];

  const senhaHash = bcrypt.hashSync('123456', 10);
  const usuarios = usuariosData.map(u => ({ ...u, senha: senhaHash }));

  await prisma.usuario.createMany({ data: usuarios });
  console.log(`✅ ${usuarios.length} usuários criados.`);

  // Buscar motoristas criados
  const motoristas = await prisma.usuario.findMany({
    where: { funcao: 'MOTORISTA' },
    select: { id: true },
    orderBy: { id: 'asc' }
  });

  console.log('🚐 Criando veículos...');
  const marcas = ['Mercedes-Benz', 'Renault', 'Fiat', 'Iveco', 'Ford'];
  const modelos = ['Sprinter', 'Master', 'Ducato', 'Daily', 'Transit'];
  const veiculos = motoristas.map((motorista, index) => ({
    motorista_id: motorista.id,
    placa: `ABC${String(1000 + index).padStart(4, '0')}`,
    modelo: modelos[index % modelos.length],
    marca: marcas[index % marcas.length],
    ano: 2019 + (index % 4)
  }));

  await prisma.veiculo.createMany({ data: veiculos });
  console.log(`✅ ${veiculos.length} veículos criados.`);

  // Buscar admins criados
  const admins = await prisma.usuario.findMany({
    where: { funcao: 'ADMIN' },
    select: { id: true },
    orderBy: { id: 'asc' }
  });

  console.log('📦 Criando pedidos...');
  const enderecos = [
    'Rua A, 100 - São Paulo, SP', 'Av. B, 200 - Rio de Janeiro, RJ',
    'Rua C, 300 - Belo Horizonte, MG', 'Av. D, 400 - Curitiba, PR',
    'Rua E, 500 - Porto Alegre, RS', 'Av. F, 600 - Salvador, BA',
    'Rua G, 700 - Fortaleza, CE', 'Av. H, 800 - Recife, PE',
    'Rua I, 900 - Brasília, DF', 'Av. J, 1000 - Manaus, AM'
  ];
  const statusPedido = ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADO'];

  const pedidos = admins.map((admin, index) => ({
    numero_pedido: `PED${String(index + 1).padStart(3, '0')}`,
    cliente_id: admin.id,
    valor_total: 1000 + (index * 100),
    endereco_cliente: enderecos[index % enderecos.length],
    status: statusPedido[index % statusPedido.length]
  }));

  await prisma.pedido.createMany({ data: pedidos });
  console.log(`✅ ${pedidos.length} pedidos criados.`);

  // Buscar pedidos e veículos criados
  const pedidosCriados = await prisma.pedido.findMany({
    select: { id: true },
    orderBy: { id: 'asc' }
  });

  const veiculosCriados = await prisma.veiculo.findMany({
    select: { id: true, motorista_id: true },
    orderBy: { id: 'asc' }
  });

  console.log('🚚 Criando entregas...');
  const statusEntrega = ['PENDENTE', 'EM_ROTA', 'ENTREGUE'];
  const entregas = pedidosCriados.map((pedido, index) => {
    const veiculo = veiculosCriados[index % veiculosCriados.length];
    const agora = new Date();
    const diasAtras = Math.floor(index / 3);

    return {
      pedido_id: pedido.id,
      motorista_id: veiculo.motorista_id,
      veiculo_id: veiculo.id,
      comprovante: `comprovante_${String(index + 1).padStart(3, '0')}.jpg`,
      status: statusEntrega[index % statusEntrega.length],
      atribuido_em: new Date(agora.getTime() - diasAtras * 24 * 60 * 60 * 1000),
      entregue_em: new Date(agora.getTime() - (diasAtras - 1) * 24 * 60 * 60 * 1000)
    };
  });

  await prisma.entrega.createMany({ data: entregas });
  console.log(`✅ ${entregas.length} entregas criadas.`);

  console.log('');
  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// FIM DO ARQUIVO
    { motorista_id: 26, placa: 'KLM9012', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 28, placa: 'NOP3456', modelo: 'Daily', marca: 'Iveco', ano: 2019 },
    { motorista_id: 30, placa: 'QRS7890', modelo: 'Transit', marca: 'Ford', ano: 2022 },
    { motorista_id: 32, placa: 'TUV1234', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 34, placa: 'WXY5678', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 36, placa: 'ZAB9012', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 38, placa: 'CDE3456', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 40, placa: 'FGH7890', modelo: 'Transit', marca: 'Ford', ano: 2019 },
    { motorista_id: 42, placa: 'IJK1234', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2022 },
    { motorista_id: 44, placa: 'LMN5678', modelo: 'Master', marca: 'Renault', ano: 2021 },
    { motorista_id: 46, placa: 'OPQ9012', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 48, placa: 'RST3456', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 50, placa: 'UVW7890', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 52, placa: 'XYZ1234', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2019 },
    { motorista_id: 54, placa: 'ABC5678', modelo: 'Master', marca: 'Renault', ano: 2022 },
    { motorista_id: 56, placa: 'DEF9012', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 58, placa: 'GHI3456', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 60, placa: 'JKL7890', modelo: 'Transit', marca: 'Ford', ano: 2021 },
    { motorista_id: 62, placa: 'MNO1A34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 64, placa: 'PQR5B78', modelo: 'Master', marca: 'Renault', ano: 2019 },
    { motorista_id: 66, placa: 'STU9C12', modelo: 'Ducato', marca: 'Fiat', ano: 2022 },
    { motorista_id: 68, placa: 'VWX3D56', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 70, placa: 'YZA7E90', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 72, placa: 'BCD1F34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 74, placa: 'EFG5G78', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 76, placa: 'HIJ9H12', modelo: 'Ducato', marca: 'Fiat', ano: 2019 },
    { motorista_id: 78, placa: 'KLM3I56', modelo: 'Daily', marca: 'Iveco', ano: 2022 },
    { motorista_id: 80, placa: 'NOP7J90', modelo: 'Transit', marca: 'Ford', ano: 2021 },
    { motorista_id: 82, placa: 'QRS1K34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 84, placa: 'TUV5L78', modelo: 'Master', marca: 'Renault', ano: 2021 },
    { motorista_id: 86, placa: 'WXY9M12', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 88, placa: 'ZAB3N56', modelo: 'Daily', marca: 'Iveco', ano: 2019 },
    { motorista_id: 90, placa: 'CDE7O90', modelo: 'Transit', marca: 'Ford', ano: 2022 },
    { motorista_id: 92, placa: 'FGH1P34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 94, placa: 'IJK5Q78', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 96, placa: 'LMN9R12', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 98, placa: 'OPQ3S56', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 100, placa: 'RST7T90', modelo: 'Transit', marca: 'Ford', ano: 2019 },
    { motorista_id: 2, placa: 'UVW1U34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2022 },
    { motorista_id: 4, placa: 'XYZ5V78', modelo: 'Master', marca: 'Renault', ano: 2021 },
    { motorista_id: 6, placa: 'AAA9W12', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 8, placa: 'BBB3X56', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 10, placa: 'CCC7Y90', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 12, placa: 'DDD1Z34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2019 },
    { motorista_id: 14, placa: 'EEE5A78', modelo: 'Master', marca: 'Renault', ano: 2022 },
    { motorista_id: 16, placa: 'FFF9B12', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 18, placa: 'GGG3C56', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 20, placa: 'HHH7D90', modelo: 'Transit', marca: 'Ford', ano: 2021 },
    { motorista_id: 22, placa: 'III1E34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 24, placa: 'JJJ5F78', modelo: 'Master', marca: 'Renault', ano: 2019 },
    { motorista_id: 26, placa: 'KKK9G12', modelo: 'Ducato', marca: 'Fiat', ano: 2022 },
    { motorista_id: 28, placa: 'LLL3H56', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 30, placa: 'MMM7I90', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 32, placa: 'NNN1J34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 34, placa: 'OOO5K78', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 36, placa: 'PPP9L12', modelo: 'Ducato', marca: 'Fiat', ano: 2019 },
    { motorista_id: 38, placa: 'QQQ3M56', modelo: 'Daily', marca: 'Iveco', ano: 2022 },
    { motorista_id: 40, placa: 'RRR7N90', modelo: 'Transit', marca: 'Ford', ano: 2021 },
    { motorista_id: 42, placa: 'SSS1O34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 44, placa: 'TTT5P78', modelo: 'Master', marca: 'Renault', ano: 2021 },
    { motorista_id: 46, placa: 'UUU9Q12', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 48, placa: 'VVV3R56', modelo: 'Daily', marca: 'Iveco', ano: 2019 },
    { motorista_id: 50, placa: 'WWW7S90', modelo: 'Transit', marca: 'Ford', ano: 2022 },
    { motorista_id: 52, placa: 'XXX1T34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 54, placa: 'YYY5U78', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 56, placa: 'ZZZ9V12', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 58, placa: 'AAB3W56', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 60, placa: 'BBC7X90', modelo: 'Transit', marca: 'Ford', ano: 2019 },
    { motorista_id: 62, placa: 'CCD1Y34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2022 },
    { motorista_id: 64, placa: 'DDE5Z78', modelo: 'Master', marca: 'Renault', ano: 2021 },
    { motorista_id: 66, placa: 'EEF9A12', modelo: 'Ducato', marca: 'Fiat', ano: 2020 },
    { motorista_id: 68, placa: 'FFG3B56', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 70, placa: 'GGH7C90', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 72, placa: 'HHI1D34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2019 },
    { motorista_id: 74, placa: 'IIJ5E78', modelo: 'Master', marca: 'Renault', ano: 2022 },
    { motorista_id: 76, placa: 'JJK9F12', modelo: 'Ducato', marca: 'Fiat', ano: 2021 },
    { motorista_id: 78, placa: 'KKL3G56', modelo: 'Daily', marca: 'Iveco', ano: 2020 },
    { motorista_id: 80, placa: 'LLM7H90', modelo: 'Transit', marca: 'Ford', ano: 2021 },
    { motorista_id: 82, placa: 'MMN1I34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2020 },
    { motorista_id: 84, placa: 'NNO5J78', modelo: 'Master', marca: 'Renault', ano: 2019 },
    { motorista_id: 86, placa: 'OOP9K12', modelo: 'Ducato', marca: 'Fiat', ano: 2022 },
    { motorista_id: 88, placa: 'PPQ3L56', modelo: 'Daily', marca: 'Iveco', ano: 2021 },
    { motorista_id: 90, placa: 'QQR7M90', modelo: 'Transit', marca: 'Ford', ano: 2020 },
    { motorista_id: 92, placa: 'RRS1N34', modelo: 'Sprinter', marca: 'Mercedes-Benz', ano: 2021 },
    { motorista_id: 94, placa: 'SST5O78', modelo: 'Master', marca: 'Renault', ano: 2020 },
    { motorista_id: 96, placa: 'TTU9P12', modelo: 'Ducato', marca: 'Fiat', ano: 2019 },
    { motorista_id: 98, placa: 'UUV3Q56', modelo: 'Daily', marca: 'Iveco', ano: 2022 },
    { motorista_id: 100, placa: 'VVW7R90', modelo: 'Transit', marca: 'Ford', ano: 2021 },
  ];

  await prisma.veiculo.createMany({ data: veiculos });
  console.log(`✅ ${veiculos.length} veículos criados.`);

  console.log('📦 Criando pedidos...');
  const pedidosData = [
    ['PED001', 1, 1500.00, 'Rua A, 100 - São Paulo, SP', 'PENDENTE'],
    ['PED002', 3, 2300.50, 'Av. B, 200 - Rio de Janeiro, RJ', 'EM_ROTA'],
    ['PED003', 5, 890.00, 'Rua C, 300 - Belo Horizonte, MG', 'ENTREGUE'],
    ['PED004', 7, 3200.75, 'Av. D, 400 - Curitiba, PR', 'PENDENTE'],
    ['PED005', 9, 1750.00, 'Rua E, 500 - Porto Alegre, RS', 'EM_ROTA'],
    ['PED006', 11, 4500.25, 'Av. F, 600 - Salvador, BA', 'CANCELADO'],
    ['PED007', 13, 2100.00, 'Rua G, 700 - Fortaleza, CE', 'ENTREGUE'],
    ['PED008', 15, 980.50, 'Av. H, 800 - Recife, PE', 'PENDENTE'],
    ['PED009', 17, 5600.00, 'Rua I, 900 - Brasília, DF', 'EM_ROTA'],
    ['PED010', 19, 1200.75, 'Av. J, 1000 - Manaus, AM', 'ENTREGUE'],
  ];

  const enderecos = [
    'Rua A, 100 - São Paulo, SP', 'Av. B, 200 - Rio de Janeiro, RJ', 'Rua C, 300 - Belo Horizonte, MG',
    'Av. D, 400 - Curitiba, PR', 'Rua E, 500 - Porto Alegre, RS', 'Av. F, 600 - Salvador, BA',
    'Rua G, 700 - Fortaleza, CE', 'Av. H, 800 - Recife, PE', 'Rua I, 900 - Brasília, DF',
    'Av. J, 1000 - Manaus, AM'
  ];

  const statusPedidos = ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADO'];
  const pedidos = [];

  for (let i = 1; i <= 100; i++) {
    const clienteId = ((i - 1) % 99) + 1;
    const valorBase = 890 + (i * 37.5);
    const statusIndex = (i - 1) % 4;
    
    pedidos.push({
      numero_pedido: `PED${String(i).padStart(3, '0')}`,
      cliente_id: clienteId,
      valor_total: valorBase,
      endereco_cliente: enderecos[(i - 1) % enderecos.length],
      status: statusPedidos[statusIndex]
    });
  }

  await prisma.pedido.createMany({ data: pedidos });
  console.log(`✅ ${pedidos.length} pedidos criados.`);

  console.log('🚚 Criando entregas...');
  const entregas = [];
  const statusEntregas = ['PENDENTE', 'EM_ROTA', 'ENTREGUE'];
  
  for (let i = 1; i <= 100; i++) {
    const motoristaId = ((i - 1) % 50) * 2 + 2;
    const veiculoId = ((i - 1) % 100) + 1;
    const statusIndex = (i - 1) % 3;
    const daysAgo = (i - 1) % 75 + 2;
    const deliveryDays = Math.max(daysAgo - 2, 0);
    
    entregas.push({
      pedido_id: i,
      motorista_id: motoristaId,
      veiculo_id: veiculoId,
      comprovante: statusIndex === 0 ? `comprovante_pendente_${String(i).padStart(3, '0')}.jpg` : `foto_entrega_${String(i).padStart(3, '0')}.jpg`,
      status: statusEntregas[statusIndex],
      atribuido_em: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      entregue_em: new Date(Date.now() - deliveryDays * 24 * 60 * 60 * 1000)
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