# 🥟 Pastelaria — Backend

API REST para gestão de pastelarias, com controle de categorias, produtos, adicionais, pedidos por mesa e sistema de permissões por papéis.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.3.5-3068B7?style=flat&logo=zod&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Rotas](#-rotas)
- [Serviços e Arquitetura](#-serviços-e-arquitetura)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **Pastelaria Backend** é uma API REST para gestão completa de uma pastelaria. O sistema cobre desde o cadastro e autenticação de funcionários até o controle detalhado de categorias, produtos com imagens, adicionais (opcionais), pedidos por mesa e gerenciamento de itens dos pedidos.

### Características principais

- ✅ Arquitetura em camadas — Controller → Service → Prisma
- ✅ Autenticação JWT com middleware de proteção de rotas
- ✅ Sistema RBAC com dois papéis: ADMIN e STAFF
- ✅ Primeiro usuário cadastrado vira ADMIN automaticamente (root)
- ✅ Hashing seguro de senhas com bcryptjs
- ✅ Validação de requests com Zod (body, params e query)
- ✅ Upload de imagens via Multer + Cloudinary
- ✅ Sistema de pedidos com rascunho → envio → finalização
- ✅ Adição inteligente de itens (incrementa quantidade se já existe)
- ✅ Tratamento global de erros centralizado no `server.ts`
- ✅ Prisma com adaptador nativo PostgreSQL (`@prisma/adapter-pg`)

---

## 🚀 Tecnologias

| Categoria           | Tecnologia        | Versão | Descrição                                  |
| ------------------- | ----------------- | ------ | ------------------------------------------ |
| **Core**            | Node.js           | 18+    | Ambiente de execução JavaScript            |
| **Linguagem**       | TypeScript        | 5.9    | Superset JavaScript com tipagem estática   |
| **Framework**       | Express           | 5.2.1  | Framework web minimalista e flexível       |
| **ORM**             | Prisma            | 7      | ORM moderno com migrations e client tipado |
| **Banco**           | PostgreSQL        | latest | Banco de dados relacional                  |
| **Auth**            | jsonwebtoken      | 9.0.3  | Geração e verificação de tokens JWT        |
| **Segurança**       | bcryptjs          | 3.0.3  | Hashing seguro de senhas                   |
| **Validação**       | Zod               | 4.3.5  | Validação de schemas de request            |
| **Upload**          | Multer            | 2.0.2  | Upload de arquivos em memória              |
| **Cloud Storage**   | Cloudinary        | 2.9.0  | Armazenamento de imagens na nuvem          |
| **Utilitários**     | cors              | 2.8.5  | Liberação de Cross-Origin Resource Sharing |
| **Utilitários**     | dotenv            | 17.2.3 | Carregamento de variáveis de ambiente      |
| **Utilitários**     | colors            | 1.4.0  | Colorização de logs no terminal            |
| **Desenvolvimento** | tsx               | 4.21.0 | Execução de TypeScript com watch mode      |
| **Linting**         | ESLint + Prettier | latest | Padronização e formatação de código        |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação & Autorização

- Registro de novos funcionários com senha hasheada via bcryptjs
- Primeiro usuário cadastrado recebe automaticamente papel ADMIN (root)
- Login com email e senha retornando token JWT (validade: 30 dias)
- Middleware `isAuthenticated` protegendo todas as rotas privadas
- Middleware `isAdmin` restringindo ações administrativas
- Token enviado no header `Authorization: Bearer <token>`
- Gerenciamento de papéis (ADMIN pode alterar papel de outros usuários)

### 👤 Usuários

- Consulta dos dados do usuário autenticado (id, name, email, role)
- Alteração de papel de outros usuários (ADMIN only)
- Proteção contra alteração do próprio papel e do usuário root

### 📂 Categorias

- CRUD completo de categorias (nome + descrição opcional)
- Proteção contra exclusão quando existem pedidos vinculados
- Exclusão em cascata dos produtos ao remover uma categoria
- Listagem ordenada por data de criação (mais recentes primeiro)

### 🛒 Produtos

- Criação de produtos com upload obrigatório de imagem (Cloudinary)
- Atualização com upload opcional de nova imagem
- Vínculo com categorias e opcionais (adicionais)
- Habilitação/desabilitação com propagação automática para opcionais vinculados
- Listagem por categoria com filtro de status
- Listagem geral de todos os produtos

### 🧂 Opcionais (Adicionais)

- Cadastro de itens adicionais com nome único e preço
- Vínculo e desvínculo de opcionais a produtos
- Listagem ordenada por data de criação

### 📋 Pedidos

- Criação de pedidos por mesa (com nome do cliente opcional)
- Adição inteligente de itens (incrementa se já existe no pedido)
- Suporte a opcionais por item de pedido
- Fluxo completo: Rascunho → Enviado → Finalizado
- Remoção de itens individuais ou do pedido inteiro
- Listagem com filtro por status (em aberto/finalizados)

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma                          # Modelos: User, Category, Product, Optional, Order, etc.
│   └── migrations/                            # Histórico de migrations SQL
│
├── src/
│   ├── server.ts                              # Ponto de entrada e middleware global de erros
│   ├── routes.ts                              # Centralização de todas as rotas
│   │
│   ├── @types/
│   │   └── express/
│   │       └── index.d.ts                     # Extensão do Request com user_id e role
│   │
│   ├── config/
│   │   ├── cloudinary.ts                      # Configuração do Cloudinary (cloud storage)
│   │   └── multer.ts                          # Configuração do Multer (upload em memória)
│   │
│   ├── schemas/                               # Schemas de validação Zod
│   │   ├── userSchema.ts                      # Schemas de usuário (create, login, updateRole)
│   │   ├── categorySchema.ts                  # Schemas de categoria (create, detail, remove, update)
│   │   ├── productSchema.ts                   # Schemas de produto (create, detail, list, update, etc.)
│   │   ├── optionalSchema.ts                  # Schemas de opcional (create, detail)
│   │   └── orderSchema.ts                     # Schemas de pedido (create, addProduct, remove, etc.)
│   │
│   ├── middlewares/
│   │   ├── isAuthenticated.ts                 # Validação do token JWT + injeção de user_id/role
│   │   ├── isAdmin.ts                         # Verificação de papel ADMIN
│   │   └── validateSchema.ts                  # Validação de request via Zod
│   │
│   ├── routes/                                # Definição de rotas por módulo
│   │   ├── users/
│   │   │   └── users.routes.ts
│   │   ├── categories/
│   │   │   └── categories.routes.ts
│   │   ├── products/
│   │   │   └── products.routes.ts
│   │   ├── optionals/
│   │   │   └── optionals.routes.ts
│   │   └── orders/
│   │       └── orders.routes.ts
│   │
│   ├── controllers/                           # Camada de entrada HTTP
│   │   ├── user/
│   │   │   ├── CreateUserController.ts
│   │   │   ├── AuthUserController.ts
│   │   │   ├── DetailsUserController.ts
│   │   │   └── UpdateRoleUserController.ts
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   ├── ListCategoriesController.ts
│   │   │   ├── DetailCategoryController.ts
│   │   │   ├── UpdateCategoryController.ts
│   │   │   └── RemoveCategoryController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── ListProductsController.ts
│   │   │   ├── DetailProductController.ts
│   │   │   ├── AllProductsController.ts
│   │   │   ├── UpdateProductController.ts
│   │   │   ├── UpdateStatusProductController.ts
│   │   │   ├── AddOptionalToProductController.ts
│   │   │   └── RemoveOptionalToProductController.ts
│   │   ├── optional/
│   │   │   ├── CreateOptionalController.ts
│   │   │   ├── ListOptionalsController.ts
│   │   │   └── DetailOptionalController.ts
│   │   └── order/
│   │       ├── CreateOrderController.ts
│   │       ├── AddProductOrderController.ts
│   │       ├── RemoveProductOrderController.ts
│   │       ├── DetailOrderController.ts
│   │       ├── LIstOrdersController.ts
│   │       ├── RemoveOrderController.ts
│   │       ├── SendOrderController.ts
│   │       └── FinishOrderController.ts
│   │
│   ├── services/                              # Camada de regras de negócio
│   │   ├── user/
│   │   │   ├── CreateUserService.ts
│   │   │   ├── AuthUserService.ts
│   │   │   ├── DetailUserService.ts
│   │   │   └── UpdateRoleUserService.ts
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   ├── ListCategoriesService.ts
│   │   │   ├── DetailCategoryService.ts
│   │   │   ├── UpdateCategoryService.ts
│   │   │   └── RemoveCategoryService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── ListProductsService.ts
│   │   │   ├── DetailProductService.ts
│   │   │   ├── AllProductsService.ts
│   │   │   ├── UpdateProductService.ts
│   │   │   ├── UpdateStatusProductService.ts
│   │   │   ├── AddOptionalToProductService.ts
│   │   │   └── RemoveOptionalToProductService.ts
│   │   ├── optional/
│   │   │   ├── CreateOptionalService.ts
│   │   │   ├── ListOptionalsService.ts
│   │   │   └── DetailOptionalService.ts
│   │   └── order/
│   │       ├── CreateOrderService.ts
│   │       ├── AddProductOrderService.ts
│   │       ├── RemoveProductOrderService.ts
│   │       ├── DetailOrderService.ts
│   │       ├── ListOrdersService.ts
│   │       ├── RemoveOrderService.ts
│   │       ├── SendOrderService.ts
│   │       └── FinishOrderService.ts
│   │
│   ├── prisma/
│   │   └── prismaclient.ts                    # Instância global do PrismaClient (com adapter-pg)
│   │
│   ├── utils/
│   │   └── logger/
│   │       └── listen.ts                      # Logger colorido para mensagem de inicialização
│   │
│   └── generated/
│       └── prisma/                            # Client gerado automaticamente pelo Prisma
│
├── .env                                       # Variáveis de ambiente (git ignored)
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **PostgreSQL** rodando localmente ou em nuvem
- **Conta Cloudinary** para upload de imagens

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/Pastelaria

# Acesse a pasta do projeto
cd backend

# Instale as dependências
yarn install
# ou
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

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

## 💻 Execução

```bash
# Aplica as migrations e cria as tabelas no banco
npx prisma migrate dev

# Gera o Prisma Client
npx prisma generate

# Inicia o servidor de desenvolvimento com watch mode
yarn dev
# ou
npm run dev
```

O servidor ficará disponível em **http://localhost:3333**.

---

## 🗺️ Rotas

### Usuários

| Rota          | Método  | Protegida | Permissão | Controller                 | Descrição                            |
| ------------- | ------- | --------- | --------- | -------------------------- | ------------------------------------ |
| `/users`      | `POST`  | ❌        | Pública   | `CreateUserController`     | Cria um novo funcionário             |
| `/sessions`   | `POST`  | ❌        | Pública   | `AuthUserController`       | Autentica e retorna token JWT        |
| `/me`         | `GET`   | ✅        | Todos     | `DetailUserController`     | Retorna dados do usuário autenticado |
| `/users/role` | `PATCH` | ✅        | ADMIN     | `UpdateRoleUserController` | Altera papel de um usuário           |

### Categorias

| Rota                       | Método   | Protegida | Permissão | Controller                 | Descrição                         |
| -------------------------- | -------- | --------- | --------- | -------------------------- | --------------------------------- |
| `/categories`              | `POST`   | ✅        | ADMIN     | `CreateCategoryController` | Cria nova categoria               |
| `/categories`              | `GET`    | ✅        | Todos     | `ListCategoriesController` | Lista todas as categorias         |
| `/categories/:category_id` | `GET`    | ✅        | Todos     | `DetailCategoryController` | Retorna detalhes de uma categoria |
| `/categories/:category_id` | `PATCH`  | ✅        | ADMIN     | `UpdateCategoryController` | Atualiza uma categoria            |
| `/categories/:category_id` | `DELETE` | ✅        | ADMIN     | `RemoveCategoryController` | Remove uma categoria              |

### Produtos

| Rota                                       | Método   | Protegida | Permissão | Controller                          | Descrição                       |
| ------------------------------------------ | -------- | --------- | --------- | ----------------------------------- | ------------------------------- |
| `/products`                                | `POST`   | ✅        | ADMIN     | `CreateProductController`           | Cria produto com imagem         |
| `/products`                                | `GET`    | ✅        | Todos     | `ListProductsController`            | Lista produtos por categoria    |
| `/products/detail`                         | `GET`    | ✅        | Todos     | `DetailProductController`           | Retorna detalhes de um produto  |
| `/products/all`                            | `GET`    | ✅        | Todos     | `AllProductsController`             | Lista todos os produtos         |
| `/products/:product_id`                    | `PUT`    | ✅        | ADMIN     | `UpdateProductController`           | Atualiza produto (com imagem)   |
| `/products/:product_id/update-status`      | `PUT`    | ✅        | ADMIN     | `UpdateStatusProductController`     | Habilita/desabilita produto     |
| `/products/optionals`                      | `POST`   | ✅        | ADMIN     | `AddOptionalToProductController`    | Vincula opcional ao produto     |
| `/products/optionals/:product_optional_id` | `DELETE` | ✅        | ADMIN     | `RemoveOptionalToProductController` | Remove vínculo opcional-produto |

### Opcionais

| Rota                      | Método | Protegida | Permissão | Controller                 | Descrição                        |
| ------------------------- | ------ | --------- | --------- | -------------------------- | -------------------------------- |
| `/optionals`              | `POST` | ✅        | ADMIN     | `CreateOptionalController` | Cria novo adicional              |
| `/optionals`              | `GET`  | ✅        | Todos     | `ListOptionalsController`  | Lista todos os adicionais        |
| `/optionals/:optional_id` | `GET`  | ✅        | Todos     | `DetailOptionalController` | Retorna detalhes de um adicional |

### Pedidos

| Rota                        | Método   | Protegida | Permissão | Controller                     | Descrição                            |
| --------------------------- | -------- | --------- | --------- | ------------------------------ | ------------------------------------ |
| `/orders`                   | `POST`   | ✅        | Todos     | `CreateOrderController`        | Cria pedido (rascunho) para uma mesa |
| `/orders/items`             | `POST`   | ✅        | Todos     | `AddProductOrderController`    | Adiciona produto ao pedido           |
| `/orders/remove/:item_id`   | `DELETE` | ✅        | Todos     | `RemoveProductOrderController` | Remove item do pedido                |
| `/orders/details/:order_id` | `GET`    | ✅        | Todos     | `DetailOrderController`        | Retorna detalhes completos do pedido |
| `/orders`                   | `GET`    | ✅        | Todos     | `ListOrdersController`         | Lista pedidos enviados por status    |
| `/orders/:order_id`         | `DELETE` | ✅        | Todos     | `RemoveOrderController`        | Remove pedido e seus itens           |
| `/orders/:order_id/send`    | `PATCH`  | ✅        | Todos     | `SendOrderController`          | Envia pedido (sai do rascunho)       |
| `/orders/:order_id/finish`  | `PATCH`  | ✅        | Todos     | `FinishOrderController`        | Finaliza pedido concluído            |

---

## 🏗️ Serviços e Arquitetura

O fluxo de uma requisição segue sempre o padrão:

```
Request → Router → [validateSchema?] → [isAuthenticated?] → [isAdmin?] → Controller → Service → Prisma (DB)
```

### Services de Usuário

| Service                 | Método    | Endpoint            | Descrição                                           |
| ----------------------- | --------- | ------------------- | --------------------------------------------------- |
| `CreateUserService`     | `execute` | `POST /users`       | Valida email único, hasheia senha, primeiro = ADMIN |
| `AuthUserService`       | `execute` | `POST /sessions`    | Valida credenciais e assina token JWT de 30 dias    |
| `DetailUserService`     | `execute` | `GET /me`           | Busca dados do usuário (id, name, email, role)      |
| `UpdateRoleUserService` | `execute` | `PATCH /users/role` | Valida permissões e atualiza papel do usuário       |

### Services de Categoria

| Service                 | Método    | Endpoint                 | Descrição                                      |
| ----------------------- | --------- | ------------------------ | ---------------------------------------------- |
| `CreateCategoryService` | `execute` | `POST /categories`       | Verifica usuário e cria a categoria            |
| `ListCategoriesService` | `execute` | `GET /categories`        | Lista todas as categorias (desc by createdAt)  |
| `DetailCategoryService` | `execute` | `GET /categories/:id`    | Retorna detalhes de uma categoria              |
| `UpdateCategoryService` | `execute` | `PATCH /categories/:id`  | Atualiza nome e/ou descrição                   |
| `RemoveCategoryService` | `execute` | `DELETE /categories/:id` | Verifica pedidos vinculados e remove (cascade) |

### Services de Produto

| Service                          | Método    | Endpoint                          | Descrição                                          |
| -------------------------------- | --------- | --------------------------------- | -------------------------------------------------- |
| `CreateProductService`           | `execute` | `POST /products`                  | Valida categoria, upload Cloudinary e cria produto |
| `ListProductsService`            | `execute` | `GET /products`                   | Lista produtos por categoria e status              |
| `AllProductsService`             | `execute` | `GET /products/all`               | Lista todos os produtos com categoria e opcionais  |
| `DetailProductService`           | `execute` | `GET /products/detail`            | Retorna produto com categoria e opcionais          |
| `UpdateProductService`           | `execute` | `PUT /products/:id`               | Atualiza produto com upload opcional de imagem     |
| `UpdateStatusProductService`     | `execute` | `PUT /products/:id/update-status` | Atualiza status do produto + opcionais vinculados  |
| `AddOptionalToProductService`    | `execute` | `POST /products/optionals`        | Vincula opcional ao produto (reativa se existia)   |
| `RemoveOptionalToProductService` | `execute` | `DELETE /products/optionals/:id`  | Remove vínculo entre produto e opcional            |

### Services de Opcional

| Service                 | Método    | Endpoint             | Descrição                                     |
| ----------------------- | --------- | -------------------- | --------------------------------------------- |
| `CreateOptionalService` | `execute` | `POST /optionals`    | Cria novo adicional                           |
| `ListOptionalsService`  | `execute` | `GET /optionals`     | Lista todos os adicionais (desc by createdAt) |
| `DetailOptionalService` | `execute` | `GET /optionals/:id` | Retorna detalhes de um adicional              |

### Services de Pedido

| Service                     | Método    | Endpoint                    | Descrição                                      |
| --------------------------- | --------- | --------------------------- | ---------------------------------------------- |
| `CreateOrderService`        | `execute` | `POST /orders`              | Cria pedido como rascunho                      |
| `AddProductOrderService`    | `execute` | `POST /orders/items`        | Adiciona/incrementa item no pedido (transação) |
| `RemoveProductOrderService` | `execute` | `DELETE /orders/remove/:id` | Remove item e retorna pedido atualizado        |
| `DetailOrderService`        | `execute` | `GET /orders/details/:id`   | Retorna pedido completo com itens e opcionais  |
| `ListOrdersService`         | `execute` | `GET /orders`               | Lista pedidos enviados filtrados por status    |
| `RemoveOrderService`        | `execute` | `DELETE /orders/:id`        | Remove pedido e itens em cascata               |
| `SendOrderService`          | `execute` | `PATCH /orders/:id/send`    | Valida e envia pedido (draft → false)          |
| `FinishOrderService`        | `execute` | `PATCH /orders/:id/finish`  | Valida e finaliza pedido (status → true)       |

### Fluxo do Pedido

```
Rascunho (draft=true, status=false)
    │
    ├── Adicionar/remover itens
    │
    ▼
Enviado (draft=false, status=false)     ← PATCH /orders/:id/send
    │
    ▼
Finalizado (draft=false, status=true)   ← PATCH /orders/:id/finish
```

---

## 🗄️ Banco de Dados

### Modelos

- **User**: Funcionários cadastrados (ADMIN / STAFF)
- **Category**: Categorias de produtos
- **Product**: Produtos com imagem, preço e categoria
- **Optional**: Itens adicionais (catupiry, cheddar, etc.)
- **ProductsOptionals**: Vínculo N:N entre Product e Optional
- **Order**: Pedidos por mesa
- **ItemsOrder**: Itens do pedido (produto + quantidade)
- **ItemsOptionals**: Opcionais selecionados por item do pedido

### Diagrama de Relacionamentos

```
User (standalone — sem FK com outros modelos)

Category 1───N Product
Product  N───N Optional   (via ProductsOptionals)
Order    1───N ItemsOrder
ItemsOrder N───1 Product
ItemsOrder 1───N ItemsOptionals
ItemsOptionals N───1 ProductsOptionals
```

---

## 📜 Scripts Disponíveis

| Comando                      | Descrição                                        |
| ---------------------------- | ------------------------------------------------ |
| `yarn dev` / `npm run dev`   | Inicia o servidor com watch mode (tsx)           |
| `yarn lint` / `npm run lint` | Executa o ESLint para verificar o código         |
| `yarn lint:fix`              | Corrige problemas de lint automaticamente        |
| `yarn format`                | Formata o código com Prettier                    |
| `npx prisma migrate dev`     | Cria e aplica migrations no banco de dados       |
| `npx prisma generate`        | Regenera o Prisma Client após mudanças no schema |
| `npx prisma studio`          | Abre interface visual do banco (localhost:5555)  |

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação. Após o login, inclua o token no header:

```bash
Authorization: Bearer seu_token_jwt
```

### Papéis (RBAC)

| Papel   | Descrição                                                     |
| ------- | ------------------------------------------------------------- |
| `ADMIN` | Acesso total: CRUD de categorias, produtos, opcionais + roles |
| `STAFF` | Acesso de leitura + gestão completa de pedidos                |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/backend/` na raiz do monorepo:

```
Pastelaria/
├── backend/
├── frontend/
├── mobile/
└── documentation/
    └── backend/
        ├── CONTEXTO.md
        └── ENDPOINTS.md
```

| Documento                                                    | Descrição                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)** | Documentação detalhada de cada endpoint: método, autenticação, body, query params, path params, respostas e erros |
| **[📖 CONTEXTO.md](../documentation/backend/CONTEXTO.md)**   | Contexto técnico completo: arquitetura, modelagem de dados, regras de negócio, fluxo auth, RBAC e padrões         |
