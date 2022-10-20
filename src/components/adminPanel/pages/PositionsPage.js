import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Button, Divider, Form, Input, Popconfirm, Radio, Tree } from "antd";
import React, { useEffect, useState } from "react";
import {
	handlerQuery,
	handlerMutation,
	useUser,
} from "../../../core/functions";
import ModalInsert from "../../../core/modal/ModalInsert";
import ModalUpdate from "../../../core/modal/ModalUpdate";
import TableContainer from "../../../core/TableContainer";
import TitleMenu from "../../../core/TitleMenu";
import test from "../../../core/functions/TrashComponent1";
import { FragmentRadioButton } from "../../DocumentControl/pages/fragments/FragmentRadioButton";
import { FragmentSelectDepartment } from "../../DocumentControl/pages/fragments/FragmentSelectItems";

let users = {
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
				}
			}
		`,
	},
	insert: gql`
		mutation insertUser($user: JSON) {
			insertUser(user: $user) {
				message
				type
			}
		}
	`,
	update: gql`
		mutation updateUser($user: JSON) {
			updateUser(user: $user) {
				message
				type
			}
		}
	`,
	delete: gql`
		mutation deleteUser($user: JSON) {
			deleteUser(user: $user) {
				message
				type
			}
		}
	`,
};

let positions = {
	exemplar: "positions",
	table: "positions",
	options: {
		all: {
			variables: {
				positions: { global: { ORDER_BY: ["name asc"] } },
			},
			fetchPolicy: "cache-only",
		},
		one: {
			fetchPolicy: "standby",
		},
	},
	select: {
		all: gql`
			query positions($positions: JSON) {
				positions(positions: $positions) {
					id
					name
					accesses
					id_depart
					is_boss
					is_vice_director
					is_user
				}
			}
		`,
		one: gql`
			query positions($positions: JSON) {
				positions(positions: $positions) {
					id
					name
					accesses
					id_depart
					is_boss
					is_vice_director
					is_user
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription positions($positions: JSON) {
				positions(positions: $positions) {
					id
					name
					accesses
					id_depart
					is_boss
					is_vice_director
					is_user
				}
			}
		`,
	},
	insert: gql`
		mutation insertPosition($positions: JSON) {
			insertPosition(positions: $positions) {
				message
			}
		}
	`,
	update: gql`
		mutation updatePosition($positions: JSON) {
			updatePosition(positions: $positions) {
				message
			}
		}
	`,
	delete: gql`
		mutation deletePosition($positions: JSON) {
			deletePosition(positions: $positions) {
				message
			}
		}
	`,
};

let DocumentPositionsPage = React.memo((props) => {
	let user = useUser();
	const visibleModalUpdate = useState(false);

	const [remove, { loading: loadingRemove }] = handlerMutation(
		useMutation(positions.delete)
	)();

	const { loading, data, refetch } = handlerQuery(positions, "all")();
	useEffect(() => {
		refetch();
	}, []);

	const {
		loading: loadingUsers,
		data: usersData,
		refetch: refetchUsers,
	} = handlerQuery(users, "all")();
	useEffect(() => {
		refetchUsers();
	}, []);

	let list =
		data && data[Object.keys(data)[0]] != null
			? data[Object.keys(data)[0]].map((item) => {
					return {
						id: item.id,
						key: item.id,
						name: item.name,
						accesses: item.accesses,
						id_depart: item.id_depart,
						is_boss: item.is_boss,
						is_vice_director: item.is_vice_director,
						is_user: item.is_user,
						count: usersData?.users?.filter((e) => e.positions == item.id)
							.length,
					};
			  })
			: [];
	//console.log('list', list, usersData)
	let dict = test([
		{
			title: "ID",
			dataIndex: "id",
			width: "15px",
			type: "search",
			tooltip: true,
		},
		{
			title: "Название",
			dataIndex: "name",
			width: "150px",
			type: "search",
			tooltip: true,
		},
		{
			title: "Кол-во польз.",
			dataIndex: "count",
			width: "50px",
			tooltip: true,
		},
	]);
	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				title="Редактирование должностей"
				buttons={[
					<ModalInsert
						title="Добавление должности"
						GQL={positions}
						InsertForm={DocumentPositionsForm}
					/>,
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						title="Редактирование должности"
						selectedRowKeys={tableProps.selectedRowKeys}
						GQL={positions}
						UpdateForm={DocumentPositionsForm}
						update={true}
					/>,
					<Popconfirm
						title="Вы уверены?"
						onConfirm={() => {
							let variables = {};
							variables[positions.exemplar] = {
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
						<Button
							key="remove"
							type="dashed"
							danger
							loading={loadingRemove}
							disabled={tableProps.selectedRowKeys.length !== 1}
						>
							<DeleteOutlined />
							Удалить
						</Button>
					</Popconfirm>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	return (
		<TableContainer
			data={{ dict, records: list }}
			loading={loading}
			title={titleMenu}
			visibleModalUpdate={visibleModalUpdate}
		/>
	);
});

let DocumentPositionsForm = React.memo((props) => {
	let user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.positions[0].id,
				name: props.initialValues.positions[0].name,
				accesses: props.initialValues.positions[0].accesses,
				log_username: state.log_username,
				is_boss: props.initialValues.positions[0].is_boss,
				is_vice_director: props.initialValues.positions[0].is_vice_director,
				is_user: props.initialValues.positions[0].is_user,
				id_depart: props.initialValues.positions[0].id_depart,
			});
		}
	}, [props.initialValues, state.log_username]);

	let onFinish = (values) => {
		props.onFinish(state);
		//console.log("onFinish", state);
	};

	return (
		<Form
			form={props.form}
			name="DocumentPositionsForm"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			<Form.Item
				name="name"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
						whitespace: true,
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Название должности" />
			</Form.Item>
			<h3>Назначение доступа:</h3>
			<Form.Item
				name="accesses"
				rules={[
					{
						type: "array",
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<PositionsPermissionsTree disabled={props.disabled} />
			</Form.Item>

			<Divider>Департамент</Divider>

			<FragmentSelectDepartment stateValue={state} setStateValue={setState} />

			<Divider>Обязанности выполняемой должности</Divider>

			<FragmentRadioButton
				stateValue={state}
				setStateValue={setState}
				is_boss={state.is_boss}
				is_vice_director={state.is_vice_director}
				is_user={state.is_user}
				disabled={props.disabled}
			/>

			<Form.Item name="log_username" hidden={true}>
				<Input disabled={props.disabled} />
			</Form.Item>
		</Form>
	);
});

const PositionsPermissionsTree = React.memo((props) => {
	const [autoExpandParent, setAutoExpandParent] = useState(true);
	const [expandedKeys, setExpandedKeys] = useState([]);

	const treeData = [
		{
			title: "Договора",
			key: "/document-control-p",
			children: [
				{
					title: "Просмотр",
					key: "/document-control-p/select",
				},
				{
					title: "Добавление",
					key: "/document-control-p/insert",
				},
				{
					title: "Изменение",
					key: "/document-control-p/update",
				},
				{
					title: "Удаление",
					key: "/document-control-p/delete",
				},
				{
					title: "Изменение статуса документа",
					key: "/document-control-p/document-status-change",
				},
				{
					title: "Изменение статуса элементов",
					key: "/document-control-p/item-status-change",
				},
				{
					title: "Исполненные",
					key: "/document-control-p/documents-finals",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/documents-finals/select",
						},
					],
				},
				{
					title: "Документы подписанные в ООПЗ",
					key: "/document-control-p/fulfilled-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/fulfilled-p/select",
						},
					],
				},
				{
					title: "Регистрация документов",
					key: "/document-control-p/registration-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/registration-p/select",
						},
					],
				},
				{
					title: "Мои договора",
					key: "/document-control-p/orders-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/orders-p/select",
						},
					],
				},
				{
					title: "На доработку",
					key: "/document-control-p/reviseduser-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/reviseduser-p/select",
						},
					],
				},
				{
					title: "Исполненные",
					key: "/document-control-p/approveduser-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/approveduser-p/select",
						},
					],
				},
				{
					title: "Отклоненные",
					key: "/document-control-p/rejecteduser-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/rejecteduser-p/select",
						},
					],
				},
				{
					title: "На подпись",
					key: "/document-control-p/on-approval-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/on-approval-p/select",
						},
					],
				},
				{
					title: "Подписанные",
					key: "/document-control-p/on-approval-list-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/on-approval-list-p/select",
						},
					],
				},
				{
					title: "На исполнение",
					key: "/document-control-p/for-execution-inbox-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/for-execution-inbox-p/select",
						},
					],
				},
				{
					title: "Все утвеждённые",
					key: "/document-control-p/approved-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/approved-p/select",
						},
					],
				},
				{
					title: "Все отклоеннённые",
					key: "/document-control-p/rejected-p",
					children: [
						{
							title: "Просмотр",
							key: "/document-control-p/rejected-p/select",
						},
					],
				},
			],
		},
		{
			title: "Отчеты",
			key: "/document-report-p",
			children: [
				{
					title: "Просмотр",
					key: "/document-report-p/select",
				},
				{
					title: "Добавление",
					key: "/document-report-p/insert",
				},
				{
					title: "Изменение",
					key: "/document-report-p/update",
				},
				{
					title: "Удаление",
					key: "/document-report-p/delete",
				},
				{
					title: "Изменение статуса документа",
					key: "/document-report-p/document-status-change",
				},
				{
					title: "Изменение статуса элементов",
					key: "/document-report-p/item-status-change",
				},
			],
		},
		{
			title: "История",
			key: "/document-hitory-p",
			children: [
				{
					title: "Просмотр",
					key: "/document-hitory-p/select",
				},
				{
					title: "Добавление",
					key: "/document-hitory-p/insert",
				},
				{
					title: "Изменение",
					key: "/document-hitory-p/update",
				},
				{
					title: "Удаление",
					key: "/document-hitory-p/delete",
				},
				{
					title: "Изменение статуса документа",
					key: "/document-hitory-p/document-status-change",
				},
				{
					title: "Изменение статуса элементов",
					key: "/document-hitory-p/item-status-change",
				},
			],
		},
		{
			title: "Поиск",
			key: "/document-search-p",
			children: [
				{
					title: "Просмотр",
					key: "/document-search-p/select",
				},
				{
					title: "Добавление",
					key: "/document-search-p/insert",
				},
				{
					title: "Изменение",
					key: "/document-search-p/update",
				},
				{
					title: "Удаление",
					key: "/document-search-p/delete",
				},
				{
					title: "Изменение статуса документа",
					key: "/document-search-p/document-status-change",
				},
				{
					title: "Изменение статуса элементов",
					key: "/document-search-p/item-status-change",
				},
			],
		},
		{
			title: "Администрация",
			key: "/admin-p",
			children: [
				{
					title: "Просмотр",
					key: "/admin-p/select",
				},
				{
					title: "Добавление",
					key: "/admin-p/insert",
				},
				{
					title: "Изменение",
					key: "/admin-p/update",
				},
				{
					title: "Удаление",
					key: "/admin-p/delete",
				},
				{
					title: "Изменение статуса документа",
					key: "/admin-p/document-status-change",
				},
				{
					title: "Изменение статуса элементов",
					key: "/admin-p/item-status-change",
				},
			],
		},
	];

	return (
		<Tree
			checkable
			onExpand={(expandedKeys) => {
				setExpandedKeys(expandedKeys);
				setAutoExpandParent(false);
			}}
			expandedKeys={expandedKeys}
			autoExpandParent={autoExpandParent}
			onCheck={(values) => {
				props.onChange(values);
			}}
			checkedKeys={props.value}
			treeData={treeData}
			disabled={props.disabled}
		/>
	);
});

export default DocumentPositionsPage;
