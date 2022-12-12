'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bid.init({
    productId: DataTypes.UUID,
    bidderId: DataTypes.UUID,
    bidderName: DataTypes.STRING,
    currentBidPrice: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'Bids',
    tableName: 'Bids',
    freezeTableName: true
  });

  //  Before the Records will be created, let's do the following.
  Bid.beforeCreate((bid) => {
    bid.id = uuidV4();
  });

  return Bid;
};