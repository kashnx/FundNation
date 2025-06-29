const asyncHandler = require("express-async-handler");
const Donation = require("../models/DonationModel");
const Review = require("../models/ReviewModel");
const ReceiverApplication = require("../models/ReceiverApplicationModel");
const cloudinary = require("../utils/cloudinaryHandler");
const { defaultDonationImage } = require("../constants/imagesConst");
const { uploadImageHandler } = require("../utils/uploadImage");
const { addHistoryController } = require("./historyController");

exports.viewAllDonationsController = asyncHandler(async (req, res) => {
	const donations = await Donation.find({
		// Match documents that have status not equal to "pending" or do not have a status field
		$or: [{ status: { $ne: "pending" } }, { status: { $exists: false } }],
	}).populate("donorAccount");

	if (donations.length) {
		return res.status(200).json({
			msg: "donations_found",
			donations,
		});
	}

	res.status(200).json({
		msg: "donations_not_found",
		donations: [],
	});
});

exports.viewSingleDonationController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;

	const donation = await Donation.findById(donationId);

	if (donation) {
		return res.status(200).json({
			msg: "donation_found",
			donation,
		});
	}

	res.status(200).json({
		msg: "donation_not_found",
		donation: null,
	});
});

exports.addDonationController = asyncHandler(async (req, res) => {
	const { file, body } = req;

	let uploadImage = {};

	// check if the file exist, if exist then upload it to cloudinary
	if (file) {
		uploadImage = await uploadImageHandler(file, "mediAid/donations");
	}

	const addDonation = await new Donation({
		...body,
		storedDosages: body.dosages,
		donationImage: uploadImage.secure_url || defaultDonationImage,
		cloudinaryId: uploadImage.public_id || "",
	}).save();

	if (addDonation) {
		return res.status(201).json({
			msg: "donation_added",
			donation: addDonation,
		});
	}

	res.status(500).json({
		msg: "donation_not_added",
		donation: null,
	});
});

exports.updateDonationController = asyncHandler(async (req, res) => {
	const {
		params: { donationId },
		body,
		file,
	} = req;

	const donationsDetails = await Donation.findById(donationId);

	let uploadImage = {};

	// check if the file exist, if exist then upload it to cloudinary
	if (file) {
		uploadImage = await uploadImageHandler(file, "mediAid/donations");

		// remove the previous uploaded image from cloudinary
		if (donationsDetails.cloudinaryId)
			await cloudinary.uploader.destroy(donationsDetails.cloudinaryId);
	}

	const updateDonation = await Donation.findByIdAndUpdate(
		donationId,
		{
			...body,
			donationImage: uploadImage.secure_url || donationsDetails.donationImage,
			cloudinaryId: uploadImage.public_id || donationsDetails.cloudinaryId,
		},
		{ new: true }
	);

	if (updateDonation) {
		return res.status(200).json({
			msg: "donation_updated",
			updatedDonation: updateDonation,
		});
	}

	res.status(500).json({
		msg: "donation_not_updated",
		updateDonation: null,
	});
});

exports.deleteDonationController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;

	const targetedDonation = await Donation.findById(donationId);

	if (targetedDonation) {
		// if image available then delete it from cloudinary
		if (targetedDonation.cloudinaryId) {
			await cloudinary.uploader.destroy(targetedDonation.cloudinaryId);
		}

		const deletedDonationInfo = await targetedDonation.remove();

		return res.status(200).json({
			msg: "donation_deleted",
			deletedDonationInfo,
		});
	}

	res.status(500).json({
		msg: "donation_not_deleted",
		deletedDonationInfo: null,
	});
});

exports.donateDonationController = asyncHandler(async (req, res) => {
	const { file, body, decoded } = req;

	let uploadImage = await uploadImageHandler(file, "mediAid/donations");

	const addDonation = await new Donation({
		...body,
		donorAccount: decoded.id,
		storedDosages: body.dosages,
		status: "pending",
		donationImage: uploadImage.secure_url || defaultDonationImage,
		cloudinaryId: uploadImage.public_id || "",
	}).save();

	if (addDonation) {
		req.historyInfo = {
			donationName: addDonation.donationName,
			action: "apply-donate",
		};

		// add action information to history collection
		addHistoryController(req, res);

		return res.status(201).json({
			msg: "donation_added_queue",
			donation: addDonation,
		});
	}

	res.status(500).json({
		msg: "donation_not_added",
		donation: null,
	});
});

exports.applyDonationController = asyncHandler(async (req, res) => {
	const { decoded, body } = req;

	const apply = new ReceiverApplication({
		...body,
		fullName: body.name,
		user: decoded.id,
	});

	const applyDonation = await apply.save();
	await applyDonation.populate("donation");

	if (applyDonation) {
		req.historyInfo = {
			donationName: applyDonation.donation?.donationName,
			action: "apply-receive",
		};

		// add action information to history collection
		addHistoryController(req, res);

		return res.status(201).json({
			msg: "apply_successful",
			applyDonation,
		});
	}

	res.status(500).json({
		msg: "apply_not_successful",
		applyDonation: null,
	});
});

// donated and receiver donation
exports.getUserDonatedDonationController = asyncHandler(async (req, res) => {
	const { decoded } = req;

	const donations = await Donation.find({ donorAccount: decoded.id });

	if (donations.length) {
		return res.status(200).json({
			msg: "donated_donation_found",
			donations,
		});
	}

	res.status(404).json({
		msg: "donated_donation_not_found",
		donations: null,
	});
});

exports.getReceivedDonationController = asyncHandler(async (req, res) => {
	const { decoded } = req;

	const receiverApplications = await ReceiverApplication.find({
		user: decoded.id,
		status: "accepted",
	}).populate("donation");

	const donationIds = receiverApplications.map((app) => app.donation._id);

	const donations = await Donation.find({ _id: { $in: donationIds } });

	if (donations.length) {
		return res.status(200).json({
			msg: "received_donation_found",
			donations,
		});
	}

	res.status(404).json({
		msg: "received_donation_not_found",
		donations: [],
	});
});

exports.getTopRatedDonationsController = asyncHandler(async (req, res) => {
	const { limit } = req.params;

	const topRatedDonations = await Review.aggregate([
		{
			$group: {
				_id: "$donation",
				avgRating: { $avg: "$rating" },
			},
		},
		// sorting donations list with descending order
		{
			$sort: {
				avgRating: -1,
			},
		},
		// populate with donation info
		{
			$lookup: {
				from: "donations",
				localField: "_id",
				foreignField: "_id",
				as: "donation",
			},
		},
		{
			$unwind: "$donation",
		},
	]).limit(Number(limit));

	if (topRatedDonations.length) {
		return res.status(200).json({
			msg: "donations_found",
			topRatedDonations,
		});
	}

	res.status(404).json({
		msg: "donations_not_found",
		topRatedDonations: [],
	});
});
