'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredient.hasMany(models.Cocktail, {
			foreignKey: "spirit",
			onDelete: "CASCADE",
		});
		  Ingredient.hasMany(models.Cocktail, {
			foreignKey: "citrus",
			onDelete: "CASCADE",
		});
		  Ingredient.hasMany(models.Cocktail, {
			foreignKey: "sweetener",
			onDelete: "CASCADE",
		});
    }
  }
  Ingredient.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ingredient',
  });
  return Ingredient;
};