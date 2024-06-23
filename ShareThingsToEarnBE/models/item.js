'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Category, {
        foreignKey: 'categoryId'
      }),
      Item.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Item.init({
    title: DataTypes.STRING,
    userId:DataTypes.NUMBER,
    categoryId: DataTypes.NUMBER,
    description: DataTypes.STRING,
    rentalPrice: DataTypes.FLOAT,
    rentalPeriod: DataTypes.STRING,
    availabilityStartDate: DataTypes.DATE,
    availabilityEndDate: DataTypes.DATE,
    location: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};