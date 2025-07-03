const router = require("express").Router();
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const {
	allPendingDonationsController,
	acceptDonationController,
	rejectDonationController,
	allRecipientController,
	acceptReceiverApplicationController,
	rejectReceiverApplicationController,
	userCartItemsController,
	allAcceptedReceiverController,
} = require("../controllers/pendingController");

router.get("/donation", verifyJWT, allPendingDonationsController);
router.patch("/donation/accept/:donationId", verifyJWT, acceptDonationController);
router.delete("/donation/reject/:donationId", verifyJWT, rejectDonationController);

router.get("/receive", verifyJWT, allRecipientController);
router.get("/receive/accepted", verifyJWT, allAcceptedReceiverController);
router.patch("/receive/accept/:donationId/:applicationId", verifyJWT, acceptReceiverApplicationController);
router.delete("/receive/reject/:applicationId", verifyJWT, rejectReceiverApplicationController);

router.get("/receive/cart", verifyJWT, userCartItemsController);

module.exports = router;
