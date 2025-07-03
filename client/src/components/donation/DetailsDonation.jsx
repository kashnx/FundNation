import { Paper } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import DonationBody from "./DonationBody";
import Review from "./review/Review";
import { useViewSingleDonationQuery } from "../../features/donations/donationsSlice";
import SkeletonCartPage from "./SkeletonCartPage";

const DetailsDonation = () => {
	const { donationId } = useParams();
	const { state } = useLocation();
	const responseInfo = useViewSingleDonationQuery(donationId);

	return (
		<>
			<Paper component="section">
				<SectionTitle
					text="Donation Details"
					button={{ link: "/donations", text: "Find More" }}
				/>
				{responseInfo.isLoading ? (
					// loader component
					<SkeletonCartPage />
				) : (
					<DonationBody donation={state ? state : responseInfo?.data?.donation} />
				)}
			</Paper>
			{/* review segment for the donation */}
			<Review donationId={donationId} />
		</>
	);
};

export default DetailsDonation;
