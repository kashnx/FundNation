const { Schema, model, default: mongoose } = require("mongoose");

const reviewSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		donation: {
			type: Schema.Types.ObjectId,
			ref: "Donation",
			required: true,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		review: String,
	},
	{
		timestamps: true,
	}
);

const Review = model("Review", reviewSchema);

module.exports = Review;
