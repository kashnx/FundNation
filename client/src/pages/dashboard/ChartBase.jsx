import { Grid } from "@mui/material";
import DonationBarChart from "./DonationBarChart";
import DonationsPieChart from "./DonationsPieChart";

const ChartBase = () => {
	return (
		<Grid container spacing="20px">
			<Grid item xs={12} md={7} className="chart-grid">
				<DonationBarChart />
			</Grid>
			<Grid item xs={12} md={5} className="chart-grid">
				<DonationsPieChart />
			</Grid>
		</Grid>
	);
};

export default ChartBase;
