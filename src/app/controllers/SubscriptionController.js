// Importa a biblioteca de validação
import * as Yup from 'yup';
import {isBefore} from 'date-fns';
import HttpStatus from 'http-status-codes';

// Importa o model do Meetup
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

/**
 * Controller para gestão de inscrições em Meetups
 */
class SubscriptionController {
  /**
   * Registra uma inscrição em um meetup para o usuário logado
   */
  async store(req, res) {
    // Define as regras de validação dos dados de entrada
    const schema = Yup.object().shape({
      meetup_id: Yup.number().integer().required(),
    });

    // Verifica se as regras de validação foram obedecidas
    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
    }

    const meetup = await Meetup.findByPk(req.body.meetup_id)

    if (! meetup) {
      return res.status(HttpStatus.NOT_FOUND).json({error: 'Meetup not found.'})
    }

    // Regras de negócio

    // Usuário não pode se inscrever em um meetup que ele mesmo organiza
    if (meetup.user_id == req.userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "You are already subscribed to your own meetup!" });
    }

    // Usuário não pode se inscrever em um meetup passado
    if (isBefore(meetup.date, new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "You can't subscribe to past meetups" });
    }

    // Usuário não pode se inscrever em um mesmo meetup mais de uma vez
    // Usuário não pode se inscrever em meetups no mesmo horário
    const hasMeetupAtSameDatetime = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date
          },
        },
      ],
    });

    if (hasMeetupAtSameDatetime) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "You can't subscribe to two meetups at the same time" });
    }

    // Efetua o registro dos dados na base
    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    // Retorna os dados do usuário recém criado
    return res.status(HttpStatus.CREATED).json(subscription);
  }
}

export default new SubscriptionController();