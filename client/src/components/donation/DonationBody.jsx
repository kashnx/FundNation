import { Divider, Grid } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ExtraDetailsAccordion from "./ExtraDetailsAccordion";
import DonationCartDetails from "./DonationCartDetails";

const DonationBody = ({ donation }) => {
	return (
		<Grid container rowSpacing={2} columnSpacing={3} sx={{ p: { xs: 2, sm: 2.5 } }}>
			<Grid item xs={12} md={6}>
				<LazyLoadImage
					height="100%"
					width="100%"
					style={{
						boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
						borderRadius: "14px",
						objectFit: "cover",
					}}
					loading="lazy"
					effect="blur"
					src={donation?.donationImage}
					alt={donation?.donationName}
				/>
			</Grid>
			<Grid item xs={12} md={6}>
				<DonationCartDetails donation={donation} />
				<Divider />
				<ExtraDetailsAccordion donation={donation} />
			</Grid>
		</Grid>
	);
};

export default DonationBody;
