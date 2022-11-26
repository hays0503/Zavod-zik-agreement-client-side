import { Button, Form, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewer } from "../../../fragments/FragmentStepViewer";
import PrintContainer4 from "./PrintContainer4";

let Update4 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues4?.documents[0];
	/**
	  * Деструктаризация (Специфичные данные для Листа согласования на закуп ТРУ для внутризаводских
				нужд и капитальных затрат )
	  */
	const iniValDataAgreeListInternal =
		props?.initialValues4?.documents[0]?.data_agreement_list_internal_needs[0];
	/**
	 * Деструктаризация (начального значение из таблиц Route(движение документов))
	 */
	const iniValRoute = props?.initialValues4?.documents[0]?.route_id;

	//////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
	 */

	//////////////////////
	let user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});
	/////////////////////////////

	/**
	 * Cтейт для таблиц файлов по поручением
	 */
	const [FileTask, setFileTask] = useState([]);

	//TODO: Сделать просмотр отправленных поручений
	const [ReRender, setRerender] = useState(false);
	useEffect(() => {
		if (iniValue?.id) {
			GetIDNameTaskFile(iniValue?.id).then((value) => {
				setFileTask(value.result);
			});
		}
	}, [iniValue, ReRender]);
	//////////////////////////////////////////////////////////////////////////////////////////

	//Направление для вывода согласованых подписей (круги)
	const stepsDirection = useRef("vertical");

	useEffect(() => {
		props.form4.setFieldsValue(state);
	}, [state]);

	//TODO: Возможно будет хорошей идеей убрать его из "одинокого стейта и перенести в общий" т.к тип договора не меняется
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);

	let [stepCount, setStepCount] = useState({ step: "0" });

	useEffect(() => {
		if (props.initialValues4) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,
				price: iniValDataAgreeListInternal?.price,
				subject: iniValDataAgreeListInternal?.subject,
				currency: iniValDataAgreeListInternal?.currency,
				executor_name_division:
					iniValDataAgreeListInternal?.executor_name_division,
				executor_phone_number:
					iniValDataAgreeListInternal?.executor_phone_number,
				counteragent_contacts:
					iniValDataAgreeListInternal?.counteragent_contacts,
				date_created: iniValue.date_created,
				date_modified: iniValue.date_modified,
				route_id: iniValRoute.id,
				status_in_process: iniValRoute.status_in_process,
				status_cancelled: iniValRoute.status_cancelled,
				status_finished: iniValRoute.status_finished,
				//Установить статус на доработку (для кнопки "Оправка на регистрацию")
				status_id: "8",
				route: iniValue.route_data,
				step: iniValue.step,
				comments: iniValue.comments,
				signatures: iniValue.signatures,
				files: iniValue.files,
				log_username: state.log_username,
			});
			setStepCount({ step: iniValue.step });
			setRoutesList(iniValue.route_data);
		}
	}, [props.initialValues4]);

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
			{/* Лист согласования на закуп ТРУ для внутризаводских
				нужд и капитальных затрат */}
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Тип договора: ", iniValue?.route_id?.name)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Наименование контрагента: ", state?.title)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Предмет договора: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Валюта платежа: ", state?.currency)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Наименование подразделения, фамилия ответственного исполнителя: ",
					state?.executor_name_division
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Телефон исполнителя: ", state?.executor_phone_number)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Контакты контрагента: ", state?.counteragent_contacts)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{iniValue?.files !== undefined && FileTask !== undefined ? (
				<FragmentTaskAndFileViewer
					files={iniValue?.files}
					files_task={FileTask}
					userId={user.id}
				/>
			) : (
				<h1>Загрузка</h1>
			)}
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<h3>
				<b>Файл согласованного договора</b>
			</h3>
			<PrintContainer4 documentData={iniValue} />
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			{/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
			{iniValue?.signatures !== undefined ? (
				<FragmentStepViewer
					signatures={iniValue?.signatures}
					stepsDirection={stepsDirection.current}
					step={stepCount.step - 1}
					routesList={routesList}
				/>
			) : (
				<h1>Загрузка</h1>
			)}
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* ///////////Отправить на регистрацию////////////// */}
			<Button type="primary" htmlType="submit">
				Отправить на регистрацию
			</Button>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			{/* Фрагмент antd для вывода Замечаний по документу */}
			<FragmentReasonsViewer Reason={iniValue?.reason} />
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
			<FragmentCommentsViewer commentsList={iniValue?.comments} />
			{/* /////////////////////////////////// */}
			{/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
			<FragmentAnyItems />
			{/* /////////////////////////////////// */}
		</Form>
	);
});

export default Update4;
