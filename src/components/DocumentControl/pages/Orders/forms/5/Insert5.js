import { Alert, Form, Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import {
	FragmentInputBoxRemark,
	FragmentInputBoxTitle,
} from "../../../fragments/FragmentInputBox";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentInputBoxSubject } from "./../../../fragments/FragmentInputBox";
import { FragmentTableInput } from "./../../../fragments/FragmentTableInput";

let Insert5 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues5?.documents[0];

	let user = useUser();

	const [state, setState] = useState({
		log_username: user.username,
	});

	// const [error, setError] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const openNotificationWithIcon = (type) => {
		api[type]({
			message: "Ошибка !",
			description: "Одно из полей пустое...",
		});
	};

	useEffect(() => {
		props.form5.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,

				subject: iniValue.data_custom[0].subject,
				remark: iniValue.data_custom[0].remark,
				custom_area: iniValue.data_custom[0].custom_area,

				date_created: iniValue.date_created,
				date_modified: iniValue.date_modified,
				route_id: iniValue.route_id.id,
				status_in_process: iniValue.route_id.status_in_process,
				status_id: iniValue.status_id,
				step: iniValue.step,
				comments: iniValue.comments,
				files: iniValue.files,
				log_username: state.log_username,
			});
		}
	}, [iniValue]);

	let onFinish = (values) => {
		if (values.custom_area != null) {
			const custom_area = values.custom_area.filter((item) => {
				if (item.key !== "" && item.data !== "") {
					return true;
				} else {
					openNotificationWithIcon("error");
					return false;
				}
			});
			console.log("console.log(newState)", {
				...state,
				custom_area: custom_area,
			});
			props.onFinish5({
				...state,
				custom_area: custom_area,
			});
		} else {
			console.log("console.log(newState)", {
				...state,
				custom_area: null,
			});
			props.onFinish5({
				...state,
				custom_area: null,
			});
		}
	};

	return (
		<Form
			form={props.form5}
			name="DocumentsForm5"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			{contextHolder}

			<FragmentInputBoxTitle
				label={"Наименование"}
				placeholder={"Наименование"}
			/>

			<FragmentInputBoxRemark label={"Примечание"} placeholder={"Примечание"} />

			<FragmentInputBoxSubject label={"Основание"} placeholder={"Основание"} />

			<FragmentTableInput form={props.form5} />

			<FragmentUploader url={"/document-control/orders"} />

			{/* <Alert
				message="Ошибка !"
				description="Одно из полей пустое..."
				type="error"
				onClose={setError(false)}
				
			/> */}

			{/* {error && (
				<Alert
					message="Ошибка !"
					description="Одно из полей пустое..."
					type="error"
					action={
						<Button size="small" danger onClick={setError(false)}>
							Закрыть
						</Button>
					}
				/>
			)} */}

			<FragmentAnyItems />
		</Form>
	);
});

export default Insert5;
