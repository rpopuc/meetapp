import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

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

// Upload de arquivos
const upload = multer(multerConfig);
routes.post('/files', authMiddleware, upload.single('file'), FileController.store);

export default routes;
