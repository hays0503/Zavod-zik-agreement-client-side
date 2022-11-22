import { gql } from "@apollo/client";

export const DocumentTasks = {
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
					document_options
					task_files
					report
					document_tasks_id_file
					document_tasks_files {
						id
						filename
						data_file
						task_id
					}
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
					document_options
					task_files
					report
					document_tasks_id_file
					document_tasks_files {
						id
						filename
						data_file
						task_id
					}
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
					document_tasks_id_file
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
	setTaskIsReadTrue: gql`
		mutation setTaskIsReadTrue($task: JSON) {
			setTaskIsReadTrue(task: $task) {
				type
				message
			}
		}
	`,
};

export const dict = [
	{
		title: "У кого",
		dataIndex: "fio_receiver",
		key: "fio_receiver",
		width: "200px",
	},
	{
		title: "Срок",
		dataIndex: "deadline",
		key: "deadline",
		width: "200px",
	},
	{
		title: "Статус",
		dataIndex: "task_statuses",
		key: "task_statuses",
		width: "150px",
	},
	{
		title: "Задача",
		dataIndex: "note",
		key: "note",
		width: "250px",
	},
];
