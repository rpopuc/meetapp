// Importa a biblioteca de validação
import * as Yup from 'yup';

// Importa o model do Meetup
import Meetup from '../models/Meetup';

/**
 * Controller para gestão de login
 */
class MeetupController {
  /**
   * Efetua o login na aplicação
   * Retorna o token JWT de autenticação
   */
  async store(req, res) {
    // Define as regras de validação dos dados de entrada
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().integer()
    });

    // Verifica se as regras de validação foram obedecidas
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date } = req.body;

    const meetupData = {
      title,
      description,
      location,
      date,
      user_id: req.userId,
      banner_id: req.body.banner_id,
    }

    // Efetua o registro dos dados na base
    await Meetup.create(meetupData);

    // Retorna os dados do usuário recém criado
    return res.json({
      title,
      description,
      location,
      date
    });
  }
}

export default new MeetupController();
