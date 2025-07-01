import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		viewReviews: builder.query({
			query: (donationId) => {
				return {
					url: `/review/${donationId}`,
					method: "GET",
				};
			},
			providesTags: ["Review"],
		}),

		userReview: builder.query({
			query: (donationId) => {
				return {
					url: `/review/user/${donationId}`,
					method: "GET",
				};
			},
			providesTags: ["Review"],
		}),

		addReview: builder.mutation({
			query: (body) => {
				return {
					url: "/review/add",
					method: "POST",
					body,
				};
			},
			invalidatesTags: ["Review", "Rating"],
		}),

		getDonationRating: builder.query({
			query: (donationId) => `/review/donation/${donationId}`,
			providesTags: ["Rating"],
		}),
	}),
});

export const {
	useViewReviewsQuery,
	useAddReviewMutation,
	useUserReviewQuery,
	useGetDonationRatingQuery,
} = extendedApiSlice;
