const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
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
    { nome: 'Juliana Almeida', email: 'juliana.almeida@logistech.com', telefone: '11987654371', funcao: 'ADMIN' },
    { nome: 'Bruno Andrade', email: 'bruno.andrade@logistech.com', telefone: '11987654331', funcao: 'MOTORISTA' },
{ nome: 'Ricardo Melo', email: 'ricardo.melo@logistech.com', telefone: '11987654332', funcao: 'MOTORISTA' },
{ nome: 'Diego Azevedo', email: 'diego.azevedo@logistech.com', telefone: '11987654333', funcao: 'MOTORISTA' },
{ nome: 'Paulo Moreira', email: 'paulo.moreira@logistech.com', telefone: '11987654334', funcao: 'MOTORISTA' },
{ nome: 'Fábio Cardoso', email: 'fabio.cardoso@logistech.com', telefone: '11987654335', funcao: 'MOTORISTA' },
{ nome: 'Leandro Teixeira', email: 'leandro.teixeira@logistech.com', telefone: '11987654336', funcao: 'MOTORISTA' },
{ nome: 'Marcelo Dias', email: 'marcelo.dias@logistech.com', telefone: '11987654337', funcao: 'MOTORISTA' },
{ nome: 'Alex Barbosa', email: 'alex.barbosa@logistech.com', telefone: '11987654338', funcao: 'MOTORISTA' },
{ nome: 'Eduardo Pinto', email: 'eduardo.pinto@logistech.com', telefone: '11987654339', funcao: 'MOTORISTA' },
{ nome: 'Jorge Nunes', email: 'jorge.nunes@logistech.com', telefone: '11987654340', funcao: 'MOTORISTA' },
{ nome: 'Márcio Ribeiro', email: 'marcio.ribeiro@logistech.com', telefone: '11987654341', funcao: 'MOTORISTA' },
{ nome: 'Vitor Gomes', email: 'vitor.gomes@logistech.com', telefone: '11987654342', funcao: 'MOTORISTA' },
{ nome: 'André Batista', email: 'andre.batista@logistech.com', telefone: '11987654343', funcao: 'MOTORISTA' },
{ nome: 'Renato Silva', email: 'renato.silva@logistech.com', telefone: '11987654344', funcao: 'MOTORISTA' },
{ nome: 'Sérgio Freitas', email: 'sergio.freitas@logistech.com', telefone: '11987654345', funcao: 'MOTORISTA' },
{ nome: 'Rafael Cunha', email: 'rafael.cunha@logistech.com', telefone: '11987654346', funcao: 'MOTORISTA' },
{ nome: 'Daniel Machado', email: 'daniel.machado@logistech.com', telefone: '11987654347', funcao: 'MOTORISTA' },
{ nome: 'Thiago Fonseca', email: 'thiago.fonseca@logistech.com', telefone: '11987654348', funcao: 'MOTORISTA' },
{ nome: 'Igor Carvalho', email: 'igor.carvalho@logistech.com', telefone: '11987654349', funcao: 'MOTORISTA' },
{ nome: 'Gustavo Rocha', email: 'gustavo.rocha@logistech.com', telefone: '11987654350', funcao: 'MOTORISTA' },
{ nome: 'Patrícia Ramos', email: 'patricia.ramos@logistech.com', telefone: '11987654351', funcao: 'ADMIN' },
{ nome: 'Vanessa Torres', email: 'vanessa.torres@logistech.com', telefone: '11987654352', funcao: 'ADMIN' },
{ nome: 'Simone Araújo', email: 'simone.araujo@logistech.com', telefone: '11987654353', funcao: 'ADMIN' },
{ nome: 'Natália Duarte', email: 'natalia.duarte@logistech.com', telefone: '11987654354', funcao: 'ADMIN' },
{ nome: 'Helena Castro', email: 'helena.castro@logistech.com', telefone: '11987654355', funcao: 'ADMIN' },
{ nome: 'Beatriz Faria', email: 'beatriz.faria@logistech.com', telefone: '11987654356', funcao: 'ADMIN' },
{ nome: 'Cláudia Rezende', email: 'claudia.rezende@logistech.com', telefone: '11987654357', funcao: 'ADMIN' },
{ nome: 'Tatiana Correia', email: 'tatiana.correia@logistech.com', telefone: '11987654358', funcao: 'ADMIN' },
{ nome: 'Elaine Moraes', email: 'elaine.moraes@logistech.com', telefone: '11987654359', funcao: 'ADMIN' },
{ nome: 'Carolina Mendes', email: 'carolina.mendes@logistech.com', telefone: '11987654360', funcao: 'ADMIN' },
{ nome: 'Hugo Almeida', email: 'hugo.almeida@logistech.com', telefone: '11987654361', funcao: 'MOTORISTA' },
{ nome: 'Rogério Matos', email: 'rogerio.matos@logistech.com', telefone: '11987654362', funcao: 'MOTORISTA' },
{ nome: 'Samuel Brito', email: 'samuel.brito@logistech.com', telefone: '11987654363', funcao: 'MOTORISTA' },
{ nome: 'Adriano Barros', email: 'adriano.barros@logistech.com', telefone: '11987654364', funcao: 'MOTORISTA' },
{ nome: 'Otávio Neves', email: 'otavio.neves@logistech.com', telefone: '11987654365', funcao: 'MOTORISTA' },
{ nome: 'Cláudio Rezende', email: 'claudio.rezende@logistech.com', telefone: '11987654366', funcao: 'MOTORISTA' },
{ nome: 'Ruan Castro', email: 'ruan.castro@logistech.com', telefone: '11987654367', funcao: 'MOTORISTA' },
{ nome: 'Mauro Assis', email: 'mauro.assis@logistech.com', telefone: '11987654368', funcao: 'MOTORISTA' },
{ nome: 'Jonas Figueiredo', email: 'jonas.figueiredo@logistech.com', telefone: '11987654369', funcao: 'MOTORISTA' },
{ nome: 'Enzo Pacheco', email: 'enzo.pacheco@logistech.com', telefone: '11987654370', funcao: 'MOTORISTA' },
{ nome: 'Robson Tavares', email: 'robson.tavares@logistech.com', telefone: '11987654371', funcao: 'MOTORISTA' },
{ nome: 'Elias Campos', email: 'elias.campos@logistech.com', telefone: '11987654372', funcao: 'MOTORISTA' },
{ nome: 'Valmir Siqueira', email: 'valmir.siqueira@logistech.com', telefone: '11987654373', funcao: 'MOTORISTA' },
{ nome: 'Nicolas Braga', email: 'nicolas.braga@logistech.com', telefone: '11987654374', funcao: 'MOTORISTA' },
{ nome: 'Ismael Porto', email: 'ismael.porto@logistech.com', telefone: '11987654375', funcao: 'MOTORISTA' },
{ nome: 'César Paiva', email: 'cesar.paiva@logistech.com', telefone: '11987654376', funcao: 'MOTORISTA' },
{ nome: 'Rafael Mendes', email: 'rafael.mendes@logistech.com', telefone: '11987654377', funcao: 'MOTORISTA' },
{ nome: 'Fabrício Queiroz', email: 'fabricio.queiroz@logistech.com', telefone: '11987654378', funcao: 'MOTORISTA' },
{ nome: 'Júlio Prado', email: 'julio.prado@logistech.com', telefone: '11987654379', funcao: 'MOTORISTA' },
{ nome: 'Wesley Cardozo', email: 'wesley.cardozo@logistech.com', telefone: '11987654380', funcao: 'MOTORISTA' },
{ nome: 'Alexandre Barcellos', email: 'alexandre.barcellos@logistech.com', telefone: '11987654381', funcao: 'MOTORISTA' },
{ nome: 'Mateus Guimarães', email: 'mateus.guimaraes@logistech.com', telefone: '11987654382', funcao: 'MOTORISTA' },
{ nome: 'Jean Correia', email: 'jean.correia@logistech.com', telefone: '11987654383', funcao: 'MOTORISTA' },
{ nome: 'Eder Lopes', email: 'eder.lopes@logistech.com', telefone: '11987654384', funcao: 'MOTORISTA' },
{ nome: 'Douglas Ventura', email: 'douglas.ventura@logistech.com', telefone: '11987654385', funcao: 'MOTORISTA' },
{ nome: 'Caio Farias', email: 'caio.farias@logistech.com', telefone: '11987654386', funcao: 'MOTORISTA' },
{ nome: 'Breno Antunes', email: 'breno.antunes@logistech.com', telefone: '11987654387', funcao: 'MOTORISTA' },
{ nome: 'Murilo Sampaio', email: 'murilo.sampaio@logistech.com', telefone: '11987654388', funcao: 'MOTORISTA' },
{ nome: 'Edson Araújo', email: 'edson.araujo@logistech.com', telefone: '11987654389', funcao: 'MOTORISTA' },
{ nome: 'Cristiano Novaes', email: 'cristiano.novaes@logistech.com', telefone: '11987654390', funcao: 'MOTORISTA' },
{ nome: 'Jonathan Vieira', email: 'jonathan.vieira@logistech.com', telefone: '11987654391', funcao: 'MOTORISTA' },
{ nome: 'Marcos Vinícius', email: 'marcos.vinicius@logistech.com', telefone: '11987654392', funcao: 'MOTORISTA' },
{ nome: 'Felipe Sales', email: 'felipe.sales@logistech.com', telefone: '11987654393', funcao: 'MOTORISTA' },
{ nome: 'Davi Silveira', email: 'davi.silveira@logistech.com', telefone: '11987654394', funcao: 'MOTORISTA' },
{ nome: 'Nathan Ribeiro', email: 'nathan.ribeiro@logistech.com', telefone: '11987654395', funcao: 'MOTORISTA' },
{ nome: 'Rodolfo Moura', email: 'rodolfo.moura@logistech.com', telefone: '11987654396', funcao: 'MOTORISTA' },
{ nome: 'Adriel Monteiro', email: 'adriel.monteiro@logistech.com', telefone: '11987654397', funcao: 'MOTORISTA' },
{ nome: 'Edgar Souza', email: 'edgar.souza@logistech.com', telefone: '11987654398', funcao: 'MOTORISTA' },
{ nome: 'Luiz Fernando', email: 'luiz.fernando@logistech.com', telefone: '11987654399', funcao: 'MOTORISTA' },
{ nome: 'Ariel Cunha', email: 'ariel.cunha@logistech.com', telefone: '11987654400', funcao: 'MOTORISTA' },
{ nome: 'Everton Dias', email: 'everton.dias@logistech.com', telefone: '11987654401', funcao: 'MOTORISTA' },
{ nome: 'Rian Barbosa', email: 'rian.barbosa@logistech.com', telefone: '11987654402', funcao: 'MOTORISTA' },
{ nome: 'Henrique Mattos', email: 'henrique.mattos@logistech.com', telefone: '11987654403', funcao: 'MOTORISTA' },
{ nome: 'Vanderson Reis', email: 'vanderson.reis@logistech.com', telefone: '11987654404', funcao: 'MOTORISTA' },
{ nome: 'Tiago Silveira', email: 'tiago.silveira@logistech.com', telefone: '11987654405', funcao: 'MOTORISTA' },
{ nome: 'Éverton Almeida', email: 'everton.almeida@logistech.com', telefone: '11987654406', funcao: 'MOTORISTA' },
{ nome: 'William Oliveira', email: 'william.oliveira@logistech.com', telefone: '11987654407', funcao: 'MOTORISTA' },
{ nome: 'Cristian Farias', email: 'cristian.farias@logistech.com', telefone: '11987654408', funcao: 'MOTORISTA' },
{ nome: 'Alex Sandro', email: 'alex.sandro@logistech.com', telefone: '11987654409', funcao: 'MOTORISTA' },
{ nome: 'Hugo Almeida', email: 'hugo.almeida@logistech.com', telefone: '11987654361', funcao: 'MOTORISTA' },
{ nome: 'Rogério Matos', email: 'rogerio.matos@logistech.com', telefone: '11987654362', funcao: 'MOTORISTA' },
{ nome: 'Samuel Brito', email: 'samuel.brito@logistech.com', telefone: '11987654363', funcao: 'MOTORISTA' },
{ nome: 'Adriano Barros', email: 'adriano.barros@logistech.com', telefone: '11987654364', funcao: 'MOTORISTA' },
{ nome: 'Otávio Neves', email: 'otavio.neves@logistech.com', telefone: '11987654365', funcao: 'MOTORISTA' },
{ nome: 'Cláudio Rezende', email: 'claudio.rezende@logistech.com', telefone: '11987654366', funcao: 'MOTORISTA' },
{ nome: 'Ruan Castro', email: 'ruan.castro@logistech.com', telefone: '11987654367', funcao: 'MOTORISTA' },
{ nome: 'Mauro Assis', email: 'mauro.assis@logistech.com', telefone: '11987654368', funcao: 'MOTORISTA' },
{ nome: 'Jonas Figueiredo', email: 'jonas.figueiredo@logistech.com', telefone: '11987654369', funcao: 'MOTORISTA' },
{ nome: 'Enzo Pacheco', email: 'enzo.pacheco@logistech.com', telefone: '11987654370', funcao: 'MOTORISTA' },
{ nome: 'Robson Tavares', email: 'robson.tavares@logistech.com', telefone: '11987654371', funcao: 'MOTORISTA' },
{ nome: 'Elias Campos', email: 'elias.campos@logistech.com', telefone: '11987654372', funcao: 'MOTORISTA' },
{ nome: 'Valmir Siqueira', email: 'valmir.siqueira@logistech.com', telefone: '11987654373', funcao: 'MOTORISTA' },
{ nome: 'Nicolas Braga', email: 'nicolas.braga@logistech.com', telefone: '11987654374', funcao: 'MOTORISTA' },
{ nome: 'Ismael Porto', email: 'ismael.porto@logistech.com', telefone: '11987654375', funcao: 'MOTORISTA' },
{ nome: 'César Paiva', email: 'cesar.paiva@logistech.com', telefone: '11987654376', funcao: 'MOTORISTA' },
{ nome: 'Rafael Mendes', email: 'rafael.mendes@logistech.com', telefone: '11987654377', funcao: 'MOTORISTA' },
{ nome: 'Fabrício Queiroz', email: 'fabricio.queiroz@logistech.com', telefone: '11987654378', funcao: 'MOTORISTA' },
{ nome: 'Júlio Prado', email: 'julio.prado@logistech.com', telefone: '11987654379', funcao: 'MOTORISTA' },
{ nome: 'Wesley Cardozo', email: 'wesley.cardozo@logistech.com', telefone: '11987654380', funcao: 'MOTORISTA' },
{ nome: 'Alexandre Barcellos', email: 'alexandre.barcellos@logistech.com', telefone: '11987654381', funcao: 'MOTORISTA' },
{ nome: 'Mateus Guimarães', email: 'mateus.guimaraes@logistech.com', telefone: '11987654382', funcao: 'MOTORISTA' },
{ nome: 'Jean Correia', email: 'jean.correia@logistech.com', telefone: '11987654383', funcao: 'MOTORISTA' },
{ nome: 'Eder Lopes', email: 'eder.lopes@logistech.com', telefone: '11987654384', funcao: 'MOTORISTA' },
{ nome: 'Douglas Ventura', email: 'douglas.ventura@logistech.com', telefone: '11987654385', funcao: 'MOTORISTA' },
{ nome: 'Caio Farias', email: 'caio.farias@logistech.com', telefone: '11987654386', funcao: 'MOTORISTA' },
{ nome: 'Breno Antunes', email: 'breno.antunes@logistech.com', telefone: '11987654387', funcao: 'MOTORISTA' },
{ nome: 'Murilo Sampaio', email: 'murilo.sampaio@logistech.com', telefone: '11987654388', funcao: 'MOTORISTA' },
{ nome: 'Edson Araújo', email: 'edson.araujo@logistech.com', telefone: '11987654389', funcao: 'MOTORISTA' },
{ nome: 'Cristiano Novaes', email: 'cristiano.novaes@logistech.com', telefone: '11987654390', funcao: 'MOTORISTA' },
{ nome: 'Jonathan Vieira', email: 'jonathan.vieira@logistech.com', telefone: '11987654391', funcao: 'MOTORISTA' },
{ nome: 'Marcos Vinícius', email: 'marcos.vinicius@logistech.com', telefone: '11987654392', funcao: 'MOTORISTA' },
{ nome: 'Felipe Sales', email: 'felipe.sales@logistech.com', telefone: '11987654393', funcao: 'MOTORISTA' },
{ nome: 'Davi Silveira', email: 'davi.silveira@logistech.com', telefone: '11987654394', funcao: 'MOTORISTA' },
{ nome: 'Nathan Ribeiro', email: 'nathan.ribeiro@logistech.com', telefone: '11987654395', funcao: 'MOTORISTA' },
{ nome: 'Rodolfo Moura', email: 'rodolfo.moura@logistech.com', telefone: '11987654396', funcao: 'MOTORISTA' },
{ nome: 'Adriel Monteiro', email: 'adriel.monteiro@logistech.com', telefone: '11987654397', funcao: 'MOTORISTA' },
{ nome: 'Edgar Souza', email: 'edgar.souza@logistech.com', telefone: '11987654398', funcao: 'MOTORISTA' },
{ nome: 'Luiz Fernando', email: 'luiz.fernando@logistech.com', telefone: '11987654399', funcao: 'MOTORISTA' },
{ nome: 'Ariel Cunha', email: 'ariel.cunha@logistech.com', telefone: '11987654400', funcao: 'MOTORISTA' },
{ nome: 'Everton Dias', email: 'everton.dias@logistech.com', telefone: '11987654401', funcao: 'MOTORISTA' },
{ nome: 'Rian Barbosa', email: 'rian.barbosa@logistech.com', telefone: '11987654402', funcao: 'MOTORISTA' },
{ nome: 'Henrique Mattos', email: 'henrique.mattos@logistech.com', telefone: '11987654403', funcao: 'MOTORISTA' },
{ nome: 'Vanderson Reis', email: 'vanderson.reis@logistech.com', telefone: '11987654404', funcao: 'MOTORISTA' },
{ nome: 'Tiago Silveira', email: 'tiago.silveira@logistech.com', telefone: '11987654405', funcao: 'MOTORISTA' },
{ nome: 'Éverton Almeida', email: 'everton.almeida@logistech.com', telefone: '11987654406', funcao: 'MOTORISTA' },
{ nome: 'William Oliveira', email: 'william.oliveira@logistech.com', telefone: '11987654407', funcao: 'MOTORISTA' },
{ nome: 'Cristian Farias', email: 'cristian.farias@logistech.com', telefone: '11987654408', funcao: 'MOTORISTA' },
{ nome: 'Alex Sandro', email: 'alex.sandro@logistech.com', telefone: '11987654409', funcao: 'MOTORISTA' }
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
