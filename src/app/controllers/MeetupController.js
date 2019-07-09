// Importa a biblioteca de validação
import * as Yup from 'yup';
import {isBefore} from 'date-fns';

// Importa o model do Meetup
import Meetup from '../models/Meetup';

/**
 * Controller para gestão de login
 */
class MeetupController {
  /**
   * Registra um meetup do usuário logado
   */
  async store(req, res) {
    // Define as regras de validação dos dados de entrada
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      location: Yup.string().required(),
      date: Yup.date().required().min(new Date(), 'Past dates are not permitted'),
      banner_id: Yup.number().integer()
    });

    // Verifica se as regras de validação foram obedecidas
    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({error: error.message});
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
    const newMeetup = await Meetup.create(meetupData);

    // Retorna os dados do usuário recém criado
    return res.json({
      id: newMeetup.id,
      title,
      description,
      location,
      date
    });
  }

  /**
   * Lista os meetups do usuário logado
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: [
        'id',
        'date',
        'title',
        'description',
        'location'
      ],
      limit: 20,
      offset: (page - 1) * 20,
      order: [
        ['date', 'DESC']
      ],
    });

    return res.json(meetups);
  }

  /**
   * Cancela o meetup
   */
  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({error: 'Meetup not found.'})
    }

    if (meetup.user_id != req.userId) {
      return res.status(401).json({error: 'Not authorized.'})
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: "Cancel past meetups is not permitted" });
    }

    await meetup.destroy;

    return res.send({ok: true})
  }
}

export default new MeetupController();
