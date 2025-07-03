import { Divider, Grid, Paper, Typography } from "@mui/material";
import SectionTitle from "../../SectionTitle";
import DonationReviewForm from "./DonationReviewForm";
import ReviewedDonation from "./ReviewedDonation";
import PeopleReviewedCard from "./PeopleReviewCard";
import { useUserReviewQuery, useViewReviewsQuery } from "../../../features/donations/reviewSlice";

const Review = ({ donationId }) => {
	const reviewInfo = useViewReviewsQuery(donationId);
	const userReviewInfo = useUserReviewQuery(donationId);

	return (
		<Paper component="section" sx={{ mt: "20px" }}>
			<SectionTitle text="Reviews & Ratings" />
			{userReviewInfo.isSuccess && userReviewInfo.data?.review ? (
				<Grid container>
					<Grid item sm={12}>
						<Typography sx={{ fontSize: "18px", fontWeight: 400 }} px={2} pt={2}>
							Your Rating:
						</Typography>
					</Grid>
					<Grid item xs={12} sm={10} md={8} lg={7} p={2}>
						<PeopleReviewedCard
							currentUser={true}
							review={userReviewInfo.data?.review}
						/>
					</Grid>
				</Grid>
			) : (
				// review form for the donation
				<DonationReviewForm donationId={donationId} />
			)}
			<Divider />
			{/* user review list for the donation */}
			<ReviewedDonation reviews={reviewInfo.data?.reviews} />
		</Paper>
	);
};

export default Review;
