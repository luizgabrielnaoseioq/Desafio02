# 🍽️ API de Controle de Refeições

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Reference](#api-reference)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Sessões](#autenticação-e-sessões)
- [Validação de Dados](#validação-de-dados)
- [Tratamento de Erros](#tratamento-de-erros)
- [Desenvolvimento](#desenvolvimento)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

Esta é uma API RESTful desenvolvida em Node.js com TypeScript para gerenciamento de refeições e controle de dieta. A aplicação permite aos usuários registrar, visualizar, atualizar e deletar refeições, mantendo um controle sobre quais refeições estão dentro ou fora da dieta.

### Funcionalidades Principais

- ✅ **CRUD Completo de Refeições**: Criar, ler, atualizar e deletar refeições
- 🔐 **Sistema de Sessões**: Autenticação baseada em cookies para identificar usuários
- 📊 **Controle de Dieta**: Marcação de refeições como dentro ou fora da dieta
- 🗄️ **Persistência de Dados**: Banco SQLite com migrações automatizadas
- ✅ **Validação de Dados**: Validação robusta com Zod
- 🚀 **Performance**: Framework Fastify para alta performance

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem tipada
- **Fastify** - Framework web de alta performance
- **Knex.js** - Query builder para banco de dados
- **SQLite** - Banco de dados relacional
- **Zod** - Validação de schemas
- **dotenv** - Gerenciamento de variáveis de ambiente

### Desenvolvimento
- **ESLint** - Linting de código
- **tsx** - Executor TypeScript
- **@types/node** - Tipos para Node.js

## 🏗️ Arquitetura

### Padrão de Arquitetura
A aplicação segue o padrão **MVC (Model-View-Controller)** adaptado para APIs REST:

```
src/
├── routes/          # Controllers (Rotas e lógica de negócio)
├── middlewares/     # Middlewares (Autenticação, validação)
├── database/        # Model (Configuração do banco)
├── env/            # Configuração de ambiente
└── server.ts       # Ponto de entrada da aplicação
```

### Fluxo de Requisições
1. **Request** → Fastify Server
2. **Middleware** → Validação de sessão
3. **Route Handler** → Lógica de negócio
4. **Database** → Persistência de dados
5. **Response** → Retorno ao cliente

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd Desafio02
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
```

4. **Configure o arquivo .env**
```env
NODE_ENV=development
DATABASE_URL=./db/app.db
PORT=3333
```

5. **Execute as migrações do banco**
```bash
npm run knex migrate:latest
```

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3333`

## 📁 Estrutura do Projeto

```
Desafio02/
├── src/
│   ├── @types/                    # Definições de tipos TypeScript
│   │   └── knex.d.ts
│   ├── env/                       # Configuração de ambiente
│   │   └── index.ts
│   ├── middlewares/               # Middlewares da aplicação
│   │   └── check-sessions-id-exists.ts
│   ├── routes/                    # Rotas da API
│   │   └── meals.ts
│   ├── database.ts               # Configuração do banco de dados
│   └── server.ts                 # Ponto de entrada da aplicação
├── db/
│   ├── app.db                    # Banco de dados SQLite
│   └── migrations/               # Migrações do banco
│       ├── 20250728200545_create_meals.ts
│       ├── 20250729162200_add.ts
│       └── 20250729171307_remove-user-id-from-meals.ts
├── package.json                  # Dependências e scripts
├── knexfile.ts                  # Configuração do Knex
├── tsconfig.json                # Configuração TypeScript
└── README.md                    # Esta documentação
```

## 📚 API Reference

### Base URL
```
http://localhost:3333/meals
```

### Endpoints

#### 1. Listar Todas as Refeições
```http
GET /meals
```

**Headers:**
```
Cookie: sessionId=<session-id>
```

**Response (200):**
```json
{
  "meals": [
    {
      "id": "uuid",
      "name": "Café da manhã",
      "description": "Pão integral com ovo",
      "inside_diet": true,
      "session_id": "uuid",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Buscar Refeição por ID
```http
GET /meals/:id
```

**Headers:**
```
Cookie: sessionId=<session-id>
```

**Response (200):**
```json
{
  "meals": {
    "id": "uuid",
    "name": "Café da manhã",
    "description": "Pão integral com ovo",
    "inside_diet": true,
    "session_id": "uuid",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Criar Nova Refeição
```http
POST /meals
```

**Body:**
```json
{
  "name": "Café da manhã",
  "description": "Pão integral com ovo",
  "inside_diet": true
}
```

**Response (200):**
```
Meal create success!
```

**Headers (criados automaticamente):**
```
Set-Cookie: sessionId=<new-session-id>; Path=/; Max-Age=604800
```

#### 4. Atualizar Refeição
```http
PUT /meals/:id
```

**Headers:**
```
Cookie: sessionId=<session-id>
```

**Body:**
```json
{
  "name": "Café da manhã atualizado",
  "description": "Pão integral com ovo e café",
  "inside_diet": false
}
```

**Response (200):**
```
Meals updated
```

#### 5. Deletar Refeição
```http
DELETE /meals/:id
```

**Headers:**
```
Cookie: sessionId=<session-id>
```

**Response (200):**
```
Mels deleted success!
```

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 401 | Não autorizado (sessão inválida) |
| 404 | Refeição não encontrada |
| 500 | Erro interno do servidor |

## 🗄️ Banco de Dados

### Schema da Tabela `meals`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `name` | VARCHAR | Nome da refeição |
| `description` | TEXT | Descrição da refeição |
| `inside_diet` | BOOLEAN | Se está dentro da dieta |
| `session_id` | UUID | ID da sessão do usuário |
| `date` | TIMESTAMP | Data de criação (automática) |

### Migrações

A aplicação utiliza migrações para controle de versão do banco:

1. **20250728200545_create_meals.ts** - Criação da tabela inicial
2. **20250729162200_add.ts** - Adição do campo session_id
3. **20250729171307_remove-user-id-from-meals.ts** - Remoção do campo user_id

### Comandos de Migração

```bash
# Executar migrações pendentes
npm run knex migrate:latest

# Reverter última migração
npm run knex migrate:rollback

# Ver status das migrações
npm run knex migrate:status
```

## 🔐 Autenticação e Sessões

### Sistema de Sessões

A aplicação utiliza um sistema de sessões baseado em cookies para identificar usuários:

- **Criação**: Automaticamente na primeira requisição POST
- **Duração**: 7 dias (604800 segundos)
- **Escopo**: Aplicação inteira (`Path=/`)
- **Segurança**: Apenas sessões válidas podem acessar dados

### Middleware de Autenticação

O middleware `checkSessionIdExists` verifica a presença do cookie `sessionId` em todas as rotas protegidas.

```typescript
// Exemplo de middleware
export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.sessionId;
  
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized.",
    });
  }
}
```

## ✅ Validação de Dados

### Schemas Zod

A aplicação utiliza Zod para validação robusta de dados:

```typescript
// Schema para criação de refeição
const createMealsBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  inside_diet: z.boolean(),
});

// Schema para parâmetros de rota
const getMealsParamSchema = z.object({
  id: z.string().uuid(),
});
```

### Validações Implementadas

- ✅ **Nome**: String obrigatório
- ✅ **Descrição**: String obrigatório
- ✅ **Inside Diet**: Boolean obrigatório
- ✅ **ID**: UUID válido para operações específicas
- ✅ **Session ID**: Presença obrigatória em rotas protegidas

## ⚠️ Tratamento de Erros

### Estratégias de Tratamento

1. **Validação de Entrada**: Zod valida schemas antes do processamento
2. **Middleware de Autenticação**: Verifica sessão antes de acessar dados
3. **Try-Catch**: Tratamento de erros em operações críticas
4. **Logs**: Registro de requisições para debugging

### Exemplos de Resposta de Erro

```json
// 401 - Não autorizado
{
  "error": "Unauthorized."
}

// 404 - Não encontrado
"Item não encontrado"

// 500 - Erro interno
"Erro ao atualizar a refeição"
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```json
{
  "dev": "tsx watch src/server.ts",     // Desenvolvimento com hot reload
  "knex": "node --import tsx ./node_modules/knex/bin/cli.js"  // Comandos Knex
}
```

### Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Executar migrações
npm run knex migrate:latest

# Criar nova migração
npm run knex migrate:make nome_da_migracao

# Executar seeds (se existirem)
npm run knex seed:run
```

### Estrutura de Desenvolvimento

- **Hot Reload**: Alterações são refletidas automaticamente
- **TypeScript**: Tipagem estática para melhor DX
- **ESLint**: Linting automático de código
- **Logs**: Console logs para debugging

## 🚀 Deploy

### Variáveis de Ambiente de Produção

```env
NODE_ENV=production
DATABASE_URL=/path/to/production/database.db
PORT=3333
```

### Considerações de Deploy

1. **Banco de Dados**: Use PostgreSQL ou MySQL para produção
2. **Process Manager**: Utilize PM2 ou similar
3. **Reverse Proxy**: Nginx ou Apache
4. **SSL**: Certificado SSL para HTTPS
5. **Backup**: Estratégia de backup do banco

### Exemplo com PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start src/server.ts --name "meals-api"

# Monitorar
pm2 monit

# Logs
pm2 logs meals-api
```

## 🤝 Contribuição

### Padrões de Código

- **TypeScript**: Use tipagem explícita
- **ESLint**: Siga as regras configuradas
- **Commits**: Use conventional commits
- **Documentação**: Mantenha esta documentação atualizada

### Processo de Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Execute os testes
5. Abra um Pull Request

### Checklist de Qualidade

- [ ] Código segue padrões ESLint
- [ ] Tipos TypeScript estão corretos
- [ ] Validações Zod implementadas
- [ ] Tratamento de erros adequado
- [ ] Documentação atualizada
- [ ] Migrações testadas

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte os logs da aplicação
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando Node.js, TypeScript e Fastify**
