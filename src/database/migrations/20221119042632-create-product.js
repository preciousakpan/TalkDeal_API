'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.ENUM("All Categories", "Computing", "Electronics", "Sporting", "Phones & Tablets", "Toys", "Fashion", "Home & Office", "Automobile", "Health & Beauty", "Babies"),
        defaultValue: "All Categories"
      },
      initialPrice: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
      },
      finalPrice: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      weight: {
        type: Sequelize.DOUBLE
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      status:{
        allowNull: false,
        type: Sequelize.ENUM("Available", "Not Available"),
        defaultValue: "Available"
      },
      ownerId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      dueDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      images: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};