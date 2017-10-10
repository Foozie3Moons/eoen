'use strict';
module.exports = (sequelize, DataTypes) => {
  var loan = sequelize.define('loan', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    loanAmount: {
      type: DataTypes.DOUBLE,
      min: {
        args: 0,
        msg: 'Loan amount must be greater than 0'
      },
      max: {
        args: 99999999,
        msg: 'Loan amount must be less than 99999999'
      }
    },
    downPayment: DataTypes.DOUBLE,
    apr: DataTypes.DOUBLE,
    lifeOfLoan: DataTypes.INTEGER,
    paymentsPerYear: DataTypes.DOUBLE,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.loan.belongsTo(models.user);
      }
    }
  });
  return loan;
};
