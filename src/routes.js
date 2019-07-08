import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Obtém o middleware de autenticação
import authMiddleware from './app/middlewares/auth';

const routes = new Router();


//---------------------------------------------------------- Rotas

// Inclusão de usuário
// {name, email, password}
routes.post('/users', UserController.store);

// Login
routes.post('/sessions', SessionController.store);

// Atualização dos dados do usuário
routes.put('/users', authMiddleware, UserController.update);

export default routes;
