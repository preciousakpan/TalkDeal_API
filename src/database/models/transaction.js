'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    talkDealTransactionId: DataTypes.STRING,
    payStackTransactionId: DataTypes.BIGINT,
    userId: DataTypes.UUID,
    amount: DataTypes.DOUBLE,
    reference: DataTypes.STRING,
    status: DataTypes.STRING,
    reason: DataTypes.STRING,
    transactionDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'Transactions',
    freezeTableName: true
  });

  //  Before the Records will be created, let's do the following.
  Transaction.beforeCreate((transaction) => {
    transaction.id = uuidV4();
  });

  return Transaction;
};