import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Button, Popconfirm, Typography, Steps } from "antd";
import React, { useEffect, useState, useRef } from "react";
import {
	handlerQuery,
	handlerMutation,
	useUser,
} from "../../../../core/functions";
import ModalUpdate from "../../modals/ModalUpdate";
import TableContainerIsRead from "../../tableContainers/TableContainerIsRead";
import TitleMenu from "../../../../core/TitleMenu";
import test from "../../../../core/functions/TrashComponent1";

import Update1 from "./forms/1/Update1";
import Update2 from "./forms/2/Update2";
import Update3 from "./forms/3/Update3";
import Update4 from "./forms/4/Update4";
import Update5 from "./forms/5/Update5";

const { Title, Link } = Typography;
const { Step } = Steps;

let OnApprovalDocuments = React.memo((props) => {
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
							positions: positionsVariable,
							status_id: "=5",
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
						subject
						date_created
						date_modified
						status_id
						reason
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
						status_id
						reason
						data_one {
							id
							document_id
							price
							subject
							supllier
						}
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
						data_custom {
							id
							document_id
							subject
							remark
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
						document_logs {
							id
							document_id
							is_read
							user_id
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
							position
							fio
							reason
							price
							supllier
							subject
							date_created
							date_modified
							status_id
							document_logs {
								id
								document_id
								is_read
								user_id
							}
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
					document_tasks: { global: { user_id_created: `=${user.id}` } },
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
						user_id_created
						fio_created
						user_id_receiver
						fio_receiver
					}
				}
			`,
			one: gql`
				query document_tasks($document_tasks: JSON) {
					document_tasks(document_tasks: $document_tasks) {
						id
						document_id
						status
						user_id_created
						fio_created
						user_id_receiver
						fio_receiver
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
						user_id_created
						fio_created
						user_id_receiver
						fio_receiver
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

	const count = useRef(0);

	const visibleModalUpdate = useState(false);
	const visibleModalUpdate2 = useState(false);
	const visibleModalUpdate3 = useState(false);
	const visibleModalUpdate4 = useState(false);
	const visibleModalUpdate5 = useState(false);

	const [remove, { loading: loadingRemove }] = handlerMutation(
		useMutation(documents.delete)
	)();

	const { loading, data, refetch } = handlerQuery(documents, "all")();
	const {
		loading: taskLoading,
		data: taskData,
		refetch: taskRefetch,
	} = handlerQuery(DocumentTasks, "all")();
	useEffect(() => {
		taskRefetch();
	}, []);
	useEffect(() => {
		refetch();
	}, []);

	let list =
		data && data[Object.keys(data)[0]] != null
			? data[Object.keys(data)[0]].map((item) => {
					count.current = data.documents.length;
					let tasks = taskData?.document_tasks?.filter((task) => {
						return task.document_id == item.id;
					});
					let tasks_done = taskData?.document_tasks?.filter((task) => {
						return task.document_id == item.id && task.status == 2;
					});
					return {
						id: item.id,
						key: item.id,
						title: item.title,
						user_info: item.fio + " " + item.position,
						date_created: item.date_created,
						date_modified: item.date_modified,
						status_id: item.status_id,
						status: item.document_statuses?.name
							? item.document_statuses.name
							: "Без статуса",
						route_id: item.route_id.id,
						route: item.route_id?.name ? item.route_id.name : "Не задан",
						route_data: item.route_data,
						route_step: item.route_data
							? item.route_data.findIndex(
									(item) => item.positionId == positionsVariable
							  ) + 1
							: [],
						step: item.step,
						step_count: item.step + " из " + item.route_data?.length,
						step_name:
							item.route_data?.length > 0
								? item.route_data[item.step - 1].positionName
								: "",
						document_logs:
							item.document_logs[
								item.document_logs.findIndex((item) => item.user_id == user.id)
							],
						tasks_count: `${tasks_done?.length} из ${tasks?.length}`,
					};
			  })
			: [];

	let listFiltered = list.filter((el) => {
		return el.step == el.route_step && el.status_id != 4;
	});

	window.localStorage["rows_onaproval"] = listFiltered.length;

	let dict = test([
		{
			title: "Наименование договора",
			dataIndex: "title",
			width: "180px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.title.localeCompare(b.title),
		},
		{
			title: "От кого",
			dataIndex: "user_info",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.user_info.localeCompare(b.user_info),
		},
		{
			title: "Дата и время создания",
			dataIndex: "date_created",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: true,
		},
		{
			title: "Последние изменение",
			dataIndex: "date_modified",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: true,
		},
		{
			title: "Тип договора",
			dataIndex: "route",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.route.localeCompare(b.route),
		},
		{
			title: "Статус",
			dataIndex: "status",
			width: "80px",
			tooltip: true,
			sorter: (a, b) => a.status.localeCompare(b.status),
		},
		{ title: "На подписи", dataIndex: "step_name", width: "114px" },
		{ title: "Этап", dataIndex: "step_count", width: "55px" },
		{ title: "Выполнено задач", dataIndex: "tasks_count", width: "90px" },
		// { title: 'Кол-во задач', dataIndex: 'document_tasks', width: '75px' },
	]);

	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						GQL={documents}
						UpdateForm={Update1}
						visibleModalUpdate2={visibleModalUpdate2}
						GQL2={documents}
						UpdateForm2={Update2}
						visibleModalUpdate3={visibleModalUpdate3}
						GQL3={documents}
						UpdateForm3={Update3}
						visibleModalUpdate4={visibleModalUpdate4}
						GQL4={documents}
						UpdateForm4={Update4}
						visibleModalUpdate5={visibleModalUpdate5}
						GQL5={documents}
						UpdateForm5={Update5}
						title="Согласование договора"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
					/>,
					<Popconfirm
						title="Вы уверены?"
						onConfirm={() => {
							let variables = {};
							variables[documents.exemplar] = {
								id: Number(tableProps.selectedRowKeys[0]),
								log_username: user.username,
							};
							remove({ variables });
						}}
						okText="Да"
						cancelText="Нет"
						icon={<QuestionCircleOutlined style={{ color: "red" }} />}
						disabled={tableProps.selectedRowKeys.length !== 1}
					>
						{user.documentControl.delete ? (
							<Button
								key="remove"
								type="dashed"
								danger
								loading={loadingRemove}
								disabled={tableProps.selectedRowKeys.length !== 2}
							>
								<DeleteOutlined />
								Удалить
							</Button>
						) : null}
					</Popconfirm>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	return (
		<TableContainerIsRead
			data={{ dict, records: listFiltered }}
			loading={loading}
			title={titleMenu}
			visibleModalUpdate={visibleModalUpdate}
			visibleModalUpdate2={visibleModalUpdate2}
			visibleModalUpdate3={visibleModalUpdate3}
			visibleModalUpdate4={visibleModalUpdate4}
			visibleModalUpdate5={visibleModalUpdate5}
			GQL={documents}
			setCountManager={props.setCountManager}
		/>
	);
});

export default OnApprovalDocuments;
