const router = require("express").Router();
const {
	addDonationController,
	viewAllDonationsController,
	updateDonationController,
	viewSingleDonationController,
	deleteDonationController,
	donateDonationController,
	applyDonationController,
	getUserDonatedDonationController,
	getReceivedDonationController,
	getTopRatedDonationsController,
} = require("../controllers/donationsController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const upload = require("../middlewares/upload");

router.get("/", viewAllDonationsController);
router.get("/:donationId", viewSingleDonationController);
router.get("/topRated/:limit", getTopRatedDonationsController);
router.post("/add", verifyJWT, upload.single("donationImage"), addDonationController);
router.post("/donate", verifyJWT, upload.single("donationImage"), donateDonationController);
router.post("/apply", verifyJWT, applyDonationController);
router.delete("/delete/:donationId", verifyJWT, deleteDonationController);
router.patch(
	"/update/:donationId",
	verifyJWT,
	upload.single("donationImage"),
	updateDonationController
);

router.get("/donated/all", verifyJWT, getUserDonatedDonationController);
router.get("/received/all", verifyJWT, getReceivedDonationController);

module.exports = router;
