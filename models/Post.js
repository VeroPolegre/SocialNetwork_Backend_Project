const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			enum: [
				"Illustration",
				"Photography",
				"Concept art",
				"Art direction",
				"Graphic design",
				"Collage",
				"AI",
				"Fashion",
				"UI/UX",
				"Branding",
				"Video / Film",
				"Animation",
				"3D",
			],
			required: [true, "Please, enter a category."],
		},
		images: {
			type: [String],
			required: [true, "Please, enter image"],
		},
		title: {
			type: String,
			required: [true, "Please, enter a title"],
		},
		content: {
			type: String,
			required: [true, "Please, enter content"],
		},
		keywords: {
			type: [String],
			required: [true, "Please, enter keywords"],
		},
		likes: [
			{
				type: ObjectId,
				ref: "User",
			},
		],
		userId: {
			type: ObjectId,
			ref: "User",
		},
		commentIds: [
			{
				type: ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
