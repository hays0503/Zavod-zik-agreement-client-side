import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import {
	handlerQuery,
	getDDMMYYYHHmm,
	useUser,
	handlerMutation,
} from "../../../core/functions";
import {
	Modal,
	Popconfirm,
	Select,
	Button,
	Form,
	DatePicker,
	Input,
	Checkbox,
	Switch,
	Row,
	Col,
	Divider,
	Typography,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";

let TasksAddDialog3 = React.memo((props) => {
	let user = useUser();
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

	let DocumentTasks = {
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
	const { Link } = Typography;
	const [insert, { loading: documentTasksInsertLoading }] = handlerMutation(
		useMutation(DocumentTasks.insert)
	)();
	const { loading, data, refetch } = handlerQuery(users, "all")();

	let OpenDocument = async (item) => {
		// setBtnLoad(true)
		//console.log("PROPS", item.id)
		// console.log('RECORD',props.record)
		const tmp = await fetch("/api/files", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user: Number(user.id), item: item.id }),
		});
		const content = await tmp.json();
		if (content != undefined) {
			//console.log("RESULT", content);
		}
	};

	let download = async (e) => {
		let id = e.target.dataset.fileid;
		await fetch("/get-file", {
			method: "POST",
			body: JSON.stringify({ id: e.target.dataset.fileid }),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				let result = response.result;
				let link = document.createElement("a");
				link.href =
					result.data_file; /*result.data_file.slice(result.data_file.indexOf(',')+1) */
				link.download = result.filename;
				link.click();
			});
	};

	useEffect(() => {
		refetch();
	}, []);

	const [state, setState] = useState({});

	let onFinish = (values) => {
		let taskData = {
			variables: {
				document_tasks: {
					document_id: props.document.documents[0].id,
					status: "1",
					is_cancelled: "false",
					note: values.note,
					deadline: getDDMMYYYHHmm(values.deadline._d),
					user_id_created: `${user.id}`,
					fio_created: user.fio,
					user_id_receiver: `${values.recepient.value}`,
					fio_receiver: values.recepient.label,
					route_id: props.document.documents[0].route_id.id,
					document_options: {
						title: values.title == undefined ? false : values.title,
						subject: values.subject == undefined ? false : values.subject,
						price: values.price == undefined ? false : values.price,
						currency:
							values.currency_price == undefined
								? false
								: values.currency_price,
						executor_name_division:
							values.executor_name_division == undefined
								? false
								: values.executor_name_division,
						executor_phone_number:
							values.executor_phone_number == undefined
								? false
								: values.executor_phone_number,
						counteragent_contacts:
							values.counteragent_contacts == undefined
								? false
								: values.counteragent_contacts,
					},
					task_files: `{${values.task_files.map((item) => parseInt(item))}}`,
					files: values.files,
				},
			},
		};
		insert(taskData);
		props.setVisible(false);
		//console.log("taskData-------------", taskData);
		//console.log("VALUES-----", values);
	};

	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue(state);
	}, [state]);

	const onChangeDatePicker = (date, dateString) => {
		// console.log('datep', date, dateString);
	};

	//checkboxgroup select all
	const CheckboxGroup = Checkbox.Group;

	let [popconfirmInModalVisible, setPopconfirmInModalVisible] = useState(false);

	let CheckAll = () => {
		let files = props?.document?.documents[0]?.files.map((item) => {
			return item.id;
		});
		form.setFieldsValue({
			task_files: files,
		});
	};

	return (
		<>
			<Button
				type="primary"
				onClick={() => {
					props.setVisible(true);
				}}
			>
				<PlusCircleOutlined />
				Создать
			</Button>
			<Modal
				title={"Создание поручения"}
				visible={props.visible}
				centered
				width={800}
				onOk={() => {}}
				closable={false}
				// onCancel={() => { props.setVisible(false) }}

				maskClosable={false}
				destroyOnClose={true}
				footer={[
					<Popconfirm
						title="Вы уверены что хотите закрыть?"
						// visible={popconfirmInModalVisible}
						onConfirm={() => {
							props.setVisible(false);
							setPopconfirmInModalVisible(false);
						}}
						onCancel={() => {
							setPopconfirmInModalVisible(false);
						}}
						okText="Да"
						cancelText="Нет"
					>
						<Button key="cancel">Закрыть</Button>
						{/* <Button key="cancel" onClick={() => { props.setVisible(false) }}>Отмена</Button> */}
					</Popconfirm>,
					<Popconfirm
						title={"Отправить поручение?"}
						placement="topLeft"
						disabled={state.recepient ? false : true}
						onConfirm={async () => {
							await form.submit();
						}}
						okText="Да"
						cancelText="Нет"
					>
						<Button type="primary" htmlType="submit">
							Сохранить
						</Button>
					</Popconfirm>,
				]}
			>
				<Form
					form={form}
					name="TaskAddForm"
					onFinish={onFinish}
					scrollToFirstError
					autoComplete="off"
					onValuesChange={(changedValues, allValues) => {
						setState(Object.assign({}, state, { ...allValues }));
					}}
				>
					<Form.Item
						label="Выберите получателя"
						labelAlign="left"
						labelCol={{ span: 12 }}
						wrapperCol={{ span: 12 }}
						name="recepient"
						rules={[
							{
								required: true,
								message: "Необходимо для заполнения!",
							},
						]}
					>
						<Select
							style={{ width: 100 + "%" }}
							showSearch
							optionFilterProp="children"
							filterOption
							{...props}
							labelInValue={true}
						>
							<Select.Option key={null} value={null}></Select.Option>
							{data?.users?.map((item, i) => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{data?.users[i]?.fio}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
					<Form.Item
						label="Срок для исполнения до"
						labelAlign="left"
						labelCol={{ span: 12 }}
						wrapperCol={{ span: 12 }}
						name="deadline"
						rules={[
							{
								required: true,
								message: "Необходимо для заполнения!",
							},
						]}
					>
						<DatePicker
							locale={locale}
							format={"DD-MM-YYYY HH:mm"}
							showTime={{ format: "HH:mm" }}
							onChange={onChangeDatePicker}
						/>
					</Form.Item>
					<Form.Item
						label="Задача"
						labelAlign="left"
						labelCol={{ span: 12 }}
						wrapperCol={{ span: 12 }}
						name="note"
						rules={[
							{
								required: true,
								message: "Необходимо для заполнения!",
							},
						]}
					>
						<Input.TextArea rows={5} />
					</Form.Item>

					<Divider type={"horizontal"} />

					<h3 className="marginTop marginBottom">
						<b>Выберите необходимые поля</b>
					</h3>

					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Наименование контрагента:</b>
						</Col>
						<Col span={8}>{props?.document?.documents[0]?.title}</Col>
						<Col span={1}>
							<Form.Item name="title">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Предмет договора:</b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.subject
							}
						</Col>
						<Col span={1}>
							<Form.Item name="subject">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Общая сумма договора: </b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.price
							}
						</Col>
						<Col span={1}>
							<Form.Item name="price">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Валюта платежа: </b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.currency
							}
						</Col>
						<Col span={1}>
							<Form.Item name="currency">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>
								Наименование подразделения, фамилия ответственного исполнителя:{" "}
							</b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.executor_name_division
							}
						</Col>
						<Col span={1}>
							<Form.Item name="executor_name_division">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Телефон исполнителя: </b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.executor_phone_number
							}
						</Col>
						<Col span={1}>
							<Form.Item name="executor_phone_number">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={13}>
							<b>Контакты контрагента: </b>
						</Col>
						<Col span={8}>
							{
								props?.document?.documents[0]?.data_agreement_list_production[0]
									?.counteragent_contacts
							}
						</Col>
						<Col span={1}>
							<Form.Item name="counteragent_contacts">
								<Switch defaultChecked={false} />
							</Form.Item>
						</Col>
					</Row>

					<Divider type={"horizontal"} />

					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={18}>
							<h3>
								<b>Выберите необходимые Файлы</b>
							</h3>
						</Col>
						<Col span={5}>
							<Button onClick={CheckAll}>Выбрать все файлы</Button>
						</Col>
					</Row>

					<Form.Item style={{ marginTop: "30px" }} name="task_files">
						<CheckboxGroup>
							<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
								{props?.document?.documents[0]?.files.map((item) => {
									return (
										<React.Fragment>
											<Col span={21}>
												<Link>
													<a data-fileid={item.id} onClick={download}>
														{item.filename}
													</a>
												</Link>
												<Button
													onClick={() => {
														OpenDocument(item);
													}}
													shape="circle"
													icon={<EyeOutlined />}
												/>
											</Col>
											<Col span={1}>
												<Checkbox value={item.id} defaultChecked={false} />
											</Col>
										</React.Fragment>
									);
								})}
							</Row>
						</CheckboxGroup>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
});

export default TasksAddDialog3;
