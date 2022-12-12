'use strict';

import { v4 as uuidV4 } from 'uuid';
import bCrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Driver.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    location: DataTypes.ARRAY(DataTypes.STRING),
    address: DataTypes.STRING,
    logisticType: DataTypes.ENUM("Truck", "Small Car", "Motor Cycle"),
    picture: DataTypes.STRING,
    status: DataTypes.ENUM('Active', 'Inactive'),
    isVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Drivers',
    tableName: 'Drivers',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  Driver.beforeCreate((driver) => {
    driver.id = uuidV4();
  });
  Driver.beforeCreate((driver) => {
    driver.password = bCrypt.hashSync(driver.password, 10);
  });
  Driver.beforeUpdate((driver) => {
    driver.password = bCrypt.hashSync(driver.password, 10);
  });

  //  After the record is persisted and before the persisted data are returned, let's remove the "password".
  Driver.afterCreate((driver) => {
    delete driver.dataValues.password
  });

  return Driver;
};