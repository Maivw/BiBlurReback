"use strict";
module.exports = (sequelize, DataTypes) => {
	const Like = sequelize.define(
		"Like",
		{
			userId: DataTypes.INTEGER,
			postId: DataTypes.INTEGER,
			commentId: DataTypes.INTEGER,
		},
		{}
	);
	Like.associate = function (models) {
		Like.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "cascade",
		});
		Like.belongsTo(models.Post, {
			foreignKey: "postId",
		});
		Like.belongsTo(models.Comment, {
			foreignKey: "commentId",
		});
	};
	return Like;
};
