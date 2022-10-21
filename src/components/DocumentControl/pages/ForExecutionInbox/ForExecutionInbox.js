import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Button, Popconfirm } from "antd";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
	handlerQuery,
	handlerMutation,
	useUser,
} from "../../../../core/functions";
import ModalUpdate from "./modals/ModalUpdate";
import TableContainer from "./tableContainers/TableContainer";
import TitleMenu from "../../../../core/TitleMenu";
import test from "../../../../core/functions/TrashComponent1";

import Update1 from "./forms/1/Update1";
import Update2 from "./forms/2/Update2";
import Update3 from "./forms/3/Update3";
import Update4 from "./forms/4/Update4";
import Update5 from "./forms/5/Update5";

let ForExecutionInbox = React.memo((props) => {
	let user = useUser();
	let userVariable = user.id;
	let positionsVariable = user.positions.toString();

	let documents = {
		exemplar: "document",
		table: "documents",
		options: {
			all: {
				variables: {
					documents: {
						global: {
							documents_for_receiver: userVariable,
							ORDER_BY: ["date_created desc"],
						},
					},
				},
				fetchPolicy: "cache-only",
			},
			one: {
				fetchPolicy: "standby",
			},
		},
		select: {
			all: gql`
				query documents($documents: JSON) {
					documents(documents: $documents) {
						id
						title
						user_id
						username
						position
						fio
						price
						supllier
						reason
						subject
						date_created
						date_modified
						status_id

						document_tasks {
							id
							document_id
							status
							is_cancelled
							note
							deadline

							user_id_created
							fio_created
							user_id_receiver
							fio_receiver
						}
						document_logs {
							id
							document_id
							is_read
							user_id
						}
						data_custom {
							id
							document_id
							subject
							remark
						}
						data_one {
							id
							document_id
							price
							subject
							supllier
						}
						data_agreement_list {
							id
							document_id
							price
							subject

							currency_price
							executor_name_division
							sider_signatures_date
							received_from_counteragent_date
						}
						data_agreement_list_production {
							id
							document_id
							price
							subject
							currency
							executor_name_division
							executor_phone_number
							counteragent_contacts
						}
						data_agreement_list_internal_needs {
							id
							document_id
							price
							subject
							currency
							executor_name_division
							executor_phone_number
							counteragent_contacts
						}
						document_statuses {
							id
							name
						}
						route_id {
							id
							name
							routes
							status_in_process
							status_cancelled
							status_finished
						}
						step
						route_data
					}
				}
			`,
			one: gql`
				query documents($documents: JSON) {
					documents(documents: $documents) {
						id
						title
						user_id
						username
						position
						fio
						price
						supllier
						subject
						date_created
						date_modified
						reason
						status_id
						document_tasks {
							id
							document_id
							status
							is_cancelled
							note
							deadline

							user_id_created
							fio_created
							user_id_receiver
							fio_receiver
						}
						document_logs {
							id
							document_id
							is_read
							user_id
						}
						data_custom {
							id
							document_id
							subject
							remark
						}
						data_one {
							id
							document_id
							price
							subject
							supllier
						}
						data_agreement_list {
							id
							document_id
							price
							subject

							currency_price
							executor_name_division
							sider_signatures_date
							received_from_counteragent_date
						}
						data_agreement_list_production {
							id
							document_id
							price
							subject
							currency
							executor_name_division
							executor_phone_number
							counteragent_contacts
						}
						data_agreement_list_internal_needs {
							id
							document_id
							price
							subject
							currency
							executor_name_division
							executor_phone_number
							counteragent_contacts
						}
						document_statuses {
							id
							name
						}
						route_id {
							id
							name
							routes
							status_in_process
							status_cancelled
							status_finished
						}
						files {
							id
							filename
						}
						signatures {
							id
							document_id
							user_id
							username
							date_signature
							position
							fio
						}
						step
						route_data
					}
				}
			`,
		},
		subscription: {
			all: [
				gql`
					subscription documents($documents: JSON) {
						documents(documents: $documents) {
							id
							title
							user_id
							username
							fio
							position
							date_created
							date_modified
							status_id
							reason
							document_statuses {
								id
								name
							}
							document_logs {
								id
								document_id
								is_read
								user_id
							}
							route_id {
								id
								name
								routes
								status_in_process
								status_cancelled
								status_finished
							}
							step
							route_data
						}
					}
				`,
			],
		},
		insert: gql`
			mutation insertDocument($document: JSON) {
				insertDocument(document: $document) {
					type
					message
				}
			}
		`,
		update: gql`
			mutation updateDocument($document: JSON) {
				updateDocument(document: $document) {
					type
					message
				}
			}
		`,
		delete: gql`
			mutation deleteDocument($document: JSON) {
				deleteDocument(document: $document) {
					type
					message
				}
			}
		`,
		setIsReadTrue: gql`
			mutation setIsReadTrue($document: JSON) {
				setIsReadTrue(document: $document) {
					type
					message
				}
			}
		`,
	};

	let DocumentTasks = {
		exemplar: "document_tasks",
		table: "document_tasks",
		options: {
			all: {
				variables: {
					document_tasks: {
						global: {
							user_id_receiver: `=${userVariable}`,
							ORDER_BY: ["date_created desc"],
						},
					},
				},
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
						task_statuses {
							id
							name
						}
						document_tasks_logs {
							id
							task_id
							is_read
							type
							user_id
						}
						report
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
						document_tasks_logs {
							id
							task_id
							is_read
							type
							user_id
						}
						task_statuses {
							id
							name
						}
						document_tasks_files {
							id
							filename
							data_file
							task_id
						}
						report
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
						document_options
						task_files
						document_tasks_logs {
							id
							task_id
							is_read
							type
							user_id
						}
						task_statuses {
							id
							name
						}
						report
					}
				}
			`,
		},
		update: gql`
			mutation updateDocumentTasks($document_tasks: JSON) {
				updateDocumentTasks(document_tasks: $document_tasks) {
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

	// const onVisibilityChange = () => {
	//     if (document.visibilityState === 'visible') {
	//         console.log("Tab visible, refetch the data!");
	//     };
	//     if (document.visibilityState === 'hidden') {
	//         console.log("Tab hidden, refetch the data!");
	//     };

	// };
	// useLayoutEffect(() => {
	//     document.addEventListener("visibilitychange", onVisibilityChange);
	// }, []);

	// const count = useRef(0);

	const visibleModalUpdate = useState(false);
	const visibleModalUpdate2 = useState(false);
	const visibleModalUpdate3 = useState(false);
	const visibleModalUpdate4 = useState(false);
	const visibleModalUpdate5 = useState(false);

	const {
		loading: loadingTasks,
		data: dataTasks,
		refetch: refetchTasks,
	} = handlerQuery(DocumentTasks, "all")();

	// useEffect(() => { refetch() }, [])

	useEffect(() => {
		refetchTasks();
	}, []);

	let list =
		dataTasks && dataTasks[Object.keys(dataTasks)[0]] != null
			? dataTasks[Object.keys(dataTasks)[0]].map((item) => {
					return {
						id: item.id,
						key: item.id,
						document_id: item.document_id,
						status: item.status,
						is_cancelled: item.is_cancelled,
						note: item.note,
						deadline: item.deadline,
						date_created: item.date_created,
						user_id_created: item.user_id_created,
						fio_created: item.fio_created,
						user_id_receiver: item.user_id_receiver,
						fio_receiver: item.fio_receiver,
						route_id: item.route_id ? item.route_id : 10,
						document_options: item.document_options,
						task_files: item.task_files ? item.task_files : {},
						task_statuses: item.task_statuses.name,
						document_tasks_logs: item.document_tasks_logs
							? item.document_tasks_logs[
									item.document_tasks_logs.findIndex(
										(item) => item.user_id == user.id
									)
							  ]
							: [],
					};
			  })
			: [];

	let listFiltered = list.filter((el) => {
		return el.status_id == 4;
	});
	window.localStorage["rows_approved"] = listFiltered.length;

	let dict = test([
		{
			title: "ФИО поручителя",
			dataIndex: "fio_created",
			width: "214px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.fio_created.localeCompare(b.fio_created),
		},
		{
			title: "Дата создания",
			dataIndex: "date_created",
			width: "300px",
			type: "search",
			tooltip: true,
			sorter: true,
			sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created),
		},
		{
			title: "Выполнить до",
			dataIndex: "deadline",
			width: "214px",
			type: "search",
			tooltip: true,
			sorter: true,
			sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
		},
		{
			title: "Статус",
			dataIndex: "task_statuses",
			width: "114px",
			tooltip: true,
		},
		{ title: "Задача", dataIndex: "note", width: "214px" },
	]);

	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						UpdateForm={Update1}
						visibleModalUpdate2={visibleModalUpdate2}
						UpdateForm2={Update2}
						visibleModalUpdate3={visibleModalUpdate3}
						UpdateForm3={Update3}
						visibleModalUpdate4={visibleModalUpdate4}
						UpdateForm4={Update4}
						visibleModalUpdate5={visibleModalUpdate5}
						UpdateForm5={Update5}
						GQL={DocumentTasks}
						title="Просмотр задания"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	return (
		<TableContainer
			data={{ dict, records: list }}
			loading={loadingTasks}
			title={titleMenu}
			visibleModalUpdate={visibleModalUpdate}
			visibleModalUpdate2={visibleModalUpdate2}
			visibleModalUpdate3={visibleModalUpdate3}
			visibleModalUpdate4={visibleModalUpdate4}
			visibleModalUpdate5={visibleModalUpdate5}
			GQL={DocumentTasks}
		/>
	);
});

export default ForExecutionInbox;
