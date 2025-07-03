const { Schema, model, default: mongoose } = require("mongoose");

const donationSchema = new Schema(
	{
		donationName: {
			type: String,
			trim: true,
			unique: [true, "Donation already in the list"],
			required: true,
		},
		donationDescription: {
			type: String,
			trim: true,
			required: true,
		},
		donationImage: {
			type: String,
			default:
				"https://res.cloudinary.com/hostingimagesservice/image/upload/v1680115118/mediAid/default-medi_bktubv.png",
			required: true,
		},
		cloudinaryId: String,
		donorAccount: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		donorName: {
			type: String,
			trim: true,
			default: "Anonymous",
		},
		donorContact: String,
		companyName: { type: String, trim: true },
		dosages: { type: Number, required: true, min: 1 },
		storedDosages: {
			type: Number,
			required: true,
			immutable: true,
			min: 1,
		},
		rating: {
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
		status: {
			type: String,
			enum: ["pending", "accepted"],
		},
	},
	{
		timestamps: true,
	}
);

const Donation = model("Donation", donationSchema);

module.exports = Donation;
