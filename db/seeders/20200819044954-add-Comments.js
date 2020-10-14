"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Comments", [
			{
				commentContent: "you are amazing!",
				postId: 1,
				userId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				commentContent: "Gorgeous!!! Missed you!",
				postId: 1,
				userId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				commentContent: "love it, love it, love it! ",
				postId: 1,
				userId: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				commentContent: "wosw!!!!!",
				postId: 2,
				userId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				commentContent: "Cool",
				postId: 2,
				userId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Comments", null, {});
	},
};
