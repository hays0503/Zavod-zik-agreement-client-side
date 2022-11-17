import { EyeOutlined } from "@ant-design/icons";
import {
	Button,
	Form,
	Input,
	Typography,
	Space,
	Divider,
	Row,
	Col,
	Steps,
	message,
} from "antd";
import React, { useEffect, useState } from "react";
import constants from "../../../../../../config/constants";
import { useUser, formatDate } from "../../../../../../core/functions";
import UploadFile from "../../../../modals/UploadFile";

//pop confirm
import FromUserEditToApproveConfirm from "./dialogs/FromUserEditToApproveConfirm";
import DeleteFile from "../../common/DeleteFile";

const { Title, Link } = Typography;
const { Step } = Steps;

const price_pattern = /^\d+$/;

let Update1 = React.memo((props) => {
	let user = useUser();

	const [state, setState] = useState({
		log_username: user.username,
	});

	let OpenDocument = async (item) => {
		// setBtnLoad(true)
		//console.log("PROPS", item.id)
		// console.log('RECORD',props.record)
		const tmp = await fetch("/api/files", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ item }),
		});
		const content = await tmp.json();
		if (content != undefined) {
			//console.log("RESULT", content);
		}
	};

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	let [stepCount, setStepCount] = useState({ step: "0" });
	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.documents[0].id,
				title: props.initialValues.documents[0].title,
				position: props.initialValues.documents[0].position,
				username: props.initialValues.documents[0].username,
				fio: props.initialValues.documents[0].fio,

				price: props.initialValues.documents[0].data_one[0].price,
				supllier: props.initialValues.documents[0].data_one[0].supllier,
				subject: props.initialValues.documents[0].data_one[0].subject,

				date_created: props.initialValues.documents[0].date_created,
				date_modified: props.initialValues.documents[0].date_modified,
				route_id: props.initialValues.documents[0].route_id.id,
				status_in_process:
					props.initialValues.documents[0].route_id.status_in_process,
				status_cancelled:
					props.initialValues.documents[0].route_id.status_cancelled,
				status_finished:
					props.initialValues.documents[0].route_id.status_finished,
				status_id: props.initialValues.documents[0].status_id,
				route: props.initialValues.documents[0].route_data,
				step: props.initialValues.documents[0].step,
				comments: props.initialValues.documents[0].comments,
				signatures: props.initialValues.documents[0].signatures,
				files: props.initialValues.documents[0].files,
				//document_logs: props.initialValues.documents[0].document_logs,
				document_logs: { is_read: true },
				log_username: state.log_username,
			});
			//console.log("props.initialValues", props.initialValues);
			setStepCount({ step: props.initialValues.documents[0].step });
			setRoutesList(props.initialValues.documents[0].route_data);
		}
	}, [props.initialValues]);

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

	let onFinish = (values) => {
		props.onFinish(state);
		//console.log("+++++++++++++++++++++++", values);
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
			<b>От:</b> {props?.initialValues?.documents[0].fio} <br />
			<b>Должность:</b> {props?.initialValues?.documents[0].position}
			{/* Закуп ТРУ */}
			<h4>
				<b>Тип договора:</b> {props?.initialValues?.documents[0].route_id.name}
			</h4>
			<Divider type={"horizontal"} />
			<Form.Item
				name="title"
				label="Наименование ТРУ"
				labelCol={{ span: 24 }}
				className="form-input-label"
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
				className="form-input-label"
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
				className="form-input-label"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Основание" />
			</Form.Item>
			<Form.Item
				name="price"
				label="Общая сумма договора"
				labelCol={{ span: 24 }}
				className="form-input-label"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
					{
						pattern: price_pattern,
						message: "Можно использовать только цифры!",
					},
				]}
			>
				<Input disabled={props.disabled} placeholder="Общая сумма договора" />
			</Form.Item>
			<Divider type={"horizontal"} />
			<Form.Item
				name="files"
				className="font-form-header"
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
					onChange={(info) => {
						const { status } = info.file;
						if (status !== "uploading") {
							//console.log("info.file", info.file, info.fileList);
						}
						if (status === "done") {
							message.success(`${info.file.name} - загружен успешно.`);
						} else if (status === "error") {
							message.error(`${info.file.name} - ошибка при загрузке.`);
						}
					}}
				/>
			</Form.Item>
			{props?.initialValues?.documents[0].files.map((item) => {
				return (
					<>
						<div className="document-view-wrap">
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
							<DeleteFile
								item={item}
								dataProps={props}
								setState={setState}
								user={user}
							/>
							<br />
						</div>
					</>
				);
			})}
			<Divider type={"horizontal"} />
			<Form.Item
				className="font-form-header"
				name="signatures"
				label="Подписи"
				labelCol={{ span: 24 }}
			>
				{props?.initialValues?.documents[0].signatures.map((item) => {
					//remove commentsList
					return (
						<>
							<div className="signature-view-wrap">
								<span className="signature-view-position">{item.position}</span>
								<span className="signature-view-username">{item.fio}</span>
								<span className="signature-view-date">
									{formatDate(item.date_signature)}
								</span>
							</div>
						</>
					);
				})}
				<Steps
					labelPlacement="vertical"
					size="small"
					current={stepCount.step - 1}
					className="steps-form-update"
				>
					{routesList.map((item) => {
						return <Step title={item.positionName} />;
					})}
				</Steps>
			</Form.Item>
			<Divider type={"horizontal"} />
			<Form.Item
				className="font-form-header"
				name="reason"
				label="Замечание"
				labelCol={{ span: 24 }}
			></Form.Item>
			<div>
				{props?.initialValues?.documents[0]?.reason?.map((item) => {
					return (
						<span>
							<span>{item.text + "-" + item.userPosition}</span>
							<br />
						</span>
					);
				})}
			</div>
			<Row>
				<Col span={24}>
					<Divider type={"horizontal"} />
					<FromUserEditToApproveConfirm
						dataProps={props}
						setState={setState}
						user={user}
					/>
				</Col>
				<Col span={24} className="marginTop">
					<Button onClick={props.modalCancelHandler}>Отменить</Button>
					<Divider type={"vertical"} />
					<Button onClick={props.modalEnableEditHandler}>Редактировать</Button>
				</Col>
			</Row>
			<Divider type={"horizontal"} />
			<Form.Item
				className="font-form-header"
				name="comments"
				label="Комментарии"
				labelCol={{ span: 24 }}
			>
				<Input.TextArea
					rows={7}
					name="comment"
					onChange={props.HandleCommentOnChange}
					disabled={props.disabled}
				/>
				<Button
					disabled={props.disabled}
					onClick={props.HandleComment}
					className="marginTop"
				>
					Оставить комментарий
				</Button>
				{props.commentsList.map((item) => {
					return (
						<div className="comments">
							<li className="comment-item">
								<span className="user-position-comment">{item.position}</span>
								<span className="user-name-comment"> ({item.fio}) </span>
								<span className="user-date-time-comment">{item.date}</span>
								<br />
								<span className="comment">{item.comment}</span>
							</li>
						</div>
					);
				})}
			</Form.Item>
			<Form.Item name="date_created" hidden={true}></Form.Item>
			<Form.Item name="route_id" hidden={true}></Form.Item>
			<Form.Item name="status_id" hidden={true}></Form.Item>
			<Form.Item name="step" hidden={true}></Form.Item>
			<Form.Item name="log_username" hidden={true}></Form.Item>
		</Form>
	);
});

export default Update1;
