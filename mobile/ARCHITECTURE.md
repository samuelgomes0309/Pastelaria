# 🏗️ Arquitetura do Aplicativo Mobile - Pastelaria

> Documentação técnica da arquitetura, padrões e convenções do aplicativo mobile

---

## 📑 Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura de Pastas](#2-arquitetura-de-pastas)
3. [Padrões de Design](#3-padrões-de-design)
4. [Fluxo de Dados](#4-fluxo-de-dados)
5. [Gerenciamento de Estado](#5-gerenciamento-de-estado)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [Roteamento e Navegação](#7-roteamento-e-navegação)
8. [Componentes UI](#8-componentes-ui)
9. [Comunicação com API](#9-comunicação-com-api)
10. [Persistência de Dados](#10-persistência-de-dados)
11. [Tratamento de Erros](#11-tratamento-de-erros)
12. [Convenções de Código](#12-convenções-de-código)
13. [Performance e Otimização](#13-performance-e-otimização)
14. [Segurança](#14-segurança)

---

## 1. Visão Geral

### 1.1 Arquitetura Geral

O aplicativo segue uma **arquitetura em camadas** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────┐
│                   APRESENTAÇÃO                       │
│            (Screens, Components, UI)                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  LÓGICA DE NEGÓCIO                   │
│              (Contexts, Hooks, Utils)                │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   COMUNICAÇÃO                        │
│                 (API Client, Axios)                  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    PERSISTÊNCIA                      │
│                  (AsyncStorage)                      │
└──────────────────────────────────────────────────────┘
```

### 1.2 Princípios Arquiteturais

- **Separation of Concerns:** Cada camada tem responsabilidade bem definida
- **Single Responsibility:** Cada módulo/arquivo faz apenas uma coisa
- **DRY (Don't Repeat Yourself):** Reutilização de código através de componentes e hooks
- **KISS (Keep It Simple, Stupid):** Soluções simples e diretas
- **Convention over Configuration:** Preferência por convenções estabelecidas

### 1.3 Stack Principal

| Camada               | Tecnologia                       |
| -------------------- | -------------------------------- |
| **UI Framework**     | React Native 0.81.5              |
| **Platform**         | Expo ~54.0.29                    |
| **Language**         | TypeScript ~5.9.2                |
| **Routing**          | Expo Router ~6.0.19 (File-based) |
| **Styling**          | NativeWind 4.2.1 (Tailwind CSS)  |
| **HTTP Client**      | Axios 1.13.5                     |
| **State Management** | React Context API + Hooks        |
| **Storage**          | AsyncStorage                     |
| **Notifications**    | React Native Toast Message       |

---

## 2. Arquitetura de Pastas

### 2.1 Estrutura Detalhada

```
mobile/
│
├── @types/                          # Definições de tipos TypeScript
│   ├── categories.d.ts              # Tipos de Categorias
│   ├── products.d.ts                # Tipos de Produtos
│   ├── optionals.d.ts               # Tipos de Adicionais
│   ├── orders.d.ts                  # Tipos de Pedidos
│   └── user.d.ts                    # Tipos de Usuário
│
├── app/                             # Rotas (File-based Routing)
│   ├── _layout.tsx                  # Layout Root (Auth Provider)
│   ├── index.tsx                    # Splash/Redirect Screen
│   ├── login.tsx                    # Tela de Login
│   │
│   └── (authenticated)/             # Grupo de rotas autenticadas
│       ├── _layout.tsx              # Layout com verificação de auth
│       ├── dashboard.tsx            # Dashboard principal
│       │
│       └── orders/                  # Fluxo de pedidos
│           └── [order_id]/          # Rota dinâmica por ID
│               ├── index.tsx        # Detalhes do pedido
│               └── checkout.tsx     # Finalização do pedido
│
├── components/                      # Componentes reutilizáveis
│   ├── header/                      # Componentes de cabeçalho
│   │   ├── orderHeader.tsx          # Header de pedido
│   │   └── sendHeader.tsx           # Header de envio
│   │
│   ├── select/                      # Componentes de seleção
│   │   └── select.tsx               # Select customizado
│   │
│   └── ui/                          # Componentes UI base
│       ├── button.tsx               # Botão reutilizável
│       ├── icon.tsx                 # Wrapper de ícones
│       ├── input.tsx                # Input customizado
│       ├── label.tsx                # Label de formulário
│       └── text.tsx                 # Texto tipado
│
├── configs/                         # Configurações
│   └── api.config.ts                # Configuração da API (baseURL, timeout)
│
├── contexts/                        # Contexts do React
│   └── authContext.tsx              # Context de autenticação
│
├── lib/                             # Bibliotecas e utilitários
│   ├── api.ts                       # Cliente Axios configurado
│   └── utils.ts                     # Funções utilitárias
│
├── assets/                          # Recursos estáticos
│   └── images/                      # Imagens do app
│
├── .env.example                     # Template de variáveis de ambiente
├── .env                             # Variáveis de ambiente (não commitado)
├── app.json                         # Configuração do Expo
├── app.config.js                    # Configuração dinâmica do Expo
├── babel.config.js                  # Configuração do Babel
├── metro.config.js                  # Configuração do Metro Bundler
├── tailwind.config.js               # Configuração do Tailwind CSS
├── tsconfig.json                    # Configuração do TypeScript
├── package.json                     # Dependências e scripts
└── global.css                       # Estilos globais (Tailwind)
```

### 2.2 Responsabilidades de Cada Pasta

| Pasta         | Responsabilidade                   | Regras                                  |
| ------------- | ---------------------------------- | --------------------------------------- |
| `@types/`     | Definições de tipos compartilhados | Apenas `.d.ts`, sem lógica              |
| `app/`        | Roteamento (file-based)            | Cada arquivo = uma rota                 |
| `components/` | Componentes reutilizáveis          | Componentes puros ou com lógica própria |
| `configs/`    | Configurações da aplicação         | Constantes, configurações de libs       |
| `contexts/`   | Contextos React (estado global)    | Apenas providers e hooks                |
| `lib/`        | Bibliotecas e utilitários          | Funções puras, helpers, clients         |
| `assets/`     | Recursos estáticos                 | Imagens, fontes, etc                    |

---

## 3. Padrões de Design

### 3.1 Component Pattern

**Componentes Funcionais com Hooks:**

```typescript
// ✅ BOM: Componente funcional com TypeScript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={/* classes */}>
      <Text>{title}</Text>
    </Pressable>
  );
}

// ❌ EVITAR: Componentes de classe
class Button extends React.Component { }
```

### 3.2 Custom Hooks Pattern

**Encapsular lógica reutilizável:**

```typescript
// hooks/useOrders.ts
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return { orders, loading, fetchOrders };
}
```

### 3.3 Provider Pattern

**Gerenciamento de estado global com contexts:**

```typescript
// contexts/authContext.tsx
interface AuthContextData {
  user: User | null;
  signed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  // lógica de autenticação
  return (
    <AuthContext.Provider value={{ /* ... */ }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o context
export function useAuth() {
  return useContext(AuthContext);
}
```

### 3.4 Composition Pattern

**Compor componentes ao invés de herança:**

```typescript
// ✅ BOM: Composição
<Card>
  <CardHeader title="Pedido #123" />
  <CardContent>
    <OrderItems items={items} />
  </CardContent>
  <CardFooter>
    <Button title="Finalizar" />
  </CardFooter>
</Card>

// ❌ EVITAR: Herança profunda
class ExtendedCard extends Card { }
```

---

## 4. Fluxo de Dados

### 4.1 Fluxo Unidirecional

O aplicativo segue o padrão de **fluxo de dados unidirecional** do React:

```
┌─────────────┐
│   Action    │ ──► Usuário interage com UI
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Handler    │ ──► Função é chamada (ex: signIn)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Call   │ ──► Requisição ao backend
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Update    │ ──► Atualiza estado (setState)
│   State     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Re-render │ ──► React re-renderiza UI
└─────────────┘
```

### 4.2 Exemplo Prático: Login

```typescript
// 1. Usuário digita email/senha e clica em "Entrar"
function LoginScreen() {
  const { signIn } = useAuth();

  async function handleLogin() {
    // 2. Handler é chamado
    await signIn(email, password);
    // 4. Após signIn completar, estado é atualizado
    // 5. React re-renderiza e redireciona (via useEffect)
  }

  return (
    <Button onPress={handleLogin} />
  );
}

// authContext.tsx
async function signIn(email: string, password: string) {
  // 3. API Call
  const response = await api.post('/sessions', { email, password });

  // 4. Update State
  setUser(response.data);
  await AsyncStorage.setItem('@appSG:user', JSON.stringify(response.data));
}
```

---

## 5. Gerenciamento de Estado

### 5.1 Níveis de Estado

O app utiliza **3 níveis de gerenciamento de estado**:

#### 5.1.1 Estado Local (useState)

Para dados específicos de um componente:

```typescript
function OrderForm() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  // ...
}
```

**Quando usar:**

- ✅ Estado usado apenas dentro de um componente
- ✅ Dados temporários (formulários, toggles)
- ✅ UI state (modal aberto/fechado)

#### 5.1.2 Estado Global (Context API)

Para dados compartilhados entre múltiplos componentes:

```typescript
// authContext.tsx
export const AuthContext = createContext({} as AuthContextData);

// Usado em qualquer lugar:
const { user, signIn, signOut } = useAuth();
```

**Quando usar:**

- ✅ Autenticação (usuário logado, token)
- ✅ Tema/configurações globais
- ✅ Dados compartilhados entre múltiplas telas

#### 5.1.3 Estado Persistido (AsyncStorage)

Para dados que devem sobreviver entre sessões:

```typescript
// Salvar
await AsyncStorage.setItem('@appSG:token', token);

// Recuperar
const token = await AsyncStorage.getItem('@appSG:token');
```

**Quando usar:**

- ✅ Token de autenticação
- ✅ Preferências do usuário
- ✅ Cache de dados offline

### 5.2 Quando Usar Cada Abordagem

| Tipo de Dado         | Estado Local | Context API | AsyncStorage |
| -------------------- | ------------ | ----------- | ------------ |
| Formulário           | ✅           | ❌          | ❌           |
| Modal aberto/fechado | ✅           | ❌          | ❌           |
| Usuário logado       | ❌           | ✅          | ✅           |
| Token JWT            | ❌           | ✅          | ✅           |
| Lista de pedidos     | ✅           | ⚠️          | ❌           |
| Tema da aplicação    | ❌           | ✅          | ✅           |

---

## 6. Autenticação e Autorização

### 6.1 Fluxo de Autenticação

```
┌──────────────┐
│ Login Screen │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────┐
│ POST /sessions                     │
│ { email, password }                │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Backend valida credenciais         │
│ Retorna: { user, token }           │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ App armazena em:                   │
│ - AuthContext (memória)            │
│ - AsyncStorage (persistência)      │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Redireciona para Dashboard         │
└────────────────────────────────────┘
```

### 6.2 Proteção de Rotas

Rotas protegidas ficam dentro do grupo `(authenticated)`:

```typescript
// app/(authenticated)/_layout.tsx
export default function AuthenticatedLayout() {
  const { signed, loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !signed) {
      router.replace('/login');
    }
  }, [signed, loadingAuth]);

  if (loadingAuth) {
    return <LoadingScreen />;
  }

  return <Stack />;
}
```

### 6.3 Interceptor de Token

Todas as requisições incluem automaticamente o token:

```typescript
// lib/api.ts
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@appSG:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6.4 Autorização por Role

```typescript
// Verificar role do usuário
const { user } = useAuth();

if (user?.role === 'ADMIN') {
  // Mostrar funções de admin
}

if (user?.role === 'STAFF') {
  // Mostrar funções de staff
}
```

---

## 7. Roteamento e Navegação

### 7.1 File-based Routing (Expo Router)

O Expo Router usa a estrutura de pastas para definir rotas:

```
app/
├── index.tsx           → /
├── login.tsx           → /login
└── (authenticated)/
    ├── dashboard.tsx   → /dashboard
    └── orders/
        └── [order_id]/
            ├── index.tsx    → /orders/:order_id
            └── checkout.tsx → /orders/:order_id/checkout
```

### 7.2 Navegação Programática

```typescript
import { useRouter } from 'expo-router';

function MyComponent() {
  const router = useRouter();

  // Navegar para uma rota
  router.push('/dashboard');

  // Substituir rota atual
  router.replace('/login');

  // Voltar
  router.back();

  // Navegar com parâmetros
  router.push(`/orders/${orderId}`);
}
```

### 7.3 Parâmetros de Rota

```typescript
// app/orders/[order_id]/index.tsx
import { useLocalSearchParams } from 'expo-router';

export default function OrderDetails() {
  const { order_id } = useLocalSearchParams();

  // order_id contém o valor da URL
}
```

### 7.4 Grupos de Rotas

Grupos são criados com parênteses e não aparecem na URL:

```
app/
└── (authenticated)/     # Grupo (não aparece na URL)
    └── dashboard.tsx    # URL: /dashboard
```

**Uso:**

- ✅ Aplicar layout comum
- ✅ Agrupar rotas com mesmo requisito (ex: autenticação)
- ✅ Organização lógica sem afetar URLs

---

## 8. Componentes UI

### 8.1 Hierarquia de Componentes

```
App
├── Screens (app/)
│   ├── LoginScreen
│   ├── DashboardScreen
│   └── OrderDetailsScreen
│       ├── OrderHeader (components/header)
│       ├── ProductList
│       │   └── ProductCard
│       │       ├── Button (components/ui)
│       │       └── Text (components/ui)
│       └── CheckoutButton
```

### 8.2 Componentes Base (UI)

Componentes reutilizáveis básicos em `components/ui/`:

```typescript
// components/ui/button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false
}: ButtonProps) {
  const baseClass = 'rounded-lg items-center justify-center';
  const variantClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    ghost: 'bg-transparent'
  };
  const sizeClass = {
    sm: 'py-2 px-4',
    md: 'py-3 px-6',
    lg: 'py-4 px-8'
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${baseClass} ${variantClass[variant]} ${sizeClass[size]}`}
    >
      <Text className="text-white font-medium">{title}</Text>
    </Pressable>
  );
}
```

### 8.3 Estilização com NativeWind

**NativeWind = Tailwind CSS para React Native**

```typescript
// ✅ BOM: Classes Tailwind
<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold text-gray-900">
    Título
  </Text>
</View>

// ❌ EVITAR: StyleSheet (exceto casos específicos)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' }
});
```

**Vantagens:**

- ✅ Desenvolvimento mais rápido
- ✅ Consistência visual
- ✅ Responsividade facilitada
- ✅ Menos código

---

## 9. Comunicação com API

### 9.1 Configuração do Axios

```typescript
// configs/api.config.ts
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || '',
  timeout: 10000, // 10 segundos
};

// lib/api.ts
import { API_CONFIG } from '@/configs/api.config';
import axios from 'axios';

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@appSG:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 9.2 Padrão de Requisições

```typescript
// ✅ BOM: Try-catch com loading e erro
async function fetchOrders() {
  setLoading(true);
  setError(null);

  try {
    const response = await api.get('/orders');
    setOrders(response.data);
  } catch (error) {
    setError('Erro ao carregar pedidos');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
```

### 9.3 Tipagem de Respostas

```typescript
// @types/orders.d.ts
export interface Order {
  id: string;
  table: number;
  status: boolean;
  draft: boolean;
  name?: string;
  items: OrderItem[];
}

// Usar na requisição
const response = await api.get<Order[]>('/orders');
const orders: Order[] = response.data;
```

---

## 10. Persistência de Dados

### 10.1 AsyncStorage

**Armazenamento chave-valor assíncrono:**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar
await AsyncStorage.setItem('@appSG:token', token);

// Recuperar
const token = await AsyncStorage.getItem('@appSG:token');

// Remover
await AsyncStorage.removeItem('@appSG:token');

// Limpar tudo
await AsyncStorage.clear();
```

### 10.2 Convenções de Chaves

Usar prefixo `@appSG:` para todas as chaves:

```typescript
// ✅ BOM: Com prefixo e descritivo
'@appSG:token';
'@appSG:user';
'@appSG:theme';

// ❌ EVITAR: Sem prefixo
'token';
'user';
```

### 10.3 Tipagem de Dados Persistidos

```typescript
// Salvar com tipagem
interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

const userData: StoredUser = {
  /* ... */
};
await AsyncStorage.setItem('@appSG:user', JSON.stringify(userData));

// Recuperar com tipagem
const userJson = await AsyncStorage.getItem('@appSG:user');
const user: StoredUser | null = userJson ? JSON.parse(userJson) : null;
```

---

## 11. Tratamento de Erros

### 11.1 Níveis de Erro

```
┌─────────────────────────────────────┐
│ 1. Try-Catch (Lógica local)        │
│    → Captura e trata localmente     │
└──────────────────┬──────────────────┘
                   │ Se não tratado
                   ▼
┌─────────────────────────────────────┐
│ 2. Error Boundary (UI)              │
│    → Captura erros de renderização  │
└──────────────────┬──────────────────┘
                   │ Se não tratado
                   ▼
┌─────────────────────────────────────┐
│ 3. Console Error (Dev)              │
│    → Log para debugging             │
└─────────────────────────────────────┘
```

### 11.2 Tratamento de Erros de API

```typescript
try {
  const response = await api.post('/orders', orderData);
  Toast.show({
    type: 'success',
    text1: 'Pedido criado com sucesso!',
  });
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Erro de rede/API
    const message = error.response?.data?.message || 'Erro ao criar pedido';
    Toast.show({
      type: 'error',
      text1: message,
    });
  } else {
    // Erro desconhecido
    Toast.show({
      type: 'error',
      text1: 'Erro inesperado',
    });
  }
  console.error(error);
}
```

### 11.3 Notificações (Toast)

```typescript
import Toast from 'react-native-toast-message';

// Sucesso
Toast.show({
  type: 'success',
  text1: 'Operação realizada',
  text2: 'Dados salvos com sucesso',
});

// Erro
Toast.show({
  type: 'error',
  text1: 'Erro na operação',
  text2: 'Tente novamente',
});

// Info
Toast.show({
  type: 'info',
  text1: 'Informação',
  text2: 'Aguarde...',
});
```

---

## 12. Convenções de Código

### 12.1 Nomenclatura

| Tipo                       | Convenção        | Exemplo           |
| -------------------------- | ---------------- | ----------------- |
| **Componentes**            | PascalCase       | `OrderHeader`     |
| **Funções**                | camelCase        | `fetchOrders`     |
| **Variáveis**              | camelCase        | `userName`        |
| **Constantes**             | UPPER_SNAKE_CASE | `API_BASE_URL`    |
| **Interfaces/Types**       | PascalCase       | `OrderProps`      |
| **Arquivos de componente** | PascalCase       | `OrderHeader.tsx` |
| **Arquivos utilitários**   | camelCase        | `api.ts`          |
| **Pastas**                 | camelCase        | `components/`     |

### 12.2 Estrutura de Arquivos

```typescript
// 1. Imports de terceiros
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

// 2. Imports locais
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/authContext';
import { api } from '@/lib/api';

// 3. Imports de tipos
import type { Order } from '@/@types/orders';

// 4. Interfaces
interface OrderScreenProps {
  orderId: string;
}

// 5. Componente
export function OrderScreen({ orderId }: OrderScreenProps) {
  // ...
}
```

### 12.3 TypeScript

```typescript
// ✅ BOM: Tipagem explícita
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

const user: User = {
  /* ... */
};

// ❌ EVITAR: any
const user: any = {
  /* ... */
};

// ✅ BOM: Tipos de função
type SignInFunction = (email: string, password: string) => Promise<void>;

// ✅ BOM: Type Guards
function isAdmin(user: User): boolean {
  return user.role === 'ADMIN';
}
```

---

## 13. Performance e Otimização

### 13.1 Memoização

```typescript
import { useMemo, useCallback } from 'react';

// useMemo: Memoizar valores computados
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// useCallback: Memoizar funções
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 13.2 Lazy Loading

```typescript
// Carregar componentes sob demanda
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 13.3 Otimização de Listas

```typescript
// ✅ BOM: FlatList com keyExtractor
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// ❌ EVITAR: map() em listas grandes
{items.map(item => <ItemCard key={item.id} item={item} />)}
```

---

## 14. Segurança

### 14.1 Checklist de Segurança

- ✅ Token JWT armazenado no AsyncStorage (privado)
- ✅ Validação de inputs no frontend
- ✅ HTTPS em produção
- ✅ Não expor dados sensíveis nos logs
- ✅ Timeout de requisições configurado
- ✅ Tratamento adequado de erros (sem expor detalhes internos)

### 14.2 Boas Práticas

```typescript
// ✅ BOM: Validar dados antes de enviar
if (!email || !email.includes('@')) {
  Toast.show({ type: 'error', text1: 'Email inválido' });
  return;
}

// ✅ BOM: Não logar dados sensíveis
console.log('Login attempt for:', email); // OK
// ❌ EVITAR
console.log('Password:', password); // NUNCA

// ✅ BOM: Limpar dados ao fazer logout
async function signOut() {
  await AsyncStorage.removeItem('@appSG:token');
  await AsyncStorage.removeItem('@appSG:user');
  setUser(null);
}
```

---

## ✅ Conclusão

Esta arquitetura foi projetada para ser:

- 📦 **Modular:** Fácil adicionar/remover funcionalidades
- 🔄 **Escalável:** Suporta crescimento do projeto
- 🧪 **Testável:** Separação de responsabilidades facilita testes
- 📖 **Manutenível:** Código organizado e documentado
- ⚡ **Performática:** Otimizações de renderização e requisições

Para mais informações, consulte:

- [README.md](./README.md) - Guia de início rápido
- [CONTEXTO_TECNICO.md](./CONTEXTO_TECNICO.md) - Documentação do backend
- [endpoints.md](./endpoints.md) - Referência da API

---

**Última atualização:** 8 de março de 2026
