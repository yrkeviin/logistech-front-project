# LogisTech - Sistema de Gestão de Entregas

Sistema web para gerenciamento de entregas e logística, desenvolvido com Next.js e Prisma.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router.
- **React 18** - Biblioteca para interfaces de usuário.
- **Prisma ORM** - Gerenciamento de modelos e migrations.
- **PostgreSQL** - Banco de dados relacional.
- **CSS Modules** - Estilização com escopo local.

## 📋 Objetivo do Sistema

### Área Administrativa
- Dashboard com estatísticas de entregas.
- Gestão de motoristas (criar, editar, visualizar, deletar).
- Gestão de entregas (atribuir, reatribuir, acompanhar status).
- Criação de veículos vinculados aos motoristas.

### Área do Motorista
- Visualização das entregas atribuídas.
- Atualização de status das entregas.
- Upload de comprovantes de entrega.
- Perfil do motorista.

## 🛠️ Configurações Necessárias

### Pré-requisitos
- Node.js 18+.
- PostgreSQL.
- npm ou pnpm.

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/yrkeviin/logistech-front-project.git
cd logistech-front-project
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/logistech_db"
```

4. **Configure o banco de dados**
```bash
# Gerar o client do Prisma
npx prisma generate

# Aplicar as migrations
npx prisma migrate dev

# (Opcional) Popular com dados de exemplo
npx prisma db seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse no navegador**
- Aplicação: [http://localhost:3000](http://localhost:3000).
- Prisma Studio: `npx prisma studio`

## 📁 Estrutura do Projeto

```
logistech-front-project/
├── prisma/
│   ├── schema.prisma      # Modelos do banco de dados
│   ├── seed.js            # Dados de exemplo
│   └── migrations/        # Histórico de migrations
├── public/
│   └── image/             # Imagens e logos
├── src/
│   ├── app/
│   │   ├── api/           # Rotas de API (REST)
│   │   │   ├── entregas/
│   │   │   ├── pedidos/
│   │   │   ├── usuarios/
│   │   │   └── veiculos/
│   │   ├── home/          # Dashboard admin
│   │   ├── entregas/      # Gestão de entregas
│   │   ├── motoristas/    # Gestão de motoristas
│   │   ├── minhas-entregas/   # Área do motorista
│   │   └── perfil-motorista/  # Perfil do motorista
│   └── components/
│       ├── HeaderAdm/     # Header administrativo
│       ├── HeaderMotorista/
│       └── ViewModal/     # Modal de visualização
└── package.json
```

## 🗄️ Modelos do Banco de Dados

- **Usuario** - Administradores e motoristas.
- **Veiculo** - Veículos vinculados aos motoristas.
- **Pedido** - Pedidos dos clientes.
- **Entrega** - Entregas atribuídas aos motoristas.

## 📝 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar em produção
```

## 👥 Autores

Desenvolvido por alunos do curso de Desenvolvimento de Sistemas 1.

## 📄 Licença

Este projeto é para fins educacionais.
