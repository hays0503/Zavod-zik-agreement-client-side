import { EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Button, Form, Modal, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import {
	handlerQuery,
	handlerMutation,
	useUser,
} from "../../../../../core/functions";

let ModalUpdate = React.memo(
	({
		GQL,
		GQL2,
		GQL3,
		GQL4,
		GQL5,
		UpdateForm,
		UpdateForm2,
		UpdateForm3,
		UpdateForm4,
		UpdateForm5,
		...props
	}) => {
		const document = {
			exemplar: "document",
			table: "documents",
			options: {
				all: {
					variables: {
						documents: {
							global: {
								id: `=${props.selectedRowKeys[1]}`,
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
								custom_area
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
								custom_area
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
								data_custom {
									id
									document_id
									subject
									remark
									custom_area
								}
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

		let uploadDocuments = async (files) => {
			console.log(files);
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

			console.log("COMPLETED");

			// Profit
			return fileInfos;
		};

		const [form] = Form.useForm();
		const [form2] = Form.useForm();
		const [form3] = Form.useForm();
		const [form4] = Form.useForm();
		const [form5] = Form.useForm();

		const [viewMode, setViewMode] = useState(true);
		const [visible, setVisible] = props.visibleModalUpdate
			? props.visibleModalUpdate
			: [];
		const [visible2, setVisible2] = props.visibleModalUpdate2
			? props.visibleModalUpdate2
			: [];
		const [visible3, setVisible3] = props.visibleModalUpdate3
			? props.visibleModalUpdate3
			: [];
		const [visible4, setVisible4] = props.visibleModalUpdate4
			? props.visibleModalUpdate4
			: [];
		const [visible5, setVisible5] = props.visibleModalUpdate5
			? props.visibleModalUpdate5
			: [];

		let variables1 = {};
		variables1[GQL.table] = GQL.table
			? { global: { id: `= ${props.selectedRowKeys[0]}` } }
			: {};

		const {
			loading: loadingOne,
			data,
			refetch,
		} = handlerQuery(GQL, "one", { variables1 })();
		const {
			loading: loadingTwo,
			data: data2,
			refetch: refetch2,
		} = handlerQuery(GQL, "one", { variables1 })();
		const {
			loading: loadingThree,
			data: data3,
			refetch: refetch3,
		} = handlerQuery(GQL, "one", { variables1 })();
		const {
			loading: loadingFour,
			data: data4,
			refetch: refetch4,
		} = handlerQuery(GQL, "one", { variables1 })();
		const {
			loading: loadingFive,
			data: data5,
			refetch: refetch5,
		} = handlerQuery(GQL, "one", { variables1 })();

		useEffect(() => {
			if (visible) {
				refetch(variables1);
			}
		}, [visible]);
		useEffect(() => {
			if (visible2) {
				refetch2(variables1);
			}
		}, [visible2]);
		useEffect(() => {
			if (visible3) {
				refetch3(variables1);
			}
		}, [visible3]);
		useEffect(() => {
			if (visible4) {
				refetch4(variables1);
			}
		}, [visible4]);
		useEffect(() => {
			if (visible5) {
				refetch5(variables1);
			}
		}, [visible5]);

		//------------documents
		let documentVariables = {
			documents: {
				global: {
					id: `=${props.selectedRowKeys[1]}`,
					ORDER_BY: ["date_created desc"],
				},
			},
		};
		const {
			loading: loadingData,
			data: documentData,
			refetch: refetchData,
		} = handlerQuery(document, "one", { variables1 })();
		const {
			loading: loadingData2,
			data: documentData2,
			refetch: refetchData2,
		} = handlerQuery(document, "one", { variables1 })();
		const {
			loading: loadingData3,
			data: documentData3,
			refetch: refetchData3,
		} = handlerQuery(document, "one", { variables1 })();
		const {
			loading: loadingData4,
			data: documentData4,
			refetch: refetchData4,
		} = handlerQuery(document, "one", { variables1 })();
		const {
			loading: loadingData5,
			data: documentData5,
			refetch: refetchData5,
		} = handlerQuery(document, "one", { variables1 })();

		useEffect(() => {
			if (visible) {
				refetchData(documentVariables);
			}
		}, [visible]);
		useEffect(() => {
			if (visible2) {
				refetchData2(documentVariables);
			}
		}, [visible2]);
		useEffect(() => {
			if (visible3) {
				refetchData3(documentVariables);
			}
		}, [visible3]);
		useEffect(() => {
			if (visible4) {
				refetchData4(documentVariables);
			}
		}, [visible4]);
		useEffect(() => {
			if (visible5) {
				refetchData5(documentVariables);
			}
		}, [visible5]);

		//------------mutations
		const [update, { loading: loadingUpdate }] = handlerMutation(
			useMutation(GQL.update),
			() => {
				setVisible(false);
			}
		)();
		return (
			<>
				<Button
					type="primary"
					disabled={props.selectedRowKeys.length !== 2}
					onClick={() => {
						setVisible(true);
					}}
				>
					<EyeOutlined />
					Просмотр
				</Button>
				<Modal
					title={props.title}
					visible={visible}
					width={600}
					onCancel={() => {
						setVisible(false);
						setViewMode(true);
					}}
					footer={null}
				>
					<UpdateForm
						document={documentData?.documents[0]}
						initialValues={data}
						form={form}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							setVisible(false);
							variables[GQL.exemplar] = {
								id: props.selectedRowKeys[0],
								status: 2,
								user_id: values.user_id_created,
								docs: base64 ? base64 : [],
								report: values.report,
							};
							console.log("variables-------123", variables);
							update({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={visible2}
					width={600}
					onCancel={() => {
						setVisible2(false);
						setViewMode(true);
					}}
					footer={null}
				>
					<UpdateForm2
						document={documentData2?.documents[0]}
						initialValues={data2}
						form={form2}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							setVisible2(false);
							variables[GQL.exemplar] = {
								id: props.selectedRowKeys[0],
								status: 2,
								user_id: values.user_id_created,
								docs: base64 ? base64 : [],
								report: values.report,
							};
							console.log("variables-------123", variables);
							update({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={visible3}
					width={900}
					onCancel={() => {
						setVisible3(false);
						setViewMode(true);
					}}
					footer={null}
				>
					<UpdateForm3
						document={documentData3?.documents[0]}
						initialValues={data3}
						form={form3}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							setVisible3(false);
							variables[GQL.exemplar] = {
								id: props.selectedRowKeys[0],
								status: 2,
								user_id: values.user_id_created,
								docs: base64 ? base64 : [],
								report: values.report,
							};
							console.log("variables-------123", variables);
							update({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={visible4}
					width={900}
					onCancel={() => {
						setVisible4(false);
						setViewMode(true);
					}}
					footer={null}
				>
					<UpdateForm4
						document={documentData4?.documents[0]}
						initialValues={data4}
						form={form4}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							setVisible4(false);
							variables[GQL.exemplar] = {
								id: props.selectedRowKeys[0],
								status: 2,
								user_id: values.user_id_created,
								docs: base64 ? base64 : [],
								report: values.report,
							};
							console.log("variables-------123", variables);
							update({ variables });
						}}
					/>
				</Modal>
				<Modal
					title={props.title}
					visible={visible5}
					width={900}
					onCancel={() => {
						setVisible5(false);
						setViewMode(true);
					}}
					footer={null}
				>
					<UpdateForm5
						document={documentData5?.documents[0]}
						initialValues={data5}
						form={form5}
						onFinish={async (values) => {
							let variables = {};
							let base64 = [];
							if (values?.files?.fileList) {
								await uploadDocuments(values.files.fileList).then((result) => {
									base64 = result;
								});
							}
							setVisible5(false);
							variables[GQL.exemplar] = {
								id: props.selectedRowKeys[0],
								status: 2,
								user_id: values.user_id_created,
								docs: base64 ? base64 : [],
								report: values.report,
							};
							console.log("variables-------123", variables);
							update({ variables });
						}}
					/>
				</Modal>
			</>
		);
	}
);

export default ModalUpdate;
