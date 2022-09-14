import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import {
	FragmentInputBoxPrice,
	FragmentInputBoxSupllier,
	FragmentInputBoxTitle,
} from "../../../fragments/FragmentInputBox";
import { FragmentInputBoxSubject } from "./../../../fragments/FragmentInputBox";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";

let Insert1 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues?.documents[0];
	console.log('props-----------------',props)
	let user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				price: iniValue.data_one[0].price,
				supllier: iniValue.data_one[0].supllier,
				subject: iniValue.data_one[0].subject,
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
			<FragmentInputBoxTitle
				label={"Наименование ТРУ"}
				placeholder={"Наименование ТРУ"}
			/>

			<FragmentInputBoxSupllier
				label={"Поставщик ТРУ"}
				placeholder={"Поставщик ТРУ"}
			/>

			<FragmentInputBoxSubject label={"Основание"} placeholder={"Основание"} />

			<FragmentInputBoxPrice
				label={"Общая сумма договора"}
				placeholder={"Общая сумма договора"}
			/>

			<FragmentUploader url={"/document-control/orders"} />

			<FragmentAnyItems />
		</Form>
	);
});

export default Insert1;
