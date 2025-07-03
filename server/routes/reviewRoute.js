const router = require("express").Router();
const {
	getAllReviewsController,
	addReviewController,
	getUserReviewController,
	getDonationRatingController,
} = require("../controllers/reviewController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.get("/:donationId", getAllReviewsController);
router.get("/donation/:donationId", getDonationRatingController);
router.get("/user/:donationId", verifyJWT, getUserReviewController);
router.post("/add", verifyJWT, addReviewController);

module.exports = router;
