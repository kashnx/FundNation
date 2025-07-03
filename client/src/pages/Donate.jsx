import { Paper } from "@mui/material";
import DonationForm from "../components/donation/DonationForm";
import SectionTitle from "../components/SectionTitle";

const Donate = () => {
	return (
		<Paper component="section">
			<SectionTitle text="Donate Donation" />
			<DonationForm isUpdateCase={false} donation={true} />
		</Paper>
	);
};

export default Donate;
