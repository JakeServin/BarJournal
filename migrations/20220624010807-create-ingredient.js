

"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Cocktails", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			spirit: {
				type: Sequelize.INTEGER,
				onDelete: "CASCADE",
				references: {
					model: "Ingredients",
					key: "id",
					as: "spirit",
				},
			},
			citrus: {
				type: Sequelize.INTEGER,
				onDelete: "CASCADE",
				references: {
					model: "Ingredients",
					key: "id",
					as: "citrus",
				},
			},
			sweetener: {
				type: Sequelize.INTEGER,
				onDelete: "CASCADE",
				references: {
					model: "Ingredients",
					key: "id",
					as: "sweetener",
				},
			},
			shake: {
				type: Sequelize.STRING,
			},
			creatorId: {
				type: Sequelize.INTEGER,
				onDelete: "CASCADE",
				references: {
					model: "Users",
					key: "id",
					as: "creatorId",
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Cocktails");
	},
};