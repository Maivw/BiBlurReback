const express = require("express");

const { asyncHandler } = require("../utils");

const db = require("../db/models");
const { requireAuth } = require("../auth");
const { User, Comment, Post, Like } = db;

const router = express.Router();
const commentNotFoundError = (id) => {
	const err = Error("Comment not found");
	err.errors = [`Comment with id of ${id} could not be found.`];
	err.title = "Comment not found.";
	err.status = 404;
	return err;
};

const postNotFoundError = (id) => {
	const err = Error("Post not found");
	err.errors = [`Post with id of ${id} could not be found.`];
	err.title = "Post not found.";
	err.status = 404;
	return err;
};
router.get(
	"/:postId",
	asyncHandler(async (req, res, next) => {
		const { commentContent, userId, postId } = req.body;
		const comments = await Comment.findAll({
			where: {
				postId: req.params.postId,
			},
			include: [User, Post, Like],
		});

		if (comments) {
			res.json({ comments });
		} else {
			next(commentNotFoundError(req.params.id));
		}
	})
);
router.post(
	"/:postId/",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const userId = req.user.id;
		const { commentContent, postId } = req.body;
		const post = await Post.findOne({
			where: {
				id: postId,
			},
		});

		if (post) {
			let cmt = await Comment.create({
				commentContent,
				userId,
				postId,
			});
			const comment = await Comment.findOne({
				where: {
					id: cmt.id,
				},
				include: [User, Post, Like],
			});
			res.status(201).json({ comment });
		} else {
			return res
				.status(400)
				.send({ status: "fail", content: "post not found" });
		}
	})
);

router.get(
	"/:postId/:commentId",
	asyncHandler(async (req, res, next) => {
		const { commentId, userId, postId } = req.body;
		const comment = await Comment.findOne({
			where: {
				id: commentId,
				userId,
			},
			include: [User, Post, Like],
		});

		if (comment) {
			res.json({ comment });
		} else {
			next(commentNotFoundError(commentId));
		}
	})
);

router.put(
	"/:postId/:id",
	asyncHandler(async (req, res, next) => {
		const { commentContent, userId, postId, id } = req.body;
		const comment = await Comment.findOne({
			where: {
				id: req.params.id,
			},
			include: [User, Post, Like],
		});

		if (comment) {
			await comment.update({
				commentContent,
				userId,
				postId,
				id: id,
			});
			res.json({ comment });
		} else {
			next(commentNotFoundError(req.params.id));
		}
	})
);

router.delete(
	"/:postId/:commentId",
	asyncHandler(async (req, res, next) => {
		const { postId, commentId } = req.body;
		const comment = await Comment.findOne({
			where: {
				id: req.params.commentId,
			},
			include: [User, Post, Like],
		});
		if (comment) {
			await comment.destroy();
			res.json({
				message: `Deleted comment with id of ${req.params.commentId}.`,
				postId,
				commentId,
				comment,
			});
		} else {
			next(commentNotFoundError(req.params.commentId));
		}
	})
);

module.exports = router;
