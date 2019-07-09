import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        // Nada
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Meetup, {
      foreignKey: 'meetup_id'
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  }
}

export default Subscription;
