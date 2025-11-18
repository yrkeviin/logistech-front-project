# 🚚 LogisTech - Sistema de Gestão de Entregas

Sistema completo de gestão de entregas e logística desenvolvido com Next.js, Prisma e PostgreSQL.

## 📋 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Login de Administrador** (`/`) - Acesso ao painel administrativo
- **Login de Motorista** (`/login-motorista`) - Acesso ao portal do entregador

### 👨‍💼 Painel Administrativo

#### Gestão de Usuários (`/user`)
- ✅ Listar todos os usuários (Admin e Motoristas)
- ✅ Criar novo usuário com validação
- ✅ Editar usuário existente
- ✅ Visualizar detalhes completos (veículos, pedidos, entregas)
- ✅ Deletar usuário (com verificação de relações)
- ✅ Filtros por função (ADMIN/MOTORISTA)
- ✅ Busca por nome, email ou telefone

#### Gestão de Motoristas (`/motoristas`)
- ✅ CRUD completo de motoristas
- ✅ Visualização de veículos vinculados
- ✅ Visualização de entregas do motorista
- ✅ Validação antes de deletar (verifica veículos e entregas)
- ✅ Busca e filtros

#### Gestão de Entregas (`/entregas`)
- ✅ Listar todas as entregas com filtros
- ✅ **Atribuir entrega a motorista** (modal completo)
- ✅ Editar entrega (motorista, veículo, status)
- ✅ Visualizar detalhes completos da entrega
- ✅ Deletar entrega
- ✅ Filtros por status (PENDENTE, EM_ROTA, ENTREGUE)
- ✅ Filtro por motorista
- ✅ Busca por pedido, cliente, motorista ou placa

#### Dashboard Principal (`/home`)
- ✅ Estatísticas gerais do sistema
- ✅ Gráficos e métricas

### 🚛 Portal do Motorista

#### Minhas Entregas (`/minhas-entregas`)
- ✅ Listagem de todas as entregas do motorista
- ✅ Entregas ordenadas por prioridade (PENDENTE → EM_ROTA → ENTREGUE)
- ✅ Estatísticas em tempo real:
  - Total de entregas
  - Entregas do dia
  - Pendentes / Em Rota / Entregues
- ✅ Filtros por status
- ✅ Design responsivo e intuitivo

#### Detalhes da Entrega (`/entrega/[id]`)
- ✅ Informações completas do cliente (nome, telefone, email)
- ✅ Detalhes do pedido (número, valor, endereço)
- ✅ Link para Google Maps (abrir navegação GPS)
- ✅ Mapa simulado com localização
- ✅ Informações do veículo
- ✅ **Botões de atualização de status:**
  - 🚚 Iniciar Rota (PENDENTE → EM_ROTA)
  - ✅ Marcar como Entregue (EM_ROTA → ENTREGUE)
  - ⏮️ Voltar para Pendente
- ✅ **Modal de Prova de Entrega:**
  - 📸 Tirar foto ou anexar arquivo
  - Preview da imagem
  - Envio do comprovante

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── entregas/          # CRUD de entregas
│   │   ├── login/             # Autenticação
│   │   ├── pedidos/           # CRUD de pedidos
│   │   └── usuarios/          # CRUD de usuários
│   ├── entrega/[id]/          # Detalhe da entrega (Motorista)
│   ├── entregas/              # Gestão de entregas (Admin)
│   ├── home/                  # Dashboard (Admin)
│   ├── login-motorista/       # Login do motorista
│   ├── minhas-entregas/       # Lista de entregas (Motorista)
│   ├── motoristas/            # Gestão de motoristas (Admin)
│   └── user/                  # Gestão de usuários (Admin)
├── components/
│   ├── HeaderAdm/             # Header do administrador
│   ├── HeaderLogis/           # Header logística
│   └── HeaderMotorista/       # Header do motorista
└── prisma/
    ├── schema.prisma          # Schema do banco de dados
    └── seed.js                # Dados de exemplo
```

## 🎨 Design e UI

### Painel Administrativo
- Gradiente roxo moderno (#667eea → #764ba2)
- Cards com sombras e animações
- Modais com backdrop blur
- Tabelas responsivas
- Status badges coloridos
- Botões com hover effects

### Portal do Motorista
- Gradiente escuro (#2c3e50 → #34495e)
- Cards de estatísticas com ícones
- Layout otimizado para mobile
- Navegação intuitiva
- Botões de ação destacados

## 🔌 API Endpoints

### Entregas (`/api/entregas`)
- `GET` - Listar entregas (filtros: status, motorista_id, data)
- `POST` - Criar nova entrega
- `GET /:id` - Buscar entrega específica
- `PUT /:id` - Atualizar entrega
- `DELETE /:id` - Deletar entrega

### Usuários (`/api/usuarios`)
- `GET` - Listar usuários (filtro: funcao)
- `POST` - Criar usuário
- `GET /:id` - Buscar usuário (com relações)
- `PUT /:id` - Atualizar usuário
- `DELETE /:id` - Deletar usuário

### Pedidos (`/api/pedidos`)
- `GET` - Listar pedidos (filtros: status, cliente_id)
- `POST` - Criar pedido
- `GET /:id` - Buscar pedido
- `PUT /:id` - Atualizar pedido
- `DELETE /:id` - Deletar pedido

### Login (`/api/login`)
- `POST` - Autenticar usuário (email + senha)

## 🗄️ Banco de Dados

### Modelos Principais
- **Usuario** - Usuários do sistema (ADMIN/MOTORISTA)
- **Veiculo** - Veículos dos motoristas
- **Pedido** - Pedidos dos clientes
- **Entrega** - Entregas atribuídas aos motoristas

### Relações
- Usuario (MOTORISTA) → Veiculo (1:N)
- Usuario (MOTORISTA) → Entrega (1:N)
- Usuario (ADMIN/cliente) → Pedido (1:N)
- Pedido → Entrega (1:1)
- Veiculo → Entrega (1:N)

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
Arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:7777/logistech_db"
```

### 3. Executar Migrations
```bash
npx prisma migrate dev
```

### 4. Popular Banco de Dados
```bash
npx prisma db seed
```

### 5. Iniciar Servidor
```bash
npm run dev
```

## 👥 Usuários de Teste

### Administradores
- **Email:** anasilva1@logistech.com
- **Senha:** 123456

### Motoristas
- **Email:** joao.santos@logistech.com
- **Senha:** 123456

## 📱 Funcionalidades do Motorista

1. **Login** - Acesso exclusivo com validação de função
2. **Dashboard** - Estatísticas das entregas
3. **Lista de Entregas** - Ordenadas por prioridade
4. **Detalhes** - Informações completas + mapa
5. **Atualizar Status** - Workflow completo de entrega
6. **Comprovante** - Upload de foto da entrega

## 🎯 Workflow de Entrega

1. **Admin atribui entrega** → Status: PENDENTE
2. **Motorista inicia rota** → Status: EM_ROTA
3. **Motorista chega no local** → Tira foto do comprovante
4. **Envia comprovante** → Status: ENTREGUE

## 🔒 Segurança

- Senhas criptografadas com bcryptjs (10 salt rounds)
- Validação de dados em todos os endpoints
- Verificação de relações antes de deletar
- Autenticação via localStorage (client-side)
- Validação de função (ADMIN/MOTORISTA)

## 📊 Validações Implementadas

- Email único por usuário
- Telefone único por usuário
- Número de pedido único
- Veículo deve pertencer ao motorista
- Pedido não pode ter múltiplas entregas
- Validação de relações antes de deletar
- Campos obrigatórios em todos os formulários

## 🎨 Componentes Reutilizáveis

- **HeaderAdm** - Navegação do administrador
- **HeaderMotorista** - Navegação do motorista
- **Modais** - Create, Edit, View, Delete
- **Status Badges** - Indicadores visuais de status
- **Cards de Estatísticas** - Métricas em tempo real

## 📝 Próximas Melhorias Sugeridas

- [ ] Integração real com Google Maps API
- [ ] Upload real de imagens (AWS S3, Cloudinary)
- [ ] Notificações em tempo real (WebSockets)
- [ ] Histórico de alterações
- [ ] Relatórios em PDF
- [ ] Gráficos de performance
- [ ] Chat entre admin e motorista
- [ ] Geolocalização em tempo real
- [ ] Otimização de rotas
- [ ] Múltiplas entregas por rota

## 🛠️ Tecnologias Utilizadas

- **Next.js 16.0.1** - Framework React
- **React 19.2.0** - Biblioteca UI
- **Prisma 6.19.0** - ORM
- **PostgreSQL** - Banco de dados
- **bcryptjs** - Criptografia de senhas
- **CSS Modules** - Estilização

---

**Desenvolvido com ❤️ para LogisTech**
