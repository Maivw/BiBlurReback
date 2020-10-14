"use strict";
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			username: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			imageUrl: DataTypes.STRING,
		},
		{}
	);
	User.associate = function (models) {
		User.hasMany(models.Post, {
			foreignKey: "userId",
			onDelete: "cascade",
			hooks: true,
		});

		User.hasMany(models.Comment, {
			foreignKey: "userId",
			onDelete: "cascade",
			hooks: true,
		});

		User.hasMany(models.Like, {
			foreignKey: "userId",
			onDelete: "cascade",
			hooks: true,
		});

		const columnMapping1 = {
			through: "Follows",
			foreignKey: "followed",
			otherKey: "following",
			as: "myFollowers",
		};
		const columnMapping2 = {
			through: "Follows",
			foreignKey: "following",
			otherKey: "followed",
			as: "following",
		};
		User.belongsToMany(models.User, columnMapping1);
		User.belongsToMany(models.User, columnMapping2);
	};
	return User;
};
