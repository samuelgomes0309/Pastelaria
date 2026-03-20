# 📡 ENDPOINTS — Pastelaria API

Documentação completa de todos os endpoints da API REST do sistema de gestão para pastelarias.

> **Base URL:** `http://localhost:3333`
> **Autenticação:** JWT via header `Authorization: Bearer <token>`

---

## 📋 Índice

- [Usuários](#-usuários)
  - [POST /users](#post-users)
  - [POST /sessions](#post-sessions)
  - [GET /me](#get-me)
  - [PATCH /users/role](#patch-usersrole)
- [Categorias](#-categorias)
  - [POST /categories](#post-categories)
  - [GET /categories](#get-categories)
  - [GET /categories/:category_id](#get-categoriescategory_id)
  - [PATCH /categories/:category_id](#patch-categoriescategory_id)
  - [DELETE /categories/:category_id](#delete-categoriescategory_id)
- [Produtos](#-produtos)
  - [POST /products](#post-products)
  - [GET /products](#get-products)
  - [GET /products/detail](#get-productsdetail)
  - [GET /products/all](#get-productsall)
  - [PUT /products/:product_id](#put-productsproduct_id)
  - [PUT /products/:product_id/update-status](#put-productsproduct_idupdate-status)
  - [POST /products/optionals](#post-productsoptionals)
  - [DELETE /products/optionals/:product_optional_id](#delete-productsoptionalsproduct_optional_id)
- [Opcionais](#-opcionais)
  - [POST /optionals](#post-optionals)
  - [GET /optionals](#get-optionals)
  - [GET /optionals/:optional_id](#get-optionalsoptional_id)
- [Pedidos](#-pedidos)
  - [POST /orders](#post-orders)
  - [POST /orders/items](#post-ordersitems)
  - [DELETE /orders/remove/:item_id](#delete-ordersremoveitem_id)
  - [GET /orders/details/:order_id](#get-ordersdetailsorder_id)
  - [GET /orders](#get-orders)
  - [DELETE /orders/:order_id](#delete-ordersorder_id)
  - [PATCH /orders/:order_id/send](#patch-ordersorder_idsend)
  - [PATCH /orders/:order_id/finish](#patch-ordersorder_idfinish)
- [Códigos de Status](#-códigos-de-status)

---

## 👤 Usuários

---

### POST /users

Cria um novo usuário (funcionário) no sistema. O primeiro usuário cadastrado recebe automaticamente o papel `ADMIN` e a flag `isRoot`.

- **Autenticação:** ❌ Não requerida
- **Permissão:** Pública
- **Controller:** `CreateUserController`
- **Service:** `CreateUserService`
- **Schema:** `createUserSchema`

#### Request Body

```json
{
	"name": "João Funcionário",
	"email": "joao@example.com",
	"password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Validação         | Descrição             |
| ---------- | ------ | ----------- | ----------------- | --------------------- |
| `name`     | string | ✅          | Min. 3 caracteres | Nome do funcionário   |
| `email`    | string | ✅          | Email válido      | Email único           |
| `password` | string | ✅          | Min. 6 caracteres | Senha (será hasheada) |

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Funcionário",
	"email": "joao@example.com",
	"role": "ADMIN"
}
```

> **Nota:** O primeiro usuário recebe `role: "ADMIN"`. Usuários subsequentes recebem `role: "STAFF"`.

#### Erros

| Status | Mensagem                | Causa                          |
| ------ | ----------------------- | ------------------------------ |
| `400`  | `"Validation failed"`   | Campos não atendem o schema    |
| `400`  | `"User already exists"` | Email já cadastrado no sistema |

---

### POST /sessions

Autentica um usuário e retorna um token JWT.

- **Autenticação:** ❌ Não requerida
- **Permissão:** Pública
- **Controller:** `AuthUserController`
- **Service:** `AuthUserService`
- **Schema:** `loginUserSchema`

#### Request Body

```json
{
	"email": "joao@example.com",
	"password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Validação         | Descrição        |
| ---------- | ------ | ----------- | ----------------- | ---------------- |
| `email`    | string | ✅          | Email válido      | Email do usuário |
| `password` | string | ✅          | Min. 6 caracteres | Senha do usuário |

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Funcionário",
	"email": "joao@example.com",
	"role": "ADMIN",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Campo   | Tipo   | Descrição                       |
| ------- | ------ | ------------------------------- |
| `id`    | string | UUID do usuário                 |
| `name`  | string | Nome do usuário                 |
| `email` | string | Email do usuário                |
| `role`  | string | Papel: `ADMIN` ou `STAFF`       |
| `token` | string | JWT com validade de **30 dias** |

#### Erros

| Status | Mensagem                        | Causa                                   |
| ------ | ------------------------------- | --------------------------------------- |
| `400`  | `"Validation failed"`           | Campos não atendem o schema             |
| `400`  | `"Email or password incorrect"` | Email não encontrado ou senha incorreta |

---

### GET /me

Retorna os dados do usuário atualmente autenticado.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `DetailUserController`
- **Service:** `DetailUserService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Funcionário",
	"email": "joao@example.com",
	"role": "ADMIN"
}
```

#### Erros

| Status | Mensagem           | Causa                           |
| ------ | ------------------ | ------------------------------- |
| `401`  | `"Token missing"`  | Token não enviado no header     |
| `401`  | `"Invalid token"`  | Token inválido ou expirado      |
| `400`  | `"User not found"` | Usuário não encontrado no banco |

---

### PATCH /users/role

Altera o papel (role) de um usuário. Exclusivo para administradores.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `UpdateRoleUserController`
- **Service:** `UpdateRoleUserService`
- **Schema:** `updateRoleUserSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"email": "maria@example.com",
	"role": "ADMIN"
}
```

| Campo   | Tipo   | Obrigatório | Validação              | Descrição                       |
| ------- | ------ | ----------- | ---------------------- | ------------------------------- |
| `email` | string | ✅          | Email válido           | Email do usuário a ser alterado |
| `role`  | string | ✅          | `"ADMIN"` ou `"STAFF"` | Novo papel do usuário           |

#### Response — 200 OK

```json
{
	"id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
	"name": "Maria Atendente",
	"email": "maria@example.com",
	"role": "ADMIN"
}
```

#### Erros

| Status | Mensagem                                        | Causa                                           |
| ------ | ----------------------------------------------- | ----------------------------------------------- |
| `400`  | `"Validation failed"`                           | Campos não atendem o schema                     |
| `401`  | `"Token missing"` / `"Invalid token"`           | Token ausente ou inválido                       |
| `403`  | `"Insufficient permissions"`                    | Usuário não é ADMIN                             |
| `400`  | `"User not found"`                              | Email não encontrado no sistema                 |
| `400`  | `"You cannot change your own role"`             | Tentou alterar o próprio papel ou papel do root |
| `400`  | `"You cannot change the role to the same role"` | Novo papel é igual ao atual                     |

---

## 📂 Categorias

---

### POST /categories

Cria uma nova categoria de produtos.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `CreateCategoryController`
- **Service:** `CreateCategoryService`
- **Schema:** `createCategorySchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"name": "Pastéis Salgados",
	"description": "Pastéis tradicionais com recheios salgados"
}
```

| Campo         | Tipo   | Obrigatório | Validação         | Descrição                         |
| ------------- | ------ | ----------- | ----------------- | --------------------------------- |
| `name`        | string | ✅          | Min. 3 caracteres | Nome da categoria                 |
| `description` | string | ❌          | —                 | Descrição da categoria (opcional) |

#### Response — 200 OK

```json
{
	"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"name": "Pastéis Salgados",
	"description": "Pastéis tradicionais com recheios salgados",
	"createdAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN         |
| `400`  | `"User not found"`                    | Usuário do token não existe |

---

### GET /categories

Lista todas as categorias cadastradas.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `ListCategoriesController`
- **Service:** `ListCategoriesService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
[
	{
		"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
		"name": "Pastéis Salgados",
		"description": "Pastéis tradicionais com recheios salgados",
		"createdAt": "2026-03-18T10:00:00.000Z"
	},
	{
		"id": "d4e5f6a7-b8c9-0123-defa-234567890123",
		"name": "Bebidas",
		"description": null,
		"createdAt": "2026-03-17T08:00:00.000Z"
	}
]
```

> Ordenado por `createdAt` em ordem decrescente (mais recentes primeiro).

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |

---

### GET /categories/:category_id

Retorna os detalhes de uma categoria específica.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `DetailCategoryController`
- **Service:** `DetailCategoryService`
- **Schema:** `detailCategorySchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro     | Tipo   | Obrigatório | Descrição         |
| ------------- | ------ | ----------- | ----------------- |
| `category_id` | string | ✅          | UUID da categoria |

#### Response — 200 OK

```json
{
	"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"name": "Pastéis Salgados",
	"description": "Pastéis tradicionais com recheios salgados",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | `category_id` não fornecido |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `400`  | `"Category not found"`                | Categoria não encontrada    |

---

### PATCH /categories/:category_id

Atualiza os dados de uma categoria existente.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `UpdateCategoryController`
- **Service:** `UpdateCategoryService`
- **Schema:** `updateCategorySchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro     | Tipo   | Obrigatório | Descrição         |
| ------------- | ------ | ----------- | ----------------- |
| `category_id` | string | ✅          | UUID da categoria |

#### Request Body

```json
{
	"name": "Pastéis Especiais",
	"description": "Pastéis com recheios premium"
}
```

| Campo         | Tipo   | Obrigatório | Validação                        | Descrição                   |
| ------------- | ------ | ----------- | -------------------------------- | --------------------------- |
| `name`        | string | ❌          | Min. 3 caracteres (se fornecido) | Novo nome da categoria      |
| `description` | string | ❌          | —                                | Nova descrição da categoria |

#### Response — 200 OK

```json
{
	"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"name": "Pastéis Especiais",
	"description": "Pastéis com recheios premium",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T12:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN         |

---

### DELETE /categories/:category_id

Remove uma categoria. Não permite exclusão se existirem pedidos com produtos vinculados.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `RemoveCategoryController`
- **Service:** `RemoveCategoryService`
- **Schema:** `removeCategorySchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro     | Tipo   | Obrigatório | Descrição         |
| ------------- | ------ | ----------- | ----------------- |
| `category_id` | string | ✅          | UUID da categoria |

#### Response — 200 OK

```json
{
	"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"name": "Pastéis Salgados",
	"description": "Pastéis tradicionais com recheios salgados",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                                                                         | Causa                                     |
| ------ | -------------------------------------------------------------------------------- | ----------------------------------------- |
| `400`  | `"Validation failed"`                                                            | `category_id` não fornecido               |
| `401`  | `"Token missing"` / `"Invalid token"`                                            | Token ausente ou inválido                 |
| `403`  | `"Insufficient permissions"`                                                     | Usuário não é ADMIN                       |
| `400`  | `"Category not found"`                                                           | Categoria não encontrada                  |
| `400`  | `"Cannot delete category because there are orders associated with its products"` | Existem pedidos com produtos da categoria |

---

## 🛒 Produtos

---

### POST /products

Cria um novo produto vinculado a uma categoria, com upload obrigatório de imagem.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `CreateProductController`
- **Service:** `CreateProductService`
- **Schema:** `createProductSchema`
- **Upload:** `multer.single("file")` — campo `file` no form-data

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

#### Request Body (form-data)

| Campo         | Tipo   | Obrigatório | Validação                         | Descrição                        |
| ------------- | ------ | ----------- | --------------------------------- | -------------------------------- |
| `name`        | string | ✅          | Min. 3 caracteres                 | Nome do produto                  |
| `price`       | string | ✅          | Apenas números (regex: `/^\d+$/`) | Preço em centavos (ex: `"1500"`) |
| `description` | string | ✅          | Min. 10 caracteres                | Descrição do produto             |
| `category_id` | string | ✅          | UUID válido                       | ID da categoria do produto       |
| `file`        | file   | ✅          | JPEG, PNG ou GIF (max 5MB)        | Imagem do produto                |

#### Response — 200 OK

```json
{
	"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"name": "Pastel de Carne",
	"price": 1500,
	"description": "Pastel crocante com recheio de carne moída temperada",
	"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/v123/products/user_id/image.jpg",
	"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"createdAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                             |
| ------ | ------------------------------------- | --------------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema       |
| `400`  | `"File is required"`                  | Imagem não enviada no request     |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido         |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN               |
| `400`  | `"Category does not exist"`           | `category_id` inválido            |
| `400`  | `"Invalid price value"`               | Preço inválido, zero ou negativo  |
| `400`  | `"Error uploading file"`              | Falha no upload para o Cloudinary |

---

### GET /products

Lista os produtos de uma categoria específica, com filtro opcional por status.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `ListProductsController`
- **Service:** `ListProductsService`
- **Schema:** `listProductsSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro     | Tipo   | Obrigatório | Padrão      | Descrição                                          |
| ------------- | ------ | ----------- | ----------- | -------------------------------------------------- |
| `category_id` | string | ✅          | —           | UUID da categoria para filtrar                     |
| `status`      | string | ❌          | `undefined` | `"true"` para desabilitados, `"false"` para ativos |

#### Exemplo de Requisição

```
GET /products?category_id=uuid-da-categoria&status=false
```

#### Response — 200 OK

```json
[
	{
		"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
		"name": "Pastel de Carne",
		"price": 1500,
		"description": "Pastel crocante com recheio de carne moída temperada",
		"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
		"disabled": false,
		"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
		"createdAt": "2026-03-18T10:00:00.000Z",
		"updatedAt": "2026-03-18T10:00:00.000Z",
		"productsOptionals": [
			{
				"optional": {
					"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
					"name": "Catupiry",
					"price": 300
				}
			}
		]
	}
]
```

> Ordenado por `createdAt` em ordem decrescente. Inclui opcionais vinculados (não desabilitados).

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | `category_id` não fornecido |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `400`  | `"Category does not exist"`           | Categoria não encontrada    |

---

### GET /products/detail

Retorna os detalhes de um produto específico, incluindo categoria e opcionais vinculados.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `DetailProductController`
- **Service:** `DetailProductService`
- **Schema:** `detailProductSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro    | Tipo   | Obrigatório | Descrição       |
| ------------ | ------ | ----------- | --------------- |
| `product_id` | string | ✅          | UUID do produto |

#### Exemplo de Requisição

```
GET /products/detail?product_id=uuid-do-produto
```

#### Response — 200 OK

```json
{
	"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"name": "Pastel de Carne",
	"price": 1500,
	"description": "Pastel crocante com recheio de carne moída temperada",
	"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
	"disabled": false,
	"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z",
	"category": {
		"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
		"name": "Pastéis Salgados",
		"description": "Pastéis tradicionais com recheios salgados",
		"createdAt": "2026-03-18T10:00:00.000Z",
		"updatedAt": "2026-03-18T10:00:00.000Z"
	},
	"productsOptionals": [
		{
			"optional": {
				"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
				"name": "Catupiry",
				"price": 300
			}
		}
	]
}
```

#### Erros

| Status | Mensagem                              | Causa                      |
| ------ | ------------------------------------- | -------------------------- |
| `400`  | `"Validation failed"`                 | `product_id` não fornecido |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido  |
| `400`  | `"Product does not exist"`            | Produto não encontrado     |

---

### GET /products/all

Lista todos os produtos do sistema, independente de categoria.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `AllProductsController`
- **Service:** `AllProductsService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão    | Descrição                                          |
| --------- | ------ | ----------- | --------- | -------------------------------------------------- |
| `status`  | string | ❌          | `"false"` | `"true"` para desabilitados, `"false"` para ativos |

#### Exemplo de Requisição

```
GET /products/all?status=false
```

#### Response — 200 OK

```json
[
	{
		"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
		"name": "Pastel de Carne",
		"price": 1500,
		"description": "Pastel crocante com recheio de carne moída temperada",
		"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
		"disabled": false,
		"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
		"createdAt": "2026-03-18T10:00:00.000Z",
		"updatedAt": "2026-03-18T10:00:00.000Z",
		"category": {
			"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
			"name": "Pastéis Salgados"
		},
		"productsOptionals": [
			{
				"optional": {
					"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
					"name": "Catupiry",
					"price": 300
				}
			}
		]
	}
]
```

> Ordenado por `createdAt` em ordem decrescente. Inclui categoria e opcionais vinculados.

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |

---

### PUT /products/:product_id

Atualiza um produto existente. Todos os campos são opcionais. A imagem pode ser atualizada enviando um novo arquivo.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `UpdateProductController`
- **Service:** `UpdateProductService`
- **Schema:** `updateProductSchema`
- **Upload:** `multer.single("file")` — campo `file` no form-data (opcional)

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

#### Path Parameters

| Parâmetro    | Tipo   | Obrigatório | Descrição       |
| ------------ | ------ | ----------- | --------------- |
| `product_id` | string | ✅          | UUID do produto |

#### Request Body (form-data)

| Campo         | Tipo   | Obrigatório | Validação                         | Descrição                 |
| ------------- | ------ | ----------- | --------------------------------- | ------------------------- |
| `name`        | string | ❌          | Min. 3 caracteres (se fornecido)  | Novo nome do produto      |
| `price`       | string | ❌          | Apenas números (se fornecido)     | Novo preço em centavos    |
| `description` | string | ❌          | Min. 10 caracteres (se fornecido) | Nova descrição do produto |
| `file`        | file   | ❌          | JPEG, PNG ou GIF (max 5MB)        | Nova imagem do produto    |

#### Response — 200 OK

```json
{
	"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"name": "Pastel de Carne Especial",
	"price": 1800,
	"description": "Pastel crocante com recheio de carne moída premium",
	"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
	"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"createdAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                             |
| ------ | ------------------------------------- | --------------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema       |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido         |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN               |
| `400`  | `"Product does not exist"`            | Produto não encontrado            |
| `400`  | `"Error uploading file"`              | Falha no upload para o Cloudinary |

---

### PUT /products/:product_id/update-status

Atualiza o status (habilitado/desabilitado) de um produto e de todos os seus opcionais vinculados.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `UpdateStatusProductController`
- **Service:** `UpdateStatusProductService`
- **Schema:** `updateStatusProductSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro    | Tipo   | Obrigatório | Descrição       |
| ------------ | ------ | ----------- | --------------- |
| `product_id` | string | ✅          | UUID do produto |

#### Request Body

```json
{
	"disabled": true
}
```

| Campo      | Tipo    | Obrigatório | Descrição                                       |
| ---------- | ------- | ----------- | ----------------------------------------------- |
| `disabled` | boolean | ✅          | `true` para desabilitar, `false` para habilitar |

#### Response — 200 OK

```json
{
	"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"name": "Pastel de Carne",
	"price": 1500,
	"description": "Pastel crocante com recheio de carne moída temperada",
	"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
	"disabled": true,
	"category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T12:00:00.000Z"
}
```

> **Nota:** Ao desabilitar/habilitar um produto, todos os vínculos com opcionais (`products_optionals`) também são atualizados com o mesmo status.

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN         |
| `400`  | `"Product does not exist"`            | Produto não encontrado      |
| `400`  | `"Error updating product status"`     | Erro ao atualizar no banco  |

---

### POST /products/optionals

Vincula um opcional a um produto. Se o vínculo já existia (desabilitado), ele é reativado.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `AddOptionalToProductController`
- **Service:** `AddOptionalToProductService`
- **Schema:** `addOptionalToProductSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"optional_id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
	"product_id": "e5f6a7b8-c9d0-1234-efab-345678901234"
}
```

| Campo         | Tipo   | Obrigatório | Descrição        |
| ------------- | ------ | ----------- | ---------------- |
| `optional_id` | string | ✅          | UUID do opcional |
| `product_id`  | string | ✅          | UUID do produto  |

#### Response — 200 OK

```json
{
	"id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
	"product_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"optional_id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
	"disabled": false,
	"optional": {
		"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
		"name": "Catupiry",
		"price": 300
	},
	"product": {
		"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
		"name": "Pastel de Carne",
		"price": 1500
	}
}
```

#### Erros

| Status | Mensagem                               | Causa                              |
| ------ | -------------------------------------- | ---------------------------------- |
| `400`  | `"Validation failed"`                  | Campos não atendem o schema        |
| `401`  | `"Token missing"` / `"Invalid token"`  | Token ausente ou inválido          |
| `403`  | `"Insufficient permissions"`           | Usuário não é ADMIN                |
| `400`  | `"Optional or Product does not exist"` | Opcional ou produto não encontrado |

---

### DELETE /products/optionals/:product_optional_id

Remove o vínculo entre um opcional e um produto.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `RemoveOptionalToProductController`
- **Service:** `RemoveOptionalToProductService`
- **Schema:** `removeOptionalToProductSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro             | Tipo   | Obrigatório | Descrição                             |
| --------------------- | ------ | ----------- | ------------------------------------- |
| `product_optional_id` | string | ✅          | UUID do registro `products_optionals` |

#### Response — 200 OK

```json
{
	"count": 1
}
```

#### Erros

| Status | Mensagem                                | Causa                               |
| ------ | --------------------------------------- | ----------------------------------- |
| `400`  | `"Validation failed"`                   | `product_optional_id` não fornecido |
| `401`  | `"Token missing"` / `"Invalid token"`   | Token ausente ou inválido           |
| `403`  | `"Insufficient permissions"`            | Usuário não é ADMIN                 |
| `400`  | `"Optional not found for this product"` | Vínculo não encontrado              |

---

## 🧂 Opcionais

---

### POST /optionals

Cria um novo item adicional (opcional) que pode ser vinculado a produtos.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN
- **Controller:** `CreateOptionalController`
- **Service:** `CreateOptionalService`
- **Schema:** `createOptionalSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"name": "Catupiry",
	"price": 300
}
```

| Campo   | Tipo   | Obrigatório | Validação   | Descrição                     |
| ------- | ------ | ----------- | ----------- | ----------------------------- |
| `name`  | string | ✅          | Min. 1 char | Nome do adicional (único)     |
| `price` | number | ✅          | Min. 0      | Preço em centavos (ex: `300`) |

#### Response — 200 OK

```json
{
	"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
	"name": "Catupiry",
	"price": 300,
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `403`  | `"Insufficient permissions"`          | Usuário não é ADMIN         |

---

### GET /optionals

Lista todos os opcionais cadastrados.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `ListOptionalsController`
- **Service:** `ListOptionalsService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
[
	{
		"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
		"name": "Catupiry",
		"price": 300,
		"createdAt": "2026-03-18T10:00:00.000Z"
	},
	{
		"id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
		"name": "Cheddar",
		"price": 250,
		"createdAt": "2026-03-17T08:00:00.000Z"
	}
]
```

> Ordenado por `createdAt` em ordem decrescente (mais recentes primeiro).

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |

---

### GET /optionals/:optional_id

Retorna os detalhes de um opcional específico.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `DetailOptionalController`
- **Service:** `DetailOptionalService`
- **Schema:** `detailOptionalSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro     | Tipo   | Obrigatório | Descrição        |
| ------------- | ------ | ----------- | ---------------- |
| `optional_id` | string | ✅          | UUID do opcional |

#### Response — 200 OK

```json
{
	"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
	"name": "Catupiry",
	"price": 300,
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | `optional_id` não fornecido |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |
| `400`  | `"Optional not found"`                | Opcional não encontrado     |

---

## 📋 Pedidos

---

### POST /orders

Cria um novo pedido (rascunho) vinculado a uma mesa.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `CreateOrderController`
- **Service:** `CreateOrderService`
- **Schema:** `createOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"table": 5,
	"name": "Carlos Silva"
}
```

| Campo   | Tipo   | Obrigatório | Validação | Descrição                  |
| ------- | ------ | ----------- | --------- | -------------------------- |
| `table` | number | ✅          | Min. 1    | Número da mesa             |
| `name`  | string | ❌          | —         | Nome do cliente (opcional) |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": false,
	"draft": true,
	"name": "Carlos Silva",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                       |
| ------ | ------------------------------------- | --------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido   |

---

### POST /orders/items

Adiciona um produto ao pedido. Se o mesmo produto (com o mesmo opcional) já existe, a quantidade é incrementada.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `AddProductOrderController`
- **Service:** `AddProductOrderService`
- **Schema:** `addProductOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"order_id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"product_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
	"amount": 2,
	"optional_id": "f6a7b8c9-d0e1-2345-fabc-456789012345"
}
```

| Campo         | Tipo   | Obrigatório | Validação | Descrição                                         |
| ------------- | ------ | ----------- | --------- | ------------------------------------------------- |
| `order_id`    | string | ✅          | UUID      | UUID do pedido                                    |
| `product_id`  | string | ✅          | UUID      | UUID do produto                                   |
| `amount`      | number | ✅          | Min. 1    | Quantidade do produto                             |
| `optional_id` | string | ❌          | UUID      | UUID do opcional vinculado ao produto (se houver) |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": false,
	"draft": true,
	"name": "Carlos Silva",
	"items": [
		{
			"id": "c9d0e1f2-a3b4-5678-cdef-789012345678",
			"amount": 2,
			"product": {
				"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
				"name": "Pastel de Carne",
				"description": "Pastel crocante com recheio de carne moída temperada",
				"price": 1500,
				"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/..."
			},
			"itemsOptionals": [
				{
					"product_optional": {
						"optional": {
							"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
							"name": "Catupiry",
							"price": 300
						}
					}
				}
			]
		}
	]
}
```

#### Erros

| Status | Mensagem                              | Causa                                  |
| ------ | ------------------------------------- | -------------------------------------- |
| `400`  | `"Validation failed"`                 | Campos não atendem o schema            |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido              |
| `400`  | `"Invalid amount"`                    | Quantidade menor ou igual a zero       |
| `400`  | `"Product or order not found"`        | Produto ou pedido não encontrado       |
| `400`  | `"Optional not linked to product"`    | Opcional não está vinculado ao produto |

---

### DELETE /orders/remove/:item_id

Remove um item específico do pedido.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `RemoveProductOrderController`
- **Service:** `RemoveProductOrderService`
- **Schema:** `removeProductOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro | Tipo   | Obrigatório | Descrição                   |
| --------- | ------ | ----------- | --------------------------- |
| `item_id` | string | ✅          | UUID do item a ser removido |

#### Query Parameters

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

#### Exemplo de Requisição

```
DELETE /orders/remove/uuid-do-item?order_id=uuid-do-pedido
```

#### Response — 200 OK

Retorna o pedido atualizado com os itens restantes (mesmo formato da resposta de `POST /orders/items`).

#### Erros

| Status | Mensagem                                    | Causa                           |
| ------ | ------------------------------------------- | ------------------------------- |
| `400`  | `"Validation failed"`                       | Parâmetros não atendem o schema |
| `401`  | `"Token missing"` / `"Invalid token"`       | Token ausente ou inválido       |
| `400`  | `"Order or product not found in the order"` | Pedido ou item não encontrado   |

---

### GET /orders/details/:order_id

Retorna os detalhes completos de um pedido, incluindo todos os itens com produtos e opcionais.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `DetailOrderController`
- **Service:** `DetailOrderService`
- **Schema:** `detailOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": false,
	"draft": true,
	"name": "Carlos Silva",
	"items": [
		{
			"id": "c9d0e1f2-a3b4-5678-cdef-789012345678",
			"amount": 2,
			"product": {
				"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
				"name": "Pastel de Carne",
				"description": "Pastel crocante com recheio de carne moída temperada",
				"price": 1500,
				"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/..."
			},
			"itemsOptionals": [
				{
					"product_optional": {
						"optional": {
							"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
							"name": "Catupiry",
							"price": 300
						}
					}
				}
			]
		}
	]
}
```

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `400`  | `"Validation failed"`                 | `order_id` não fornecido  |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |
| `400`  | `"Order not found"`                   | Pedido não encontrado     |

---

### GET /orders

Lista todos os pedidos enviados (não rascunhos), filtrados por status.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `ListOrdersController`
- **Service:** `ListOrdersService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão    | Descrição                                           |
| --------- | ------ | ----------- | --------- | --------------------------------------------------- |
| `status`  | string | ❌          | `"false"` | `"true"` para finalizados, `"false"` para em aberto |

#### Exemplo de Requisição

```
GET /orders?status=false
```

#### Response — 200 OK

```json
[
	{
		"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
		"table": 5,
		"status": false,
		"draft": false,
		"name": "Carlos Silva",
		"items": [
			{
				"id": "c9d0e1f2-a3b4-5678-cdef-789012345678",
				"amount": 2,
				"product": {
					"id": "e5f6a7b8-c9d0-1234-efab-345678901234",
					"name": "Pastel de Carne",
					"description": "Pastel crocante com recheio de carne moída temperada",
					"price": 1500,
					"bannerUrl": "https://res.cloudinary.com/xxx/image/upload/...",
					"category": {
						"id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
						"name": "Pastéis Salgados"
					}
				},
				"itemsOptionals": [
					{
						"product_optional": {
							"optional": {
								"id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
								"name": "Catupiry",
								"price": 300
							}
						}
					}
				]
			}
		]
	}
]
```

> **Nota:** Apenas pedidos com `draft = false` são retornados. A listagem inclui itens com dados completos de produto, categoria e opcionais.

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |

---

### DELETE /orders/:order_id

Remove um pedido e todos os seus itens em cascata.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `RemoveOrderController`
- **Service:** `RemoveOrderService`
- **Schema:** `removeOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": false,
	"draft": true,
	"name": "Carlos Silva",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                     |
| ------ | ------------------------------------- | ------------------------- |
| `400`  | `"Validation failed"`                 | `order_id` não fornecido  |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido |
| `400`  | `"Order not found"`                   | Pedido não encontrado     |

---

### PATCH /orders/:order_id/send

Envia um pedido (altera o status de rascunho para enviado). O pedido deve ter pelo menos um item.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `SendOrderController`
- **Service:** `SendOrderService`
- **Schema:** `sendOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": false,
	"draft": false,
	"name": "Carlos Silva",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T10:30:00.000Z"
}
```

#### Erros

| Status | Mensagem                              | Causa                               |
| ------ | ------------------------------------- | ----------------------------------- |
| `400`  | `"Validation failed"`                 | `order_id` não fornecido            |
| `401`  | `"Token missing"` / `"Invalid token"` | Token ausente ou inválido           |
| `400`  | `"Order not found"`                   | Pedido não encontrado               |
| `400`  | `"Cannot send an empty order"`        | Pedido sem itens                    |
| `400`  | `"Order has already been sent"`       | Pedido já foi enviado anteriormente |

---

### PATCH /orders/:order_id/finish

Finaliza um pedido que já foi enviado.

- **Autenticação:** ✅ Requerida
- **Permissão:** ADMIN, STAFF
- **Controller:** `FinishOrderController`
- **Service:** `FinishOrderService`
- **Schema:** `finishOrderSchema`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

#### Response — 200 OK

```json
{
	"id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
	"table": 5,
	"status": true,
	"draft": false,
	"name": "Carlos Silva",
	"createdAt": "2026-03-18T10:00:00.000Z",
	"updatedAt": "2026-03-18T11:00:00.000Z"
}
```

#### Erros

| Status | Mensagem                                  | Causa                                                |
| ------ | ----------------------------------------- | ---------------------------------------------------- |
| `400`  | `"Validation failed"`                     | `order_id` não fornecido                             |
| `401`  | `"Token missing"` / `"Invalid token"`     | Token ausente ou inválido                            |
| `400`  | `"Order not found or cannot be finished"` | Pedido não existe, ainda é rascunho ou já finalizado |

---

## 📊 Códigos de Status

| Código | Significado                                         |
| ------ | --------------------------------------------------- |
| `200`  | Operação bem-sucedida                               |
| `400`  | Erro de validação (Zod) ou regra de negócio violada |
| `401`  | Token JWT ausente ou inválido                       |
| `403`  | Permissão insuficiente (usuário não é ADMIN)        |
| `500`  | Erro interno do servidor                            |
