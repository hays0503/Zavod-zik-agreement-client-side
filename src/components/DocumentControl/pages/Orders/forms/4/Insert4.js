import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { FragmentInputBoxCounteragentContacts, FragmentInputBoxCurrency, FragmentInputBoxExecutorNameDivision, FragmentInputBoxExecutorPhoneNumber, FragmentInputBoxPrice, FragmentInputBoxSubjectRadio, FragmentInputBoxTitle } from "../../../fragments/FragmentInputBox";

let Insert4 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues4?.documents[0];

	let user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form4.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,

				price: iniValue.data_agreement_list_internal_needs[0].price,
				subject: iniValue.data_agreement_list_internal_needs[0].subject,
				currency: iniValue.data_agreement_list_internal_needs[0].currency,
				executor_name_division:
					iniValue.data_agreement_list_internal_needs[0].executor_name_division,
				executor_phone_number:
					iniValue.data_agreement_list_internal_needs[0].executor_phone_number,
				counteragent_contacts:
					iniValue.data_agreement_list_internal_needs[0].counteragent_contacts,

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
		props.onFinish4(state);
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
				ЛИСТ СОГЛАСОВАНИЯ НА ЗАКУП ТРУ ДЛЯ ВНУТРИЗАВОДСКИХ НУЖД И КАПИТАЛЬНЫХ
				ЗАТРАТ
			</h4>

			<FragmentInputBoxTitle
				label={"Наименование контрагента"}
				placeholder={"Наименование контрагента"}
			/>

			<FragmentInputBoxSubjectRadio
				label={"Предмет договора"}
				placeholder={"Предмет договора"}
			/>

            <FragmentInputBoxPrice
                label={"Общая сумма договора"}
                placeholder={"Общая сумма договора"}
            />

            <FragmentInputBoxCurrency
                label={"Валюта платежа"}
                placeholder={"Валюта платежа"}
            />

            <FragmentInputBoxExecutorNameDivision
                label={"Наименование подразделения, фамилия ответственного исполнителя"}
                placeholder={"Наименование подразделения, фамилия ответственного исполнителя"}
            />

            <FragmentInputBoxExecutorPhoneNumber
                label={"Телефон исполнителя"}
                placeholder={"Телефон исполнителя"}
            />

            <FragmentInputBoxCounteragentContacts
                label={"Контакты контрагента"}
                placeholder={"Контакты контрагента"}
            />

			<FragmentUploader url={"/document-control/orders"} />

			<FragmentAnyItems />

		</Form>
	);
});

export default Insert4;
