# 📱 PastelariaSG — Mobile

Aplicativo mobile para abertura, composição e envio de pedidos em salão, com selects encadeados (categoria → produto → opcional), controle de quantidade, autenticação JWT e persistência via AsyncStorage.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2-06B6D4?style=flat&logo=tailwind-css&logoColor=white)

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

O **PastelariaSG Mobile** é o aplicativo React Native (Expo) que complementa o frontend web do sistema de gestão para pastelarias. Enquanto a aplicação web é voltada para gerenciamento administrativo (CRUD de categorias, produtos, opcionais, finalização de pedidos), o mobile é focado no **fluxo operacional de salão**: o funcionário abre um pedido informando a mesa, monta os itens com selects encadeados e envia para a cozinha.

### Características principais

- ✅ Navegação file-based com Expo Router e Stack navigator
- ✅ Autenticação via JWT persistido no AsyncStorage
- ✅ Abertura de pedido com número da mesa e nome do cliente (opcional)
- ✅ Composição de itens com selects encadeados (categoria → produto → opcional)
- ✅ Controle de quantidade por item (1–10)
- ✅ Visualização em FlatList com preços e opcionais por item
- ✅ Remoção individual de itens e exclusão de pedido rascunho
- ✅ Envio do pedido para cozinha com confirmação via Alert
- ✅ UI com NativeWind (Tailwind CSS) + CVA + tema escuro customizado
- ✅ Notificações toast com React Native Toast Message
- ✅ Interceptor Axios para injeção automática de token

### Escopo do Mobile vs. Frontend Web

| Funcionalidade                        | Mobile | Web |
| ------------------------------------- | :----: | :-: |
| Login com email e senha               |   ✅   | ✅  |
| Abertura e composição de pedidos      |   ✅   | ❌  |
| Envio de pedido para cozinha          |   ✅   | ❌  |
| Cadastro de usuários                  |   ❌   | ✅  |
| CRUD de categorias/produtos/opcionais |   ❌   | ✅  |
| Listagem e finalização de pedidos     |   ❌   | ✅  |
| Gerência de roles (ADMIN/STAFF)       |   ❌   | ✅  |

---

## 🚀 Tecnologias

| Categoria        | Tecnologia          | Versão   | Descrição                                       |
| ---------------- | ------------------- | -------- | ----------------------------------------------- |
| **Framework**    | React Native        | 0.81.5   | Framework mobile multiplataforma                |
| **Plataforma**   | Expo                | ~54.0.29 | Plataforma de desenvolvimento e build           |
| **Linguagem**    | TypeScript          | ~5.9.2   | Superset JavaScript com tipagem estática        |
| **Navegação**    | Expo Router         | ~6.0.19  | File-based routing sobre React Navigation       |
| **Navegação**    | React Navigation    | 7.0.0    | Stack navigator nativo                          |
| **Estilização**  | NativeWind          | 4.2.1    | Tailwind CSS para React Native                  |
| **Estilização**  | Tailwind CSS        | 3.4.14   | Engine de utilitários CSS                       |
| **Componentes**  | CVA                 | 0.7.1    | Variantes de componentes (button, text)         |
| **Ícones**       | Lucide React Native | 0.545.0  | Biblioteca de ícones SVG                        |
| **Primitivos**   | RN Primitives       | —        | Componentes base (label, slot, portal)          |
| **HTTP**         | Axios               | 1.13.5   | Cliente HTTP com interceptors de token          |
| **Estado**       | React Context API   | —        | Estado global de autenticação                   |
| **Persistência** | AsyncStorage        | 2.2.0    | Armazenamento local de token e dados do usuário |
| **Notificações** | Toast Message       | 2.3.3    | Notificações toast (success, error)             |
| **Animações**    | Reanimated          | ~4.1.1   | Animações de alta performance                   |
| **Formatação**   | Prettier            | 3.6.2    | Formatador de código opinativo                  |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Login com email e senha via `POST /sessions`
- Token JWT e dados do usuário persistidos no AsyncStorage
- Auto-redirect na tela index baseado no estado de autenticação
- Guard no grupo `(authenticated)` — redireciona para login se não autenticado
- Logout com limpeza do AsyncStorage e reset do estado

### 🛒 Fluxo de Pedidos

- **Abrir pedido**: informa mesa (obrigatório) + nome do cliente (opcional) → `POST /orders`
- **Selecionar categoria**: primeiro select — carrega categorias do backend
- **Selecionar produto**: segundo select — filtra produtos pela categoria selecionada
- **Selecionar opcional**: terceiro select — exibe opcionais vinculados ao produto escolhido
- **Definir quantidade**: controle −/+ com limite de 1 a 10
- **Adicionar item**: insere produto (+ opcional) no pedido via `POST /orders/items`
- **Visualizar itens**: FlatList com nome, quantidade, preço unitário e opcionais
- **Remover item**: botão lixeira por item — remove via `DELETE /orders/remove/:item_id`
- **Excluir pedido**: botão no header — deleta pedido rascunho e volta ao dashboard
- **Enviar pedido**: tela de checkout — confirma via Alert e envia via `PATCH /orders/:id/send`

---

## 📁 Estrutura do Projeto

```
mobile/
├── @types/                              # Definições de tipos TypeScript globais
│   ├── categories.d.ts                  # Interface Category
│   ├── optionals.d.ts                   # Interfaces Optional, ProductOptional
│   ├── orders.d.ts                      # Interfaces Order, OrderItem, ItemOptional
│   ├── products.d.ts                    # Interface Product
│   └── user.d.ts                        # Interfaces User, AuthResponse
│
├── app/                                 # Rotas (Expo Router — file-based)
│   ├── _layout.tsx                      # Layout raiz: AuthProvider + Toast + StatusBar
│   ├── index.tsx                        # Splash/redirect (verifica auth)
│   ├── login.tsx                        # Tela de login (email + senha)
│   └── (authenticated)/                 # Grupo protegido (guard de auth)
│       ├── _layout.tsx                  # Guard: redireciona se não autenticado
│       ├── dashboard.tsx                # Abertura de novo pedido (mesa + nome)
│       └── orders/
│           └── [order_id]/
│               ├── index.tsx            # Composição de itens do pedido
│               └── checkout.tsx         # Confirmação e envio para cozinha
│
├── components/                          # Componentes reutilizáveis
│   ├── header/
│   │   ├── orderHeader.tsx              # Header: título da mesa + botão excluir
│   │   └── sendHeader.tsx               # Header: seta voltar + título
│   ├── select/
│   │   └── select.tsx                   # Select com modal (categoria/produto/opcional)
│   └── ui/                              # 5 componentes base (CVA + NativeWind)
│       ├── button.tsx                   # Pressable com variantes (default/destructive/outline/...)
│       ├── icon.tsx                     # Wrapper Lucide com suporte a className
│       ├── input.tsx                    # TextInput estilizado
│       ├── label.tsx                    # Label via @rn-primitives/label
│       └── text.tsx                     # Text com variantes semânticas (h1–h4, p, muted, ...)
│
├── configs/
│   └── api.config.ts                    # { baseURL, timeout } via Expo Constants
│
├── contexts/
│   └── authContext.tsx                   # AuthProvider + useAuth() hook
│
├── lib/                                 # Bibliotecas e utilitários
│   ├── api.ts                           # Instância Axios + interceptor de token
│   └── utils.ts                         # cn() — clsx + tailwind-merge
│
├── assets/images/                       # Recursos estáticos (ícone, splash)
├── .env.example                         # Template de variáveis de ambiente
├── app.config.js                        # Config dinâmica do Expo (lê env)
├── app.json                             # Config estática do Expo
├── babel.config.js                      # Babel + NativeWind preset
├── metro.config.js                      # Metro + NativeWind
├── tailwind.config.js                   # Tema: cores brand, app, texto, bordas
├── global.css                           # Tailwind layers + CSS variables
├── tsconfig.json                        # TypeScript strict + path alias @/*
└── package.json                         # Dependências e scripts
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **Backend da PastelariaSG** rodando (API em `http://localhost:3333`)

### Para dispositivo/emulador

| Plataforma | Requisito                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| Android    | [Android Studio](https://developer.android.com/studio) com emulador **ou** dispositivo com [Expo Go](https://expo.dev/go) |
| iOS        | [Xcode](https://developer.apple.com/xcode/) (apenas Mac) **ou** dispositivo com [Expo Go](https://expo.dev/go)            |

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/pastelaria

# Acesse a pasta do mobile
cd mobile

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do mobile (ou copie o `.env.example`):

```bash
cp .env.example .env
```

Edite o `.env` com a URL do backend:

```env
EXPO_PUBLIC_API_BASE_URL="http://localhost:3333"
```

| Ambiente           | Valor                        |
| ------------------ | ---------------------------- |
| Android Emulator   | `http://10.0.2.2:3333`       |
| iOS Simulator      | `http://localhost:3333`      |
| Dispositivo Físico | `http://{SEU_IP_LOCAL}:3333` |

| Variável                   | Obrigatória | Descrição                                                 |
| -------------------------- | ----------- | --------------------------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | ✅          | URL da API consumida via Expo Constants (`app.config.js`) |

> **Nota:** Para encontrar seu IP local: `ipconfig` (Windows) ou `ifconfig` / `ip addr` (Mac/Linux). Certifique-se de que o backend está rodando antes de iniciar o app.

---

## 💻 Execução

```bash
# Iniciar servidor de desenvolvimento (limpa cache)
npm run dev

# Abrir no Android (emulador ou dispositivo)
npm run android

# Abrir no iOS (apenas Mac)
npm run ios

# Abrir na web
npm run web
```

A aplicação estará disponível no Expo Go ou emulador configurado.

---

## 🗺️ Rotas da Aplicação

| Rota                         | Guard       | Tela       | Descrição                           |
| ---------------------------- | ----------- | ---------- | ----------------------------------- |
| `/`                          | —           | Index      | Splash + redirect automático (auth) |
| `/login`                     | Pública     | Login      | Formulário de email e senha         |
| `/dashboard`                 | Autenticada | Dashboard  | Abrir novo pedido (mesa + nome)     |
| `/orders/:order_id`          | Autenticada | Composição | Montar itens do pedido              |
| `/orders/:order_id/checkout` | Autenticada | Checkout   | Confirmar e enviar para cozinha     |

- **Pública**: Acessível sem autenticação
- **Autenticada**: Grupo `(authenticated)` com guard — redireciona para `/login` se `!signed`

### Fluxo de Navegação

```
         ┌───────────┐
         │   index   │ → Verifica auth
         └─────┬─────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
┌────────┐      ┌──────────────┐
│ login  │      │  dashboard   │ ← Abrir mesa
└────┬───┘      └──────┬───────┘
     │                 │
     │                 ▼
     │       ┌───────────────────────┐
     │       │ orders/[order_id]     │ ← Montar itens
     │       └──────────┬────────────┘
     │                  │
     │                  ▼
     │       ┌───────────────────────┐
     │       │ orders/.../checkout   │ ← Enviar pedido
     │       └──────────┬────────────┘
     │                  │
     └──────────────────┘  (volta ao dashboard)
```

---

## 🏗️ Arquitetura e Padrões

### Fluxo de uma Requisição

```
Ação do Usuário → Tela (Screen) → useState / handlers
       ↓                                  ↓
  Axios (lib/api.ts) → Interceptor (Bearer token) → Backend REST → Resposta
       ↓
  Toast.show() / Alert / router.replace() → Atualiza estado local
```

### Gerenciamento de Estado

| Escopo           | Solução            | Uso                                               |
| ---------------- | ------------------ | ------------------------------------------------- |
| **Global**       | React Context API  | Autenticação (user, signed, loadingAuth)          |
| **Persistência** | AsyncStorage       | Token JWT (`@appSG:token`) e user (`@appSG:user`) |
| **Local**        | `useState`         | Selects, loadings, itens do pedido, quantidades   |
| **Navegação**    | Expo Router params | `order_id`, `table` (passados entre telas)        |

### Autenticação

- Token JWT salvo no **AsyncStorage** (`@appSG:token`, `@appSG:user`)
- Interceptor Axios injeta `Authorization: Bearer {token}` automaticamente
- Tela index verifica `signed` e redireciona para `/login` ou `/dashboard`
- Guard no `(authenticated)/_layout.tsx` — redireciona se `!signed`
- Logout limpa AsyncStorage e reseta estado do context

### Comunicação com a API

A instância Axios é configurada em `lib/api.ts` com `baseURL` via `configs/api.config.ts` (Expo Constants), timeout de 5s e interceptor de token. Preços são recebidos em **centavos** e exibidos em reais: `(price / 100).toFixed(2)`.

| Ação               | Método   | Endpoint                    | Tela       |
| ------------------ | -------- | --------------------------- | ---------- |
| Login              | `POST`   | `/sessions`                 | Login      |
| Criar pedido       | `POST`   | `/orders`                   | Dashboard  |
| Listar categorias  | `GET`    | `/categories`               | Composição |
| Listar produtos    | `GET`    | `/products?category_id=`    | Composição |
| Adicionar item     | `POST`   | `/orders/items`             | Composição |
| Remover item       | `DELETE` | `/orders/remove/:item_id`   | Composição |
| Detalhes do pedido | `GET`    | `/orders/details/:order_id` | Composição |
| Deletar pedido     | `DELETE` | `/orders/:order_id`         | Composição |
| Enviar pedido      | `PATCH`  | `/orders/:order_id/send`    | Checkout   |

---

## 📜 Scripts Disponíveis

| Comando           | Descrição                                 |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Inicia o servidor Expo com cache limpo    |
| `npm run android` | Abre no Android (emulador ou dispositivo) |
| `npm run ios`     | Abre no iOS (apenas Mac)                  |
| `npm run web`     | Abre na web                               |
| `npm run clean`   | Remove node_modules e limpa cache         |

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
    ├── frontend/
    │   └── CONTEXTO.md
    └── mobile/
        └── CONTEXTO.md
```

| Documento                                                              | Descrição                                                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **[📖 CONTEXTO.md (Mobile)](../documentation/mobile/CONTEXTO.md)**     | Contexto técnico completo do mobile                                                 |
| **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)**                            | Arquitetura detalhada do app mobile                                                 |
| **[📖 CONTEXTO.md (Backend)](../documentation/backend/CONTEXTO.md)**   | Arquitetura em camadas, modelagem de dados, regras de negócio e padrões do backend  |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)**           | Documentação de cada endpoint da API: método, body, query params, respostas e erros |
| **[📖 CONTEXTO.md (Frontend)](../documentation/frontend/CONTEXTO.md)** | Contexto técnico do frontend web                                                    |
