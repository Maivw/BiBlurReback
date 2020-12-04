const express = require("express");
const router = express.Router();

const { asyncHandler, handleValidationErrors } = require("../utils");

const db = require("../db/models");
const { User, Like, Comment, Post, Follow } = db;

router.get(
	"/:userId/myfollowers",
	asyncHandler(async (req, res) => {
		const userId = parseInt(req.params.userId, 10);
		const user = await User.findOne({
			where: { id: userId },
			include: { model: User, as: "myFollowers" },
		});
		res.json({ user });
	})
);

router.get(
	"/:userId/myfollowings",
	asyncHandler(async (req, res) => {
		const userId = parseInt(req.params.userId, 10);
		const user = await User.findOne({
			where: { id: userId },
			include: { model: User, as: "following" },
		});
		res.json({ user });
	})
);

router.delete(
	"/:userId/myfollowings/:following",
	asyncHandler(async (req, res) => {
		const userId = parseInt(req.params.userId, 10);
		const followingId = parseInt(req.params.following, 10);
		const follow = await Follow.findOne({
			where: { following: followingId, followed: userId },
		});
		follow.destroy();
		res.json({ message: `Unfollow!` });
	})
);
module.exports = router;
