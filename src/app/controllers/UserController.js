// Importa a biblioteca de validação
import * as Yup from 'yup';

// Importa o model do Usuário
import User from '../models/User';

/**
 * Controller para gestão de dados de usuários
 */
class UserController {
  /**
   * Registra um novo usuário
   */
  async store(req, res) {
    // Define as regras de validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Verifica se as regras de validação foram obedecidas
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verifica se já existe um usuário com o email informado
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    // Caso exista, bloqueia o registro
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Efetua o registro dos dados na base
    const { id, name, email, provider } = await User.create(req.body);

    // Retorna os dados do usuário recém criado
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  /**
   * Efetua a alteração dos dados do usuário
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Obtém os dados de entrada
    const { oldPassword } = req.body;

    // Obtém o usuário da base de dados
    const user = await User.findByPk(req.userId);

    // Verifica se a alteração
    // implica em um email duplicado
    if (req.body.email && req.body.email !== user.email) {
      // Verifica se existe um usuário com o mesmo email
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      // Se existir, bloqueia a alteração
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // Se for solicitada a alteração de senha...
    // ...Verifica se a senha atual está correta
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // Efetua a alteração dos dados
    await user.update(req.body);

    // Retorna os dados do usuário
    const { id, name, email, provider } = user;
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
