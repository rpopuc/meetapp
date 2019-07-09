// Importa a biblioteca de validação
import {isBefore} from 'date-fns';
import {Op} from 'sequelize';
import HttpStatus from 'http-status-codes';

// Importa o model do Meetup
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

/**
 * Controller para gestão de inscrições em Meetups
 */
class SubscriptionController {
  /**
   * Lista as inscrições do usuário logado
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [
        [Meetup, 'date']
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(subscriptions);
  }

  /**
   * Registra uma inscrição em um meetup para o usuário logado
   */
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

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

    // Envia notificação de inscrição para
    // o organizador do Meetup
    await Queue.add(SubscriptionMail.key, {
      subscription: {
        user: await subscription.getUser(),
        meetup,
      },
    });

    // Retorna os dados do usuário recém criado
    return res.status(HttpStatus.CREATED).json(subscription);
  }
}

export default new SubscriptionController();
