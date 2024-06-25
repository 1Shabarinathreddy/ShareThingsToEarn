'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemImages.belongsTo(models.Item, {
        foreignKey: 'itemId'
      })
    }
  }
  ItemImages.init({
    itemId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    fileName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ItemImages',
  });
  return ItemImages;
};