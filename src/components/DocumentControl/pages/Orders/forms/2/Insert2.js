import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import {
	FragmentInputBoxCurrencyPrice,
	FragmentInputBoxExecutorNameDivision,
	FragmentInputBoxExecutorReceivedFromCounteragentDate,
	FragmentInputBoxExecutorSiderSignaturesDate,
	FragmentInputBoxPrice,
	FragmentInputBoxSubjectRadio,
	FragmentInputBoxTitle,
} from "../../../fragments/FragmentInputBox";
import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";
import FragmentUploader from "./../../../fragments/FragmentUploader";

let Insert2 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues2?.documents[0];

	let user = useUser();
	const price_pattern = /^\d+$/;
	const price_max_count = /^.{1,8}$/;
	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form2.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				price: iniValue.data_agreement_list[0].price,
				subject: iniValue.data_agreement_list[0].subject,
				currency_price: iniValue.data_agreement_list[0].currency_price,
				executor_name_division:
					iniValue.data_agreement_list[0].executor_name_division,
				sider_signatures_date:
					iniValue.data_agreement_list[0].sider_signatures_date,
				received_from_counteragent_date:
					iniValue.data_agreement_list[0].received_from_counteragent_date,
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
		props.onFinish2(state);
	};

	return (
		<Form
			form={props.form2}
			name="DocumentsForm2"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			<h4>ЛИСТ СОГЛАСОВАНИЯ НА РЕАЛИЗАЦИЮ ГОТОВОЙ ПРОДУКЦИИ</h4>

			<FragmentInputBoxTitle
				label={"Наименование контрагента"}
				placeholder={"Наименование контрагента"}
			/>

			<FragmentInputBoxSubjectRadio
				label={"Предмет договора"}
				placeholder={"Предмет договора"}
			/>

			<FragmentInputBoxPrice
				label={"Общая сумма договора в валюте цены договора"}
				placeholder={"Общая сумма договора в валюте цены договора"}
			/>

			<FragmentInputBoxCurrencyPrice
				label={"Общая сумма договора в тенге, по курсу НБ РК"}
				placeholder={"Общая сумма договора в тенге, по курсу НБ РК"}
			/>

			<FragmentInputBoxExecutorNameDivision
				label={"Наименование подразделения, фамилия ответственного исполнителя"}
				placeholder={
					"Наименование подразделения, фамилия ответственного исполнителя"
				}
			/>

			<FragmentInputBoxExecutorSiderSignaturesDate
				label={
					"Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента"
				}
				placeholder={
					"Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента"
				}
			/>

			<FragmentInputBoxExecutorReceivedFromCounteragentDate
				label={
					"Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента"
				}
				placeholder={
					"Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента"
				}
			/>

			<FragmentUploader url={"/document-control/orders"} />

			<FragmentAnyItems />
		</Form>
	);
});

export default Insert2;
