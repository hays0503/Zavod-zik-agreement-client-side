import { gql } from "@apollo/client";

export const AllUserGQL = {
	exemplar: "user",
	table: "users",
	options: {
		all: {
			variables: {
				users: { global: { ORDER_BY: ["username asc"] } },
			},
			fetchPolicy: "cache-only",
		},
		one: {
			fetchPolicy: "standby",
		},
	},
	select: {
		all: gql`
			query users($users: JSON) {
				users(users: $users) {
					id
					username
					admin
					accesses
					positions
					domain_username
					fio
					email
				}
			}
		`,
		one: gql`
			query users($users: JSON) {
				users(users: $users) {
					id
					username
					password
					admin
					accesses
					positions
					domain_username
					fio
					email
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription users($users: JSON) {
				users(users: $users) {
					id
					username
					admin
					accesses
					positions
					domain_username
					fio
					email
				}
			}
		`,
	},
};
