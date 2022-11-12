import { gql } from "@apollo/client";

export const AllDocumentTaskGQL = {
	exemplar: "document_tasks",
	table: "document_tasks",
	options: {
		all: {
			fetchPolicy: "standby",
		},
		one: {
			fetchPolicy: "standby",
		},
	},
	select: {
		all: gql`
			query document_tasks($document_tasks: JSON) {
				document_tasks(document_tasks: $document_tasks) {
					id
					document_id
					status
					is_cancelled
					note
					deadline
					date_created
					user_id_created
					fio_created
					user_id_receiver
					fio_receiver
					route_id
				}
			}
		`,
		one: gql`
			query document_tasks($document_tasks: JSON) {
				document_tasks(document_tasks: $document_tasks) {
					id
					document_id
					status
					is_cancelled
					note
					deadline
					date_created
					user_id_created
					fio_created
					user_id_receiver
					fio_receiver
					route_id
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription document_tasks($document_tasks: JSON) {
				document_tasks(document_tasks: $document_tasks) {
					id
					document_id
					status
					is_cancelled
					note
					deadline
					date_created
					user_id_created
					fio_created
					user_id_receiver
					fio_receiver
					route_id
				}
			}
		`,
	},
	insert: gql`
		mutation insertDocumentTasks($document_tasks: JSON) {
			insertDocumentTasks(document_tasks: $document_tasks) {
				type
				message
			}
		}
	`,
};
