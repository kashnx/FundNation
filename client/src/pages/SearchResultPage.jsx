import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import SectionTitle from "../components/SectionTitle";
import { useNavigate, useSearchParams } from "react-router-dom";
import donations from "../../data/donations.json";
import { useEffect, useState } from "react";
import DonationExcerpt from "../components/donation/DonationExcerpt";
import { useViewAllDonationsQuery } from "../features/donations/donationsSlice";

const SearchResultPage = () => {
	const navigate = useNavigate();
	const [queryParams, setQueryParams] = useSearchParams();
	const [searchedDonations, setSearchedDonations] = useState([]);
	const donationInfo = useViewAllDonationsQuery();

	const filterDonationsByName = (donations, name) => {
		const lowerCaseName = name.toLowerCase();

		const filteredDonations = donations.filter((donation) =>
			donation.donationName.toLowerCase().includes(lowerCaseName)
		);

		return filteredDonations;
	};

	useEffect(() => {
		setSearchedDonations(
			filterDonationsByName(donationInfo?.data?.donations, queryParams.get("donation"))
		);
	}, [queryParams]);

	return (
		<Paper component="section">
			<SectionTitle text={`Search result for - ${queryParams.get("donation") || ""}`} />
			<Grid container spacing="20px" sx={{ p: { xs: 2, sm: "20px" } }}>
				{searchedDonations.length === 0 && (
					<Stack alignItems="center" width="100%" sx={{ px: 2, py: "70px" }}>
						<Typography variant="h5" fontWeight={300} mb={1.2} textAlign="center">
							Oops! Donation not found
						</Typography>
						<Button onClick={() => navigate("/donate")}>Donate this donation</Button>
					</Stack>
				)}
				{searchedDonations.map((donation) => (
					<Grid item xs={12} sm={6} lg={4} key={donation.id}>
						<DonationExcerpt donation={donation} />
					</Grid>
				))}
			</Grid>
		</Paper>
	);
};

export default SearchResultPage;
