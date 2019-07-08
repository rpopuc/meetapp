// Importa a biblioteca de manipulação de JWT
import jwt from 'jsonwebtoken';

// Importa a função de conversão de função
// callback para Promise
import { promisify } from 'util';

// Importa as configurações de autenticação
import authConfig from '../../config/auth';

/**
 * Exporta função para ser utilizada como middleware
 * de rotas da aplicação.
 * Esse middleware é reponsável por verificar
 * se a requisição está sendo efetuada com um token (JWT)
 * válido de autenticação
 */
export default async (req, res, next) => {
  // Obtém a string authorization da header da requisição
  const authHeader = req.headers.authorization;

  // Caso não tenha sido informada um token de autorização
  if (!authHeader) {
    // Retorna o erro
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Obtém o token informado
  // Retirando a string Bearer do token
  const [, token] = authHeader.split(' ');

  try {
    // Descriptografa o token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Obtém o identificador do usuário
    req.userId = decoded.id;
    return next();
  } catch (err) {
    // Caso o token seja inválido, retorna o erro
    return res.status(401).json({ error: 'Token invalid' });
  }
};
