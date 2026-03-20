# 🥐 PastelariaSG — Frontend

Interface web para gestão completa de pastelaria, com dashboard de pedidos, controle de produtos com imagens, categorias, opcionais, autenticação JWT e controle de acesso RBAC (ADMIN/STAFF).

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

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
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Arquitetura e Padrões](#-arquitetura-e-padrões)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **PastelariaSG Frontend** é uma aplicação web construída com Next.js 16 (App Router) que consome a API REST do backend para oferecer gestão completa de uma pastelaria/lanchonete. Desde o login até o controle de pedidos, produtos, categorias e opcionais — tudo com tema escuro, design responsivo e controle de acesso por permissões.

### Características principais

- ✅ Arquitetura com Server Components e Server Actions (Next.js 16)
- ✅ Autenticação via JWT em cookie HTTP-only com guards por role
- ✅ React Compiler ativado para otimização automática
- ✅ UI com shadcn/ui (Radix primitives) e tema escuro customizado
- ✅ Validação dupla de formulários (client + server) com Zod + React Hook Form
- ✅ CRUD de produtos com upload de imagens via Cloudinary
- ✅ Dashboard com pedidos em produção, detalhamento e finalização
- ✅ Filtro de produtos ativos/inativos via URL search params
- ✅ Gerenciamento de opcionais vinculados a produtos
- ✅ Controle de acesso RBAC (ADMIN/STAFF)
- ✅ Layout responsivo mobile-first com sidebar e drawer mobile
- ✅ Notificações toast com Sonner (richColors)

### Perfis de Acesso

| Perfil    | Descrição     | Permissões                                                        |
| --------- | ------------- | ----------------------------------------------------------------- |
| **ADMIN** | Administrador | Acesso total: gerenciar produtos, categorias, opcionais, usuários |
| **STAFF** | Funcionário   | Visualizar catálogo e gerenciar pedidos                           |

---

## 🚀 Tecnologias

| Categoria        | Tecnologia      | Versão   | Descrição                                              |
| ---------------- | --------------- | -------- | ------------------------------------------------------ |
| **Framework**    | Next.js         | 16.1.6   | App Router, Server Components, Server Actions, RSC     |
| **UI**           | React           | 19.2.3   | Biblioteca para construção de interfaces               |
| **Linguagem**    | TypeScript      | ^5       | Superset JavaScript com tipagem estática               |
| **Estilização**  | Tailwind CSS    | v4       | Framework CSS utility-first via `@tailwindcss/postcss` |
| **Componentes**  | shadcn/ui       | new-york | Componentes Radix primitives + CVA + Tailwind          |
| **Ícones**       | Lucide React    | 0.563.0  | Biblioteca de ícones SVG                               |
| **Formulários**  | React Hook Form | 7.71.1   | Gerenciamento performático de formulários              |
| **Validação**    | Zod             | 4.3.6    | Validação de schemas TypeScript-first                  |
| **HTTP**         | Axios           | 1.13.4   | Cliente HTTP server-side para comunicação com a API    |
| **Cookies**      | nookies / next  | —        | Cookies HTTP-only para autenticação                    |
| **Notificações** | Sonner          | 2.0.7    | Toast notifications elegantes com richColors           |
| **Temas**        | next-themes     | 0.4.6    | Suporte a dark/light mode                              |
| **Animações**    | tw-animate-css  | 1.4.0    | Animações CSS para Tailwind                            |
| **Formatação**   | Prettier        | 3.8.1    | Formatador de código opinativo                         |

---

## ⚙️ Funcionalidades

### 📊 Dashboard — Pedidos

- Visão geral de pedidos em produção como cards
- Detalhamento completo de cada pedido (mesa, cliente, itens, opcionais, subtotais)
- Cálculo automático do total (preços em centavos)
- Finalização de pedidos via dialog modal

> **Nota**: A criação, edição e remoção de pedidos é feita pelo aplicativo mobile.

### 🛍️ Gestão de Produtos

- CRUD completo com upload de imagens (max 5MB, JPG/PNG/WEBP)
- Preview da imagem antes do envio
- Organização por categorias via Select
- Filtro ativo/inativo via Switch (URL search params)
- Ativação/desativação de produtos com toggle
- Edição inteligente: só envia campos alterados
- Vinculação e remoção de opcionais por produto

### 📁 Gestão de Categorias

- Listagem de categorias em cards
- Criação com nome e descrição opcional (ADMIN only)

### 🍔 Gestão de Opcionais

- Listagem de opcionais com preço
- Criação com nome e preço (convertido para centavos) (ADMIN only)

### 🔐 Autenticação e Acesso

- Login com email e senha (JWT em cookie HTTP-only)
- Registro de novos usuários
- Validação automática de sessão em cada página protegida
- Guards por role: ADMIN acessa tudo, STAFF apenas pedidos e visualização
- Alteração de roles de usuários (ADMIN only)
- Logout com limpeza de cookie e redirect

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── @types/                              # Definições de tipos TypeScript globais
│   │   ├── categories.d.ts                  # Interface Category
│   │   ├── optionals.d.ts                   # Interfaces Optional, ProductOptional
│   │   ├── order.d.ts                       # Interfaces Order, OrderItem, ItemOptional
│   │   ├── products.d.ts                    # Interface Product
│   │   └── user.d.ts                        # Interfaces User, AuthResponse
│   │
│   ├── actions/                             # Server Actions ("use server")
│   │   ├── category/
│   │   │   ├── createCategoryAction.ts      # POST /categories
│   │   │   └── listCategoriesAction.ts      # GET /categories
│   │   ├── optionals/
│   │   │   ├── createOptionalAction.ts      # POST /optionals (preço → centavos)
│   │   │   └── listOptionalsAction.ts       # GET /optionals
│   │   ├── order/
│   │   │   ├── finishOrderAction.ts         # PATCH /orders/{id}/finish
│   │   │   └── listOrdersAction.ts          # GET /orders
│   │   ├── product/
│   │   │   ├── addOptionalToProduct.ts      # POST /products/optionals
│   │   │   ├── createProductAction.ts       # POST /products (FormData)
│   │   │   ├── detailProductAction.ts       # GET /products/detail
│   │   │   ├── listProductsAction.ts        # GET /products/all?status=
│   │   │   ├── removeOptionalToProduct.ts   # DELETE /products/optionals/{id}
│   │   │   ├── updateProductAction.ts       # PUT /products/{id} (FormData, diff)
│   │   │   └── updateStatusAction.ts        # PUT /products/{id}/update-status
│   │   └── user/
│   │       ├── loginAction.ts               # POST /sessions + setAuthToken
│   │       ├── logoutAction.ts              # clearAuthToken + redirect
│   │       ├── registerAction.ts            # POST /users
│   │       └── updateRoleAction.ts          # PATCH /users/role
│   │
│   ├── app/                                 # App Router (Next.js)
│   │   ├── globals.css                      # Tema escuro customizado + Tailwind v4
│   │   ├── layout.tsx                       # Layout raiz: fontes Geist, Toaster, pt-BR
│   │   ├── page.tsx                         # Redirect → /login
│   │   ├── login/
│   │   │   └── page.tsx                     # Página de login (guard inverso)
│   │   ├── register/
│   │   │   └── page.tsx                     # Página de registro (guard inverso)
│   │   └── dashboard/
│   │       ├── layout.tsx                   # Layout autenticado: Sidebar + MobileSidebar
│   │       ├── page.tsx                     # Pedidos em produção (home)
│   │       ├── categories/
│   │       │   ├── page.tsx                 # Listagem de categorias
│   │       │   └── new/page.tsx             # Criar categoria (ADMIN)
│   │       ├── products/
│   │       │   ├── page.tsx                 # Listagem com filtro ativo/inativo
│   │       │   ├── new/page.tsx             # Criar produto (ADMIN)
│   │       │   └── [id]/edit/page.tsx       # Editar produto + opcionais (ADMIN)
│   │       ├── optionals/
│   │       │   ├── page.tsx                 # Listagem de opcionais
│   │       │   └── new/page.tsx             # Criar opcional (ADMIN)
│   │       └── user/
│   │           └── page.tsx                 # Gerenciar roles (ADMIN)
│   │
│   ├── components/                          # Componentes React
│   │   ├── dashboard/
│   │   │   ├── card/
│   │   │   │   ├── card.tsx                 # OrderCard — card de pedido
│   │   │   │   └── orderDialog.tsx          # OrderDialog — detalhes + finalizar
│   │   │   ├── header/
│   │   │   │   └── header.tsx               # Header reutilizável (título + ação)
│   │   │   └── sidebar/
│   │   │       ├── sidebar.tsx              # Sidebar desktop (lg+)
│   │   │       └── mobileSidebar.tsx        # MobileSidebar (Sheet drawer)
│   │   ├── categoriesForm/
│   │   │   └── categoryform.tsx             # Formulário de criação de categoria
│   │   ├── loginforms/
│   │   │   ├── login/loginForm.tsx          # Formulário de login
│   │   │   └── register/registerForm.tsx    # Formulário de registro
│   │   ├── optionalsForm/
│   │   │   └── optionalForm.tsx             # Formulário de criação de opcional
│   │   ├── productFilter/
│   │   │   └── productFilter.tsx            # Switch filtro ativo/inativo
│   │   ├── productOptionals/
│   │   │   └── bindOptional.tsx             # Gerenciar opcionais vinculados
│   │   ├── productsForms/
│   │   │   ├── productform.tsx              # Formulário de criação de produto
│   │   │   └── editForm.tsx                 # Formulário de edição + BindOptional
│   │   ├── productsTable/
│   │   │   ├── productTable.tsx             # Grid de produtos
│   │   │   ├── productItem.tsx              # Card individual de produto
│   │   │   └── productDialog.tsx            # Dialog detalhes com toggle status
│   │   ├── profileform/
│   │   │   └── profileForm.tsx              # Formulário de alteração de role
│   │   └── ui/                              # 12 componentes shadcn/ui (Radix + CVA)
│   │
│   ├── lib/                                 # Bibliotecas e utilitários
│   │   ├── api.ts                           # Instância Axios com cookie e token
│   │   ├── auth.ts                          # Auth helpers: set/get/clear token, guards
│   │   └── utils.ts                         # cn() — clsx + tailwind-merge
│   │
│   └── schemas/                             # Schemas de validação (Zod v4)
│       ├── login.schema.ts                  # loginSchema, registerSchema
│       ├── category.schema.ts               # createCategorySchema
│       ├── product.schema.ts                # create/update Product schemas (client + server)
│       ├── optional.schema.ts               # create Optional schemas (client + server)
│       └── profile.schema.ts                # updateRoleSchema
│
├── .env.example                             # Exemplo de variáveis de ambiente
├── components.json                          # Configuração shadcn/ui (new-york, RSC)
├── next.config.ts                           # React Compiler, Cloudinary images, 10MB body
├── package.json                             # Dependências e scripts
├── postcss.config.mjs                       # Configuração PostCSS + Tailwind
└── tsconfig.json                            # TypeScript strict, path alias @/*
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **Backend da PastelariaSG** rodando (API em `http://localhost:3333`)

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/pastelaria

# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do frontend (ou copie o `.env.example`):

```env
# URL pública da API (exposta no bundle — usada em Server Actions)
NEXT_PUBLIC_API_URL=http://localhost:3333

# URL privada da API (server-side — não exposta no bundle)
API_URL=http://localhost:3333
```

| Variável              | Obrigatória | Descrição                                               |
| --------------------- | ----------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅          | URL da API exposta no bundle JavaScript                 |
| `API_URL`             | ❌          | URL da API usada apenas server-side (Server Components) |

> **Nota:** Certifique-se de que o backend está rodando antes de iniciar o frontend.

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Inicia o servidor em modo produção (após build)
npm run start
```

A aplicação estará disponível em **http://localhost:3000**.

---

## 🗺️ Rotas da Aplicação

| Rota                            | Guard         | Página       | Descrição                            |
| ------------------------------- | ------------- | ------------ | ------------------------------------ |
| `/`                             | —             | Redirect     | Redireciona para `/login`            |
| `/login`                        | Public (inv.) | Login        | Formulário de login                  |
| `/register`                     | Public (inv.) | Register     | Formulário de cadastro               |
| `/dashboard`                    | STAFF/ADMIN   | Orders       | Pedidos em produção                  |
| `/dashboard/categories`         | Authenticated | Categories   | Listagem de categorias               |
| `/dashboard/categories/new`     | ADMIN         | New Category | Criar nova categoria                 |
| `/dashboard/products`           | Authenticated | Products     | Listagem com filtro ativo/inativo    |
| `/dashboard/products/new`       | ADMIN         | New Product  | Criar produto com upload de imagem   |
| `/dashboard/products/[id]/edit` | ADMIN         | Edit Product | Editar produto + gerenciar opcionais |
| `/dashboard/optionals`          | Authenticated | Optionals    | Listagem de opcionais                |
| `/dashboard/optionals/new`      | ADMIN         | New Optional | Criar novo opcional                  |
| `/dashboard/user`               | ADMIN         | Settings     | Gerenciar roles de usuários          |

- **Public (inv.)**: Redireciona para `/dashboard` se já autenticado
- **Authenticated**: Qualquer usuário logado (STAFF ou ADMIN)
- **STAFF/ADMIN**: Ambas as roles têm acesso
- **ADMIN**: Exclusivo para administradores; STAFF é redirecionado

---

## 🏗️ Arquitetura e Padrões

### Fluxo de uma Requisição

```
Ação do Usuário → Server Component (guard + dados) → Client Component (UI interativa)
       ↓                                                       ↓
  Server Action ("use server") → Zod (validação) → Axios (API) → Backend REST → Resposta
       ↓
  { success, errors, data? } → Toast/Redirect → router.refresh() / revalidatePath()
```

### Gerenciamento de Estado

| Escopo           | Solução                 | Uso                                         |
| ---------------- | ----------------------- | ------------------------------------------- |
| **Server**       | Server Components (RSC) | Carregamento de dados no render server-side |
| **Client Local** | `useState`              | Modais, loading, previews, seleções         |
| **Formulários**  | React Hook Form         | Valores, validação, submissão               |
| **URL State**    | Search Params           | Filtros (ex: `?disabled=true`)              |
| **Cache**        | `revalidatePath()`      | Invalidação após mutações                   |

### Validação de Formulários

Todos os formulários usam **validação dupla**:

1. **Client-side**: Zod via `zodResolver` no React Hook Form — feedback instantâneo
2. **Server-side**: Zod `safeParse` nas Server Actions — segurança

Schemas com transformação de tipos: preços são `string` no form → `number` na action (via `.transform()`).

### Autenticação

- Token JWT salvo em **cookie HTTP-only** (`@appSG.token`, 30 dias)
- Validação em cada Server Component via `isAuthenticated()` → `GET /me`
- Guard `requireAuth({ needRole })` com redirect automático
- ADMIN sempre tem acesso; STAFF acessos restritos

### Layout

O layout das páginas autenticadas segue o padrão: **Sidebar (desktop) + MobileSidebar (mobile) + Header + Conteúdo**.

- **Mobile (< lg)**: MobileSidebar como drawer lateral (Sheet), conteúdo full-width
- **Desktop (lg+)**: Sidebar fixa à esquerda (w-64), conteúdo flex-1 à direita

---

## 📜 Scripts Disponíveis

| Comando         | Descrição                                   |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento        |
| `npm run build` | Compila TypeScript e gera build de produção |
| `npm run start` | Serve a build de produção                   |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/` na raiz do monorepo:

```
Pastelaria/
├── backend/
├── frontend/
├── mobile/
└── documentation/
    ├── backend/
    │   ├── CONTEXTO.md
    │   └── ENDPOINTS.md
    └── frontend/
        └── CONTEXTO.md
```

| Documento                                                              | Descrição                                                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **[📖 CONTEXTO.md (Frontend)](../documentation/frontend/CONTEXTO.md)** | Arquitetura, componentes, fluxos, tema, validação e convenções do frontend          |
| **[📖 CONTEXTO.md (Backend)](../documentation/backend/CONTEXTO.md)**   | Arquitetura em camadas, modelagem de dados, regras de negócio e padrões do backend  |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)**           | Documentação de cada endpoint da API: método, body, query params, respostas e erros |
