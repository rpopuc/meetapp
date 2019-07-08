import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import sentryConfig from './config/sentry';
import 'express-async-errors';

import routes from './routes';
import './database';

class App {

  constructor() {
    // Instancia o express
    this.server = express();

    // Configura o Sentry
    Sentry.init(sentryConfig);
    this.server.use(Sentry.Handlers.requestHandler());

    // Carrega os middlewares
    this.middlewares();

    // Carrega as rotas
    this.routes();

    // Utiliza o Sentry
    this.server.use(Sentry.Handlers.errorHandler());

    this.exceptionHandler();
  }

  middlewares() {
    // Prepara a aplicação para receber chamadas em JSON
    this.server.use(express.json());
  }

  routes() {
    // Configura as rotas para a aplicação
    this.server.use(routes);
  }

  // Gerencia as exceções
  // Em ambiente de desenvolvimento, exibe o log
  // completo da exceção
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

// Exporta a instância de server
export default new App().server;
