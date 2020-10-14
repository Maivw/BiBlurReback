"use strict";
module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		"Post",
		{
			postContent: DataTypes.STRING,
			location: DataTypes.STRING,
			userId: DataTypes.INTEGER,
			imagePostUrl: DataTypes.STRING,
			videoPostUrl: DataTypes.STRING,
		},
		{}
	);
	Post.associate = function (models) {
		Post.belongsTo(models.User, {
			foreignKey: "userId",
		});
		Post.hasMany(models.Comment, {
			foreignKey: "postId",
			onDelete: "cascade",
			hooks: true,
		});
		Post.hasMany(models.Like, {
			foreignKey: "postId",
			onDelete: "cascade",
			hooks: true,
		});
	};
	return Post;
};
