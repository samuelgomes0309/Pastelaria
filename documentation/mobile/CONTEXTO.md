# 📖 CONTEXTO TÉCNICO — PastelariaSG Mobile

Documento de referência técnica do aplicativo mobile do sistema de gestão para pastelarias. Descreve a arquitetura, componentes, fluxos, comunicação com a API, estilização e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Roteamento e Navegação](#-roteamento-e-navegação)
- [Autenticação](#-autenticação)
- [Comunicação com a API](#-comunicação-com-a-api)
- [Telas da Aplicação](#-telas-da-aplicação)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Gerenciamento de Estado](#-gerenciamento-de-estado)
- [Tipagem TypeScript](#-tipagem-typescript)
- [Tema e Estilização](#-tema-e-estilização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **PastelariaSG Mobile** é um aplicativo React Native construído com Expo SDK 54 e Expo Router 6 (file-based routing) que consome a API REST do backend. O app é voltado para **funcionários** (STAFF/ADMIN) realizarem operações de abertura de pedidos, composição de itens e envio para a cozinha — tudo em um fluxo otimizado para uso em salão de atendimento.

### Domínios da aplicação

| Domínio          | Responsabilidade                                                         |
| ---------------- | ------------------------------------------------------------------------ |
| **Autenticação** | Login com email/senha, persistência de sessão via AsyncStorage, logout   |
| **Pedidos**      | Criação de pedido (mesa + nome), composição de itens, envio para cozinha |
| **Categorias**   | Listagem para seleção ao montar um pedido                                |
| **Produtos**     | Listagem filtrada por categoria para adição ao pedido                    |
| **Opcionais**    | Seleção de adicionais vinculados ao produto escolhido                    |

### Escopo diferencial — Mobile vs Frontend Web

| Funcionalidade                  | Frontend Web | Mobile |
| ------------------------------- | ------------ | ------ |
| Login                           | ✅           | ✅     |
| Cadastro de usuário             | ✅           | ❌     |
| Gerência de roles               | ✅           | ❌     |
| CRUD de categorias              | ✅           | ❌     |
| CRUD de produtos                | ✅           | ❌     |
| CRUD de opcionais               | ✅           | ❌     |
| Listagem de pedidos em produção | ✅           | ❌     |
| Finalização de pedidos          | ✅           | ❌     |
| Abertura de pedido (mesa)       | ❌           | ✅     |
| Composição de itens no pedido   | ❌           | ✅     |
| Envio de pedido para cozinha    | ❌           | ✅     |
| Remoção de itens do pedido      | ❌           | ✅     |
| Exclusão de pedido rascunho     | ❌           | ✅     |

---

## 🚀 Stack Tecnológica

| Camada             | Tecnologia                     | Versão   | Papel                                                |
| ------------------ | ------------------------------ | -------- | ---------------------------------------------------- |
| Framework          | React Native                   | 0.81.5   | Framework para aplicações nativas multiplataforma    |
| Plataforma         | Expo                           | ~54.0.29 | Plataforma de desenvolvimento e build                |
| Linguagem          | TypeScript                     | ~5.9.2   | Tipagem estática e segurança em desenvolvimento      |
| Roteamento         | Expo Router                    | ~6.0.19  | Navegação file-based (baseada em arquivos)           |
| Estilização        | NativeWind                     | 4.2.1    | Tailwind CSS para React Native via className         |
| Tailwind           | Tailwind CSS                   | 3.4.14   | Configuração de tema, cores e utilitários            |
| Componentes UI     | RN Primitives + CVA            | —        | Componentes base com variantes (label, slot, portal) |
| Ícones             | Lucide React Native            | 0.545.0  | Ícones SVG como componentes React Native             |
| HTTP               | Axios                          | 1.13.5   | Cliente HTTP com interceptors                        |
| Estado Global      | React Context API              | —        | AuthContext para autenticação                        |
| Persistência Local | AsyncStorage                   | 2.2.0    | Armazenamento de token e dados do usuário            |
| Notificações       | React Native Toast Message     | 2.3.3    | Toasts de feedback (sucesso, erro, info)             |
| Animações          | React Native Reanimated        | ~4.1.1   | Animações de alta performance                        |
| Safe Area          | react-native-safe-area-context | —        | Gerenciamento de áreas seguras (notch, status bar)   |

---

## 🏗️ Arquitetura

### Visão Geral do Fluxo

```
┌───────────────────────────────────────────────────┐
│                 Ação do Usuário                    │
│       (tap em botão, digitação em input)           │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│           Expo Router (File-based)                 │
│   Resolve a rota, aplica layout de autenticação    │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│             Screen (Tela / Componente)             │
│  Gerencia estado local (useState), chama API,      │
│  renderiza componentes UI                          │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│          Instância Axios (lib/api.ts)              │
│  Interceptor injeta Bearer token automaticamente   │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────┐
│              Backend REST (Express)                │
│  Processa a requisição e retorna resposta JSON     │
└───────────────────────────────────────────────────┘
```

### Estrutura de Camadas

| Camada           | Diretório      | Responsabilidade                                             |
| ---------------- | -------------- | ------------------------------------------------------------ |
| **Entrada**      | `_layout.tsx`  | Layout raiz: AuthProvider, StatusBar, Toast, Stack navigator |
| **Roteamento**   | `app/`         | File-based routing com grupos autenticados                   |
| **Telas**        | `app/**/*.tsx` | Composição de UI, lógica de negócio, chamadas à API          |
| **Componentes**  | `components/`  | Elementos de UI reutilizáveis (headers, selects, UI base)    |
| **Contexto**     | `contexts/`    | AuthContext — estado global de autenticação                  |
| **Configuração** | `configs/`     | Configuração da API (baseURL, timeout)                       |
| **Lib**          | `lib/`         | Instância Axios configurada + utilitário `cn()`              |
| **Tipos**        | `@types/`      | Definições de tipos TypeScript globais (.d.ts)               |

### Layout Raiz (`app/_layout.tsx`)

```typescript
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle={'light-content'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(authenticated)" />
      </Stack>
      <Toast autoHide={true} position="top" visibilityTime={3000} />
    </AuthProvider>
  );
}
```

- `AuthProvider` envolve toda a aplicação (estado global de autenticação)
- `StatusBar` com `light-content` (texto branco sobre fundo escuro)
- Todas as headers nativas desativadas (`headerShown: false`)
- `Toast` global com auto-hide de 3 segundos, posição `top`

---

## 🛣️ Roteamento e Navegação

### Mapa de Rotas (File-based Routing)

| Arquivo                                              | URL                          | Proteção    | Descrição                      |
| ---------------------------------------------------- | ---------------------------- | ----------- | ------------------------------ |
| `app/index.tsx`                                      | `/`                          | —           | Splash/redirect automático     |
| `app/login.tsx`                                      | `/login`                     | Pública     | Tela de login                  |
| `app/(authenticated)/_layout.tsx`                    | —                            | Guard       | Layout com verificação de auth |
| `app/(authenticated)/dashboard.tsx`                  | `/dashboard`                 | Autenticada | Dashboard — abrir novo pedido  |
| `app/(authenticated)/orders/[order_id]/index.tsx`    | `/orders/:order_id`          | Autenticada | Composição de itens do pedido  |
| `app/(authenticated)/orders/[order_id]/checkout.tsx` | `/orders/:order_id/checkout` | Autenticada | Confirmação e envio do pedido  |

### Grupo `(authenticated)`

O grupo entre parênteses **não aparece na URL** — serve apenas para aplicar um layout comum que verifica autenticação:

```typescript
// app/(authenticated)/_layout.tsx
export default function AuthenticatedLayout() {
  const { loadingAuth, signed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !signed) {
      router.replace('/login');
    }
  }, [loadingAuth, signed]);

  if (loadingAuth || !signed) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- Se `loadingAuth` → renderiza nada (tela vazia enquanto verifica)
- Se não `signed` → redireciona para `/login`
- Se `signed` → renderiza as telas filhas via `<Stack />`

### Tela Index (Splash/Redirect)

A rota raiz (`/`) funciona como ponto de decisão:

```typescript
// app/index.tsx
useEffect(() => {
	if (loadingAuth) return;
	const isAuthGroup = segments[0] === "(authenticated)";
	if (!signed && isAuthGroup) {
		router.replace("/login");
	} else if (signed && !isAuthGroup) {
		router.replace("/(authenticated)/dashboard");
	}
}, [loadingAuth, signed, segments]);
```

- Enquanto verifica auth → exibe `ActivityIndicator` com cor `#f6005d`
- Se autenticado → redireciona para `/dashboard`
- Se não autenticado → redireciona para `/login`

### Navegação Programática

```typescript
// Navegar para pedido
router.replace({
	pathname: "/(authenticated)/orders/[order_id]",
	params: { order_id: response.data.id },
});

// Navegar com parâmetros extras
router.push({
	pathname: "/orders/[order_id]/checkout",
	params: { order_id: safeOrderId, table: table },
});

// Voltar para dashboard
router.replace({
	pathname: "/(authenticated)/dashboard",
	params: { refresh: "true" },
});
```

---

## 🔐 Autenticação

### Visão Geral

A autenticação é baseada em **JWT** armazenado no **AsyncStorage** e gerenciada pelo **AuthContext** (React Context API). O token é injetado automaticamente em todas as requisições via interceptor do Axios.

### Interface do Usuário

```typescript
export interface User {
	id: string;
	name: string;
	email: string;
	role: "STAFF" | "ADMIN";
}

export interface AuthResponse extends User {
	token: string;
}
```

### AuthContext (`contexts/authContext.tsx`)

| Propriedade   | Tipo                                                 | Descrição                                 |
| ------------- | ---------------------------------------------------- | ----------------------------------------- |
| `user`        | `User \| null`                                       | Dados do usuário autenticado              |
| `signed`      | `boolean`                                            | `!!user` — indica se está logado          |
| `loadingAuth` | `boolean`                                            | `true` enquanto verifica dados do storage |
| `signIn`      | `(email: string, password: string) => Promise<void>` | Realiza login via API                     |
| `signOut`     | `() => Promise<void>`                                | Limpa storage e reseta estado             |

### Fluxo Completo de Autenticação

```
1. App inicializa → AuthProvider monta → loadStorageUser()
      │
2a. Token + user encontrados no AsyncStorage → setUser(user) → signed = true
2b. Nada encontrado → signed = false → loadingAuth = false
      │
3. Index.tsx verifica signed:
   - signed=true → router.replace("/dashboard")
   - signed=false → router.replace("/login")
      │
4. Usuário digita email/senha e clica "Acessar"
      │
5. handleLogin() → signIn(email, password)
      │
6. signIn(): POST /sessions → recebe { token, ...user }
      │
7. AsyncStorage.setItem("@appSG:token", token)
   AsyncStorage.setItem("@appSG:user", JSON.stringify(user))
   setUser(user)
      │
8. router.replace("/(authenticated)/dashboard")
```

### Persistência de Sessão

| Chave AsyncStorage | Conteúdo                | Descrição                                |
| ------------------ | ----------------------- | ---------------------------------------- |
| `@appSG:token`     | JWT string              | Token de autenticação                    |
| `@appSG:user`      | JSON stringified `User` | Dados do usuário (id, name, email, role) |

### Logout

```typescript
async function signOut() {
	await AsyncStorage.removeItem("@appSG:token");
	await AsyncStorage.removeItem("@appSG:user");
	setUser(null); // signed = false → redirect para /login
}
```

---

## 📡 Comunicação com a API

### Configuração (`configs/api.config.ts`)

```typescript
import Constants from "expo-constants";

export const API_CONFIG = {
	baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
	timeout: 5000,
};
```

- `baseURL` obtida via `app.config.js` → `expo.extra.apiBaseUrl` → env `EXPO_PUBLIC_API_BASE_URL`
- Timeout de **5 segundos**

### Instância Axios (`lib/api.ts`)

```typescript
export const api = axios.create({
	baseURL: baseURL,
	timeout: timeout,
	headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem("@appSG:token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
```

- Token JWT injetado automaticamente em **todas** as requisições via interceptor
- Apenas requisições JSON (sem upload de imagens no mobile)

### Endpoints Consumidos pelo Mobile

| Ação               | Método   | Endpoint                     | Tela      | Descrição                          |
| ------------------ | -------- | ---------------------------- | --------- | ---------------------------------- |
| Login              | `POST`   | `/sessions`                  | Login     | Autentica e retorna token + user   |
| Criar pedido       | `POST`   | `/orders`                    | Dashboard | Cria pedido rascunho (mesa + nome) |
| Listar categorias  | `GET`    | `/categories`                | Orders    | Lista categorias para seleção      |
| Listar produtos    | `GET`    | `/products?category_id={id}` | Orders    | Produtos filtrados por categoria   |
| Adicionar item     | `POST`   | `/orders/items`              | Orders    | Adiciona produto ao pedido         |
| Remover item       | `DELETE` | `/orders/remove/{item_id}`   | Orders    | Remove item (query: order_id)      |
| Detalhes do pedido | `GET`    | `/orders/details/{order_id}` | Orders    | Carrega pedido com itens           |
| Deletar pedido     | `DELETE` | `/orders/{order_id}`         | Orders    | Exclui pedido rascunho             |
| Enviar pedido      | `PATCH`  | `/orders/{order_id}/send`    | Checkout  | Envia pedido para cozinha          |

### Padrão de Chamadas nas Telas

Todas as chamadas seguem o mesmo padrão:

```typescript
try {
	setLoading(true);
	const response = await api.method("/endpoint", data);
	// Atualiza estado com response.data
	Toast.show({ type: "success", text1: "Sucesso", text2: "Mensagem" });
} catch (error: unknown) {
	if (error instanceof AxiosError) {
		Alert.alert("Erro", error.response?.data?.message);
	} else {
		Alert.alert("Erro", "Ocorreu um erro inesperado.");
	}
} finally {
	setLoading(false);
}
```

### Conversão de Preços

A API trabalha com **preços em centavos** (inteiros). O mobile exibe em reais:

- **Exibição:** `(price / 100).toFixed(2)` — ex: `1500` → `"15.00"`

---

## 📱 Telas da Aplicação

### Login (`app/login.tsx`)

Tela pública de autenticação com campos de email e senha.

#### Layout

- `KeyboardAvoidingView` com behavior `"padding"`
- `ScrollView` centralizado com `keyboardShouldPersistTaps="handled"`
- Logo "Pastelaria**SG**" centralizada no topo
- Campos: email e senha com `Input` customizado
- Botão "Acessar" com loading indicator

#### Fluxo

```
1. Usuário preenche email e senha
2. handleLogin() valida campos (trim não vazio)
3. signIn(email, password) → POST /sessions
4. Sucesso → router.replace("/dashboard")
5. Erro → Alert.alert("Erro", "Falha ao tentar fazer login")
```

#### Validação

- Email: `!email.trim()` → alerta "preencha todos os campos"
- Senha: `!password.trim()` → alerta "preencha todos os campos"
- Validação apenas de presença (sem regex de email no client)

---

### Dashboard (`app/(authenticated)/dashboard.tsx`)

Tela principal para abertura de novos pedidos. O funcionário informa mesa e opcionalmente o nome do cliente.

#### Layout

- Botão "Sair" posicionado absolutamente no canto superior direito (com `useSafeAreaInsets`)
- Logo "Pastelaria**SG**" centralizada
- Título "Novo Pedido"
- Input numérico para número da mesa
- Input texto para nome do cliente (opcional)
- Botão "Abrir mesa" com loading indicator

#### Fluxo

```
1. Funcionário digita número da mesa (obrigatório, numérico > 0)
2. Opcionalmente digita nome do cliente (validação: não pode ser número)
3. handleCreateTable() → POST /orders { table, name }
4. Sucesso → router.replace({ pathname: "/orders/[order_id]", params: { order_id } })
5. Erro AxiosError → Alert com mensagem do backend
```

#### Validações

- `tableNumber.trim()` vazio → alerta
- `parseInt(tableNumber)` → `isNaN` ou `<= 0` → alerta "número válido"
- `name` && `!isNaN(Number(name))` → alerta "nome válido para o cliente"

---

### Composição do Pedido (`app/(authenticated)/orders/[order_id]/index.tsx`)

Tela principal do fluxo de montagem de pedido. Permite selecionar categoria → produto → opcional → quantidade, adicionar itens e visualizar a lista de itens já adicionados.

#### Layout

- `OrderHeader` com título "Mesa - {table}" e botão excluir pedido
- **3 Selects encadeados**: Categoria → Produto → Opcional
- Controle de quantidade (−/+) com limite 1–10
- Botão "Adicionar" para inserir item
- `FlatList` com itens já adicionados (nome, quantidade, preço, opcionais)
- Botão "Avançar" para ir ao checkout

#### Fluxo de Dados Encadeado

```
1. loadInitialData() → Promise.all([loadOrder(), listCategories()])
      │
2. Seleciona categoria → setSelectedCategory → useEffect → listProducts(category_id)
      │
3. Seleciona produto → setSelectedProduct → useEffect → loadOptionals(product_id)
      │   (filtra productsOptionals do produto selecionado localmente)
      │
4. Opcionalmente seleciona opcional + ajusta quantidade
      │
5. handleAddItem() → POST /orders/items { order_id, amount, product_id, optional_id? }
      │
6. Response retorna pedido atualizado → setItemsOrder(response.data.items)
```

#### Ações Disponíveis

| Ação              | Endpoint                          | Descrição                                        |
| ----------------- | --------------------------------- | ------------------------------------------------ |
| Carregar pedido   | `GET /orders/details/{order_id}`  | Carrega dados + itens do pedido                  |
| Listar categorias | `GET /categories`                 | Popula select de categorias                      |
| Listar produtos   | `GET /products?category_id={id}`  | Popula select de produtos (filtro por categoria) |
| Adicionar item    | `POST /orders/items`              | Adiciona produto (+ opcional) ao pedido          |
| Remover item      | `DELETE /orders/remove/{item_id}` | Remove item e retorna pedido atualizado          |
| Deletar pedido    | `DELETE /orders/{order_id}`       | Exclui o pedido rascunho e volta ao dashboard    |

#### Exibição de Itens

Cada item na `FlatList` exibe:

- Nome do produto
- Quantidade × preço unitário (`item.amount`x - R$ `item.product.price / 100`)
- Contagem de opcionais ("N Opcional/Opcionais")
- Nome e preço de cada opcional individual
- Botão lixeira para remover (`handleRemoveItem`)

#### Estados de Loading

| Estado           | Efeito                                             |
| ---------------- | -------------------------------------------------- |
| `loading`        | Tela inteira com ActivityIndicator (carga inicial) |
| `loadingProduct` | ActivityIndicator no lugar do select de produtos   |
| `loadingAdd`     | Desabilita botão "Adicionar" e mostra spinner      |
| `loadingRemove`  | Spinner no botão lixeira do item específico        |

---

### Checkout (`app/(authenticated)/orders/[order_id]/checkout.tsx`)

Tela de confirmação e envio do pedido para a cozinha.

#### Layout

- `SendHeader` com botão voltar (←) e título "Voltar"
- Texto centralizado "Mesa - {table}"
- Botão "Enviar" / "Enviando..."

#### Fluxo

```
1. Funcionário toca em "Enviar"
2. Alert.alert de confirmação ("Deseja enviar o pedido da mesa N?")
3. Confirma → PATCH /orders/{order_id}/send
4. Sucesso → Toast "Mesa N enviada com sucesso"
5. setTimeout(1000) → router.replace("/dashboard")
6. Erro → Toast de erro
```

#### Parâmetros de Rota

- `order_id`: extraído via `useLocalSearchParams()` — ID do pedido
- `table`: passado como parâmetro de navegação — número da mesa para exibição

---

## 🧩 Componentes Reutilizáveis

### Headers

#### `OrderHeader` (`components/header/orderHeader.tsx`)

Header da tela de composição de pedido.

| Prop     | Tipo         | Descrição                      |
| -------- | ------------ | ------------------------------ |
| `title`  | `string`     | Texto exibido (ex: "Mesa - 5") |
| `delete` | `() => void` | Callback para deletar o pedido |

- Ícone `Trash` (Lucide) vermelho à direita
- Border-bottom sutil (`border-b-gray-400/10`)

#### `SendHeader` (`components/header/sendHeader.tsx`)

Header da tela de checkout.

| Prop    | Tipo         | Descrição                          |
| ------- | ------------ | ---------------------------------- |
| `title` | `string`     | Texto exibido (ex: "Voltar")       |
| `back`  | `() => void` | Callback para voltar (router.back) |

- Ícone `ArrowLeft` (Lucide) branco à esquerda
- Border-bottom sutil

### Select

#### `Select` (`components/select/select.tsx`)

Componente de seleção com modal fullscreen.

| Prop               | Tipo                             | Descrição                     |
| ------------------ | -------------------------------- | ----------------------------- |
| `label`            | `string?`                        | Label opcional acima do botão |
| `options`          | `{ id: string, name: string }[]` | Lista de opções               |
| `selected`         | `string`                         | ID da opção selecionada       |
| `placeholder`      | `string`                         | Texto quando nada selecionado |
| `disabled`         | `boolean?`                       | Desabilita interação          |
| `onChangeSelected` | `(id: string) => void`           | Callback ao selecionar        |

**Comportamento:**

- Renderiza como `Button` com texto da opção selecionada ou placeholder
- Ícone `ArrowDown` à direita
- Abre `Modal` transparente com `animationType="fade"`
- Header do modal com label + botão fechar (`X` vermelho)
- Itens listados com `Pressable` — selecionado exibe ícone `Check` verde
- Seleção fecha o modal automaticamente
- `useEffect` sincroniza `selectedOption` quando `selected` ou `options` mudam externamente

### Componentes UI Base (`components/ui/`)

#### `Button` — Componente Pressable com variantes

Sistema de variantes via **CVA** (Class Variance Authority):

| Variante      | Estilo                         |
| ------------- | ------------------------------ |
| `default`     | `bg-primary` com hover/active  |
| `destructive` | `bg-destructive` vermelho      |
| `outline`     | Borda + fundo background       |
| `secondary`   | `bg-secondary`                 |
| `ghost`       | Transparente com active accent |
| `link`        | Texto com underline            |

Tamanhos: `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10)

- Usa `TextClassContext` para propagar estilo de texto para filhos `<Text>`
- `disabled` aplica `opacity-50`
- Suporte a platform-specific styles (web vs native)

#### `Text` — Componente de texto com variantes semânticas

Variantes tipográficas: `default`, `h1`, `h2`, `h3`, `h4`, `p`, `blockquote`, `code`, `lead`, `large`, `small`, `muted`

- Aplica roles ARIA corretos (`heading` com `aria-level` para h1–h4)
- Consome `TextClassContext` para herdar estilos do `Button` pai
- Suporte a `asChild` via `@rn-primitives/slot`

#### `Input` — TextInput estilizado

- Fundo `bg-input/30` escuro com borda `border-input`
- Suporte a `editable=false` com `opacity-50`
- Platform-specific: web tem focus ring, native tem placeholder muted

#### `Label` — Label de formulário

- Usa `@rn-primitives/label` (Root + Text)
- Suporte a estados `disabled` com `opacity-50`
- Platform-specific: web tem cursor styles

#### `Icon` — Wrapper de ícones Lucide

- `cssInterop` do NativeWind para suporte a `className` em ícones Lucide
- Mapeia `height`/`width` do className para prop `size`
- Tamanho padrão: 14

---

## 🗃️ Gerenciamento de Estado

### 3 Níveis de Estado

| Nível          | Mecanismo    | Escopo           | Exemplos                                        |
| -------------- | ------------ | ---------------- | ----------------------------------------------- |
| **Local**      | `useState`   | Componente       | Formulários, loading, itens selecionados        |
| **Global**     | Context API  | Toda a aplicação | Usuário autenticado, token, signed, loadingAuth |
| **Persistido** | AsyncStorage | Entre sessões    | Token JWT, dados do usuário                     |

### Estado Local — Tela de Pedido (principal)

A tela `orders/[order_id]/index.tsx` é a mais complexa em termos de estado:

| Estado             | Tipo             | Descrição                                |
| ------------------ | ---------------- | ---------------------------------------- |
| `order`            | `Order \| null`  | Dados do pedido atual                    |
| `categories`       | `Category[]`     | Lista de categorias disponíveis          |
| `products`         | `Product[]`      | Produtos filtrados pela categoria        |
| `optionals`        | `Optional[]`     | Opcionais do produto selecionado         |
| `selectedCategory` | `string`         | ID da categoria selecionada              |
| `selectedProduct`  | `string`         | ID do produto selecionado                |
| `selectedOptional` | `string`         | ID do opcional selecionado               |
| `amount`           | `number`         | Quantidade (1–10)                        |
| `itemsOrder`       | `Order['items']` | Lista de itens já adicionados ao pedido  |
| `table`            | `string \| null` | Número da mesa para exibição no header   |
| `loading`          | `boolean`        | Loading da carga inicial                 |
| `loadingAdd`       | `boolean`        | Loading ao adicionar item                |
| `loadingRemove`    | `boolean`        | Loading ao remover item                  |
| `loadingProduct`   | `boolean`        | Loading ao trocar categoria              |
| `selectedItem`     | `string`         | ID do item sendo removido (para spinner) |

### Cadeia de Dependência (Selects Encadeados)

```
selectedCategory → useEffect → listProducts(category_id)
                                    → setProducts, limpa selectedProduct, selectedOptional

selectedProduct  → useEffect → loadOptionals(product_id)
                                    → setOptionals (extraído localmente de product.productsOptionals)
```

- Ao trocar categoria: reseta produto, opcional e quantidade
- Ao trocar produto: reseta opcional e quantidade
- Opcionais são extraídos client-side do array `productsOptionals` do produto

---

## 📝 Tipagem TypeScript

### Tipos Globais (`@types/`)

#### `categories.d.ts`

```typescript
export interface Category {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
}
```

#### `products.d.ts`

```typescript
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number; // Em centavos
	disabled: boolean;
	bannerUrl: string;
	category_id: string;
	createdAt: string;
	updatedAt: string;
	productsOptionals: ProductOptional[];
	category: Category;
}
```

#### `optionals.d.ts`

```typescript
export interface Optional {
	id: string;
	name: string;
	price: number; // Em centavos
	createdAt: string;
	updatedAt: string;
}

export interface ProductOptional {
	id: string;
	disabled: boolean;
	product: Product;
	optional_id: string;
	optional: Optional;
	createdAt: string;
	updatedAt: string;
}
```

#### `orders.d.ts`

```typescript
export interface ItemOptional {
	product_optional: {
		optional: Optional | null;
	} | null;
}

export interface OrderItem {
	id: string;
	amount: number;
	product: Product;
	itemsOptionals: ItemOptional[];
}

export interface Order {
	id: string;
	table: number;
	status: boolean;
	draft: boolean;
	name: string | null;
	items: OrderItem[];
}
```

#### `user.d.ts`

```typescript
export interface User {
	id: string;
	name: string;
	email: string;
	role: "STAFF" | "ADMIN";
}

export interface AuthResponse extends User {
	token: string;
}
```

---

## 🎨 Tema e Estilização

### NativeWind (Tailwind CSS para React Native)

O projeto usa **NativeWind 4.2.1** que permite usar classes Tailwind diretamente via prop `className` em componentes React Native.

#### Configuração

- `babel.config.js`: plugin `nativewind/babel` com `jsxImportSource: nativewind`
- `metro.config.js`: `withNativeWind(config, { input: './global.css' })`
- `nativewind-env.d.ts`: referência de tipos `nativewind/types`

### Paleta de Cores

#### Brand

| Token                    | Valor     | Uso                     |
| ------------------------ | --------- | ----------------------- |
| `brand.primary`          | `#f6005d` | Botões principais, CTA  |
| `brand.primaryHover`     | `#ff3f4b` | Hover do brand primary  |
| `brand.primaryActive`    | `#e6004c` | Active do brand primary |
| `brand.primarySoft`      | `#ff5c6a` | Variante suave          |
| `brand.primarySoftLight` | `#ff7a85` | Variante mais clara     |

#### App Backgrounds

| Token                 | Valor     | Uso                               |
| --------------------- | --------- | --------------------------------- |
| `app.background`      | `#080c1a` | Fundo principal de todas as telas |
| `app.surface`         | `#0c111f` | Superfícies de cards              |
| `app.surfaceAlt`      | `#11172a` | Inputs, campos de formulário      |
| `app.surfaceDeep`     | `#151a29` | Superfícies profundas             |
| `app.surfaceElevated` | `#161c33` | Items de lista no modal Select    |
| `app.black`           | `#000000` | Preto absoluto                    |

#### Texto

| Token                  | Valor     | Uso                |
| ---------------------- | --------- | ------------------ |
| `textCustom.primary`   | `#ffffff` | Texto principal    |
| `textCustom.secondary` | `#b2b7c6` | Texto secundário   |
| `textCustom.muted`     | `#8f95a6` | Texto esmaecido    |
| `textCustom.disabled`  | `#6b7082` | Texto desabilitado |

#### Bordas

| Token                  | Valor     |
| ---------------------- | --------- |
| `borderCustom.default` | `#4a4f5e` |
| `borderCustom.strong`  | `#363a45` |

#### Feedback

| Token                 | Valor     | Uso                      |
| --------------------- | --------- | ------------------------ |
| `feedback.danger`     | `#f6005d` | Erros, ações destrutivas |
| `feedback.dangerSoft` | `#ff7a85` | Erros suaves             |

### CSS Variables

O `global.css` define CSS custom properties (`:root`) usadas pelas variantes dos componentes UI base (shadcn-inspired):

- Tokens de light mode e dark mode (`.dark:root`)
- Mesma paleta brand/app/feedback como CSS variables (`--color-brand-primary`, `--color-app-background`, etc.)

### Utilitário `cn()` (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

Combina `clsx` (classnames condicionais) com `tailwind-merge` (resolve conflitos de classes Tailwind).

---

## ⚙️ Variáveis de Ambiente

### Arquivo `.env`

| Variável                   | Obrigatória | Descrição                  | Exemplo                     |
| -------------------------- | ----------- | -------------------------- | --------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | ✅          | URL base da API do backend | `http://192.168.1.100:3333` |

### Resolução da Variável

```
.env → EXPO_PUBLIC_API_BASE_URL
  └→ app.config.js → expo.extra.apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL
      └→ configs/api.config.ts → Constants.expoConfig?.extra?.apiBaseUrl
          └→ lib/api.ts → axios.create({ baseURL })
```

### Valores por Ambiente

| Ambiente           | Valor                           |
| ------------------ | ------------------------------- |
| Android Emulator   | `http://10.0.2.2:3333`          |
| iOS Simulator      | `http://localhost:3333`         |
| Dispositivo Físico | `http://{IP_LOCAL}:3333`        |
| Produção           | `https://api.pastelaria.com.br` |

---

## 📐 Convenções e Padrões

### Nomenclatura

| Tipo                 | Convenção         | Exemplo           |
| -------------------- | ----------------- | ----------------- |
| Componentes (export) | PascalCase        | `OrderHeader`     |
| Funções              | camelCase         | `handleAddItem`   |
| Variáveis            | camelCase         | `selectedProduct` |
| Constantes de config | UPPER_SNAKE_CASE  | `API_CONFIG`      |
| Interfaces/Types     | PascalCase        | `AuthContextData` |
| Arquivos componentes | camelCase         | `orderHeader.tsx` |
| Arquivos utilitários | camelCase         | `api.ts`          |
| Pastas               | camelCase         | `components/`     |
| Parâmetros de rota   | snake_case        | `[order_id]`      |
| Chaves AsyncStorage  | Prefixo `@appSG:` | `@appSG:token`    |

### Estrutura de Arquivos (Telas)

```typescript
// 1. Imports de terceiros
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// 2. Imports de tipos
import { Order } from "@/@types/orders";

// 3. Imports de componentes locais
import { Button } from "@/components/ui/button";
import { Select } from "@/components/select/select";

// 4. Imports de serviços/contextos
import { useAuth } from "@/contexts/authContext";
import { api } from "@/lib/api";

// 5. Componente default export
export default function ScreenName() {
	// Estados → useEffect → Funções handler → return JSX
}
```

### Padrão de Tratamento de Erros

| Contexto            | Mecanismo                                           |
| ------------------- | --------------------------------------------------- |
| Erro de API (Axios) | `Toast.show({ type: 'error' })` ou `Alert.alert`    |
| Erro genérico       | `Alert.alert('Erro', 'Ocorreu um erro inesperado')` |
| Validação de input  | `Alert.alert('Atenção', 'mensagem de validação')`   |
| Feedback de sucesso | `Toast.show({ type: 'success' })`                   |

### Padrão de Loading

- `ActivityIndicator` com `color="#f6005d"` (brand primary) para loading de tela
- `ActivityIndicator` com `color="#FFF"` dentro de botões durante ações
- Botões ficam `disabled={loading}` durante operações assíncronas
- Texto "Enviando..." substitui "Enviar" no checkout

### Navegação

- Criação de pedido → `router.replace()` (não permite voltar)
- Abertura de detalhes → `router.push()` (permite voltar)
- Após envio/deleção → `router.replace("/dashboard")` (limpa stack)
- Voltar → `router.back()`
