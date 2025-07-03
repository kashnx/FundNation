import { Paper } from "@mui/material";
import { useState } from "react";
import DonationForm from "../components/donation/DonationForm";
import SectionTitle from "../components/SectionTitle";

const AddDonation = () => {
	const [isUpdateCase, setIsUpdateCase] = useState(false);

	return (
		<Paper component="section">
			<SectionTitle text={isUpdateCase ? "Update Donation" : "Add New Donation"} />
			<DonationForm isUpdateCase={isUpdateCase} setIsUpdateCase={setIsUpdateCase} />
		</Paper>
	);
};

export default AddDonation;
