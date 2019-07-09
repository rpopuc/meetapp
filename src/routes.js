import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

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

//---------------------------------------------------------- Meetups

// Registro de meetup
routes.post('/meetups', authMiddleware, MeetupController.store);

// Listagem de meetups
routes.get('/meetups', authMiddleware, MeetupController.index);

// Cancelamento de meetups
routes.delete('/meetups/:id', authMiddleware, MeetupController.delete);

// Edição de meetup
routes.put('/meetups/:id', authMiddleware, MeetupController.update);

//---------------------------------------------------------- Subscriptions

// Inscrição em um meetup
routes.post('/subscriptions', authMiddleware, SubscriptionController.store);

export default routes;
