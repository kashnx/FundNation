import DonationExcerpt from "../../components/donation/DonationExcerpt";
import { Box, Grid, useMediaQuery } from "@mui/material";
import SectionTitle from "../../components/SectionTitle";
import { useSelector } from "react-redux";
import { drawerStatus } from "../../features/drawer/drawerSlice";
import { useGetTopRatedDonationsQuery } from "../../features/donations/donationsSlice";
import DonationLoading from "../donations/DonationLoading";

const RatedDonations = () => {
	const drawerOpen = useSelector(drawerStatus);
	const topRatedDonationsInfo = useGetTopRatedDonationsQuery();

	const midScreen = useMediaQuery("(min-width:900px)");
	const smallScreen = useMediaQuery("(min-width:600px)");

	return (
		<Box>
			<SectionTitle
				text="Top Rated Donations"
				button={{ text: "View All", link: "/donations" }}
			/>
			<Grid
				container
				spacing={midScreen ? "20px" : "16px"}
				sx={{ p: { xs: "16px", md: "20px" } }}
			>
				{topRatedDonationsInfo.isLoading ? (
					<DonationLoading drawerOpen={drawerOpen} smallScreen={smallScreen} />
				) : (
					<>
						{topRatedDonationsInfo.data?.topRatedDonations?.map((donationInfo) => (
							<Grid
								key={donationInfo._id}
								item
								lg={4}
								md={drawerOpen ? 6 : 4}
								sm={smallScreen ? 6 : 4}
								xs={12}
							>
								<DonationExcerpt donation={donationInfo?.donation} />
							</Grid>
						))}
					</>
				)}
			</Grid>
		</Box>
	);
};

export default RatedDonations;
