'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cocktail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cocktail.belongsTo(models.User, {
        foreignKey: 'creatorId',
        onDelete: 'CASCADE'
      })
      Cocktail.belongsTo(models.Ingredient, {
        foreignKey: 'spirit',
      })
      Cocktail.belongsTo(models.Ingredient, {
        foreignKey: 'citrus',
        onDelete: 'CASCADE'
      })
      Cocktail.belongsTo(models.Ingredient, {
        foreignKey: 'sweetener',
        onDelete: 'CASCADE'
      })
    }
  }
  Cocktail.init({
    name: DataTypes.STRING,
    spirit: DataTypes.INTEGER,
    citrus: DataTypes.INTEGER,
    sweetener: DataTypes.INTEGER,
    shake: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cocktail',
  });
  return Cocktail;
};