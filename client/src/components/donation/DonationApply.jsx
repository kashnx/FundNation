import { Paper } from "@mui/material";
import SectionTitle from "../SectionTitle";
import DonationApplyForm from "./DonationApplyForm";

const DonationApply = () => {
	return (
		<Paper component="section">
			<SectionTitle text="Apply for the donation" />
			<DonationApplyForm />
		</Paper>
	);
};

export default DonationApply;

