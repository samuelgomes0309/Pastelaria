# 📖 CONTEXTO TÉCNICO — PastelariaSG Frontend

Documento de referência técnica do frontend do sistema de gestão para pastelarias. Descreve a arquitetura, componentes, fluxos, validação, tema e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Roteamento e Guards](#-roteamento-e-guards)
- [Autenticação](#-autenticação)
- [Comunicação com a API](#-comunicação-com-a-api)
- [Páginas da Aplicação](#-páginas-da-aplicação)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Validação de Formulários](#-validação-de-formulários)
- [Tema e Estilização](#-tema-e-estilização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **PastelariaSG Frontend** é uma aplicação web construída com Next.js 16 (App Router) que consome a API REST do backend. A interface permite autenticação, gerenciamento de pedidos, categorias, produtos com imagens, opcionais e controle de acesso por roles (ADMIN/STAFF) — tudo com design responsivo e tema escuro.

### Domínios da aplicação

| Domínio           | Responsabilidade                                                                  |
| ----------------- | --------------------------------------------------------------------------------- |
| **Autenticação**  | Cadastro, login, validação de sessão (cookie HTTP-only), logout                   |
| **Pedidos**       | Listagem de pedidos em produção, detalhamento e finalização                       |
| **Categorias**    | CRUD de categorias de produtos                                                    |
| **Produtos**      | CRUD de produtos com upload de imagem, filtro ativo/inativo, vínculo de opcionais |
| **Opcionais**     | Cadastro e listagem de itens adicionais                                           |
| **Configurações** | Alteração de roles de usuários (ADMIN only)                                       |

---

## 🚀 Stack Tecnológica

| Camada       | Tecnologia          | Versão   | Papel                                                |
| ------------ | ------------------- | -------- | ---------------------------------------------------- |
| Framework    | Next.js             | 16.1.6   | App Router, Server Components, Server Actions, RSC   |
| UI           | React               | 19.2.3   | Renderização de componentes e gerenciamento de UI    |
| Linguagem    | TypeScript          | ^5       | Tipagem estática e segurança em desenvolvimento      |
| Estilização  | Tailwind CSS        | v4       | Classes utilitárias CSS via `@tailwindcss/postcss`   |
| Componentes  | shadcn/ui           | new-york | Componentes UI baseados em Radix primitives + CVA    |
| Ícones       | Lucide React        | 0.563.0  | Ícones SVG como componentes React                    |
| Formulários  | React Hook Form     | 7.71.1   | Gerenciamento performático de formulários            |
| Validação    | Zod                 | 4.3.6    | Schemas de validação TypeScript-first                |
| Resolvers    | @hookform/resolvers | 5.2.2    | Integração Zod ↔ React Hook Form                     |
| HTTP         | Axios               | 1.13.4   | Cliente HTTP server-side para chamadas à API backend |
| Cookies      | nookies / next      | —        | Gerenciamento de cookies HTTP-only para autenticação |
| Notificações | Sonner              | 2.0.7    | Toast notifications com estilo rich colors           |
| Temas        | next-themes         | 0.4.6    | Suporte a dark/light mode                            |
| Animações    | tw-animate-css      | 1.4.0    | Animações CSS para Tailwind                          |
| Scrollbar    | tailwind-scrollbar  | 4.0.2    | Personalização de scrollbar via Tailwind             |
| Formatação   | Prettier            | 3.8.1    | Formatador automático de código                      |

---

## 🏗️ Arquitetura

### Visão Geral do Fluxo

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
│         Server Component (Página)               │
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
┌───────────────────▼─────────────────────────────┐
│           Backend REST (Express)                │
│  Processa a requisição e retorna resposta       │
└─────────────────────────────────────────────────┘
```

### Estrutura de Camadas

| Camada             | Diretório        | Responsabilidade                                            |
| ------------------ | ---------------- | ----------------------------------------------------------- |
| **Entrada**        | `layout.tsx`     | Layout raiz: fontes, Toaster global, lang pt-BR             |
| **Roteamento**     | `app/`           | App Router com Server Components e guards de autenticação   |
| **Páginas**        | `app/dashboard/` | Composição de layout, carregamento de dados server-side     |
| **Componentes**    | `components/`    | Elementos de UI reutilizáveis (formulários, cards, sidebar) |
| **Server Actions** | `actions/`       | Comunicação com a API backend via funções server-side       |
| **Schemas**        | `schemas/`       | Schemas Zod para validação client e server-side             |
| **Lib**            | `lib/`           | Utilitários: instância Axios, auth helpers, cn()            |
| **Tipos**          | `@types/`        | Definições de tipos TypeScript globais                      |

### Layout Raiz (`layout.tsx`)

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-center" duration={1000} />
      </body>
    </html>
  );
}
```

- Fontes **Geist Sans** e **Geist Mono** (Google Fonts)
- `Toaster` (Sonner) global com `richColors`, posição `top-center`, duração `1000ms`
- React Compiler ativado (`reactCompiler: true` no `next.config.ts`)

---

## 🛣️ Roteamento e Guards

### Estrutura de Rotas (App Router)

| Rota                            | Guard                    | Página           | Descrição                               |
| ------------------------------- | ------------------------ | ---------------- | --------------------------------------- |
| `/`                             | —                        | Redirect         | Redireciona para `/login`               |
| `/login`                        | `isAuthenticated` (inv.) | Login            | Formulário de login                     |
| `/register`                     | `isAuthenticated` (inv.) | Register         | Formulário de cadastro                  |
| `/dashboard`                    | `requireAuth(STAFF)`     | Orders           | Pedidos em produção                     |
| `/dashboard/categories`         | `isAuthenticated`        | Categories       | Listagem de categorias                  |
| `/dashboard/categories/new`     | `requireAuth(ADMIN)`     | New Category     | Criar nova categoria                    |
| `/dashboard/products`           | `isAuthenticated`        | Products         | Listagem de produtos com filtro         |
| `/dashboard/products/new`       | `requireAuth(ADMIN)`     | New Product      | Criar novo produto com upload de imagem |
| `/dashboard/products/[id]/edit` | `requireAuth(ADMIN)`     | Edit Product     | Editar produto + gerenciar opcionais    |
| `/dashboard/optionals`          | `isAuthenticated`        | Optionals        | Listagem de opcionais                   |
| `/dashboard/optionals/new`      | `requireAuth(ADMIN)`     | New Optional     | Criar novo opcional                     |
| `/dashboard/user`               | `requireAuth(ADMIN)`     | Profile/Settings | Gerenciar roles de usuários             |

### Guards de Autenticação

#### `requireAuth({ needRole, redirectTo })`

Guard principal que protege rotas autenticadas:

```
1. Chama isAuthenticated() → valida token via GET /me
2. Se não autenticado → redirect("/login")
3. Se user.role === "ADMIN" → acesso liberado (sempre)
4. Se user.role !== needRole → redirect(redirectTo || "/dashboard")
5. Retorna o objeto User
```

#### Guard Inverso (Login/Register)

Páginas públicas verificam se o usuário já está autenticado:

```
1. Chama isAuthenticated()
2. Se autenticado → redirect("/dashboard")
3. Se não autenticado → renderiza formulário
```

---

## 🔐 Autenticação

### Visão Geral

A autenticação é baseada em **cookies HTTP-only** gerenciados server-side via `next/headers`. Não há Context API nem state management global — toda verificação ocorre nos Server Components.

### Interface do Usuário

```typescript
interface User {
	id: string;
	name: string;
	email: string;
	role: "STAFF" | "ADMIN";
}

interface AuthResponse extends User {
	token: string;
}
```

### Módulo Auth (`lib/auth.ts`)

| Função                 | Descrição                                                                 |
| ---------------------- | ------------------------------------------------------------------------- |
| `setAuthToken(token)`  | Salva JWT em cookie HTTP-only, 30 dias, `sameSite: lax`, `secure` em prod |
| `getAuthToken()`       | Lê o token do cookie `@appSG.token`                                       |
| `clearAuthToken()`     | Deleta o cookie de autenticação                                           |
| `isAuthenticated()`    | Valida token chamando `GET /me`; retorna `User \| null`                   |
| `requireAuth(options)` | Guard completo: verifica auth + role; redireciona se necessário           |

### Fluxo Completo de Autenticação

```
1. Usuário acessa /login → Server Component verifica isAuthenticated()
      │
2a. Se autenticado → redirect("/dashboard")
2b. Se não → renderiza LoginForm (Client Component)
      │
3. Usuário submete form → loginUserAction (Server Action)
      │
4. Server Action: POST /sessions → recebe token
      │
5. setAuthToken(token) → salva em cookie HTTP-only
      │
6. Client: toast.success → router.push("/dashboard")
      │
7. Dashboard carrega → requireAuth("STAFF") valida o cookie
      │
8. GET /me com token → retorna User → renderiza página
```

### Configuração do Cookie

| Propriedade | Valor                |
| ----------- | -------------------- |
| Nome        | `@appSG.token`       |
| httpOnly    | `true`               |
| maxAge      | 30 dias (2.592.000s) |
| path        | `/`                  |
| sameSite    | `lax`                |
| secure      | `true` em produção   |

---

## 📡 Comunicação com a API

### Instância Axios (`lib/api.ts`)

```typescript
export const setupApi = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("@appSG.token")?.value || null;
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		timeout: 5000,
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	return api;
};
```

- Instância criada em cada Server Action (lê cookie fresh)
- `baseURL` via variável de ambiente `NEXT_PUBLIC_API_URL`
- Timeout de **5 segundos**
- Token JWT injetado automaticamente no header `Authorization`

### Padrão das Server Actions

Todas as actions seguem o padrão:

```typescript
"use server";
async function action(data) {
	// 1. Validação com Zod (safeParse)
	// 2. Cria instância API (setupApi)
	// 3. Chamada HTTP (axios)
	// 4. Retorna { success: boolean, errors: {}, data?: T }
}
```

### Actions por Domínio

#### Usuários

| Action               | Endpoint            | Método | Descrição                |
| -------------------- | ------------------- | ------ | ------------------------ |
| `loginUserAction`    | `POST /sessions`    | POST   | Login + salva cookie     |
| `registerUserAction` | `POST /users`       | POST   | Cadastro de novo usuário |
| `logoutAction`       | —                   | —      | Limpa cookie + redirect  |
| `updateRoleAction`   | `PATCH /users/role` | PATCH  | Altera role (ADMIN only) |

#### Categorias

| Action                 | Endpoint           | Método | Descrição              |
| ---------------------- | ------------------ | ------ | ---------------------- |
| `listCategoriesAction` | `GET /categories`  | GET    | Lista todas categorias |
| `createCategoryAction` | `POST /categories` | POST   | Cria nova categoria    |

#### Produtos

| Action                          | Endpoint                               | Método | Descrição                                 |
| ------------------------------- | -------------------------------------- | ------ | ----------------------------------------- |
| `listProductsAction`            | `GET /products/all?status={bool}`      | GET    | Lista produtos (filtro ativo/inativo)     |
| `detailProductAction`           | `GET /products/detail?product_id={id}` | GET    | Detalhes de um produto                    |
| `createProductAction`           | `POST /products`                       | POST   | Cria produto (FormData com imagem)        |
| `updateProductAction`           | `PUT /products/{id}`                   | PUT    | Atualiza produto (só campos alterados)    |
| `updateStatusAction`            | `PUT /products/{id}/update-status`     | PUT    | Ativa/desativa produto + `revalidatePath` |
| `addOptionalToProductAction`    | `POST /products/optionals`             | POST   | Vincula opcional a produto                |
| `removeOptionalToProductAction` | `DELETE /products/optionals/{id}`      | DELETE | Remove vínculo de opcional                |

#### Opcionais

| Action                 | Endpoint          | Método | Descrição                                      |
| ---------------------- | ----------------- | ------ | ---------------------------------------------- |
| `listOptionalsAction`  | `GET /optionals`  | GET    | Lista todos opcionais                          |
| `createOptionalAction` | `POST /optionals` | POST   | Cria opcional (preço convertido para centavos) |

#### Pedidos

| Action              | Endpoint                    | Método | Descrição       |
| ------------------- | --------------------------- | ------ | --------------- |
| `listOrdersAction`  | `GET /orders`               | GET    | Lista pedidos   |
| `finishOrderAction` | `PATCH /orders/{id}/finish` | PATCH  | Finaliza pedido |

### Conversão de Preços

A API trabalha com **preços em centavos** (inteiros). O frontend faz a conversão:

- **Envio:** `Math.round(price * 100)` — converte reais para centavos
- **Exibição:** `(price / 100).toFixed(2)` — converte centavos para reais

---

## 📄 Páginas da Aplicação

### Login (`app/login/`)

Página pública de autenticação. Server Component que verifica se já está autenticado.

#### Fluxo

```
1. Server Component: isAuthenticated() → se autenticado → redirect("/dashboard")
2. Renderiza LoginForm (Client Component)
3. Usuário preenche email e senha
4. Zod valida com loginSchema
5. loginUserAction → POST /sessions → setAuthToken(token)
6. toast.success → router.push("/dashboard")
```

---

### Register (`app/register/`)

Página pública de cadastro. Mesma estrutura do login.

#### Fluxo

```
1. Server Component: isAuthenticated() → se autenticado → redirect("/dashboard")
2. Renderiza RegisterForm (Client Component)
3. Usuário preenche nome, email e senha
4. Zod valida com registerSchema
5. registerUserAction → POST /users
6. toast.success → router.push("/login")
```

---

### Dashboard — Pedidos (`app/dashboard/`)

Página principal do dashboard. Exibe pedidos em produção como cards.

#### Fluxo

```
1. DashboardLayout: requireAuth("STAFF") → valida auth
2. Server Component: listOrdersAction() → GET /orders
3. Renderiza grid de OrderCard (Client Component)
4. Click em "Detalhes" → abre OrderDialog
5. OrderDialog mostra itens, opcionais, subtotais e total
6. "Finalizar pedido" → finishOrderAction → PATCH /orders/{id}/finish
```

#### Componentes

| Componente    | Tipo   | Descrição                                                            |
| ------------- | ------ | -------------------------------------------------------------------- |
| `OrderCard`   | Client | Card de pedido: mesa, status, itens resumidos, total, botão Detalhes |
| `OrderDialog` | Client | Dialog modal: detalhes completos do pedido com botão Finalizar       |

---

### Categorias (`app/dashboard/categories/`)

Listagem de categorias em cards. ADMIN vê botão "Nova categoria".

#### Rota `/dashboard/categories/new`

Formulário de criação de categoria (ADMIN only):

- Campos: nome (min 3 chars) + descrição (opcional)
- Validação: `createCategorySchema` (Zod + React Hook Form)
- Action: `createCategoryAction` → `POST /categories`

---

### Produtos (`app/dashboard/products/`)

Listagem de produtos em grid com filtro ativo/inativo via `Switch` (URL search params).

#### Componentes

| Componente             | Tipo   | Descrição                                                                    |
| ---------------------- | ------ | ---------------------------------------------------------------------------- |
| `ProductFilter`        | Client | Toggle Switch que altera query param `?disabled=true/false`                  |
| `ProductTable`         | Client | Grid de `ProductItem` + `DialogProductDetails` controlado por estado         |
| `ProductItem`          | Client | Card com imagem (Next Image), nome, status, categoria, preço, ações          |
| `DialogProductDetails` | Client | Dialog de detalhes com switch ativo/inativo (ADMIN) via `updateStatusAction` |

#### Rota `/dashboard/products/new`

Formulário de criação de produto (ADMIN only):

- Campos: nome, preço (string → number), descrição (min 10 chars), categoria (Select), imagem (File, max 5MB, JPG/PNG/WEBP)
- Preview da imagem antes do envio
- Action: `createProductAction` → `POST /products` (FormData)

#### Rota `/dashboard/products/[id]/edit`

Formulário de edição de produto + gerenciamento de opcionais (ADMIN only):

- Campos pré-preenchidos com dados do produto
- Só envia campos que foram alterados (diff inteligente)
- **BindOptional**: lista opcionais vinculados (com botão remover) + select para vincular novos
- Actions: `updateProductAction`, `addOptionalToProductAction`, `removeOptionalToProductAction`

---

### Opcionais (`app/dashboard/optionals/`)

Listagem de opcionais em cards. ADMIN vê botão "Cadastrar".

#### Rota `/dashboard/optionals/new`

Formulário de criação de opcional (ADMIN only):

- Campos: nome (min 3 chars) + preço (string → number > 0)
- Preço convertido para centavos antes do envio
- Action: `createOptionalAction` → `POST /optionals`

---

### Configurações/Perfil (`app/dashboard/user/`)

Página exclusiva ADMIN para alterar roles de outros usuários.

- Campos: email + radio (ADMIN/STAFF)
- Validação: `updateRoleSchema`
- Action: `updateRoleAction` → `PATCH /users/role`

---

## 🧩 Componentes Reutilizáveis

### Layout & Navegação

#### `Sidebar` (`components/dashboard/sidebar/sidebar.tsx`)

Menu lateral fixo para desktop (hidden em mobile, visível em `lg+`).

| Item de Menu  | Ícone               | Rota                    | Permissão   |
| ------------- | ------------------- | ----------------------- | ----------- |
| Pedidos       | `ShoppingCart`      | `/dashboard`            | STAFF/ADMIN |
| Categorias    | `Tags`              | `/dashboard/categories` | STAFF/ADMIN |
| Produtos      | `Package`           | `/dashboard/products`   | STAFF/ADMIN |
| Opcionais     | `RectangleEllipsis` | `/dashboard/optionals`  | STAFF/ADMIN |
| Configurações | `UserPen`           | `/dashboard/user`       | ADMIN only  |

- Exibe logo "Pastelaria**SG**" e saudação ao usuário
- Botão "Sair" chama `logoutAction` via form action
- Links ativos destacados com `bg-brand-primary`

#### `MobileSidebar` (`components/dashboard/sidebar/mobileSidebar.tsx`)

Header mobile com drawer lateral (`Sheet` do shadcn/ui):

- Visível apenas em telas `< lg`
- Mesmo menu da Sidebar desktop dentro de um Sheet
- Controle de estado aberto/fechado via `useState`

#### `Header` (`components/dashboard/header/header.tsx`)

Header reutilizável presente em todas as páginas do dashboard.

| Prop          | Tipo      | Descrição                                          |
| ------------- | --------- | -------------------------------------------------- |
| `title`       | string    | Título da página                                   |
| `description` | string?   | Subtítulo descritivo                               |
| `href`        | string?   | Link para ação (ex: "/dashboard/products/new")     |
| `textLink`    | string?   | Texto do botão-link (ex: "Cadastrar novo produto") |
| `children`    | ReactNode | Conteúdo alternativo ao link                       |

Exibe botão com ícone `Plus` quando `href` e `textLink` são fornecidos.

---

### Formulários

| Componente        | Arquivo                                | Descrição                                                |
| ----------------- | -------------------------------------- | -------------------------------------------------------- |
| `LoginForm`       | `loginforms/login/loginForm.tsx`       | Card com form email+senha, validação Zod, login action   |
| `RegisterForm`    | `loginforms/register/registerForm.tsx` | Card com form nome+email+senha, register action          |
| `CategoryForm`    | `categoriesForm/categoryform.tsx`      | Form com nome e descrição para criar categoria           |
| `ProductForm`     | `productsForms/productform.tsx`        | Form completo com upload de imagem e select de categoria |
| `ProductEditForm` | `productsForms/editForm.tsx`           | Form de edição + BindOptional para gerenciar opcionais   |
| `OptionalForm`    | `optionalsForm/optionalForm.tsx`       | Form com nome e preço para criar opcional                |
| `ProfileForm`     | `profileform/profileForm.tsx`          | Form com email e radio ADMIN/STAFF para alterar role     |

### Pedidos

| Componente    | Arquivo                          | Descrição                                           |
| ------------- | -------------------------------- | --------------------------------------------------- |
| `OrderCard`   | `dashboard/card/card.tsx`        | Card de pedido com total calculado e botão Detalhes |
| `OrderDialog` | `dashboard/card/orderDialog.tsx` | Dialog com detalhes completos e botão Finalizar     |

### Produtos

| Componente             | Arquivo                             | Descrição                                          |
| ---------------------- | ----------------------------------- | -------------------------------------------------- |
| `ProductTable`         | `productsTable/productTable.tsx`    | Grid de produtos + dialog de detalhes              |
| `ProductItem`          | `productsTable/productItem.tsx`     | Card individual de produto com imagem e ações      |
| `DialogProductDetails` | `productsTable/productDialog.tsx`   | Dialog com toggle ativo/inativo                    |
| `ProductFilter`        | `productFilter/productFilter.tsx`   | Switch para filtrar produtos ativos/inativos       |
| `BindOptional`         | `productOptionals/bindOptional.tsx` | Gerenciamento de opcionais vinculados a um produto |

### Componentes UI (shadcn/ui)

12 componentes instalados em `components/ui/`:

`alertDialog` · `button` · `card` · `dialog` · `input` · `label` · `select` · `sheet` · `sonner` · `switch` · `table` · `textarea`

Todos seguem o padrão shadcn/ui: **Radix primitives + CVA + Tailwind**.

---

## ✅ Validação de Formulários

Todos os formulários utilizam o padrão **Zod + React Hook Form + @hookform/resolvers**, com validação dupla:

1. **Client-side**: Zod via `zodResolver` no React Hook Form (feedback instantâneo)
2. **Server-side**: Zod `safeParse` nas Server Actions (segurança)

### Schemas Disponíveis

#### Login (`schemas/login.schema.ts`)

| Schema           | Campos                      | Validação                                   |
| ---------------- | --------------------------- | ------------------------------------------- |
| `loginSchema`    | `email`, `password`         | Email válido, senha min 6 chars             |
| `registerSchema` | `name`, `email`, `password` | Nome min 3 chars, email válido, senha min 6 |

#### Categoria (`schemas/category.schema.ts`)

| Schema                 | Campos                | Validação                    |
| ---------------------- | --------------------- | ---------------------------- |
| `createCategorySchema` | `name`, `description` | Nome min 3 chars, desc. opt. |

#### Produto (`schemas/product.schema.ts`)

| Schema                      | Campos                                                 | Validação                                                                      |
| --------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `createProductSchema`       | `name`, `price`, `description`, `category_id`, `image` | Nome min 3, preço string→number > 0, desc. min 10, imagem max 5MB JPG/PNG/WEBP |
| `updateProductSchema`       | Todos opcionais                                        | Mesmas regras, campos opcionais                                                |
| `createProductServerSchema` | Server-side (price já é number)                        | Validação final no servidor                                                    |
| `updateProductServerSchema` | Server-side (todos opcionais)                          | Validação final no servidor                                                    |

#### Opcional (`schemas/optional.schema.ts`)

| Schema                       | Campos          | Validação                                 |
| ---------------------------- | --------------- | ----------------------------------------- |
| `createOptionalSchema`       | `name`, `price` | Nome min 3 chars, preço string→number > 0 |
| `createOptionalServerSchema` | Server-side     | Nome string, preço number positivo        |

#### Perfil (`schemas/profile.schema.ts`)

| Schema             | Campos          | Validação                             |
| ------------------ | --------------- | ------------------------------------- |
| `updateRoleSchema` | `email`, `role` | Email válido, role "ADMIN" ou "STAFF" |

### Padrão de Uso nos Formulários

```typescript
const {
	register,
	handleSubmit,
	formState: { errors, isSubmitting },
} = useForm<InputType, any, OutputType>({
	resolver: zodResolver(schema),
});

async function onSubmit(data: OutputType) {
	const response = await serverAction(data);
	if (response.success) {
		toast.success("Sucesso!");
		router.push("/destino");
	} else {
		// Trata erros de API
	}
}
```

### Feedback Visual

- Campo com erro: `<p className="text-sm text-red-500">{error.message}</p>` abaixo do input
- Botão desabilitado durante submissão (`isSubmitting`) com spinner animado
- Erros de API: exibidos como `<p>` com `animate-bounce` ou via toast

---

## 🎨 Tema e Estilização

### Tema Escuro Customizado (`globals.css`)

O Tailwind CSS v4 é configurado com paleta de marca via `@theme`:

```css
@import "tailwindcss";
@plugin "tailwind-scrollbar";
@import "tw-animate-css";

@theme {
	/* Brand / Ações Principais */
	--color-brand-primary: #f6005d;
	--color-brand-primary-hover: #ff3f4b;
	--color-brand-primary-active: #e6004c;
	--color-brand-primary-soft: #ff5c6a;
	--color-brand-primary-soft-light: #ff7a85;

	/* Accent / Destaques */
	--color-accent-default: #c9184a;
	--color-accent-hover: #a4133c;
	--color-accent-soft: #ff8fa3;

	/* Backgrounds do App */
	--color-app-background: #080c1a;
	--color-app-surface: #0c111f;
	--color-app-surface-alt: #11172a;
	--color-app-surface-deep: #151a29;
	--color-app-surface-elevated: #161c33;

	/* Texto / Neutros */
	--color-text-primary: #ffffff;
	--color-text-secondary: #b2b7c6;
	--color-text-muted: #8f95a6;
	--color-text-disabled: #6b7082;
	--color-border-default: #4a4f5e;
	--color-border-strong: #363a45;

	/* Feedback / Status */
	--color-feedback-danger: #f6005d;
	--color-feedback-danger-soft: #ff7a85;
}
```

### Paleta de Cores

| Token                 | Hex       | Uso                                        |
| --------------------- | --------- | ------------------------------------------ |
| `brand-primary`       | `#f6005d` | Botões principais, links ativos, destaques |
| `brand-primary-hover` | `#ff3f4b` | Hover de botões primários                  |
| `accent-default`      | `#c9184a` | Botões de login/registro                   |
| `app-background`      | `#080c1a` | Fundo geral do app, inputs                 |
| `app-surface`         | `#0c111f` | Sidebar, superfícies de cards              |
| `app-surface-alt`     | `#11172a` | Background do conteúdo principal           |
| `app-surface-deep`    | `#151a29` | Cards de formulários e listagens           |
| `text-primary`        | `#ffffff` | Textos principais                          |
| `text-muted`          | `#8f95a6` | Textos secundários, saudação               |
| `text-disabled`       | `#6b7082` | Labels descritivos, informações auxiliares |
| `feedback-danger`     | `#f6005d` | Erros, mensagens de falha                  |

### Fontes

| Fonte      | Variável CSS        | Uso              |
| ---------- | ------------------- | ---------------- |
| Geist Sans | `--font-geist-sans` | Textos gerais    |
| Geist Mono | `--font-geist-mono` | Código/monospace |

### Responsividade

O layout usa abordagem **mobile-first** com breakpoint principal `lg` (1024px):

| Viewport      | Sidebar                              | Header/Conteúdo           |
| ------------- | ------------------------------------ | ------------------------- |
| Mobile (< lg) | MobileSidebar (Sheet drawer lateral) | Conteúdo full-width       |
| Desktop (lg+) | Sidebar fixa à esquerda (w-64)       | Conteúdo flex-1 à direita |

---

## ⚙️ Variáveis de Ambiente

| Variável              | Obrigatória | Exemplo                 | Descrição                              |
| --------------------- | ----------- | ----------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅          | `http://localhost:3333` | URL pública da API (exposta no bundle) |
| `API_URL`             | ❌          | `http://localhost:3333` | URL privada server-side (não exposta)  |

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto               | Padrão      | Exemplo                                           |
| ---------------------- | ----------- | ------------------------------------------------- |
| Componentes            | PascalCase  | `OrderCard`, `ProductFilter`, `BindOptional`      |
| Arquivos de componente | camelCase   | `orderDialog.tsx`, `productFilter.tsx`            |
| Server Actions         | camelCase   | `loginUserAction`, `createProductAction`          |
| Schemas                | camelCase   | `loginSchema`, `createProductSchema`              |
| Interfaces/Tipos       | PascalCase  | `User`, `Product`, `OrderItem`                    |
| Variáveis de ambiente  | UPPER_SNAKE | `NEXT_PUBLIC_API_URL`                             |
| Diretórios             | camelCase   | `loginforms/`, `productsTable/`, `productsForms/` |

### Padrão de Página Autenticada (Server Component)

```tsx
export default async function Page() {
	// 1. Guard de autenticação
	const user = await requireAuth({ needRole: "STAFF" });

	// 2. Carrega dados
	const data = await listAction();

	// 3. Renderiza
	return (
		<div>
			<Header
				title="Título"
				href={user.role === "ADMIN" ? "/new" : undefined}
			/>
			<ClientComponent data={data} user={user} />
		</div>
	);
}
```

### Padrão de Formulário (Client Component)

```tsx
"use client";

export default function Form() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(schema),
	});
	const router = useRouter();

	async function onSubmit(data) {
		const response = await serverAction(data);
		if (response.success) {
			toast.success("Sucesso!", {
				onAutoClose: () => router.push("/destino"),
			});
		} else {
			// Trata erros
		}
	}

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input {...register("campo")} />
				{errors.campo && <p className="text-red-500">{errors.campo.message}</p>}
				<Button disabled={isSubmitting}>
					{isSubmitting ? <Spinner /> : "Enviar"}
				</Button>
			</form>
		</Card>
	);
}
```

### Layout do Dashboard

```tsx
<div className="flex min-h-screen w-full text-white">
	<Sidebar user={user} />
	<div className="flex flex-1 flex-col overflow-hidden">
		<MobileSidebar user={user} />
		<main className="bg-app-surface-alt flex-1">
			<div className="container max-w-full px-4 py-6">{children}</div>
		</main>
	</div>
</div>
```

### State Management

| Escopo           | Solução                 | Uso                                        |
| ---------------- | ----------------------- | ------------------------------------------ |
| **Server**       | Server Components (RSC) | Carregamento de dados no render            |
| **Client Local** | `useState`              | Modais, loading, previews, seleções        |
| **Formulários**  | React Hook Form         | Valores, validação, submissão              |
| **URL State**    | Search Params           | Filtros (ex: `?disabled=true` em produtos) |
| **Cache**        | `revalidatePath()`      | Invalidação de cache após mutações         |
| **Navegação**    | `router.refresh()`      | Recarrega dados após operações de escrita  |

### Notificações (Toast)

O projeto usa `sonner` com `richColors`:

| Tipo                 | Quando                                    |
| -------------------- | ----------------------------------------- |
| `toast.success(msg)` | Login/cadastro/criação/edição com sucesso |
| `toast.error(msg)`   | Erros de API, falhas de operação          |

Configuração global: posição `top-center`, duração `1000ms`, `richColors` ativado.

### Tratamento de Erros

- **Validação client-side**: Zod via React Hook Form → mensagens inline abaixo dos campos
- **Validação server-side**: Zod nas Server Actions → erros retornados no objeto `errors`
- **Erros de API**: Capturados via `try/catch` nas actions → mapeados para `errors._form`
- **Feedback visual**: Toast (sonner) para erros de API, `<p className="text-red-500">` para validação de campos, `animate-bounce` para erros de submissão
