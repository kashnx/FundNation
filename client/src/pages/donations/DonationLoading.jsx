import { Grid } from "@mui/material";
import DonationLoadingSkeleton from "../../components/DonationLoadingSkeleton";

const DonationLoading = ({ drawerOpen, smallScreen }) => {
	return (
		<>
			{[1, 2, 3, 4, 5, 6].map((value) => (
				<Grid
					key={value}
					item
					lg={4}
					md={drawerOpen ? 6 : 4}
					sm={smallScreen ? 6 : 4}
					xs={12}
					sx={{ mb: 2 }}
				>
					<DonationLoadingSkeleton />
				</Grid>
			))}
		</>
	);
};

export default DonationLoading;
