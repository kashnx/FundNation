import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		viewAllDonations: builder.query({
			query: () => "/donations",
			providesTags: (result) =>
				result.donations?.length
					? result.donations.map(({ _id }) => ({ type: "Donation", id: _id }))
					: ["Donation"],
		}),

		viewSingleDonation: builder.query({
			query: (donationId) => `/donations/${donationId}`,
			providesTags: (result) =>
				result.donation ? [{ type: "Donation", id: result.donation?._id }] : ["Donation"],
		}),

		addDonation: builder.mutation({
			query: (body) => {
				const payload = new FormData();

				for (const [key, value] of Object.entries(body)) {
					payload.append(key, value);
				}

				return {
					url: "/donations/add",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["Donation", "BestDonors"],
		}),

		donateDonation: builder.mutation({
			query: (body) => {
				const payload = new FormData();

				for (const [key, value] of Object.entries(body)) {
					payload.append(key, value);
				}

				return {
					url: "/donations/donate",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["PendingDonation", "History", "BestDonors"],
		}),

		applyDonation: builder.mutation({
			query: (body) => {
				return {
					url: "/donations/apply",
					method: "POST",
					body,
				};
			},
			invalidatesTags: ["PendingReceive", "History"],
		}),

		updateDonation: builder.mutation({
			query: ({ body, donationId }) => {
				const payload = new FormData();
				for (const [key, value] of Object.entries(body)) {
					payload.append(key, value);
				}

				return {
					url: `/donations/update/${donationId}`,
					method: "PATCH",
					body: payload,
				};
			},
			invalidatesTags: (result) =>
				result.updateDonation
					? [{ type: "Donation", id: result.updatedDonation?._id }]
					: ["Donation"],
		}),

		deleteDonation: builder.mutation({
			query: (donationId) => {
				return {
					url: `/donations/delete/${donationId}`,
					method: "DELETE",
				};
			},
			invalidatesTags: ["Donation"],
		}),

		getDonatedDonations: builder.query({
			query: () => "/donations/donated/all",
			providesTags: ["DonatedDonations"],
		}),

		getReceivedDonations: builder.query({
			query: () => "/donations/received/all",
			providesTags: ["ReceivedDonations"],
		}),

		getTopRatedDonations: builder.query({
			query: () => "/donations/topRated/5",
			providesTags: ["Donation"],
		}),
	}),
});

export const {
	useViewAllDonationsQuery,
	useViewSingleDonationQuery,
	useAddDonationMutation,
	useUpdateDonationMutation,
	useDeleteDonationMutation,
	useDonateDonationMutation,
	useApplyDonationMutation,
	useGetDonatedDonationsQuery,
	useGetReceivedDonationsQuery,
	useGetTopRatedDonationsQuery,
} = extendedApiSlice;
