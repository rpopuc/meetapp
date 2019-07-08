import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        location: Sequelize.TEXT,
        date: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'banner_id',
      as: 'banner',
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Meetup;
