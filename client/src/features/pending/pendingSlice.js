import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		pendingDonations: builder.query({
			query: () => "/pending/donation",
			providesTags: ["PendingDonation"],
		}),

		pendingDonationAccept: builder.mutation({
			query: (donationId) => ({
				url: `/pending/donation/accept/${donationId}`,
				method: "PATCH",
			}),
			invalidatesTags: ["PendingDonation", "Donation", "DonatedDonations", "Dashboard"],
		}),

		pendingDonationReject: builder.mutation({
			query: (donationId) => ({
				url: `/pending/donation/reject/${donationId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["PendingDonation"],
		}),

		pendingApplication: builder.query({
			query: () => "/pending/receive",
			providesTags: ["PendingReceive"],
		}),

		acceptedApplication: builder.query({
			query: () => "/pending/receive/accepted",
			providesTags: ["PendingReceive"],
		}),

		userCartItem: builder.query({
			query: () => "/pending/receive/cart",
			providesTags: ["PendingReceive"],
		}),

		pendingApplyAccept: builder.mutation({
			query: ({ donationId, applicationId }) => ({
				url: `/pending/receive/accept/${donationId}/${applicationId}`,
				method: "PATCH",
			}),
			invalidatesTags: ["PendingReceive", "ReceivedDonations", "Dashboard"],
		}),

		pendingApplyReject: builder.mutation({
			query: (applicationId) => ({
				url: `/pending/receive/reject/${applicationId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["PendingReceive"],
		}),
	}),
});

export const {
	usePendingDonationsQuery,
	usePendingDonationAcceptMutation,
	usePendingDonationRejectMutation,
	usePendingApplicationQuery,
	usePendingApplyAcceptMutation,
	usePendingApplyRejectMutation,
	useUserCartItemQuery,
	useAcceptedApplicationQuery,
} = extendedApiSlice;
