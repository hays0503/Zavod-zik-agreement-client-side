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
import test from "../../../core/functions/test";
import { FragmentRadioButton } from "../../DocumentControl/pages/fragments/FragmentRadioButton";
import { FragmentSelectDepartment } from "../../DocumentControl/pages/fragments/FragmentSelectItems";

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

let department_dictionary = {
	exemplar: "department_dictionary",
	table: "department_dictionary",
	options: {
		all: {
			variables: {
				department_dictionary: {
					global: { ORDER_BY: ["department_name asc"] },
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
			query department_dictionary($department_dictionary: JSON) {
				department_dictionary(department_dictionary: $department_dictionary) {
					id
					department_name
				}
			}
		`,
		one: gql`
			query department_dictionary($department_dictionary: JSON) {
				department_dictionary(department_dictionary: $department_dictionary) {
					id
					department_name
				}
			}
		`,
	},
	subscription: {
		all: gql`
			subscription department_dictionary($department_dictionary: JSON) {
				department_dictionary(department_dictionary: $department_dictionary) {
					id
					department_name
				}
			}
		`,
	},
	insert: gql`
		mutation insertDepartmentDictionary($department_dictionary: JSON) {
			insertDepartmentDictionary(
				department_dictionary: $department_dictionary
			) {
				message
			}
		}
	`,
	update: gql`
		mutation updateDepartmentDictionary($department_dictionary: JSON) {
			updateDepartmentDictionary(
				department_dictionary: $department_dictionary
			) {
				message
			}
		}
	`,
	delete: gql`
		mutation deleteDepartmentDictionary($department_dictionary: JSON) {
			deleteDepartmentDictionary(
				department_dictionary: $department_dictionary
			) {
				message
			}
		}
	`,
};

let DocumentDepartPage = React.memo((props) => {
	const visibleModalUpdate = useState(false);

	const [remove, { loading: loadingRemove }] = handlerMutation(
		useMutation(department_dictionary.delete)
	)();

	const { loading, data, refetch } = handlerQuery(
		department_dictionary,
		"all"
	)();
	useEffect(() => {
		refetch();
	}, []);

	console.log("console.log(data)", data);

	let list =
		data && data[Object.keys(data)[0]] != null
			? data[Object.keys(data)[0]].map((item) => {
					return {
						id: item.id,
						key: item.id,
						department_name: item.department_name,
					};
			  })
			: [];

	console.log("console.log(list)", list);

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
			dataIndex: "department_name",
			width: "75px",
			type: "search",
			tooltip: true,
		},
	]);
	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				title="Редактирование департаментов"
				buttons={[
					<ModalInsert
						title="Добавление департаментов"
						GQL={department_dictionary}
						InsertForm={DocumentDepartForm}
					/>,
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						title="Редактирование департаментов"
						selectedRowKeys={tableProps.selectedRowKeys}
						GQL={department_dictionary}
						UpdateForm={DocumentDepartForm}
						update={true}
					/>,
					<Popconfirm
						title="Вы уверены?"
						onConfirm={() => {
							let variables = {};
							variables[department_dictionary.exemplar] = {
								id: Number(tableProps.selectedRowKeys[0]),
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

let DocumentDepartForm = React.memo((props) => {
	console.log("props?.initialValues", props?.initialValues);
	console.log("props", props);

	const [state, setState] = useState({
		id: props?.initialValues?.department_dictionary[0]?.id,
	});

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.department_dictionary[0].id,
				department_name:
					props.initialValues.department_dictionary[0].department_name,
			});
		}
	}, [props.initialValues, state.log_username]);

	let onFinish = (values) => {
		props.onFinish(state);
		console.log("onFinishValues", values);
		console.log("onFinish", state);
	};

	return (
		<Form
			form={props.form}
			name="DocumentDepartForm"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			<Form.Item
				name="department_name"
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

			<Form.Item name="log_username" hidden={true}>
				<Input disabled={props.disabled} />
			</Form.Item>
		</Form>
	);
});

export default DocumentDepartPage;
