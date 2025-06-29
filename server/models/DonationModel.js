const { Schema, model } = require("mongoose");

const donationSchema = new Schema(
  {
    itemName: {
      type: String,
      trim: true,
      required: true,
    },
    itemDescription: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      enum: ["medicine", "clothing", "food", "books", "electronics", "others"],
      default: "others",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/hostingimagesservice/image/upload/v1680115118/mediAid/default-medi_bktubv.png",
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

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    storedQuantity: {
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
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Donation = model("Donation", donationSchema);
module.exports = Donation;
