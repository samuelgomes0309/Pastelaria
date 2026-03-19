import { Router } from "express";
import { userRouter } from "./routes/users/users.routes";
import { categoryRouter } from "./routes/categories/categories.routes";
import { productRouter } from "./routes/products/products.routes";
import { optionalRouter } from "./routes/optionals/optionals.routes";
import { orderRouter } from "./routes/orders/orders.routes";

// Criar uma instância do roteador do Express
const router = Router();

// Configuração das rotas
router.use(userRouter); // Rotas de usuários
router.use(categoryRouter); // Rotas de categorias
router.use(productRouter); // Rotas de produtos
router.use(optionalRouter); // Rotas de opcionais
router.use(orderRouter); // Rotas de pedidos

export { router };
