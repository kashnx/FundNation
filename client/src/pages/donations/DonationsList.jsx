import DonationExcerpt from "../../components/donation/DonationExcerpt";
import { Box, Grid, useMediaQuery } from "@mui/material";
import SectionTitle from "../../components/SectionTitle";
import { useSelector } from "react-redux";
import { drawerStatus } from "../../features/drawer/drawerSlice";
import DonationLoading from "./DonationLoading";

const DonationsList = ({ responseInfo, donations }) => {
	const drawerOpen = useSelector(drawerStatus);

	const midScreen = useMediaQuery("(min-width:900px)");
	const smallScreen = useMediaQuery("(min-width:600px)");

	return (
		<Box>
			<SectionTitle text="Available Donations" />
			<Grid
				container
				spacing={midScreen ? "20px" : "16px"}
				sx={{ p: { xs: "16px", md: "20px" } }}
			>
				{responseInfo.isLoading ? (
					<DonationLoading drawerOpen={drawerOpen} smallScreen={smallScreen} />
				) : (
					<>
						{donations?.map((donation) => (
							<Grid
								key={donation._id}
								item
								lg={4}
								md={drawerOpen ? 6 : 4}
								sm={smallScreen ? 6 : 4}
								xs={12}
							>
								<DonationExcerpt donation={donation} />
							</Grid>
						))}
					</>
				)}
			</Grid>
		</Box>
	);
};

export default DonationsList;
