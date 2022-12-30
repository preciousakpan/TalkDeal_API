'use strict';


import { v4 as uuidV4 } from 'uuid';
import bCrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE"
      });
    }
  }
  Wallet.init({
    userId: DataTypes.UUID,
    amount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Wallets',
    tableName: 'Wallets',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  Wallet.beforeCreate((wallet) => {
    wallet.id = uuidV4();
  });

  return Wallet;
};