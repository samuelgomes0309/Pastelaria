<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença" />
</p>

# 🥟 PastelariaSG — Sistema de Gestão para Pastelarias

Sistema fullstack para gerenciamento de pastelarias com **API REST**, **painel web interativo** e **aplicativo mobile**. Gerencie categorias, produtos com imagens, adicionais (opcionais), pedidos por mesa e controle de acesso por papéis (ADMIN/STAFF). Desenvolvido por **Samuel Gomes da Silva**.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Fluxos Principais](#-fluxos-principais)
- [Documentação Detalhada](#-documentação-detalhada)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Visão Geral

O **PastelariaSG** é um ecossistema completo para gestão de pastelarias, dividido em três aplicações integradas:

| Aplicação    | Público-Alvo            | Função                                                                          |
| ------------ | ----------------------- | ------------------------------------------------------------------------------- |
| **Backend**  | API central             | Gerencia autenticação, RBAC, categorias, produtos, opcionais e pedidos          |
| **Frontend** | Administradores (ADMIN) | Painel web para CRUD de categorias, produtos, opcionais, pedidos e configuração |
| **Mobile**   | Funcionários (STAFF)    | App para abertura de pedidos, composição de itens e envio para a cozinha        |

### Fluxo de Operação

```
  👤 ADMIN (Web)                     📱 STAFF (Mobile)                 🔧 API (Backend)
  ┌─────────────────────┐          ┌─────────────────────┐          ┌──────────────────────┐
  │ • Cadastro / Login  │          │ • Login             │          │ • PostgreSQL         │
  │ • Categorias (CRUD) │          │ • Abrir pedido      │          │ • Prisma ORM         │
  │ • Produtos (CRUD)   │──────┐   │ • Montar itens      │──────┐   │ • JWT Auth           │
  │ • Opcionais (CRUD)  │      │   │ • Enviar pedido     │      │   │ • RBAC (ADMIN/STAFF) │
  │ • Pedidos (lista/   │      └──▶│ • Excluir pedido    │      └──▶│ • Cloudinary (imgs)  │
  │   finalizar)        │◀─────────│                     │◀─────────│ • Zod (validação)    │
  │ • Config. de roles  │          └─────────────────────┘          │                      │
  └─────────────────────┘                                           └──────────────────────┘
              ▲                              ▲                              │
              │                  REST API (HTTP)                            │
              └─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura do Sistema

```
                    ┌─────────────────────────────┐
                    │       PostgreSQL Database     │
                    │  (users, categories, products,│
                    │   optionals, orders, items)   │
                    └──────────────┬───────────────┘
                                   │ Prisma ORM
                    ┌──────────────▼───────────────┐
                    │     Backend (Node/Express)    │
                    │         Porta: 3333           │
                    │                               │
                    │  ┌─────────┐  ┌───────────┐  │
                    │  │ Routes  │→ │Controllers│  │
                    │  └─────────┘  └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │ Services  │  │
                    │               └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │  Prisma   │  │
                    │               └───────────┘  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────┼──────────────────┐
                    │              │                   │
     ┌──────────────▼────────┐  ┌─▼───────────────────────┐
     │   Frontend (Web)      │  │     Mobile (App)         │
     │   Next.js 16          │  │     Expo SDK 54          │
     │                       │  │                          │
     │  • SSR + Server       │  │  • Expo Router 6         │
     │    Components         │  │  • React Native 0.81     │
     │  • Server Actions     │  │  • NativeWind            │
     │  • shadcn/ui          │  │  • AuthContext global     │
     │  • Dashboard admin    │  │  • Fluxo de pedidos      │
     └───────────────────────┘  └──────────────────────────┘
```

### Padrão Arquitetural (Backend)

O backend segue o padrão **MVC adaptado** com camadas bem definidas:

```
┌─────────────────────────────────────────────┐
│                  HTTP Request               │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              routes.ts                      │
│  Define as rotas e aplica middlewares       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│   validateSchema → isAuthenticated → isAdmin│
│  Zod valida input, JWT verifica token,      │
│  RBAC verifica permissão                    │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              Controller                     │
│  Extrai dados do request (body/query/params)│
│  Chama o Service e retorna a resposta HTTP  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│               Service                       │
│  Toda a regra de negócio fica aqui          │
│  Validações, cálculos e operações no banco  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            PrismaClient                     │
│  Acesso ao banco de dados PostgreSQL        │
│  (via @prisma/adapter-pg)                   │
└─────────────────────────────────────────────┘
```

### Padrão Arquitetural (Frontend)

O frontend segue uma arquitetura baseada em **Server Components + Server Actions** do Next.js App Router:

```
┌─────────────────────────────────────────────────┐
│               Ação do Usuário                   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│         Next.js App Router (Server)             │
│  Resolve a rota, aplica guard (requireAuth)     │
│  Carrega dados via Server Actions               │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        Server Component (Página)                │
│  Renderiza layout (Sidebar + Header + Conteúdo) │
│  Passa dados para Client Components             │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│       Client Components (Interativos)           │
│  Formulários, modais, filtros, toasts           │
│  Chamam Server Actions para mutações            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│       Server Actions ("use server")             │
│  Validam com Zod, chamam API via Axios          │
│  Retornam { success, errors, data? }            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┘
│           Backend REST (Express)                │
└─────────────────────────────────────────────────┘
```

### Padrão Arquitetural (Mobile)

O mobile utiliza **Expo Router** com file-based routing e **Context API** para autenticação:

```
┌───────────────────────────────────────────────────┐
│                 Ação do Usuário                    │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│           Expo Router (File-based)                 │
│   Resolve a rota, aplica layout de autenticação    │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│             Screen (Tela / Componente)             │
│  Gerencia estado local, chama API, renderiza UI    │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│          Instância Axios (lib/api.ts)              │
│  Interceptor injeta Bearer token automaticamente   │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│              Backend REST (Express)                │
└───────────────────────────────────────────────────┘
```

---

## 🚀 Stack Tecnológica

### Backend

| Tecnologia         | Versão | Função                                |
| ------------------ | ------ | ------------------------------------- |
| Node.js            | ≥ 18   | Runtime JavaScript                    |
| TypeScript         | 5.9    | Tipagem estática                      |
| Express            | 5.2.1  | Framework HTTP                        |
| Prisma             | 7      | ORM com type-safety                   |
| PostgreSQL         | latest | Banco de dados relacional             |
| JWT (jsonwebtoken) | 9.0.3  | Autenticação via token                |
| bcryptjs           | 3.0.3  | Hash de senhas                        |
| Zod                | 4.3.5  | Validação de schemas de request       |
| Multer             | 2.0.2  | Upload de arquivos em memória         |
| Cloudinary         | 2.9.0  | Armazenamento de imagens na nuvem     |
| cors               | 2.8.5  | Liberação de origens cruzadas         |
| dotenv             | 17.2.3 | Carregamento de variáveis de ambiente |
| tsx                | 4.21.0 | Execução de TypeScript com watch mode |

### Frontend

| Tecnologia      | Versão | Função                                    |
| --------------- | ------ | ----------------------------------------- |
| Next.js         | 16.1.6 | Framework React com App Router e SSR      |
| React           | 19.2.3 | Biblioteca de UI                          |
| TypeScript      | ^5     | Tipagem estática                          |
| Tailwind CSS    | v4     | Estilização utility-first                 |
| shadcn/ui       | —      | Componentes UI (Radix + CVA + Tailwind)   |
| React Hook Form | 7.71.1 | Gerenciamento performático de formulários |
| Zod             | 4.3.6  | Schemas de validação TypeScript-first     |
| Axios           | 1.13.4 | Cliente HTTP para chamadas à API          |
| Sonner          | 2.0.7  | Toast notifications                       |
| Lucide React    | 0.563  | Ícones SVG como componentes React         |
| nookies         | 2.5.2  | Gerenciamento de cookies (token JWT)      |

### Mobile

| Tecnologia              | Versão   | Função                                   |
| ----------------------- | -------- | ---------------------------------------- |
| React Native            | 0.81.5   | Framework para aplicações nativas        |
| Expo                    | ~54.0.29 | Plataforma de desenvolvimento e build    |
| Expo Router             | ~6.0.19  | Navegação file-based                     |
| TypeScript              | ~5.9.2   | Tipagem estática                         |
| NativeWind              | 4.2.1    | Tailwind CSS para React Native           |
| Axios                   | 1.13.5   | Cliente HTTP com interceptors            |
| AsyncStorage            | 2.2.0    | Persistência local de token e dados      |
| Lucide RN               | 0.545.0  | Ícones SVG como componentes React Native |
| React Native Reanimated | ~4.1.1   | Animações de alta performance            |

---

## 🗄️ Modelos de Dados

O banco de dados PostgreSQL contém 7 tabelas gerenciadas pelo Prisma:

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
│ updatedAt   DateTime     │       │ price       Int (centavos)   │
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
               └────────┬────────┘  └──────┬────────────────────┘
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
│ price Int (centavos)     │       │ status  Boolean              │
│ createdAt DateTime       │       │ draft   Boolean              │
│ updatedAt DateTime       │       │ name    String?              │
└──────────────────────────┘       │ createdAt DateTime           │
                                   │ updatedAt DateTime           │
                                   └──────────────────────────────┘
```

### Relacionamentos

| Relação                                 | Tipo | Descrição                                                    |
| --------------------------------------- | ---- | ------------------------------------------------------------ |
| Category → Products                     | 1:N  | Cada categoria possui zero ou mais produtos (cascade delete) |
| Product → Category                      | N:1  | Cada produto pertence a uma categoria                        |
| Product ↔ Optional (products_optionals) | N:N  | Produtos e opcionais vinculados via tabela intermediária     |
| Order → Items (items_orders)            | 1:N  | Cada pedido possui zero ou mais itens (cascade delete)       |
| Item → Product                          | N:1  | Cada item de pedido referencia um produto                    |
| Item → Items Optionals                  | 1:N  | Cada item de pedido pode ter opcionais vinculados            |

### Campos Importantes

| Campo       | Modelo           | Descrição                                                        |
| ----------- | ---------------- | ---------------------------------------------------------------- |
| `role`      | User             | `ADMIN` (acesso total) ou `STAFF` (operacional)                  |
| `isRoot`    | User             | Primeiro usuário cadastrado — admin raiz, papel imutável         |
| `price`     | Product/Optional | Preço em **centavos** (ex: `1500` = R$ 15,00)                    |
| `disabled`  | Product          | `true` (desabilitado) ou `false` (ativo)                         |
| `draft`     | Order            | `true` (rascunho, não enviado) ou `false` (enviado para cozinha) |
| `status`    | Order            | `false` (em produção) ou `true` (finalizado)                     |
| `bannerUrl` | Product          | URL da imagem armazenada no Cloudinary                           |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação & Autorização (RBAC)

- Cadastro de usuários com hash bcryptjs (salt: 8)
- Login com geração de token JWT (expiração: 30 dias)
- O **primeiro usuário** cadastrado recebe automaticamente papel `ADMIN` e flag `isRoot`
- Middleware `isAuthenticated` protege todas as rotas privadas
- Middleware `isAdmin` restringe operações de gestão a administradores
- Mensagem genérica em login inválido para evitar enumeração de usuários
- Persistência de sessão via cookie HTTP-only (web) e AsyncStorage (mobile)

#### Matriz de Permissões

| Recurso            | ADMIN | STAFF |
| ------------------ | :---: | :---: |
| CRUD de categorias |  ✅   |  👀   |
| CRUD de produtos   |  ✅   |  👀   |
| CRUD de opcionais  |  ✅   |  👀   |
| Gerenciar roles    |  ✅   |  ❌   |
| Operar pedidos     |  ✅   |  ✅   |

> 👀 = Apenas visualização (listar/detalhar)

### 📂 Categorias

- CRUD completo (nome obrigatório, descrição opcional)
- Apenas `ADMIN` pode criar, atualizar ou remover
- Uma categoria **não pode ser removida** se existirem pedidos com produtos vinculados
- Exclusão em cascata de todos os produtos associados

### 🥟 Produtos

- CRUD completo com upload obrigatório de imagem (JPEG, PNG, GIF — máx. 5MB)
- Imagens armazenadas no Cloudinary via Multer (buffer em memória)
- Vinculação N:N com opcionais (ativar/desativar vínculos)
- Ao desabilitar um produto, todos os opcionais vinculados também são desabilitados
- Filtro por categoria e por status (ativo/inativo)
- Preço armazenado em centavos (evita imprecisão com ponto flutuante)

### 🧂 Opcionais (Adicionais)

- Cadastro com nome único e preço em centavos
- Podem ser vinculados a múltiplos produtos
- Listagem em ordem decrescente de criação

### 📋 Pedidos

- Criação de pedido por mesa (número da mesa + nome do cliente opcional)
- Fluxo: **Rascunho** → **Enviado** → **Finalizado**
- Adição de itens com produto + quantidade + opcional (se houver)
- Incremento automático de quantidade para produto repetido com mesmo opcional
- Envio exige pelo menos 1 item no pedido
- Finalização apenas de pedidos já enviados
- Remoção em cascata de itens e opcionais

### 📱 Mobile vs Web — Escopo Diferencial

| Funcionalidade                  | Web | Mobile |
| ------------------------------- | :-: | :----: |
| Login                           | ✅  |   ✅   |
| Cadastro de usuário             | ✅  |   ❌   |
| Gerência de roles               | ✅  |   ❌   |
| CRUD de categorias              | ✅  |   ❌   |
| CRUD de produtos                | ✅  |   ❌   |
| CRUD de opcionais               | ✅  |   ❌   |
| Listagem de pedidos em produção | ✅  |   ❌   |
| Finalização de pedidos          | ✅  |   ❌   |
| Abertura de pedido (mesa)       | ❌  |   ✅   |
| Composição de itens no pedido   | ❌  |   ✅   |
| Envio de pedido para cozinha    | ❌  |   ✅   |

---

## 📁 Estrutura do Monorepo

```
Pastelaria/
│
├── 📄 README.md                  ← Você está aqui
├── 📄 LICENSE                    ← Licença MIT
│
├── 📂 backend/                   ← API REST (Node.js + Express)
│   ├── prisma/                   ← Schema e migrations do Prisma
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts             ← Ponto de entrada (porta 3333)
│   │   ├── routes.ts             ← Centraliza e delega para rotas específicas
│   │   ├── @types/
│   │   │   └── express/          ← Extensão de tipos (user_id, role)
│   │   ├── config/
│   │   │   ├── cloudinary.ts     ← Configuração do Cloudinary
│   │   │   └── multer.ts         ← Configuração do Multer (upload)
│   │   ├── middlewares/
│   │   │   ├── isAuthenticated.ts  ← Middleware JWT
│   │   │   ├── isAdmin.ts         ← Middleware RBAC (admin only)
│   │   │   └── validateSchema.ts  ← Middleware de validação Zod
│   │   ├── controllers/
│   │   │   ├── category/         ← Create, List, Detail, Update, Remove
│   │   │   ├── product/          ← Create, List, All, Detail, Update, Status, Optionals
│   │   │   ├── optional/         ← Create, List, Detail
│   │   │   ├── order/            ← Create, AddItem, RemoveItem, Detail, List, Remove, Send, Finish
│   │   │   └── user/             ← Create, Auth, Detail, UpdateRole
│   │   ├── services/
│   │   │   ├── category/         ← Regras de negócio de categorias
│   │   │   ├── product/          ← Regras de negócio de produtos
│   │   │   ├── optional/         ← Regras de negócio de opcionais
│   │   │   ├── order/            ← Regras de negócio de pedidos
│   │   │   └── user/             ← Regras de negócio de usuários
│   │   ├── schemas/              ← Schemas Zod de validação
│   │   ├── routes/               ← Rotas específicas por domínio
│   │   ├── prisma/
│   │   │   └── prismaclient.ts   ← PrismaClient singleton
│   │   ├── utils/
│   │   │   └── logger/           ← Utilitários de log
│   │   └── generated/prisma/     ← Client Prisma gerado
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma.config.ts
│
├── 📂 frontend/                  ← Painel Web (Next.js + shadcn/ui)
│   └── src/
│       ├── @types/               ← Tipos TypeScript globais
│       ├── actions/              ← Server Actions por domínio
│       │   ├── category/
│       │   ├── optionals/
│       │   ├── order/
│       │   ├── product/
│       │   └── user/
│       ├── app/
│       │   ├── layout.tsx        ← Layout raiz (fontes, Toaster)
│       │   ├── page.tsx          ← Redireciona para /login
│       │   ├── globals.css       ← Estilos globais + Tailwind
│       │   ├── login/            ← Tela de autenticação
│       │   ├── register/         ← Tela de cadastro
│       │   └── dashboard/        ← Área autenticada
│       │       ├── page.tsx      ← Pedidos em produção
│       │       ├── categories/   ← Listagem + criação de categorias
│       │       ├── products/     ← Listagem + criação + edição de produtos
│       │       ├── optionals/    ← Listagem + criação de opcionais
│       │       └── user/         ← Gerenciamento de roles (ADMIN)
│       ├── components/
│       │   ├── dashboard/        ← Sidebar, Header, OrderCard, OrderDialog
│       │   ├── loginforms/       ← LoginForm, RegisterForm
│       │   ├── categoriesForm/   ← Formulário de categorias
│       │   ├── productsForms/    ← Formulários de produto + edição
│       │   ├── optionalsForm/    ← Formulário de opcionais
│       │   ├── productsTable/    ← Grid de produtos + dialog de detalhes
│       │   ├── productFilter/    ← Switch ativo/inativo
│       │   ├── productOptionals/ ← Gerenciar opcionais vinculados
│       │   ├── profileform/      ← Formulário de roles
│       │   └── ui/               ← 12 componentes shadcn/ui
│       ├── lib/                  ← Axios (api.ts), auth helpers, cn()
│       └── schemas/              ← Schemas Zod (validação client + server)
│
├── 📂 mobile/                    ← App Mobile (Expo + React Native)
│   ├── app/
│   │   ├── _layout.tsx           ← Layout raiz (AuthProvider, Toast, Stack)
│   │   ├── index.tsx             ← Splash/redirect (auth check)
│   │   ├── login.tsx             ← Tela de login
│   │   └── (authenticated)/      ← Grupo protegido (auth guard)
│   │       ├── _layout.tsx       ← Guard de autenticação
│   │       ├── dashboard.tsx     ← Abertura de novo pedido
│   │       └── orders/
│   │           └── [order_id]/
│   │               ├── index.tsx ← Composição de itens do pedido
│   │               └── checkout.tsx ← Confirmação e envio
│   ├── components/
│   │   ├── header/               ← OrderHeader, SendHeader
│   │   ├── select/               ← Select com modal fullscreen
│   │   └── ui/                   ← Button, Input, Label, Text (CVA)
│   ├── contexts/
│   │   └── authContext.tsx        ← Estado global de auth (Context API)
│   ├── configs/
│   │   └── api.config.ts         ← baseURL + timeout
│   ├── lib/
│   │   ├── api.ts                ← Axios com interceptor de token
│   │   └── utils.ts              ← cn() utilitário
│   └── @types/                   ← Tipos TypeScript (.d.ts)
│
└── 📂 documentation/             ← Documentação detalhada
    ├── backend/
    │   ├── CONTEXTO.md           ← Arquitetura e regras de negócio do backend
    │   └── ENDPOINTS.md          ← Referência completa de todos os endpoints
    ├── frontend/
    │   └── CONTEXTO.md           ← Arquitetura e práticas do frontend
    └── mobile/
        └── CONTEXTO.md           ← Arquitetura e práticas do mobile
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito             | Versão Mínima | Verificar Instalação |
| --------------------- | :-----------: | -------------------- |
| **Node.js**           |     18.x      | `node --version`     |
| **npm** ou **yarn**   |       —       | `npm --version`      |
| **PostgreSQL**        |     13.x      | `psql --version`     |
| **Git**               |       —       | `git --version`      |
| **Conta Cloudinary**  |       —       | cloudinary.com       |
| **Expo CLI** (mobile) |       —       | `npx expo --version` |

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/samuelgomes0309/pastelaria
cd Pastelaria
```

### 2. Backend

```bash
cd backend

# Instalar dependências
npm install  # ou yarn install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pastelaria"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="sua-api-secret"
```

> 💡 **Dica:** Gere um `JWT_SECRET` forte com:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

```bash
# Gerar client Prisma e rodar migrations
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em `http://localhost:3333`.

### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install  # ou yarn install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará acessível em `http://localhost:3000`.

### 4. Mobile

```bash
cd mobile

# Instalar dependências
npm install  # ou yarn install
```

Configure a variável de ambiente no `app.config.js` ou crie um `.env`:

```env
EXPO_PUBLIC_API_BASE_URL="http://SEU_IP_LOCAL:3333"
```

> ⚠️ **Importante:** No mobile, use o IP local da máquina (ex: `192.168.x.x`) em vez de `localhost`.

```bash
# Iniciar servidor Expo
npm run dev
```

Escaneie o QR code com o app **Expo Go** no seu dispositivo.

---

## ▶️ Executando o Projeto

### Inicialização Rápida (3 terminais)

**Terminal 1 — Backend:**

```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend && npm run dev
```

**Terminal 3 — Mobile:**

```bash
cd mobile && npm run dev
```

### Scripts Disponíveis

| Projeto  | Comando           | Descrição                                  |
| -------- | ----------------- | ------------------------------------------ |
| Backend  | `npm run dev`     | Inicia servidor com hot-reload (tsx watch) |
| Backend  | `npm run lint`    | Executa ESLint                             |
| Backend  | `npm run format`  | Formata código com Prettier                |
| Frontend | `npm run dev`     | Inicia Next.js dev server com HMR          |
| Frontend | `npm run build`   | Build de produção                          |
| Frontend | `npm run start`   | Inicia servidor de produção                |
| Mobile   | `npm run dev`     | Inicia Expo dev server (limpa cache)       |
| Mobile   | `npm run android` | Inicia no emulador Android                 |
| Mobile   | `npm run ios`     | Inicia no simulador iOS                    |

---

## 📡 Endpoints da API

> Documentação completa em [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md)

### Visão Geral

| Método   | Rota                                       | Descrição                           | Auth | Perm  |
| -------- | ------------------------------------------ | ----------------------------------- | :--: | :---: |
| `POST`   | `/users`                                   | Cadastrar usuário                   |  ❌  |   —   |
| `POST`   | `/sessions`                                | Login (gera JWT)                    |  ❌  |   —   |
| `GET`    | `/me`                                      | Dados do usuário logado             |  ✅  |  ALL  |
| `PATCH`  | `/users/role`                              | Alterar papel de usuário            |  ✅  | ADMIN |
| `POST`   | `/categories`                              | Criar categoria                     |  ✅  | ADMIN |
| `GET`    | `/categories`                              | Listar categorias                   |  ✅  |  ALL  |
| `GET`    | `/categories/:category_id`                 | Detalhar categoria                  |  ✅  |  ALL  |
| `PATCH`  | `/categories/:category_id`                 | Atualizar categoria                 |  ✅  | ADMIN |
| `DELETE` | `/categories/:category_id`                 | Remover categoria                   |  ✅  | ADMIN |
| `POST`   | `/products`                                | Criar produto (multipart/form-data) |  ✅  | ADMIN |
| `GET`    | `/products`                                | Listar produtos por categoria       |  ✅  |  ALL  |
| `GET`    | `/products/detail`                         | Detalhar produto                    |  ✅  |  ALL  |
| `GET`    | `/products/all`                            | Listar todos os produtos            |  ✅  |  ALL  |
| `PUT`    | `/products/:product_id`                    | Atualizar produto                   |  ✅  | ADMIN |
| `PUT`    | `/products/:product_id/update-status`      | Ativar/desativar produto            |  ✅  | ADMIN |
| `POST`   | `/products/optionals`                      | Vincular opcional a produto         |  ✅  | ADMIN |
| `DELETE` | `/products/optionals/:product_optional_id` | Desvincular opcional de produto     |  ✅  | ADMIN |
| `POST`   | `/optionals`                               | Criar opcional                      |  ✅  | ADMIN |
| `GET`    | `/optionals`                               | Listar opcionais                    |  ✅  |  ALL  |
| `GET`    | `/optionals/:optional_id`                  | Detalhar opcional                   |  ✅  |  ALL  |
| `POST`   | `/orders`                                  | Criar pedido (rascunho)             |  ✅  |  ALL  |
| `POST`   | `/orders/items`                            | Adicionar item ao pedido            |  ✅  |  ALL  |
| `DELETE` | `/orders/remove/:item_id`                  | Remover item do pedido              |  ✅  |  ALL  |
| `GET`    | `/orders/details/:order_id`                | Detalhar pedido                     |  ✅  |  ALL  |
| `GET`    | `/orders`                                  | Listar pedidos enviados             |  ✅  |  ALL  |
| `DELETE` | `/orders/:order_id`                        | Remover pedido                      |  ✅  |  ALL  |
| `PATCH`  | `/orders/:order_id/send`                   | Enviar pedido para cozinha          |  ✅  |  ALL  |
| `PATCH`  | `/orders/:order_id/finish`                 | Finalizar pedido                    |  ✅  |  ALL  |

### Exemplos Rápidos

#### Cadastro

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Funcionário", "email": "joao@email.com", "password": "senha123"}'
```

#### Login

```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "senha123"}'
```

#### Criar Categoria

```bash
curl -X POST http://localhost:3333/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Pastéis Salgados", "description": "Pastéis com recheios salgados"}'
```

#### Criar Produto (com imagem)

```bash
curl -X POST http://localhost:3333/products \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "name=Pastel de Carne" \
  -F "price=1500" \
  -F "description=Pastel crocante com recheio de carne moída" \
  -F "category_id=UUID_DA_CATEGORIA" \
  -F "file=@./imagem.jpg"
```

#### Criar Pedido

```bash
curl -X POST http://localhost:3333/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"table": 5, "name": "Carlos Silva"}'
```

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)

| Variável                | Obrigatória | Descrição                     | Exemplo                                        |
| ----------------------- | :---------: | ----------------------------- | ---------------------------------------------- |
| `DATABASE_URL`          |     ✅      | String de conexão PostgreSQL  | `postgresql://user:pass@localhost:5432/pastel` |
| `JWT_SECRET`            |     ✅      | Chave secreta para tokens JWT | `minha_chave_ultra_secreta`                    |
| `PORT`                  |     ✅      | Porta do servidor HTTP        | `3333`                                         |
| `CLOUDINARY_CLOUD_NAME` |     ✅      | Cloud name do Cloudinary      | `meu-cloud`                                    |
| `CLOUDINARY_API_KEY`    |     ✅      | API Key do Cloudinary         | `123456789012345`                              |
| `CLOUDINARY_API_SECRET` |     ✅      | API Secret do Cloudinary      | `abcdefghijk...`                               |

### Frontend (`.env`)

| Variável              | Obrigatória | Descrição               | Exemplo                 |
| --------------------- | :---------: | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` |     ✅      | URL base da API backend | `http://localhost:3333` |

### Mobile (`.env` / `app.config.js`)

| Variável                   | Obrigatória | Descrição               | Exemplo                    |
| -------------------------- | :---------: | ----------------------- | -------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` |     ✅      | URL base da API backend | `http://192.168.1.10:3333` |

---

## 🔄 Fluxos Principais

### Fluxo de Pedido (Mobile → Backend → Web)

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                    📱 ABERTURA (Mobile)                           │
  │                                                                   │
  │   POST /orders { table: 5, name: "Carlos" }                      │
  │                                                                   │
  │   1. Funcionário informa mesa e nome do cliente                   │
  │   2. Pedido criado como rascunho (draft=true)                     │
  │   3. Redireciona para tela de composição                          │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                   📱 COMPOSIÇÃO (Mobile)                          │
  │                                                                   │
  │   Selects encadeados: Categoria → Produto → Opcional              │
  │                                                                   │
  │   POST /orders/items { order_id, product_id, amount, optional_id }│
  │                                                                   │
  │   1. Seleciona categoria → carrega produtos da categoria          │
  │   2. Seleciona produto → carrega opcionais vinculados             │
  │   3. Ajusta quantidade (1-10)                                     │
  │   4. Adiciona item ao pedido                                      │
  │   5. Repete até finalizar composição                              │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                    📱 ENVIO (Mobile)                              │
  │                                                                   │
  │   PATCH /orders/:order_id/send                                    │
  │                                                                   │
  │   1. Confirmação via Alert                                        │
  │   2. Valida que o pedido tem itens e é rascunho                   │
  │   3. Altera draft=false → pedido enviado para cozinha             │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                  💻 PRODUÇÃO (Web Dashboard)                      │
  │                                                                   │
  │   GET /orders?status=false                                        │
  │                                                                   │
  │   1. Pedidos enviados aparecem como cards no dashboard            │
  │   2. Exibe mesa, itens, opcionais e total                         │
  │   3. Clique em "Detalhes" abre dialog com informações completas   │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                  💻 FINALIZAÇÃO (Web Dashboard)                   │
  │                                                                   │
  │   PATCH /orders/:order_id/finish                                  │
  │                                                                   │
  │   1. Admin/Staff clica em "Finalizar pedido"                      │
  │   2. Valida que já foi enviado e não está finalizado              │
  │   3. Altera status=true → pedido concluído                        │
  └───────────────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                       CADASTRO                                    │
  │                                                                   │
  │   POST /users { name, email, password }                           │
  │                                                                   │
  │   1. Valida dados com Zod (name ≥3, email válido, senha ≥6)      │
  │   2. Verifica unicidade do email                                  │
  │   3. Hash da senha com bcryptjs (salt: 8)                         │
  │   4. Primeiro usuário → ADMIN + isRoot = true                     │
  │   5. Demais usuários → STAFF por padrão                           │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                         LOGIN                                     │
  │                                                                   │
  │   POST /sessions { email, password }                              │
  │                                                                   │
  │   1. Busca usuário por email                                      │
  │   2. Compara senha com bcrypt.compare                             │
  │   3. Gera JWT (sub=user_id, role, exp=30d)                        │
  │   4. Retorna { id, name, email, role, token }                     │
  │                                                                   │
  │   Web: salva token em cookie HTTP-only                            │
  │   Mobile: salva token no AsyncStorage                             │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                    REQUISIÇÕES AUTENTICADAS                       │
  │                                                                   │
  │   Authorization: Bearer <token>                                   │
  │                                                                   │
  │   1. isAuthenticated: verify(token, JWT_SECRET)                   │
  │   2. Injeta req.user_id e req.role no request                     │
  │   3. isAdmin (se necessário): verifica role === "ADMIN"           │
  │   4. Controller → Service → Prisma → Response                     │
  └───────────────────────────────────────────────────────────────────┘
```

### Sistema RBAC

```
  ┌─────────────────────────────────┬────────────────────────────────┐
  │          ADMIN                  │            STAFF               │
  ├─────────────────────────────────┼────────────────────────────────┤
  │ CRUD de categorias              │ Visualização de categorias     │
  │ CRUD de produtos + imagens      │ Visualização de produtos       │
  │ CRUD de opcionais               │ Visualização de opcionais      │
  │ Vincular/desvincular opcionais  │ Operar pedidos (criar, enviar) │
  │ Alterar roles de usuários       │ Finalizar pedidos              │
  │ Operar pedidos                  │                                │
  │ Finalizar pedidos               │                                │
  └─────────────────────────────────┴────────────────────────────────┘
```

---

## 📚 Documentação Detalhada

Cada parte do projeto possui documentação aprofundada:

| Documento                                                                | Descrição                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [documentation/backend/CONTEXTO.md](documentation/backend/CONTEXTO.md)   | Arquitetura, regras de negócio e convenções do backend         |
| [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md) | Referência completa de todos os endpoints com request/response |
| [documentation/frontend/CONTEXTO.md](documentation/frontend/CONTEXTO.md) | Arquitetura, componentes, actions e práticas do frontend       |
| [documentation/mobile/CONTEXTO.md](documentation/mobile/CONTEXTO.md)     | Arquitetura, telas, navegação e práticas do mobile             |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Samuel Gomes da Silva**

- GitHub: [@samuelgomes0309](https://github.com/samuelgomes0309)

---
