import { Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import DonationExcerpt from "../../components/donation/DonationExcerpt";
import SectionTitle from "../../components/SectionTitle";
import { useSelector } from "react-redux";
import { drawerStatus } from "../../features/drawer/drawerSlice";

const ProfileDonations = ({ donations, titleText }) => {
	const drawerOpen = useSelector(drawerStatus);

	const midScreen = useMediaQuery("(min-width:900px)");
	const smallScreen = useMediaQuery("(min-width:600px)");

	return (
		<Paper component="section" sx={{ mt: "15px" }}>
			<SectionTitle text={titleText} />
			<Grid
				container
				spacing={midScreen ? "20px" : "16px"}
				sx={{ p: { xs: "16px", md: "20px" }, pt: 0 }}
			>
				{!donations?.length && (
					<Grid xs={12}>
						<Typography sx={{ fontStyle: "italic", textAlign: "center" }} p={2} pt={4}>
							The user didn't do anything yet
						</Typography>
					</Grid>
				)}
				{donations?.map((donation) => (
					<Grid
						key={donation?._id}
						item
						lg={4}
						md={drawerOpen ? 6 : 4}
						sm={smallScreen ? 6 : 4}
						xs={12}
					>
						<DonationExcerpt donation={donation} />
					</Grid>
				))}
			</Grid>
		</Paper>
	);
};

export default ProfileDonations;
