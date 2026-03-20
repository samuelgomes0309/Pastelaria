# 📖 CONTEXTO TÉCNICO — Pastelaria API

Documento de referência técnica do backend do sistema de gestão para pastelarias. Descreve a arquitetura, modelagem de dados, regras de negócio, fluxos e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Modelagem de Dados](#-modelagem-de-dados)
- [Regras de Negócio](#-regras-de-negócio)
- [Sistema de Autenticação](#-sistema-de-autenticação)
- [Sistema de Autorização (RBAC)](#-sistema-de-autorização-rbac)
- [Módulos do Sistema](#-módulos-do-sistema)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **Pastelaria Backend** é uma API REST para gestão completa de uma pastelaria. O sistema cobre desde o cadastro e autenticação de funcionários até o controle detalhado de categorias, produtos com imagens, adicionais (opcionais), pedidos por mesa e gerenciamento de itens dos pedidos. Implementa controle de acesso baseado em papéis (RBAC) com dois níveis: **ADMIN** e **STAFF**.

### Domínios da aplicação

| Domínio        | Responsabilidade                                                                        |
| -------------- | --------------------------------------------------------------------------------------- |
| **Usuários**   | Cadastro, autenticação, consulta de perfil e gerenciamento de papéis (roles)            |
| **Categorias** | CRUD de categorias de produtos com proteção de exclusão por pedidos vinculados          |
| **Produtos**   | CRUD de produtos com upload de imagens via Cloudinary, vínculo a categorias e opcionais |
| **Opcionais**  | Cadastro e listagem de itens adicionais que podem ser vinculados a produtos             |
| **Pedidos**    | Criação de pedidos por mesa, adição/remoção de itens, envio e finalização               |

---

## 🚀 Stack Tecnológica

| Camada         | Tecnologia         | Versão | Papel                                               |
| -------------- | ------------------ | ------ | --------------------------------------------------- |
| Runtime        | Node.js            | 18+    | Ambiente de execução                                |
| Linguagem      | TypeScript         | 5.9    | Tipagem estática e segurança em desenvolvimento     |
| Framework HTTP | Express            | 5.2.1  | Roteamento e middlewares                            |
| ORM            | Prisma             | 7      | Acesso ao banco, migrations e client tipado         |
| DB Adapter     | @prisma/adapter-pg | 7      | Adaptador PostgreSQL nativo para Prisma             |
| Banco de Dados | PostgreSQL         | latest | Persistência relacional                             |
| Autenticação   | jsonwebtoken       | 9.0.3  | Geração e verificação de tokens JWT                 |
| Hash de senhas | bcryptjs           | 3.0.3  | Criptografia segura de senhas (salt 8)              |
| Validação      | Zod                | 4.3.5  | Validação de schemas de request (body/params/query) |
| Upload         | Multer             | 2.0.2  | Upload de arquivos (imagens) em memória             |
| Cloud Storage  | Cloudinary         | 2.9.0  | Armazenamento de imagens de produtos na nuvem       |
| CORS           | cors               | 2.8.5  | Liberação de origens cruzadas                       |
| Env vars       | dotenv             | 17.2.3 | Carregamento do arquivo `.env`                      |
| Console        | colors             | 1.4.0  | Colorização de logs no terminal                     |
| Dev Runner     | tsx                | 4.21.0 | Execução de TypeScript com watch mode               |

---

## 🏗️ Arquitetura

### Padrão de Camadas

O projeto segue uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────────────────────┐
│                     HTTP Request                    │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                   routes.ts                         │
│  Centraliza e delega para rotas específicas         │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│            Rotas específicas (*.routes.ts)           │
│  Aplica middlewares: isAuthenticated, isAdmin,       │
│  validateSchema + multer (upload)                    │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                   Controller                        │
│  Extrai dados do request (body/query/params/file)   │
│  Chama o Service e retorna a resposta HTTP          │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                    Service                          │
│  Toda a regra de negócio fica aqui                  │
│  Validações, cálculos e operações no banco          │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                 PrismaClient                        │
│  Acesso ao banco de dados PostgreSQL                │
│  (via @prisma/adapter-pg)                           │
└─────────────────────────────────────────────────────┘
```

### Fluxo de Middlewares nas Rotas

```
Request → validateSchema (Zod) → isAuthenticated (JWT) → isAdmin (Role) → Controller → Service → DB
```

Nem todas as rotas aplicam todos os middlewares. A composição varia:

| Tipo de rota                                       | Middlewares aplicados                                       |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Rotas públicas (POST /users, POST /sessions)       | `validateSchema`                                            |
| Rotas autenticadas (GET /me, GET /categories)      | `isAuthenticated`                                           |
| Rotas admin (POST /categories, DELETE /categories) | `isAuthenticated` → `isAdmin` → `validateSchema`            |
| Rotas com upload (POST /products, PUT /products)   | `isAuthenticated` → `isAdmin` → `multer` → `validateSchema` |

### Validação de Requests com Zod

Todas as rotas que recebem dados (body, params ou query) são validadas via middleware `validateSchema` usando schemas Zod. Os schemas estão centralizados na pasta `src/schemas/` e validam a estrutura completa do request:

```typescript
// Exemplo de schema
export const createUserSchema = z.object({
	body: z.object({
		name: z.string().min(3),
		email: z.email(),
		password: z.string().min(6),
	}),
});
```

O middleware retorna erros de validação no formato:

```json
{
	"message": "Validation failed",
	"details": [
		{
			"field": "body.name",
			"message": "Name must be at least 3 characters long"
		}
	]
}
```

### Tratamento Global de Erros

Todos os erros de regra de negócio são lançados com `throw new Error("mensagem")` dentro dos Services. O middleware global em `server.ts` os captura e retorna a resposta padronizada:

```typescript
app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
	if (error instanceof Error) {
		return res.status(400).json({ error: error.message });
	}
	return res.status(500).json({ error: "Internal server error" });
});
```

### Upload de Imagens

O sistema utiliza **Multer** (armazenamento em memória) + **Cloudinary** para upload de imagens de produtos:

1. Multer recebe o arquivo em memória (buffer) com limite de 5MB
2. Apenas tipos `image/jpeg`, `image/png` e `image/gif` são aceitos
3. O buffer é convertido em stream e enviado ao Cloudinary via `upload_stream`
4. A URL segura (`secure_url`) retornada pelo Cloudinary é salva no campo `bannerUrl` do produto

```typescript
// Configuração do Multer
storage: multer.memoryStorage(),
limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
fileFilter: allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"]
```

---

## 🗄️ Modelagem de Dados

### Diagrama de Relacionamento

```
┌──────────────────────────┐
│          users           │
├──────────────────────────┤
│ id        UUID (PK)      │
│ name      String         │
│ email     String (UQ)    │
│ password  String         │
│ role      Enum (ADMIN|   │
│           STAFF)         │
│ isRoot    Boolean        │
│ createdAt DateTime       │
│ updatedAt DateTime       │
└──────────────────────────┘

┌──────────────────────────┐       ┌──────────────────────────────┐
│       categories         │       │          products            │
├──────────────────────────┤       ├──────────────────────────────┤
│ id          UUID (PK)    │◄──┐   │ id          UUID (PK)        │
│ name        String       │   │   │ name        String           │
│ description String?      │   └───│ category_id UUID (FK)        │
│ createdAt   DateTime     │       │ description String           │
│ updatedAt   DateTime     │       │ price       Int              │
└──────────────────────────┘       │ bannerUrl   String           │
                                   │ disabled    Boolean          │
                                   │ createdAt   DateTime         │
                                   │ updatedAt   DateTime         │
                                   └──────┬───────────────────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
               ┌──────────▼──────┐  ┌─────▼─────────────────────┐
               │  items_orders   │  │  products_optionals       │
               ├─────────────────┤  ├───────────────────────────┤
               │ id    UUID (PK) │  │ id          UUID (PK)     │
               │ amount Int      │  │ product_id  UUID (FK)     │
               │ order_id  (FK)  │  │ optional_id UUID (FK)     │
               │ product_id(FK)  │  │ disabled    Boolean       │
               └────────┬────────┘  │ createdAt   DateTime      │
                        │           │ updatedAt   DateTime      │
                        │           └──────┬────────────────────┘
                        │                  │
               ┌────────▼────────┐         │
               │items_optionals  │─────────┘
               ├─────────────────┤
               │ id         (PK) │
               │ items_order_id  │
               │ product_optional│
               │ _id        (FK) │
               └─────────────────┘

┌──────────────────────────┐       ┌──────────────────────────────┐
│        optionals         │       │           orders             │
├──────────────────────────┤       ├──────────────────────────────┤
│ id    UUID (PK)          │       │ id      UUID (PK)            │
│ name  String (UQ)        │       │ table   Int                  │
│ price Int                │       │ status  Boolean              │
│ createdAt DateTime       │       │ draft   Boolean              │
│ updatedAt DateTime       │       │ name    String?              │
└──────────────────────────┘       │ createdAt DateTime           │
                                   │ updatedAt DateTime           │
                                   └──────────────────────────────┘
```

**Relacionamentos:**

- Uma categoria possui zero ou mais produtos (`1:N`, cascade delete)
- Um produto pertence a uma categoria (`N:1`)
- Um produto possui zero ou mais vínculos com opcionais via `products_optionals` (`N:N`)
- Um opcional possui zero ou mais vínculos com produtos via `products_optionals` (`N:N`)
- Um pedido possui zero ou mais itens (`1:N`, cascade delete)
- Um item de pedido pertence a um pedido e a um produto (`N:1` para ambos)
- Um item de pedido pode ter zero ou mais itens opcionais via `items_optionals`
- Um item opcional vincula um `items_order` a um `products_optionals`

### Tabela `users`

| Campo       | Tipo     | Constraints             | Descrição                                                 |
| ----------- | -------- | ----------------------- | --------------------------------------------------------- |
| `id`        | String   | PK, UUID, auto          | Identificador único gerado automaticamente                |
| `name`      | String   | NOT NULL                | Nome do funcionário                                       |
| `email`     | String   | NOT NULL, UNIQUE        | Email — chave de autenticação                             |
| `password`  | String   | NOT NULL                | Senha armazenada como **hash bcrypt** (salt: 8)           |
| `role`      | Enum     | NOT NULL, default STAFF | Papel do usuário: `ADMIN` ou `STAFF`                      |
| `isRoot`    | Boolean  | NOT NULL, default false | Se é o primeiro usuário cadastrado (admin raiz, imutável) |
| `createdAt` | DateTime | default now()           | Data de criação do registro                               |
| `updatedAt` | DateTime | @updatedAt              | Data da última atualização                                |

### Tabela `categories`

| Campo         | Tipo     | Constraints    | Descrição                                  |
| ------------- | -------- | -------------- | ------------------------------------------ |
| `id`          | String   | PK, UUID, auto | Identificador único gerado automaticamente |
| `name`        | String   | NOT NULL       | Nome da categoria                          |
| `description` | String?  | NULLABLE       | Descrição da categoria (opcional)          |
| `createdAt`   | DateTime | default now()  | Data de criação do registro                |
| `updatedAt`   | DateTime | @updatedAt     | Data da última atualização                 |

### Tabela `products`

| Campo         | Tipo     | Constraints             | Descrição                                  |
| ------------- | -------- | ----------------------- | ------------------------------------------ |
| `id`          | String   | PK, UUID, auto          | Identificador único gerado automaticamente |
| `name`        | String   | NOT NULL                | Nome do produto                            |
| `description` | String   | NOT NULL                | Descrição do produto                       |
| `price`       | Int      | NOT NULL                | Preço do produto (em centavos)             |
| `bannerUrl`   | String   | NOT NULL                | URL da imagem no Cloudinary                |
| `disabled`    | Boolean  | NOT NULL, default false | Se o produto está desabilitado             |
| `category_id` | String   | FK → categories.id      | Vínculo com a categoria (cascade delete)   |
| `createdAt`   | DateTime | default now()           | Data de criação do registro                |
| `updatedAt`   | DateTime | @updatedAt              | Data da última atualização                 |

### Tabela `optionals`

| Campo       | Tipo     | Constraints      | Descrição                                  |
| ----------- | -------- | ---------------- | ------------------------------------------ |
| `id`        | String   | PK, UUID, auto   | Identificador único gerado automaticamente |
| `name`      | String   | NOT NULL, UNIQUE | Nome do adicional (único no sistema)       |
| `price`     | Int      | NOT NULL         | Preço do adicional (em centavos)           |
| `createdAt` | DateTime | default now()    | Data de criação do registro                |
| `updatedAt` | DateTime | @updatedAt       | Data da última atualização                 |

### Tabela `products_optionals` (intermediária N:N)

| Campo         | Tipo     | Constraints             | Descrição                                  |
| ------------- | -------- | ----------------------- | ------------------------------------------ |
| `id`          | String   | PK, UUID, auto          | Identificador único gerado automaticamente |
| `product_id`  | String?  | FK → products.id        | Vínculo com o produto                      |
| `optional_id` | String?  | FK → optionals.id       | Vínculo com o adicional                    |
| `disabled`    | Boolean  | NOT NULL, default false | Se o vínculo está desabilitado             |
| `createdAt`   | DateTime | default now()           | Data de criação do registro                |
| `updatedAt`   | DateTime | @updatedAt              | Data da última atualização                 |

> Constraint: `@@unique([product_id, optional_id])` — um produto não pode ter o mesmo opcional vinculado duas vezes.

### Tabela `orders`

| Campo       | Tipo     | Constraints             | Descrição                                       |
| ----------- | -------- | ----------------------- | ----------------------------------------------- |
| `id`        | String   | PK, UUID, auto          | Identificador único gerado automaticamente      |
| `table`     | Int      | NOT NULL                | Número da mesa                                  |
| `status`    | Boolean  | NOT NULL, default false | Se o pedido foi finalizado (`true` = concluído) |
| `draft`     | Boolean  | NOT NULL, default true  | Se o pedido é rascunho (`true` = não enviado)   |
| `name`      | String?  | NULLABLE                | Nome do cliente (opcional)                      |
| `createdAt` | DateTime | default now()           | Data de criação do registro                     |
| `updatedAt` | DateTime | @updatedAt              | Data da última atualização                      |

### Tabela `items_orders`

| Campo        | Tipo     | Constraints                | Descrição                                  |
| ------------ | -------- | -------------------------- | ------------------------------------------ |
| `id`         | String   | PK, UUID, auto             | Identificador único gerado automaticamente |
| `amount`     | Int      | NOT NULL                   | Quantidade do produto no pedido            |
| `order_id`   | String   | FK → orders.id (cascade)   | Vínculo com o pedido                       |
| `product_id` | String   | FK → products.id (cascade) | Vínculo com o produto                      |
| `createdAt`  | DateTime | default now()              | Data de criação do registro                |
| `updatedAt`  | DateTime | @updatedAt                 | Data da última atualização                 |

### Tabela `items_optionals`

| Campo                 | Tipo     | Constraints                          | Descrição                                  |
| --------------------- | -------- | ------------------------------------ | ------------------------------------------ |
| `id`                  | String   | PK, UUID, auto                       | Identificador único gerado automaticamente |
| `items_order_id`      | String   | FK → items_orders.id (cascade)       | Vínculo com o item do pedido               |
| `product_optional_id` | String   | FK → products_optionals.id (cascade) | Vínculo com o opcional do produto          |
| `createdAt`           | DateTime | default now()                        | Data de criação do registro                |
| `updatedAt`           | DateTime | @updatedAt                           | Data da última atualização                 |

---

## 📐 Regras de Negócio

### Cadastro de Usuário

- Os campos `name`, `email` e `password` são obrigatórios
- `name` deve ter no mínimo 3 caracteres
- `email` deve ser um email válido e único no sistema
- `password` deve ter no mínimo 6 caracteres
- A senha é hasheada com `bcryptjs` antes de ser persistida (salt: 8)
- O **primeiro usuário** cadastrado no sistema automaticamente recebe o papel `ADMIN` e a flag `isRoot = true`
- Usuários subsequentes recebem o papel `STAFF` por padrão
- A verificação e criação usam transação (`$transaction`) para garantir atomicidade

### Autenticação

- Login realizado com `email` + `password`
- Senha comparada com o hash armazenado via `bcrypt.compare`
- Em caso de email não encontrado ou senha incorreta, a mensagem retornada é sempre a mesma (`"Email or password incorrect"`) — evita enumeração de usuários
- Token JWT gerado com validade de **30 dias**, assinado com `JWT_SECRET`
- Payload do token: `{ name, email, role, sub: user_id }`

### Gerenciamento de Papéis (Roles)

- Apenas administradores (`ADMIN`) podem alterar o papel de outros usuários
- Um usuário **não pode** alterar seu próprio papel
- O usuário **root** (primeiro cadastrado, `isRoot = true`) não pode ter seu papel alterado por ninguém
- Não é permitido alterar para o mesmo papel que o usuário já possui

### Categorias

- O nome é obrigatório (mínimo 3 caracteres), a descrição é opcional
- Apenas `ADMIN` pode criar, atualizar ou remover categorias
- Qualquer usuário autenticado pode listar e visualizar detalhes de categorias
- Uma categoria **não pode ser removida** se existirem pedidos (`orders`) com produtos vinculados a ela
- A exclusão de uma categoria remove em cascata todos os produtos associados (cascade delete no Prisma)
- Categorias são listadas em ordem decrescente de criação (mais recentes primeiro)

### Produtos

- Os campos `name`, `price`, `description`, `category_id` e `file` (imagem) são obrigatórios na criação
- O `price` é enviado como string no body (validação Zod com regex numérico) e convertido para `Int` no service
- Apenas `ADMIN` pode criar, atualizar status ou vincular/desvincular opcionais
- A imagem é obrigatória na criação e opcional na atualização
- Ao desabilitar um produto (`disabled = true`), todos os seus vínculos com opcionais também são desabilitados
- Ao reabilitar um produto, os vínculos com opcionais também são reabilitados
- Produtos podem ser listados por categoria e filtrados por status (`disabled`)
- Produtos incluem seus opcionais vinculados (não desabilitados) no detalhe

### Opcionais (Adicionais)

- Os campos `name` e `price` são obrigatórios
- O nome do opcional deve ser **único** no sistema
- Apenas `ADMIN` pode criar opcionais
- Qualquer usuário autenticado pode listar e visualizar detalhes
- Opcionais são listados em ordem decrescente de criação

### Pedidos

- O número da mesa (`table`) é obrigatório (mínimo 1), o nome do cliente é opcional
- Um pedido é criado como **rascunho** (`draft = true`, `status = false`)
- **Fluxo do pedido:** `Rascunho (draft)` → `Enviado (draft=false)` → `Finalizado (status=true)`
- Ao adicionar um produto ao pedido:
  - Se o mesmo produto (com o mesmo opcional) já existe no pedido, a **quantidade é incrementada**
  - Caso contrário, um novo item é criado
  - A operação usa transação para garantir consistência
- Um pedido só pode ser **enviado** se não estiver vazio (ter pelo menos 1 item) e ainda for rascunho
- Um pedido só pode ser **finalizado** se já tiver sido enviado (`draft = false`) e não estiver finalizado (`status = false`)
- Pedidos são listados filtrados por status (finalizados ou não), excluindo rascunhos
- A remoção de um pedido deleta em cascata todos os seus itens e itens opcionais

---

## 🔐 Sistema de Autenticação

### Fluxo Completo

```
1. Cliente: POST /sessions { email, password }
      │
2. AuthUserService: verifica email no banco
      │
3. AuthUserService: compara senha com bcrypt.compare
      │
4. AuthUserService: gera JWT (sub = user_id, role, exp = 30d)
      │
5. Resposta: { id, name, email, role, token }
      │
6. Próximas requisições: Authorization: Bearer <token>
      │
7. isAuthenticated: verify(token, JWT_SECRET)
      │
8. isAuthenticated: injeta req.user_id = sub, req.role = role
      │
9. Controller → Service: usa req.user_id e req.role conforme necessário
```

### Middleware `isAuthenticated`

Localizado em `src/middlewares/isAuthenticated.ts`. Aplicado em todas as rotas privadas:

```typescript
const authToken = req.headers.authorization;
if (!authToken) {
	return res.status(401).json({ error: "Token missing" });
}

const [, token] = authToken.split(" ");

try {
	const { sub, role } = verify(token, process.env.JWT_SECRET!) as Payload;
	req.user_id = sub;
	req.role = role;
	return next();
} catch (error) {
	return res.status(401).json({ error: "Invalid token" });
}
```

A interface `Request` do Express é extendida em `src/@types/express/index.d.ts` para incluir `user_id` e `role`:

```typescript
declare namespace Express {
	export interface Request {
		user_id: string;
		role: "ADMIN" | "STAFF";
	}
}
```

---

## 🛡️ Sistema de Autorização (RBAC)

### Papéis

| Papel   | Descrição                                                                          |
| ------- | ---------------------------------------------------------------------------------- |
| `ADMIN` | Acesso total: CRUD de categorias, produtos, opcionais + gerenciamento de roles     |
| `STAFF` | Acesso limitado: visualização de categorias/produtos/opcionais + gestão de pedidos |

### Middleware `isAdmin`

Localizado em `src/middlewares/isAdmin.ts`. Aplicado após `isAuthenticated` nas rotas administrativas:

```typescript
if (req.role !== "ADMIN") {
	return res.status(403).json({ error: "Insufficient permissions" });
}
return next();
```

### Matriz de Permissões

| Recurso              | ADMIN | STAFF |
| -------------------- | ----- | ----- |
| Criar usuário        | ✅    | ✅    |
| Login                | ✅    | ✅    |
| Ver perfil           | ✅    | ✅    |
| Alterar roles        | ✅    | ❌    |
| Criar categoria      | ✅    | ❌    |
| Listar categorias    | ✅    | ✅    |
| Detalhar categoria   | ✅    | ✅    |
| Atualizar categoria  | ✅    | ❌    |
| Remover categoria    | ✅    | ❌    |
| Criar produto        | ✅    | ❌    |
| Listar produtos      | ✅    | ✅    |
| Detalhar produto     | ✅    | ✅    |
| Todos os produtos    | ✅    | ✅    |
| Atualizar produto    | ✅    | ❌    |
| Atualizar status     | ✅    | ❌    |
| Vincular opcional    | ✅    | ❌    |
| Desvincular opcional | ✅    | ❌    |
| Criar opcional       | ✅    | ❌    |
| Listar opcionais     | ✅    | ✅    |
| Detalhar opcional    | ✅    | ✅    |
| Criar pedido         | ✅    | ✅    |
| Adicionar item       | ✅    | ✅    |
| Remover item         | ✅    | ✅    |
| Detalhar pedido      | ✅    | ✅    |
| Listar pedidos       | ✅    | ✅    |
| Remover pedido       | ✅    | ✅    |
| Enviar pedido        | ✅    | ✅    |
| Finalizar pedido     | ✅    | ✅    |

---

## 📦 Módulos do Sistema

### Módulo de Usuários

| Arquivo                       | Responsabilidade                                                   |
| ----------------------------- | ------------------------------------------------------------------ |
| `CreateUserController.ts`     | Extrai `name`, `email`, `password` do body e chama o service       |
| `CreateUserService.ts`        | Valida unicidade de email, hasheia senha, primeiro user vira ADMIN |
| `AuthUserController.ts`       | Extrai `email`, `password` do body e chama o service               |
| `AuthUserService.ts`          | Valida credenciais, gera e retorna o token JWT + dados do user     |
| `DetailUserController.ts`     | Lê `user_id` do request e chama o service                          |
| `DetailUserService.ts`        | Busca e retorna os dados do usuário (id, name, email, role)        |
| `UpdateRoleUserController.ts` | Extrai `email`, `role` do body e chama o service                   |
| `UpdateRoleUserService.ts`    | Valida permissões (não pode alterar próprio role/root) e atualiza  |

### Módulo de Categorias

| Arquivo                       | Responsabilidade                                                 |
| ----------------------------- | ---------------------------------------------------------------- |
| `CreateCategoryController.ts` | Extrai `name`, `description` do body e chama o service           |
| `CreateCategoryService.ts`    | Verifica se o usuário existe e cria a categoria                  |
| `ListCategoriesController.ts` | Chama o service sem parâmetros                                   |
| `ListCategoriesService.ts`    | Retorna todas as categorias ordenadas por data de criação (desc) |
| `DetailCategoryController.ts` | Extrai `category_id` dos params e chama o service                |
| `DetailCategoryService.ts`    | Busca e retorna os dados de uma categoria específica             |
| `UpdateCategoryController.ts` | Extrai `category_id`, `name`, `description` e chama o service    |
| `UpdateCategoryService.ts`    | Atualiza nome e/ou descrição da categoria                        |
| `RemoveCategoryController.ts` | Extrai `category_id` dos params e chama o service                |
| `RemoveCategoryService.ts`    | Verifica pedidos vinculados e remove a categoria (cascade)       |

### Módulo de Produtos

| Arquivo                                | Responsabilidade                                                      |
| -------------------------------------- | --------------------------------------------------------------------- |
| `CreateProductController.ts`           | Extrai dados do body + file e chama o service                         |
| `CreateProductService.ts`              | Valida categoria, faz upload no Cloudinary e cria o produto           |
| `ListProductsController.ts`            | Extrai `category_id` e `status` da query e chama o service            |
| `ListProductsService.ts`               | Lista produtos por categoria e status, incluindo opcionais vinculados |
| `AllProductsController.ts`             | Extrai `status` da query e chama o service                            |
| `AllProductsService.ts`                | Lista todos os produtos com categoria e opcionais                     |
| `DetailProductController.ts`           | Extrai `product_id` da query e chama o service                        |
| `DetailProductService.ts`              | Retorna produto com categoria e opcionais não desabilitados           |
| `UpdateProductController.ts`           | Extrai dados do body/params/file e chama o service                    |
| `UpdateProductService.ts`              | Atualiza produto com upload opcional de nova imagem                   |
| `UpdateStatusProductController.ts`     | Extrai `product_id` e `disabled` e chama o service                    |
| `UpdateStatusProductService.ts`        | Atualiza status do produto e de todos os opcionais vinculados         |
| `AddOptionalToProductController.ts`    | Extrai `optional_id`, `product_id` do body e chama o service          |
| `AddOptionalToProductService.ts`       | Vincula um opcional ao produto (reativa se já existiu)                |
| `RemoveOptionalToProductController.ts` | Extrai `product_optional_id` dos params e chama o service             |
| `RemoveOptionalToProductService.ts`    | Remove o vínculo entre produto e opcional                             |

### Módulo de Opcionais

| Arquivo                       | Responsabilidade                                                |
| ----------------------------- | --------------------------------------------------------------- |
| `CreateOptionalController.ts` | Extrai `name`, `price` do body e chama o service                |
| `CreateOptionalService.ts`    | Cria um novo adicional                                          |
| `ListOptionalsController.ts`  | Chama o service sem parâmetros                                  |
| `ListOptionalsService.ts`     | Retorna todos os opcionais ordenados por data de criação (desc) |
| `DetailOptionalController.ts` | Extrai `optional_id` dos params e chama o service               |
| `DetailOptionalService.ts`    | Busca e retorna os dados de um opcional específico              |

### Módulo de Pedidos

| Arquivo                           | Responsabilidade                                                         |
| --------------------------------- | ------------------------------------------------------------------------ |
| `CreateOrderController.ts`        | Extrai `table`, `name` do body e chama o service                         |
| `CreateOrderService.ts`           | Cria pedido como rascunho                                                |
| `AddProductOrderController.ts`    | Extrai `order_id`, `product_id`, `amount`, `optional_id` e chama service |
| `AddProductOrderService.ts`       | Adiciona ou incrementa item no pedido (com transação)                    |
| `RemoveProductOrderController.ts` | Extrai `item_id` dos params e `order_id` da query e chama o service      |
| `RemoveProductOrderService.ts`    | Remove item do pedido e retorna pedido atualizado                        |
| `DetailOrderController.ts`        | Extrai `order_id` dos params e chama o service                           |
| `DetailOrderService.ts`           | Retorna pedido completo com itens, produtos e opcionais                  |
| `ListOrdersController.ts`         | Extrai `status` da query e chama o service                               |
| `ListOrdersService.ts`            | Lista pedidos enviados (não rascunhos) filtrados por status              |
| `RemoveOrderController.ts`        | Extrai `order_id` dos params e chama o service                           |
| `RemoveOrderService.ts`           | Remove o pedido e todos os itens em cascata                              |
| `SendOrderController.ts`          | Extrai `order_id` dos params e chama o service                           |
| `SendOrderService.ts`             | Valida se tem itens, se é rascunho, e envia o pedido                     |
| `FinishOrderController.ts`        | Extrai `order_id` dos params e chama o service                           |
| `FinishOrderService.ts`           | Valida se já foi enviado e não está finalizado, e finaliza               |

---

## 🔧 Variáveis de Ambiente

```env
# String de conexão com o banco PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Chave secreta para assinar tokens JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Porta do servidor
PORT=3333

# Cloudinary (upload de imagens)
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="sua-api-secret"
```

---

## 📏 Convenções e Padrões

### Nomenclatura

- **Arquivos:** PascalCase para Controllers e Services (`CreateUserController.ts`, `CreateUserService.ts`)
- **Rotas:** Plural em lowercase (`/users`, `/categories`, `/products`, `/optionals`, `/orders`)
- **Tabelas:** Plural em lowercase via `@@map` (`users`, `categories`, `products`, `optionals`, `orders`, `items_orders`, `items_optionals`, `products_optionals`)
- **IDs:** UUID v4 gerados automaticamente pelo Prisma
- **Timestamps:** `createdAt` com `@default(now())` e `updatedAt` com `@updatedAt`

### Padrões de Código

- Controllers instanciam Services e delegam toda a lógica de negócio
- Services são responsáveis por validações e operações no banco
- Erros de negócio são lançados com `throw new Error("mensagem")` dentro dos Services
- Validação de input é feita via middleware `validateSchema` com schemas Zod
- O preço dos produtos é armazenado como `Int` (centavos) para evitar imprecisão com ponto flutuante
- Upload de imagens é feito em memória (Multer) e enviado ao Cloudinary via stream
- Transações (`$transaction`) são usadas para operações que precisam de atomicidade (criação de usuário, adição de itens ao pedido)

### Respostas HTTP

| Código | Uso                                               |
| ------ | ------------------------------------------------- |
| `200`  | Operação bem-sucedida                             |
| `400`  | Erro de validação Zod ou regra de negócio violada |
| `401`  | Token ausente ou inválido                         |
| `403`  | Permissão insuficiente (não é ADMIN)              |
| `500`  | Erro interno do servidor                          |
