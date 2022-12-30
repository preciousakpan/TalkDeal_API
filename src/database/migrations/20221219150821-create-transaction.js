'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      talkDealTransactionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payStackTransactionId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "Pending"
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      transactionDate: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Transactions');
  }
};