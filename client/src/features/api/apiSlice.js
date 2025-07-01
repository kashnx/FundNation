import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	reducerPath: "api", // optional
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_URL,
		credentials: "include",
	}),
	tagTypes: [
		"User",
		"Dashboard",
		"Donation",
		"Review",
		"Rating",
		"Gallery",
		"HealthTip",
		"Profile",
		"History",
		"PendingDonation",
		"PendingReceive",
		"BestDonors",
		"DonatedDonations",
		"ReceivedDonations",
	],
	endpoints: (builder) => ({}),
});
