# API de Usuários - LogisTech

## Endpoints Disponíveis

### 1. Listar Usuários

**GET** `/api/usuarios`

Lista todos os usuários com informações de contadores.

**Query Parameters:**

- `funcao` (opcional): Filtrar por função (`ADMIN` ou `MOTORISTA`)
- `busca` (opcional): Buscar por nome, email ou telefone

**Resposta de Sucesso (200):**

```json
[
  {
    "id": 1,
    "nome": "Ana Silva",
    "email": "anasilva1@logistech.com",
    "telefone": "11987654321",
    "funcao": "ADMIN",
    "criado_em": "2025-11-18T10:30:00.000Z",
    "_count": {
      "veiculos": 0,
      "pedidos_cliente": 5,
      "entregas": 0
    }
  }
]
```

**Exemplo de Uso:**

```javascript
// Listar todos
const response = await fetch("/api/usuarios");

// Filtrar apenas motoristas
const response = await fetch("/api/usuarios?funcao=MOTORISTA");

// Buscar usuários
const response = await fetch("/api/usuarios?busca=joão");
```

---

### 2. Criar Usuário

**POST** `/api/usuarios`

Cria um novo usuário no sistema.

**Body (JSON):**

```json
{
  "nome": "João Silva",
  "email": "joao@logistech.com",
  "telefone": "11999999999",
  "senha": "senha123",
  "funcao": "MOTORISTA"
}
```

**Validações:**

- Todos os campos são obrigatórios
- Email deve ser válido e único
- Telefone deve ter no mínimo 10 dígitos e ser único
- Senha deve ter no mínimo 6 caracteres
- Função deve ser `ADMIN` ou `MOTORISTA`

**Resposta de Sucesso (201):**

```json
{
  "mensagem": "Usuário criado com sucesso",
  "usuario": {
    "id": 101,
    "nome": "João Silva",
    "email": "joao@logistech.com",
    "telefone": "11999999999",
    "funcao": "MOTORISTA",
    "criado_em": "2025-11-18T15:30:00.000Z"
  }
}
```

**Erros Possíveis:**

- `400`: Campos obrigatórios faltando ou inválidos
- `409`: Email ou telefone já cadastrado

---

### 3. Buscar Usuário por ID

**GET** `/api/usuarios/[id]`

Retorna detalhes completos de um usuário específico, incluindo veículos, pedidos e entregas.

**Resposta de Sucesso (200):**

```json
{
  "id": 2,
  "nome": "João Santos",
  "email": "joao.santos@logistech.com",
  "telefone": "11987654322",
  "funcao": "MOTORISTA",
  "criado_em": "2025-11-18T10:30:00.000Z",
  "veiculos": [
    {
      "id": 1,
      "placa": "ABC1234",
      "modelo": "Sprinter",
      "marca": "Mercedes-Benz",
      "ano": 2020
    }
  ],
  "pedidos_cliente": [],
  "entregas": [
    {
      "id": 1,
      "comprovante": "comprovante_001.jpg",
      "status": "ENTREGUE",
      "atribuido_em": "2025-11-16T10:00:00.000Z",
      "entregue_em": "2025-11-16T14:30:00.000Z",
      "pedido": {
        "numero_pedido": "PED001",
        "endereco_cliente": "Rua A, 100 - São Paulo, SP"
      },
      "veiculo": {
        "placa": "ABC1234",
        "modelo": "Sprinter"
      }
    }
  ]
}
```

**Erros Possíveis:**

- `400`: ID inválido
- `404`: Usuário não encontrado

---

### 4. Atualizar Usuário

**PUT** `/api/usuarios/[id]`

Atualiza informações de um usuário existente.

**Body (JSON):**

```json
{
  "nome": "João Silva Santos",
  "email": "joao.novo@logistech.com",
  "telefone": "11988888888",
  "senha": "novasenha123",
  "funcao": "ADMIN"
}
```

**Observações:**

- Todos os campos são opcionais (enviar apenas o que deseja atualizar)
- Email e telefone devem ser únicos (não podem estar em uso por outro usuário)
- Mesmas validações da criação aplicam-se aos campos enviados

**Resposta de Sucesso (200):**

```json
{
  "mensagem": "Usuário atualizado com sucesso",
  "usuario": {
    "id": 2,
    "nome": "João Silva Santos",
    "email": "joao.novo@logistech.com",
    "telefone": "11988888888",
    "funcao": "ADMIN",
    "criado_em": "2025-11-18T10:30:00.000Z"
  }
}
```

**Erros Possíveis:**

- `400`: Dados inválidos ou nenhum dado fornecido
- `404`: Usuário não encontrado
- `409`: Email ou telefone já em uso por outro usuário

---

### 5. Deletar Usuário

**DELETE** `/api/usuarios/[id]`

Remove um usuário do sistema.

**Restrições:**

- Não é possível deletar usuários com veículos, pedidos ou entregas associadas
- Primeiro deve-se remover ou reatribuir as relações

**Resposta de Sucesso (200):**

```json
{
  "mensagem": "Usuário deletado com sucesso"
}
```

**Erros Possíveis:**

- `400`: ID inválido
- `404`: Usuário não encontrado
- `409`: Usuário possui relações ativas (veículos, pedidos ou entregas)

**Exemplo de erro com relações:**

```json
{
  "erro": "Não é possível deletar usuário com veículos, pedidos ou entregas associadas",
  "detalhes": {
    "veiculos": 2,
    "pedidos": 5,
    "entregas": 10
  }
}
```

---

### 6. Estatísticas de Usuários

**GET** `/api/usuarios/estatisticas`

Retorna estatísticas gerais do sistema.

**Resposta de Sucesso (200):**

```json
{
  "usuarios": {
    "total": 100,
    "admins": 50,
    "motoristas": 50,
    "recentes_30_dias": 15
  },
  "sistema": {
    "veiculos": 100,
    "pedidos": 100,
    "entregas": 100
  },
  "entregas_por_status": {
    "pendente": 30,
    "em_rota": 25,
    "entregue": 45
  },
  "motoristas_mais_ativos": [
    {
      "id": 2,
      "nome": "João Santos",
      "email": "joao.santos@logistech.com",
      "total_entregas": 25
    }
  ]
}
```

---

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida (dados faltando ou inválidos)
- `401`: Não autorizado (para login)
- `404`: Recurso não encontrado
- `409`: Conflito (email/telefone duplicado ou relações ativas)
- `500`: Erro interno do servidor

## Segurança

- Senhas são criptografadas usando bcrypt com salt de 10 rounds
- Senhas nunca são retornadas nas respostas da API
- Validações robustas em todos os endpoints

## Exemplos de Uso no Frontend

```javascript
// Listar usuários
const getUsuarios = async () => {
  const res = await fetch("/api/usuarios");
  const data = await res.json();
  return data;
};

// Criar usuário
const criarUsuario = async (dados) => {
  const res = await fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return await res.json();
};

// Atualizar usuário
const atualizarUsuario = async (id, dados) => {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return await res.json();
};

// Deletar usuário
const deletarUsuario = async (id) => {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};

// Buscar estatísticas
const getEstatisticas = async () => {
  const res = await fetch("/api/usuarios/estatisticas");
  return await res.json();
};
```
