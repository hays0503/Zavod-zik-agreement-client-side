import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
	Button,
	Form,
	Modal,
	Steps,
	Divider,
	Input,
	Row,
	Col,
	notification,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { handlerMutation, useUser } from "../../../core/functions";

import { gql } from "@apollo/client";
import IndependentSelect from "../../../core/IndependentSelect";
import { UserException } from "./../pages/api/UserException";

let document_routes = {
	exemplar: "document_routes",
	table: "document_routes",
	options: {
		all: {
			fetchPolicy: "cache-only",
		},
		one: {
			fetchPolicy: "standby",
		},
	},
	select: {
		all: gql`
			query document_routes($document_routes: JSON) {
				document_routes(document_routes: $document_routes) {
					id
					name
					routes
					status_in_process
					status_cancelled
					status_finished
				}
			}
		`,
		one: gql`
			query document_routes($document_routes: JSON) {
				document_routes(document_routes: $document_routes) {
					id
					name
					routes
					status_in_process
					status_cancelled
					status_finished
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
					routes
					status_in_process
					status_cancelled
					status_finished
				}
			}
		`,
	},
};

let positions = {
	exemplar: "positions",
	table: "positions",
	options: {
		all: {
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
				}
			}
		`,
		one: gql`
			query positions($positions: JSON) {
				positions(positions: $positions) {
					id
					name
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
				}
			}
		`,
	},
};

let userGql = {
	exemplar: "user",
	table: "users",
	options: {},
	select: {
		all: gql`
			query users($users: JSON) {
				users(users: $users) {
					id
					fio
				}
				get_boss_depart(users: $users) {
					id
					username
					fio
					positions
					boss_position_name
				}
			}
		`,
		one: gql`
			query users($users: JSON) {
				users(users: $users) {
					id
					fio
				}
				get_boss_depart(users: $users) {
					id
					username
					fio
					positions
				}
			}
		`,
	},
	subscription: {
		all: gql`
			query users($users: JSON) {
				users(users: $users) {
					id
					fio
				}
				get_boss_depart(users: $users) {
					id
					username
					fio
				}
			}
		`,
	},
};

const { Step } = Steps;

let ModalInsert = React.memo(
	({
		GQL,
		GQL2,
		GQL3,
		GQL4,
		GQL5,
		Form1,
		Form2,
		Form3,
		Form4,
		Form5,
		...props
	}) => {
		const [secondModalVisible, setSecondModalVisible] = useState(false);
		const [thirdModalVisible, setThirdModalVisible] = useState(false);
		const [fourthModalVisible, setFourthModalVisible] = useState(false);
		const [fifthModalVisible, setFifthModalVisible] = useState(false);
		const [sixthModalVisible, setsixthModalVisible] = useState(false);
		const [routeData, setRouteData] = useState();
		const [state, setState] = useState({});

		const user = useUser();

		const [formRouteSelect] = Form.useForm();
		const [visible, setVisible] = useState(false);

		useEffect(() => {
			if (visible && state.route_id != null) {
				formRouteSelect.resetFields();
				setState({ route_id: null });
				setRoutesList([{ positionName: "Тип договора не выбран." }]);
			}
		}, [visible]);

		//modal handling
		const showModalForm1 = () => {
			setSecondModalVisible(true);
		};
		const showModalForm2 = () => {
			setThirdModalVisible(true);
		};
		const showModalForm3 = () => {
			setFourthModalVisible(true);
		};
		const showModalForm4 = () => {
			setFifthModalVisible(true);
		};
		const showModalForm5 = () => {
			setsixthModalVisible(true);
		};
		const handleOk = () => {
			if (state.route_id != null) {
				if (state.route_id == 10) {
					setVisible(false);
					showModalForm1();
				}
				if (state.route_id == 24) {
					setVisible(false);
					showModalForm2();
				}
				if (state.route_id == 26) {
					setVisible(false);
					showModalForm3();
				}
				if (state.route_id == 27) {
					setVisible(false);
					showModalForm4();
				}
				if (state.route_id == 29) {
					if (state.routes && state.routes[0]) {
						formRouteSelect.submit();
						//console.log('formRouteSelect------',formRouteSelect)
						setVisible(false);
						showModalForm5();
					} else
						formRouteSelect.setFields([
							{
								name: "route_id",
								errors: ["Необходимо построить маршрут"],
							},
						]);
				}
			} else
				formRouteSelect.setFields([
					{
						name: "route_id",
						errors: ["Не выбран маршрут"],
					},
				]);
		};

		const handleCancel = () => {
			setSecondModalVisible(false);
			setThirdModalVisible(false);
			setFourthModalVisible(false);
			setFifthModalVisible(false);
			setsixthModalVisible(false);
		};

		const {
			loading: loadingBoss,
			data: dataBoss,
			refetch: refetchBoss,
		} = useQuery(userGql.select.all, {
			variables: {
				users: {
					global: {
						id: `=${user.id}`,
					},
				},
			},
		});
		useEffect(() => {
			refetchBoss();
		}, []);

		//routes manipulation
		const {
			loading: loadingRoutes,
			data: dataRoutes,
			refetch: refetchRoutes,
		} = useQuery(document_routes.select.all, {
			variables: {
				document_routes: {
					global: {
						id: `=${state.route_id}`,
					},
				},
			},
		});

		useEffect(() => {
			if (state.route_id != null) {
				refetchRoutes();
			}
		}, [state]);

		let [routesList, setRoutesList] = useState([
			{ positionName: "Тип договора не выбран." },
		]);
		let routesMap = [];

		useEffect(() => {
			if (
				dataRoutes &&
				dataRoutes[Object.keys(dataRoutes)[0]] != null &&
				state.route_id > 0
			) {
				let boss = dataRoutes.document_routes[0].routes.find((route, index) => {
					//Оповещение о ошибке у данного пользователя нет начальника
					if (dataBoss?.get_boss_depart[0]?.positions[0] == undefined) {
						throw new UserException("У данного пользователя нет начальника");
					}
					return route.positionId == dataBoss?.get_boss_depart[0]?.positions[0];
				});
				let routes = [...dataRoutes.document_routes[0].routes];
				if (boss) {
					let bossRouteData = { ...boss, step: 1 };
					routes.unshift(bossRouteData);
					for (let i = 0; i < routes.length; i++) {
						routes[i].step = i + 1;
						if (
							bossRouteData.positionId == routes[i].positionId &&
							routes[i].step != 1
						) {
							routes.splice(i, 1);
						}
					}
					// console.log("Начальник в маршруте*-*-*-*", boss);
					//console.log("routes!!!!!!!!!!+++", routes);
					setRouteData(routes);
					setRoutesList(routes);
				} else {
					let bossRouteData = {
						positionName: dataBoss.get_boss_depart[0].boss_position_name,
						step: 1,
						positionId: dataBoss.get_boss_depart[0].positions[0],
						statuses: ["5", "2", "4"],
					};
					routes.unshift(bossRouteData);
					for (let i = 0; i < routes.length; i++) {
						routes[i].step = i + 1;
					}
					// console.log("Начальник вне маршрута*-*-*-*", dataBoss);
					//console.log("routes!!!!!!!!!!", routes);
					setRouteData(routes);
					setRoutesList(routes);
				}

				form.setFieldsValue({
					route_id: dataRoutes.document_routes[0].id,
					step: 1,
					status_id: dataRoutes.document_routes[0].status_in_process,
				});
				form2.setFieldsValue({
					route_id: dataRoutes.document_routes[0].id,
					step: 1,
					status_id: dataRoutes.document_routes[0].status_in_process,
				});
				form3.setFieldsValue({
					route_id: dataRoutes.document_routes[0].id,
					step: 1,
					status_id: dataRoutes.document_routes[0].status_in_process,
				});
				form4.setFieldsValue({
					route_id: dataRoutes.document_routes[0].id,
					step: 1,
					status_id: dataRoutes.document_routes[0].status_in_process,
				});
				form5.setFieldsValue({
					route_id: dataRoutes.document_routes[0].id,
					step: 1,
					status_id: dataRoutes.document_routes[0].status_in_process,
				});
				// setRoutesList(routesMap = (dataRoutes.document_routes[0].routes !== undefined )? dataRoutes.document_routes[0].routes.map((item)=>{
				//     return{
				//         positionName:item.positionName
				//     }
				// }) :[])
				// setRouteData(routes);
				// setRouteData(dataRoutes.document_routes[0].routes.filter((el) => { return el.step == 1 }))
			}
		}, [dataRoutes]);

		const [form] = Form.useForm();
		const [form2] = Form.useForm();
		const [form3] = Form.useForm();
		const [form4] = Form.useForm();
		const [form5] = Form.useForm();

		const [insert, { loading }] = handlerMutation(
			useMutation(GQL.insert),
			() => {
				setSecondModalVisible(false);
				form.resetFields();
			}
		)();
		const [insert2, { loading2 }] = handlerMutation(
			useMutation(GQL2.insert),
			() => {
				setThirdModalVisible(false);
				form2.resetFields();
			}
		)();
		const [insert3, { loading3 }] = handlerMutation(
			useMutation(GQL3.insert),
			() => {
				setFourthModalVisible(false);
				form3.resetFields();
			}
		)();
		const [insert4, { loading4 }] = handlerMutation(
			useMutation(GQL4.insert),
			() => {
				setFifthModalVisible(false);
				form4.resetFields();
			}
		)();
		const [insert5, { loading5 }] = handlerMutation(
			useMutation(GQL5.insert),
			() => {
				setsixthModalVisible(false);
				form5.resetFields();
			}
		)();

		//------------------files upload func
		let uploadDocuments = async (files) => {
			//console.log(files);
			const filePromises = files.map((file) => {
				// Return a promise per file
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = async (e) => {
						resolve({ dataFile: e.target.result, fileName: file.name });
					};
					reader.onerror = (error) => {
						reject(error);
					};
					reader.readAsDataURL(file.originFileObj);
				});
			});

			// Wait for all promises to be resolved
			const fileInfos = await Promise.all(filePromises);

			//console.log("COMPLETED");

			// Profit
			return fileInfos;
		};

		const cRef = useRef("displayNone");

		let form5RouteData = useRef();

		return (
			<>
				<Button
					type="primary"
					onClick={() => {
						setVisible(true);
					}}
				>
					<PlusCircleOutlined />
					Создать
				</Button>
				<Modal
					title="Выберите тип договора:"
					onOk={handleOk}
					visible={visible}
					onCancel={() => {
						setVisible(false);
					}}
				>
					<Form
						form={formRouteSelect}
						name="Route_select"
						onFinish={(values) => {
							form5RouteData.current = values.routes;
							//console.log("ROUTE 5", values);
						}}
						onValuesChange={(changedValues, allValues) => {
							setState(Object.assign({}, state, { ...allValues }));
						}}
					>
						<Form.Item
							name="route_id"
							rules={[
								{
									required: true,
									message: "Необходимо выбрать маршрут!",
									whitespace: true,
								},
							]}
						>
							<IndependentSelect
								placeholder="Тип договора"
								title="Выберите тип договора:"
								query={document_routes}
							/>
						</Form.Item>
						<Divider type={"horizontal"} />
						<div className="font-form-header marginTop marginBottom">
							<label>Маршрут:</label>
						</div>
						<Steps size="small" current={0} direction="vertical">
							{routesList.map((item) => {
								if (routesList.length == 4) {
									cRef.current = "displayBlock";
								} else {
									cRef.current = "displayNone";
									return (
										<Step
											title={
												user.admin
													? item.positionName + " - " + user.username
													: item.positionName
											}
										/>
									);
								}
							})}
						</Steps>
						<div className={cRef.current}>
							<span className="marginBottom displayBlock">
								Для создания нового маршрута, укажите все необходимые должности
								в нужном порядке
							</span>
							<Form.List name="routes">
								{(fields, { add, remove }) => (
									<>
										{fields.map((field) => (
											<>
												<Row>
													<Col span={19}>
														<span className="displayFlex">
															<p className="anotherFormSelectCount">
																{field.name + 1}.
															</p>

															<Form.Item
																{...field}
																name={[field.name, "positionId"]}
																fieldKey={[field.fieldKey, "positionId"]}
																className="anotherForm"
																rules={[
																	{
																		required: true,
																		message: "Необходимо для заполнения!",
																	},
																]}
															>
																<IndependentSelect
																	disabled={props.disabled}
																	placeholder="Должность"
																	title="Должность"
																	query={positions}
																	onChange={(value, LabeledValue) => {
																		setState((prevState) => {
																			let old = Object.assign({}, prevState);
																			// //console.log(
																			// 	"field.fieldKey",
																			// 	field.fieldKey
																			// );
																			old.routes[field.name].positionName =
																				LabeledValue.children;
																			old.routes[field.name].step =
																				field.name + 1;
																			old.routes[field.name].statuses = [
																				"5",
																				"4",
																				"2",
																				"7",
																			];
																			return old;
																		});
																	}}
																/>
															</Form.Item>
														</span>
													</Col>
													<Col span={5}>
														<i style={{ marginLeft: "20px" }}>Убрать</i>
														<MinusCircleOutlined
															onClick={() => {
																remove(field.name);
															}}
															disabled={props.disabled}
															style={{ marginLeft: 5 }}
														/>
													</Col>

													<Form.Item
														{...field}
														name={[field.name, "step"]}
														fieldKey={[field.fieldKey, "step"]}
														hidden={true}
													></Form.Item>
													<Form.Item
														{...field}
														name={[field.name, "positionName"]}
														fieldKey={[field.fieldKey, "positionName"]}
														hidden={true}
													></Form.Item>
													<Form.Item
														{...field}
														name={[field.name, "statuses"]}
														fieldKey={[field.fieldKey, "statuses"]}
														hidden={true}
													></Form.Item>
												</Row>
											</>
										))}
										<Button
											type="dashed"
											onClick={() => {
												add();
											}}
											disabled={props.disabled}
											block
										>
											Добавить участника
										</Button>
									</>
								)}
							</Form.List>
						</div>
					</Form>
				</Modal>
				<Modal
					title={props.title}
					visible={secondModalVisible}
					onOk={() => {
						form.submit();
					}}
					onCancel={handleCancel}
					cancelText="Отмена"
					okText="Отправить на согласование"
					centered
					width={props.width ? props.width : 450}
					maskClosable={false}
					destroyOnClose={true}
					confirmLoading={loading ? loading : false}
				>
					<Form1
						form={form}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							values.docs = base64 ? base64 : [];
							values.user_id = user.id;
							values.username = user.username;
							values.position = user.position_names[0];
							values.is_read = false;
							values.fio = user.fio;
							values.route_data = routeData;
							values.positionId = routeData[0].positionId;
							//console.log("Variables", variables);
							variables[GQL.exemplar] = values;
							insert({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={thirdModalVisible}
					onOk={() => {
						form2.submit();
					}}
					onCancel={handleCancel}
					cancelText="Отмена"
					okText="Отправить на согласование"
					centered
					width={props.width ? props.width : 450}
					maskClosable={false}
					destroyOnClose={true}
					confirmLoading={loading ? loading : false}
				>
					<Form2
						form2={form2}
						onFinish2={async (values) => {
							let variables = {};
							let base64 = [];
							await uploadDocuments(values.files.fileList).then((result) => {
								base64 = result;
							});
							values.docs = base64;
							values.user_id = user.id;
							values.username = user.username;
							values.position = user.position_names[0];
							values.is_read = false;
							values.fio = user.fio;
							values.route_data = routeData;
							values.positionId = routeData[0].positionId;
							//console.log("TEST", variables);
							// console.log('TEST', Object.assign(variables,))
							variables[GQL2.exemplar] = values;
							insert2({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={fourthModalVisible}
					onOk={() => {
						form3.submit();
					}}
					onCancel={handleCancel}
					cancelText="Отмена"
					okText="Отправить на согласование"
					centered
					width={props.width ? props.width : 450}
					maskClosable={false}
					destroyOnClose={true}
					confirmLoading={loading ? loading : false}
				>
					<Form3
						form3={form3}
						onFinish3={async (values) => {
							let variables = {};
							let base64 = [];
							await uploadDocuments(values.files.fileList).then((result) => {
								base64 = result;
							});
							values.docs = base64;
							values.user_id = user.id;
							values.username = user.username;
							values.position = user.position_names[0];
							values.is_read = false;
							values.fio = user.fio;

							values.route_data = routeData;

							values.positionId = routeData[0].positionId;
							//console.log("TEST", variables);
							// console.log('TEST', Object.assign(variables,))
							variables[GQL3.exemplar] = values;
							insert3({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={fifthModalVisible}
					onOk={() => {
						form4.submit();
					}}
					onCancel={handleCancel}
					cancelText="Отмена"
					okText="Отправить на согласование"
					centered
					width={props.width ? props.width : 450}
					maskClosable={false}
					destroyOnClose={true}
					confirmLoading={loading ? loading : false}
				>
					<Form4
						form4={form4}
						onFinish4={async (values) => {
							let variables = {};
							let base64 = [];
							await uploadDocuments(values.files.fileList).then((result) => {
								base64 = result;
							});
							values.docs = base64;
							values.user_id = user.id;
							values.username = user.username;
							values.position = user.position_names[0];
							values.is_read = false;
							values.fio = user.fio;
							values.positionId = routeData[0].positionId;
							//console.log("values---", values);
							values.route_data = routeData;
							variables[GQL4.exemplar] = values;
							insert4({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={sixthModalVisible}
					onOk={() => {
						form5.submit();
					}}
					onCancel={handleCancel}
					cancelText="Отмена"
					okText="Отправить на согласование"
					centered
					width={props.width ? props.width : 450}
					maskClosable={false}
					destroyOnClose={true}
					confirmLoading={loading ? loading : false}
				>
					<Form5
						form5={form5}
						onFinish5={async (values) => {
							let variables = {};
							let base64 = [];
							await uploadDocuments(values.files.fileList).then((result) => {
								base64 = result;
							});
							values.route_data = form5RouteData.current;
							// values.route_data = routeData;
							values.docs = base64;
							values.user_id = user.id;
							values.username = user.username;
							values.position = user.position_names[0];
							values.is_read = false;
							values.fio = user.fio;
							values.positionId = routeData[0].positionId;
							//console.log("TEST", variables);
							// console.log('TEST', Object.assign(variables,))
							variables[GQL5.exemplar] = values;
							insert5({ variables });
						}}
					/>
				</Modal>
			</>
		);
	}
);

export default ModalInsert;
