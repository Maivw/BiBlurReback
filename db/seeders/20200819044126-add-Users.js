"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"Users",
			[
				{
					username: "Demo",
					email: "demo@gmail.com",
					password:
						"$2a$10$l16QhY4ALqAtY83nlyvukuan7hd59W1TT.wCVBAbe8p80bI17Rk9i",
					imageUrl:
						"https://images.pexels.com/photos/838875/pexels-photo-838875.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					username: "Demo1",
					email: "demo1@gmail.com",
					password:
						"$2a$10$l16QhY4ALqAtY83nlyvukuan7hd59W1TT.wCVBAbe8p80bI17Rk9i",
					imageUrl:
						"https://images.pexels.com/photos/764529/pexels-photo-764529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					username: "Demo2",
					email: "demo2@gmail.com",
					password:
						"$2a$10$g3cXgk6AJAEWBicWgSLPq.SQMeuGGGBTpBa/YJ6kyM4N5Tr4ZDeru",
					imageUrl:
						"https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Users", null, {});
	},
};
