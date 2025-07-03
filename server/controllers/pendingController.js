const asyncHandler = require("express-async-handler");
const Donation = require("../models/DonationModel");
const cloudinary = require("../utils/cloudinaryHandler");
const History = require("../models/HistoryModel");
const ReceiverApplication = require("../models/ReceiverApplicationModel");

exports.allPendingDonationsController = asyncHandler(async (req, res) => {
	const pendingDonations = await Donation.find({ status: "pending" }).sort({ createdAt: "desc" });

	if (pendingDonations.length) {
		return res.status(200).json({
			msg: "pending_donation_found",
			pendingDonations,
		});
	}

	res.status(200).json({
		msg: "pending_donation_not_found",
		pendingDonations: [],
	});
});

exports.acceptDonationController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;
	const { decoded } = req;

	const updateDonation = await Donation.findByIdAndUpdate(donationId, { status: "accepted" });

	if (updateDonation) {
		await new History({
			user: decoded.id,
			donationName: updateDonation.donationName,
			action: "accept-donation",
		}).save();

		return res.status(200).json({
			msg: "donation_accepted",
			acceptedDonation: updateDonation,
		});
	}

	res.status(500).json({
		msg: "donation_not_accepted",
		acceptedDonation: null,
	});
});

exports.rejectDonationController = asyncHandler(async (req, res) => {
	const { donationId } = req.params;
	const { decoded } = req;

	const deleteDonation = await Donation.findByIdAndDelete(donationId);

	if (deleteDonation) {
		if (deleteDonation.cloudinaryId) {
			await cloudinary.uploader.destroy(deleteDonation.cloudinaryId);
		}

		// // add action information to history collection
		await new History({
			user: decoded.id,
			donationName: deleteDonation.donationName,
			action: "reject-donation",
		}).save();

		return res.status(200).json({
			msg: "donation_rejected",
			deletedDonationInfo: deleteDonation,
		});
	}

	res.status(500).json({
		msg: "donation_not_rejected",
		deletedDonationInfo: null,
	});
});

exports.allRecipientController = asyncHandler(async (req, res) => {
	const pendingReceiverApplication = await ReceiverApplication.find({ status: "pending" })
		.sort({
			createdAt: "desc",
		})
		.populate("user donation");

	if (pendingReceiverApplication.length) {
		return res.status(200).json({
			msg: "pending_application_found",
			applications: pendingReceiverApplication,
		});
	}

	res.status(200).json({
		msg: "pending_applications_not_found",
		applications: [],
	});
});

exports.allAcceptedReceiverController = asyncHandler(async (req, res) => {
	const pendingReceiverApplication = await ReceiverApplication.find({ status: "accepted" })
		.sort({
			createdAt: "desc",
		})
		.populate("user donation");

	if (pendingReceiverApplication.length) {
		return res.status(200).json({
			msg: "pending_application_found",
			applications: pendingReceiverApplication,
		});
	}

	res.status(200).json({
		msg: "pending_applications_not_found",
		applications: [],
	});
});

// only for logged in user's cart info
exports.userCartItemsController = asyncHandler(async (req, res) => {
	const { decoded } = req;

	const pendingReceiverApplication = await ReceiverApplication.find({ user: decoded.id })
		.sort({
			createdAt: "desc",
		})
		.populate("user donation");

	if (pendingReceiverApplication.length) {
		return res.status(200).json({
			msg: "pending_application_found",
			applications: pendingReceiverApplication,
		});
	}

	res.status(200).json({
		msg: "pending_applications_not_found",
		applications: [],
	});
});

exports.acceptReceiverApplicationController = asyncHandler(async (req, res) => {
	const { donationId, applicationId } = req.params;
	const { decoded } = req;

	const [application, getAvailableDonation] = await Promise.all([
		ReceiverApplication.findById(applicationId),
		Donation.findById(donationId).select("dosages"),
	]);

	// check if the donation is available or not
	if (getAvailableDonation.dosages < application.count) {
		return res.status(409).json({
			msg: "donation_out_of_stock",
			acceptedDonation: null,
		});
	}

	const acceptApplication = await ReceiverApplication.findByIdAndUpdate(
		applicationId,
		{
			status: "accepted",
		},
		{ new: true }
	).populate("donation");

	if (acceptApplication) {
		// add action information to history collection
		const history = new History({
			user: decoded.id,
			donationName: acceptApplication.donation?.donationName,
			action: "accept-receive",
		});

		// deduct the donated donation count from donation count
		const updateDonation = Donation.findByIdAndUpdate(donationId, {
			$inc: { dosages: -Number(acceptApplication.count) },
		});

		await Promise.all([history.save(), updateDonation]);

		return res.status(200).json({
			msg: "application_accepted",
			acceptedDonation: acceptApplication,
		});
	}

	res.status(500).json({
		msg: "application_not_accepted",
		acceptedDonation: null,
	});
});

exports.rejectReceiverApplicationController = asyncHandler(async (req, res) => {
	const { applicationId } = req.params;
	const { decoded } = req;

	const deleteApplication = await ReceiverApplication.findByIdAndDelete(applicationId).populate(
		"donation"
	);

	if (deleteApplication) {
		// add action information to history collection
		await new History({
			user: decoded.id,
			donationName: deleteApplication.donation?.donationName,
			action: "reject-receive",
		}).save();

		return res.status(200).json({
			msg: "application_rejected",
			deletedApplication: deleteApplication,
		});
	}

	res.status(500).json({
		msg: "application_not_rejected",
		deletedApplication: null,
	});
});
