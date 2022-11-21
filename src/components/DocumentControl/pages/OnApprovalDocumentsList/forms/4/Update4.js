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
} from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";

let Update4 = React.memo((props) => {
	let user = useUser();
	const price_pattern = /^\d+$/;
	const { Title, Link } = Typography;
	const { Step } = Steps;

	const [state, setState] = useState({
		log_username: user.username,
	});

	let OpenDocument = async (item) => {
		const tmp = await fetch("/api/files", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user: Number(user.id), item: item.id }),
		});
		const content = await tmp.json();
		if (content != undefined) {
			//console.log("RESULT", content)
		}
	};

	useEffect(() => {
		props.form4.setFieldsValue(state);
	}, [state]);
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	let [stepCount, setStepCount] = useState({ step: "0" });
	useEffect(() => {
		if (props.initialValues4) {
			setState({
				id: props.initialValues4.documents[0].id,
				title: props.initialValues4.documents[0].title,
				position: props.initialValues4.documents[0].position,
				username: props.initialValues4.documents[0].username,
				fio: props.initialValues4.documents[0].fio,

				price:
					props.initialValues4.documents[0]
						?.data_agreement_list_internal_needs[0]?.price,
				subject:
					props.initialValues4.documents[0]
						?.data_agreement_list_internal_needs[0]?.subject,
				currency:
					props.initialValues4.documents[0]
						?.data_agreement_list_internal_needs[0]?.currency,
				executor_name_division:
					props.initialValues4.documents[0]
						?.data_agreement_list_internal_needs[0]?.executor_name_division,
				executor_phone_number:
					props.initialValues4.documents[0]
						?.data_agreement_list_internal_needs[0]?.executor_phone_number,
				counteragent_contacts:
					props?.initialValues4.documents[0]
						.data_agreement_list_internal_needs[0]?.counteragent_contacts, //console.logalues4.documents[0]

				date_created: props.initialValues4.documents[0].date_created,
				date_modified: props.initialValues4.documents[0].date_modified,
				route_id: props.initialValues4.documents[0].route_id.id,
				status_in_process:
					props.initialValues4.documents[0].route_id.status_in_process,
				status_cancelled:
					props.initialValues4.documents[0].route_id.status_cancelled,
				status_finished:
					props.initialValues4.documents[0].route_id.status_finished,
				status_id: props.initialValues4.documents[0].status_id,
				route: props.initialValues4.documents[0].route_data,
				step: props.initialValues4.documents[0].step,
				comments: props.initialValues4.documents[0].comments,
				signatures: props.initialValues4.documents[0].signatures,
				files: props.initialValues4.documents[0].files,
				log_username: state.log_username,
			});
			setStepCount({ step: props.initialValues4.documents[0].step });
			setRoutesList(props.initialValues4.documents[0].route_data);
		}
	}, [props.initialValues4]);

	let onFinish = (values) => {
		props.onFinish4(state);
		//console.log("+++++++++++++++++++++++", values);
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

	let radioOptions = [
		{ label: "Закупки товаров, работ и услуг", value: "1" },
		{
			label: "Поставка продукции (выполнение работ, оказание услуг) заказчикам",
			value: "2",
		},
		{
			label: "Передача имущества в аренду (бесплатное пользование)",
			value: "3",
		},
		{ label: "Совместная деятельность", value: "4" },
		{
			label:
				"Финансирование (кредитование, обеспечение исполнения обязательств)",
			value: "5",
		},
		{ label: "Прочие обязательства", value: "6" },
	];
	const [radioState, setRadioState] = useState(
		props?.initialValues4?.documents[0]?.data_agreement_list_internal_needs[0]
			?.subject
	);

	const RadioOnChange = (radioValue) => {
		setRadioState(radioValue.target.value);
	};

	return (
		<Form
			form={props.form4}
			name="DocumentsForm4"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			<h4>
				{/*Лист согласования на реализацию готовой продукции*/}
				<b>Тип договора:</b> {props?.initialValues4?.documents[0].route_id.name}
			</h4>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Наименование контрагента:</Col>{" "}
					<Col span={12}>{state.title}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Предмет договора:</Col>{" "}
					<Col span={12}>{state.subject}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Общая сумма договора:</Col>{" "}
					<Col span={12}>{state.price}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Валюта платежа:</Col>{" "}
					<Col span={12}>{state.currency}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>
						Наименование подразделения, фамилия ответственного исполнителя:
					</Col>{" "}
					<Col span={12}>{state.executor_name_division}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Телефон исполнителя:</Col>{" "}
					<Col span={12}>{state.executor_phone_number}</Col>
				</Row>
			</div>
			<div className="form-item-wrap">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>Контакты контрагента:</Col>{" "}
					<Col span={12}>{state.counteragent_contacts}</Col>
				</Row>
			</div>
			<Divider type={"horizontal"} />
			<Form.Item
				name="files"
				className="font-form-header"
				label="Файлы"
				labelCol={{ span: 24 }}
			>
				{props?.initialValues4?.documents[0].files.map((item) => {
					return (
						<>
							<div className="document-view-wrap">
								<Link>
									<a data-fileid={item.id} onClick={download}>
										{item.filename}
									</a>
								</Link>{" "}
								<Button
									onClick={() => {
										OpenDocument(item);
									}}
									shape="circle"
									icon={<EyeOutlined />}
								/>{" "}
								<br />
							</div>
						</>
					);
				})}
			</Form.Item>
			<Divider type={"horizontal"} />
			<Form.Item
				className="font-form-header"
				name="signatures"
				label="Подписи"
				labelCol={{ span: 24 }}
			>
				{props?.initialValues4?.documents[0].signatures.map((item) => {
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
				{props?.initialValues4?.documents[0]?.reason?.map((item) => {
					return (
						<span>
							<span>{item.text + "-" + item.userPosition}</span>
							<br />
						</span>
					);
				})}
			</div>
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
				/>
				<Button onClick={props.HandleComment} className="marginTop">
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

export default Update4;
