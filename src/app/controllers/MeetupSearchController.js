import {parseISO, startOfDay, endOfDay} from 'date-fns';
import { Op } from 'sequelize';

// Importa os models
import Meetup from '../models/Meetup';
import User from '../models/User';

/**
 * Controller para consulta de meetups
 */
class MeetupSearchController {
  /**
   * Lista os meetups de acordo com a busca
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    let filter = {};

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);
      filter.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where: filter,
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
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
      }]
    });

    return res.json(meetups);
  }
}

export default new MeetupSearchController();
