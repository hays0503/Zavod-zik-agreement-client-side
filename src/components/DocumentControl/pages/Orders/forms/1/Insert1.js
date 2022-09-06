import { Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import constants from "../../../../../../config/constants";
import UploadFile from "../../../../modals/UploadFile";

let Insert1 = React.memo((props) => {
	let user = useUser();
	const price_pattern = /^\d+$/;
	const price_max_count = /^.{1,8}$/;
	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.documents[0].id,
				title: props.initialValues.documents[0].title,
				price: props.initialValues.documents[0].data_one[0].price,
				supllier: props.initialValues.documents[0].data_one[0].supllier,
				subject: props.initialValues.documents[0].data_one[0].subject,
				date_created: props.initialValues.documents[0].date_created,
				date_modified: props.initialValues.documents[0].date_modified,
				route_id: props.initialValues.documents[0].route_id.id,
				status_in_process:
					props.initialValues.documents[0].route_id.status_in_process,
				status_id: props.initialValues.documents[0].status_id,
				step: props.initialValues.documents[0].step,
				comments: props.initialValues.documents[0].comments,
				files: props.initialValues.documents[0].files,
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
			name="DocumentsForm"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			<Form.Item
				name="title"
				label="Наименование ТРУ"
				labelCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Наименование ТРУ" />
			</Form.Item>
			<Form.Item
				name="supllier"
				label="Поставщик ТРУ"
				labelCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
			</Form.Item>
			<Form.Item
				name="subject"
				label="Основание"
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
					placeholder="Основание"
				/>
			</Form.Item>
			<Form.Item
				name="price"
				label="Общая сумма договора"
				labelCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
					{
						pattern: price_pattern,
						message: "Можно использовать только цифры!",
					},
					{
						pattern: price_max_count,
						message: "Общая сумма договора не должна превышать 99999999",
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Общая сумма договора" />
			</Form.Item>
			<Form.Item
				name="files"
				label="Файлы"
				labelCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: "Необходимо загрузить хотя бы один файл.",
					},
				]}
			>
				<UploadFile
					showUploadList={true}
					action={
						"https://" +
						constants.host +
						":" +
						constants.port +
						"/document-control/orders"
					}
					multiple={true}
					maxCount={50}
					/*accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}*/
					onChange={(info) => {
						const { status } = info.file;
						if (status !== "uploading") {
							console.log("info.file", info.file, info.fileList);
						}
						if (status === "done") {
							message.success(`${info.file.name} - загружен успешно.`);
						} else if (status === "error") {
							message.error(`${info.file.name} - ошибка при загрузке.`);
						}
					}}
				/>
			</Form.Item>
			<Form.Item name="date_created" hidden={true}></Form.Item>
			<Form.Item name="route_id" hidden={true}></Form.Item>
			<Form.Item name="status_id" hidden={true}></Form.Item>
			<Form.Item name="step" hidden={true}></Form.Item>
			<Form.Item name="log_username" hidden={true}></Form.Item>
		</Form>
	);
});

export default Insert1;
