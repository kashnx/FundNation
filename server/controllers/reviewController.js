const { Types } = require("mongoose");
const Review = require("../models/ReviewModel");
const asyncHandler = require("express-async-handler");

exports.addReviewController = asyncHandler(async (req, res) => {
	const { decoded, body } = req;

	const isAlreadyReviewed = await Review.exists({ user: decoded.id, donation: body.donation });

	if (isAlreadyReviewed) return res.status(409).json({ msg: "already_reviewed", review: null });

	const addReview = await new Review({ ...body, user: decoded.id }).save();

	if (addReview) {
		return res.status(201).json({
			msg: "review_added",
			review: addReview,
		});
	}

	res.status(500).json({
		msg: "review_not_added",
		review: null,
	});
});

exports.getAllReviewsController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;

	const reviews = await Review.find({ donation: donationId });

	if (reviews.length) {
		return res.status(200).json({
			msg: "reviews_found",
			reviews,
		});
	}

	res.status(200).json({
		msg: "reviews_not_found",
		reviews: [],
	});
});

exports.getUserReviewController = asyncHandler(async (req, res) => {
	const {
		decoded,
		params: { donationId },
	} = req;

	const review = await Review.findOne({ donation: donationId, user: decoded.id });

	if (review) {
		return res.status(200).json({
			msg: "review_found",
			review,
		});
	}

	res.status(200).json({
		msg: "review_not_found",
		review: null,
	});
});

exports.getDonationRatingController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;

	const donationRating = await Review.aggregate([
		{
			$match: { donation: Types.ObjectId(donationId) },
		},
		{
			$group: {
				_id: "$donation",
				averageRating: { $avg: "$rating" },
				count: { $sum: 1 },
			},
		},
	]);

	if (!donationRating || donationRating.length === 0) {
		return res.status(404).json({
			msg: "no_reviews_found",
		});
	}

	const { averageRating, count } = donationRating[0];

	res.status(200).json({
		msg: "rating_found",
		rating: averageRating.toFixed(1),
		totalRating: count,
	});
});
