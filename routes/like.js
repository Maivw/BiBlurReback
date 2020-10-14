const express = require("express");
const { Op } = require("sequelize");
const { requireAuth } = require("../auth");

const { asyncHandler, handleValidationErrors } = require("../utils");

const db = require("../db/models");
const { User, Like, Comment, Post } = db;

const router = express.Router();
const postNotFoundError = (id) => {
	const err = Error("Comment not found");
	err.errors = [`Comment with id of ${id} could not be found.`];
	err.title = "Comment not found.";
	err.status = 404;
	return err;
};
//get all likes of a post
router.get(
	"/:postId",
	asyncHandler(async (req, res, next) => {
		// const { user_id, post_id, comment_id } = req.body;
		const { postId } = req.body;
		const likes = await Like.findAll({
			postId,
		});

		res.status(201).json({ likes });
	})
);
//get all likes of a comment
router.get(
	"/:postId/(:commentId)?",
	asyncHandler(async (req, res, next) => {
		const { userId, postId, commentId } = req.body;
		const likes = await Like.findAll({
			userId,
			postId,
			commentId,
		});

		res.status(201).json({ likes });
	})
);

router.post(
	"/:postId/:commentId",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const { postId, commentId } = req.params;
		const userId = req.user.id;
		const like = await Like.findOne({
			where: {
				userId,
				postId,
				commentId,
			},
		});
		if (like) {
			await like.destroy();
			res.json({
				likeComment: like,
				message: `Deleted like with id of ${commentId} on ${postId}.`,
			});
		} else {
			const likeComment = await Like.create({
				userId,
				postId,
				commentId,
			});
			res
				.status(201)
				.json({ likeComment, messsage: "created like successfully" });
		}
	})
);

router.post(
	"/:postId",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const { id } = req.body;
		const userId = req.user.id;
		const like = await Like.findOne({
			where: {
				userId: userId,
				postId: id,
			},
		});
		if (like) {
			await like.destroy();
			res.status(201).json({ like, message: "unlike successfully" });
		} else {
			const like = await Like.create({
				userId: userId,
				postId: id,
			});
			res.status(201).json({ like });
		}
	})
);

//unlike
router.delete(
	"/:postId/:commentId",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const { postId, commentId } = req.params;
		const userId = req.user.id;
		const like = await Like.findOne({
			where: {
				userId,
				postId,
				commentId,
			},
		});
		if (like) {
			await like.destroy();
			res.json({
				message: `Deleted like with id of ${commentId} on ${postId}.`,
			});
		} else {
			next(postNotFoundError(postId));
		}
	})
);

module.exports = router;
