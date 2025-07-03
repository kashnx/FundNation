import { useState } from "react";
import { Autocomplete, Box, FormControl, InputAdornment, TextField, useTheme } from "@mui/material";
import { IconSearch as SearchIcon } from "@tabler/icons-react";
import { IconAdjustmentsHorizontal as TuneIcon } from "@tabler/icons-react";
import { IconX as CloseIcon } from "@tabler/icons-react";
import CustomIconButton from "../theme/customComponent/CustomIconButton";
// import donations from ../../data/donations.json";
import { useNavigate } from "react-router-dom";
import { useViewAllDonationsQuery } from "../features/donations/donationsSlice";

const absoluteStyle = {
	zIndex: 999,
	width: "calc(100%)",
	top: "50%",
	left: "50%",
	translate: "-50% -50%",
};

const SearchBar = ({
	sm,
	md,
	lgWidth,
	mdWidth,
	smWidth,
	position = "relative",
	handleShowFullSearch = () => false,
}) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [value, setValue] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const donationInfo = useViewAllDonationsQuery();

	const handleSearch = (e) => {
		if (e.key === "Enter" && inputValue.length > 0) {
			navigate(`/donations/search?donation=${inputValue}`);
		}
	};

	const handleAutoSelectSearch = (donationName) => {
		if (donationName?.length > 0) navigate(`/donations/search?donation=${donationName}`);
	};

	return (
		<Box
			component="div"
			className="search-floating-md"
			sx={{ width: "100%", position, height: "100%" }}
		>
			<FormControl
				sx={{
					display: { xs: sm, sm, md },

					position,
					...(position === "absolute" && absoluteStyle),
				}}
			>
				<Autocomplete
					sx={{
						width: { xs: smWidth, sm: smWidth, md: mdWidth, lg: lgWidth },
						height: "56px",
						fontSize: "14px",
						fontWeight: 500,
						borderRadius: "16px",
						marginLeft: { lg: "15px", md: 0 },
					}}
					id="outlined-adornment-text"
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
						handleAutoSelectSearch(newValue);
					}}
					inputValue={inputValue}
					onInputChange={(event, newInputValue) => {
						setInputValue(newInputValue);
					}}
					onKeyDown={handleSearch}
					name="searchText"
					freeSolo={true}
					options={
						donationInfo.data?.donations?.map((option) => option.donationName) ||
						["Loading..."]
					}
					renderInput={(params) => (
						<TextField
							className="search-body"
							sx={{ background: "#f8fafc", borderRadius: "14px" }}
							{...params}
							placeholder="Search donation..."
							InputProps={{
								...params.InputProps,
								type: "search",
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon size={18} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<>
											<CustomIconButton
												sx={{ mr: "-3px" }}
												aria-label="filter search"
												edge="end"
											>
												<TuneIcon />
											</CustomIconButton>
											{position === "absolute" && (
												<CustomIconButton
													sx={{
														mr: "-3px",
														ml: "10px",
														color: theme.palette.warning.main,
														backgroundColor:
															theme.palette.warning.light,
														"&:hover": {
															backgroundColor:
																theme.palette.warning.main,
															color: theme.palette.warning.light,
														},
													}}
													aria-label="filter search"
													edge="end"
													onClick={handleShowFullSearch}
												>
													<CloseIcon />
												</CustomIconButton>
											)}
										</>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
			</FormControl>
		</Box>
	);
};

export default SearchBar;
