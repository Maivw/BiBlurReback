const express = require("express");
const { asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");
const _ = require("lodash");

const router = express.Router();
const db = require("../db/models");
const { User, Post, Comment, Like } = db;
const upload = require("../upload");

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const posts = await Post.findAll({
			order: [["createdAt", "DESC"]],
			include: [Comment, Like, User],
		});
		res.json({ posts });
	})
);

const postNotFoundError = (id) => {
	const err = Error("Unauthorized");
	err.errors = [`Post with id of ${id} could not be deleted.`];
	err.title = "You are not allowed to delelte this";
	err.status = 401;
	return err;
};

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const postId = parseInt(req.params.id, 10);
		const post = await Post.findByPk(postId, {
			include: [Like, Comment, User],
		});
		if (post) {
			res.json({ post });
		} else {
			next(postNotFoundError(postId));
		}
	})
);

router.post(
	"/",
	upload.single("imagePostUrl"),

	asyncHandler(async (req, res, next) => {
		const {
			postContent,
			location,
			videoPostUrl,
			imagePostUrl,
			userId,
		} = req.body;

		console.log("KKKKKK");
		const isFile = _.get(req, "file.path", ""); // {res: {file {path : 'upload/file_name.png'}}}
		const formatUrlFile = isFile
			? `${process.env.URL}/${isFile}`
			: imagePostUrl;

		let post = await Post.create({
			postContent,
			location,
			userId,
			imagePostUrl: formatUrlFile,
			videoPostUrl,
		});
		post = await Post.findOne({
			where: {
				id: post.id,
			},
			include: [Like, Comment, User],
		});
		res.status(201).json({ post });
	})
);

router.put(
	"/:id",
	asyncHandler(async (req, res, next) => {
		const {
			postContent,
			location,
			userId,
			videoPostUrl,
			imagePostUrl,
		} = req.body;
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
			include: [Like, Comment, User],
		});

		if (post) {
			await post.update({
				postContent,
				location,
				userId,
				videoPostUrl,
				imagePostUrl,
			});
			res.status(201).json({ post });
		} else {
			next(postNotFoundError(req.params.id));
		}
	})
);

router.delete(
	"/:id",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
			include: [Like, Comment],
		});
		if (post && req.user.id === post.userId) {
			await post.destroy();
			res.json({ postId: req.params.id });
		} else {
			next(postNotFoundError(req.params.id));
		}
	})
);
module.exports = router;
