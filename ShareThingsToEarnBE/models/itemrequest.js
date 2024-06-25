'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemRequest.belongsTo(models.User, {
        foreignKey: 'requestedUserId'
      })
      ItemRequest.belongsTo(models.Item, {
        foreignKey: 'itemId'
      })
    }
  }
  ItemRequest.init({
    itemId: DataTypes.INTEGER,
    rentalStartDate: DataTypes.DATE,
    rentalEndDate: DataTypes.DATE,
    notes: DataTypes.STRING,
    requestedUserId: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'reject', 'approved', 'returned')
  }, {
    sequelize,
    modelName: 'ItemRequest',
  });
  return ItemRequest;
};