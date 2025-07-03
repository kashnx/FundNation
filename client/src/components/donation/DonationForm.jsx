import { useEffect, useState } from "react";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	OutlinedInput,
	useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { IconHeartPlus, IconEdit } from "@tabler/icons-react";
import ImageDropZone from "../imageDropZone/ImageDropZone";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
	useAddDonationMutation,
	useDonateDonationMutation,
	useUpdateDonationMutation,
	useViewSingleDonationQuery,
} from "../../features/donations/donationsSlice";

const DonationForm = ({ isUpdateCase, setIsUpdateCase, donat }) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { donationId } = useParams();
	const { state } = useLocation();
	const { data: { donation } = {}, isLoading } = useViewSingleDonationQuery(donationId);
	const [addDonation, responseInfo] = useAddDonationMutation();
	const [donateDonation, donateResponseInfo] = useDonateDonationMutation();
	const [updateDonation, updateResponseInfo] = useUpdateDonationMutation();
	const [resetKey, setResetKey] = useState(Date.now());

	const [defaultData, setDefaultData] = useState({
		donationName: state?.donationName || "",
		donationDescription: state?.donationDescription || "",
		companyName: state?.companyName || "",
		donorName: state?.donorName || "",
		donorContact: state?.donorContact || "",
		dosages: state?.dosages || 1,
	});

	const schema = yup
		.object({
			donationName: yup.string().required("Donation name is required"),
			companyName: yup.string().required("Company name is required"),
			donorName: yup.string().required("Donor name is required"),
			donorContact: yup
				.string()
				.matches(/^[0-9]{11}$/, "Contact number must be 11 digits")
				.required("Contact number is required"),
			donationDescription: yup
				.string()
				.min(25, "Description must be at least 25 characters")
				.max(500, "Description must be at most 500 characters")
				.required("Description is required"),
			dosages: yup.number().required("Number of dosages is required"),
		})
		.required();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultData,
	});

	useEffect(() => {
		Object.keys(defaultData).forEach((key) => {
			setValue(key, defaultData[key]);
		});
	}, [defaultData, setValue]);

	useEffect(() => {
		if (Boolean(state) || Boolean(donationId)) {
			setIsUpdateCase(true);
		}
	}, []);

	useEffect(() => {
		if (isUpdateCase) {
			setDefaultData({
				donationName: donation?.donationName,
				donationDescription: donation?.donationDescription,
				companyName: donation?.companyName,
				donorName: donation?.donorName,
				donorContact: donation?.donorContact,
				dosages: donation?.dosages,
			});
		}
	}, [donation, isUpdateCase]);

	const onSubmit = (data) => {
		if (isUpdateCase) {
			updateDonation({
				body: data,
				donationId: state?._id || donation?._id,
			})
				.unwrap()
				.then((response) => {
					if (response.msg === "donation_updated") {
						toast.success("Donation updated successfully");
						return navigate(`/donations/${response?.updatedDonation?._id}`, {
							state: response?.updatedDonation,
							replace: true,
						});
					}
					toast.error("Something went wrong!");
				})
				.catch((err) => {
					toast.error("Something went wrong");
					console.error(err.message);
				});
		} else if (donat) {
			donateDonation(data)
				.unwrap()
				.then((response) => {
					if (response.msg === "donation_added_queue") {
						toast.success("Donated info sent");
						setResetKey(Date.now()); // re-render with key -> ImageDropZone component
						reset();
					}
				})
				.catch((err) => {
					toast.error("Something went wrong");
					console.error(err.message);
				});
		} else {
			addDonation(data)
				.unwrap()
				.then((response) => {
					if (response.msg === "donation_added") {
						toast.success("New Donation added");
						setResetKey(Date.now()); // re-render with key -> ImageDropZone component
						reset();
					}
				})
				.catch((err) => {
					toast.error("Something went wrong");
					console.error(err.message);
				});
		}
	};

	const onFileSelect = (file) => {
		setValue("donationImage", file);
	};

	return (
		<Box component="form" p="20px" onSubmit={handleSubmit(onSubmit)}>
			<Grid container columnSpacing={2} rowSpacing="5px" mb={1.5}>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.donationName)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="donationName">Full Donation Name</InputLabel>
						<OutlinedInput
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							{...register("donationName")}
						/>
						{errors.donationName && (
							<FormHelperText error>{errors.donationName?.message}</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.companyName)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="companyName">Company Name</InputLabel>
						<OutlinedInput
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							{...register("companyName")}
						/>
						{errors.companyName && (
							<FormHelperText error>{errors.companyName?.message}</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.donorName)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="donorName">Donor's Full Name</InputLabel>
						<OutlinedInput
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							{...register("donorName")}
						/>
						{errors.donorName && (
							<FormHelperText error>{errors.donorName?.message}</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.donorContact)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="donorContact">Donor's Contact Number</InputLabel>
						<OutlinedInput
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							{...register("donorContact")}
						/>
						{errors.donorContact && (
							<FormHelperText error>{errors.donorContact?.message}</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.donationDescription)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="donationDescription">
							Provide Necessary Information
						</InputLabel>
						<OutlinedInput
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							multiline
							rows={7}
							{...register("donationDescription")}
						/>
						{errors.donationDescription && (
							<FormHelperText error>
								{errors.donationDescription?.message}
							</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Controller
						name="donationImage"
						control={control}
						render={({ field }) => (
							<>
								<ImageDropZone
									{...field}
									image={state?.donationImage || donation?.donationImage}
									onFileSelect={onFileSelect}
									key={resetKey}
								/>
							</>
						)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl
						error={Boolean(errors.dosages)}
						fullWidth
						sx={{ ...theme.customInput }}
					>
						<InputLabel htmlFor="dosages">Number of Dosages</InputLabel>
						<OutlinedInput
							type="number"
							inputProps={{ min: 1 }}
							disabled={
								responseInfo.isLoading ||
								updateResponseInfo.isLoading ||
								donateResponseInfo.isLoading
							}
							{...register("dosages")}
						/>
						{errors.dosages && (
							<FormHelperText error>{errors.dosages?.message}</FormHelperText>
						)}
					</FormControl>
				</Grid>
			</Grid>
			<Button
				startIcon={isUpdateCase ? <IconEdit size={20} /> : <IconHeartPlus size={20} />}
				type="submit"
				size="large"
				variant="contained"
				disableElevation
				disabled={
					responseInfo.isLoading ||
					updateResponseInfo.isLoading ||
					donateResponseInfo.isLoading
				}
				sx={{ color: "whitesmoke", borderRadius: "10px" }}
			>
				{isUpdateCase ? "Update Donation" : donat ? "Donate" : "ADD Donation"}
			</Button>
		</Box>
	);
};

export default DonationForm;
