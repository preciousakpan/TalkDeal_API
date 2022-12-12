'use strict';

import { v4 as uuidV4 } from 'uuid';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: DataTypes.STRING,
    category: DataTypes.ENUM("All Categories", "Computing", "Electronics", "Sporting", "Phones & Tablets", "Toys", "Fashion", "Home & Office", "Automobile", "Health & Beauty", "Babies"),
    initialPrice: DataTypes.DOUBLE,
    finalPrice: DataTypes.DOUBLE,
    count: DataTypes.INTEGER,
    weight: DataTypes.DOUBLE,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.ENUM("Available", "Not Available"),
    ownerId: DataTypes.UUID,
    dueDate: DataTypes.DATE,
    images: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'Products',
    freezeTableName: true
  });

  //  Before the Records will be created, let's do the following.
  Product.beforeCreate((product) => {
    product.id = uuidV4();
  });

  return Product;
};