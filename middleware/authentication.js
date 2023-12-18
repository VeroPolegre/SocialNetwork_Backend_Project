require("dotenv").config();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const payload = jwt.verify(token, jwt_secret);
		const user = await User.findOne({ _id: payload._id, tokens: token });
		if (!user) {
			return res.status(404).send({ message: "Not authorized" });
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		return res
			.status(404)
			.send({ message: "There was a problem with the token" });
	}
};

const isAdmin = async (req, res, next) => {
	const admins = ["admin", "superadmin"];
	if (!admins.includes(req.user.role)) {
		return res.status(403).send({ message: `You don't have permission` });
	}
	next();
};

const isSuperAdmin = async (req, res, next) => {
	const admins = ["superadmin"];
	if (!admins.includes(req.user.role)) {
		return res.status(403).send({ message: `You don't have permission` });
	}
	next();
};

const isPostAuthor = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params._id);
		if (post.userId.toString() !== req.user._id.toString()) {
			return res.status(403).send({ message: `This is not your post` });
		}

		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			message: "There was an error when checking the author of the post",
		});
	}
};

const isCommentAuthor = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params._id);
		if (comment.userId.toString() !== req.user._id.toString()) {
			return res.status(403).send({ message: `This is not your comment` });
		}

		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			message: "There was an error when checking the author of the post",
		});
	}
};

module.exports = {
	authentication,
	isAdmin,
	isSuperAdmin,
	isPostAuthor,
	isCommentAuthor,
};
