"use strict";
module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define(
		"Comment",
		{
			commentContent: DataTypes.STRING,
			userId: DataTypes.INTEGER,
			postId: DataTypes.INTEGER,
		},
		{}
	);
	Comment.associate = function (models) {
		Comment.belongsTo(models.Post, {
			foreignKey: "postId",
			onDelete: "cascade",
		});
		Comment.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "cascade",
		});
		Comment.hasMany(models.Like, {
			foreignKey: "commentId",
			onDelete: "cascade",
			hooks: true,
		});
	};
	return Comment;
};
