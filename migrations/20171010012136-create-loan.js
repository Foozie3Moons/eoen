'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      loanAmount: {
        type: Sequelize.DOUBLE
      },
      downPayemnt: {
        type: Sequelize.DOUBLE
      },
      apr: {
        type: Sequelize.DOUBLE
      },
      lifeOfLoan: {
        type: Sequelize.INTEGER
      },
      paymentsPerYear: {
        type: Sequelize.DOUBLE
      },
      userId: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('loans');
  }
};