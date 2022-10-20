import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Button, Form, Input, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import {
	handlerQuery,
	handlerMutation,
	useUser,
} from "../../../core/functions";
import ModalInsert from "../../../core/modal/ModalInsert";
import ModalUpdate from "../../../core/modal/ModalUpdate";
import TableContainer from "../../../core/TableContainer";
import IndependentSelect from "../../../core/IndependentSelect";
import TitleMenu from "../../../core/TitleMenu";
import test from "../../../core/functions/TrashComponent1";

let forms = {
	exemplar: "forms",
	table: "forms",
	options: {
		all: {
			/*variables: {
               controller_addresses: { global: {ORDER_BY: ['id DESC']}}
           },*/
			fetchPolicy: "cache-only",
		},
		one: {
			fetchPolicy: "standby",
		},
	},
	select: {
		all: gql`
			query forms($forms: JSON) {
				forms(forms: $forms) {
					id
					name
					route
					settings
				}
			}
		`,
		one: gql`
			query forms($forms: JSON) {
				forms(forms: $forms) {
					id
					name
					route
					settings
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription forms($forms: JSON) {
				forms(forms: $forms) {
					id
					name
					route
					settings
				}
			}
		`,
	},
	insert: gql`
		mutation insertForm($forms: JSON) {
			insertForm(forms: $forms) {
				message
			}
		}
	`,
	update: gql`
		mutation updateForm($forms: JSON) {
			updateForm(forms: $forms) {
				message
			}
		}
	`,
	delete: gql`
		mutation deleteForm($forms: JSON) {
			deleteForm(forms: $forms) {
				message
			}
		}
	`,
};

let document_routes = {
	exemplar: "document_routes",
	table: "document_routes",
	options: {
		all: {
			/*variables: {
               controller_addresses: { global: {ORDER_BY: ['id DESC']}}
           },*/
			fetchPolicy: "cache-only",
		},
	},
	select: {
		all: gql`
			query document_routes($document_routes: JSON) {
				document_routes(document_routes: $document_routes) {
					id
					name
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription document_routes($document_routes: JSON) {
				document_routes(document_routes: $document_routes) {
					id
					name
				}
			}
		`,
	},
};

let FormSettingsPage = React.memo((props) => {
	let user = useUser();
	const visibleModalUpdate = useState(false);

	const [remove, { loading: loadingRemove }] = handlerMutation(
		useMutation(forms.delete)
	)();

	const { loading, data, refetch } = handlerQuery(forms, "all")();
	useEffect(() => {
		refetch();
	}, []);
	let list =
		data && data[Object.keys(data)[0]] != null
			? data[Object.keys(data)[0]].map((item) => {
					return {
						id: item.id,
						key: item.id,
						name: item.name,
					};
			  })
			: [];
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
	]);
	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				title="Редактирование настроек форм"
				buttons={[
					<ModalInsert
						title="Добавление формы"
						GQL={forms}
						InsertForm={FormSettingsForm}
					/>,
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						title="Редактирование формы"
						selectedRowKeys={tableProps.selectedRowKeys}
						GQL={forms}
						UpdateForm={FormSettingsForm}
						update={true}
					/>,
					<Popconfirm
						title="Вы уверены?"
						onConfirm={() => {
							let variables = {};
							variables[forms.exemplar] = {
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

let FormSettingsForm = React.memo((props) => {
	let user = useUser();
	const [state, setState] = useState({
		isuseforreport: false,
		log_username: user.username,
	});

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.forms[0].id,
				name: props.initialValues.forms[0].name,
				route: props.initialValues.forms[0].route,
				settings: JSON.stringify(props.initialValues.forms[0].settings),
				log_username: state.log_username,
			});
		}
	}, [props.initialValues]);

	let onFinish = (values) => {
		props.onFinish(state);
	};
	return (
		<Form
			form={props.form}
			name="FormSettingsForm"
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
				<Input disabled={props.disabled} placeholder="Название формы" />
			</Form.Item>
			<Form.Item
				name="route"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
						whitespace: true,
					},
				]}
			>
				<IndependentSelect
					disabled={props.disabled}
					placeholder="Маршрут"
					title="Маршрут"
					query={document_routes}
				/>
			</Form.Item>
			<Form.Item
				name="settings"
				label="Настройки"
				labelCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Input.TextArea
					rows={4}
					disabled={props.disabled}
					placeholder="Настройки"
				/>
			</Form.Item>
			<Form.Item name="log_username" hidden={true}>
				<Input disabled={props.disabled} />
			</Form.Item>
		</Form>
	);
});

export default FormSettingsPage;
