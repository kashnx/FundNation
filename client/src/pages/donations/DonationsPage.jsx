import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import DonationsList from "./DonationsList";
import DonationsPagination from "./DonationsPagination";
import { useViewAllDonationsQuery } from "../../features/donations/donationsSlice";

const DonationsPage = () => {
	const responseInfo = useViewAllDonationsQuery();

	const [data, setData] = useState([]); // Array of data
	const dataPerPage = 6; // The number of data to show per page
	const [currentPage, setCurrentPage] = useState(1); // The current page number
	const [totalPages, setTotalPages] = useState(0);

	// for asynchronous operations
	useEffect(() => {
		if (responseInfo.isSuccess) {
			setData(responseInfo.data.donations);
		}
	}, [responseInfo]);

	useEffect(() => {
		setTotalPages(Math.ceil(data?.length / dataPerPage));
	}, [data]);

	// Get the current data based on the current page
	const indexOfLastData = currentPage * dataPerPage;
	const indexOfFirstData = indexOfLastData - dataPerPage;
	const currentData = data?.slice(indexOfFirstData, indexOfLastData);

	const handlePageChange = (_, value) => {
		setCurrentPage(value);
		window.scrollTo({ top: 0, left: 0 });
	};

	return (
		<>
			<Paper
				component="section"
				sx={{ mt: "5px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
			>
				<DonationsList responseInfo={responseInfo} donations={currentData} />
			</Paper>
			<Paper
				component="section"
				sx={{ mt: "2px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
			>
				<DonationsPagination
					page={currentPage}
					handlePageChange={handlePageChange}
					count={totalPages}
				/>
			</Paper>
		</>
	);
};

export default DonationsPage;
