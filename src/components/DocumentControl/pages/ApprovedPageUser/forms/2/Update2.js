import { Button, Form, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import PrintContainer2 from "./PrintContainer2";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentStepViewer } from "../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";

let Update2 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues2?.documents[0];
	/**
	 * Деструктаризация (Специфичные данные для Листа согласования на реализацию готовой продукции)
	 */
	const iniValDataAgreeList =
		props?.initialValues2?.documents[0]?.data_agreement_list[0];
	/**
	 * Деструктаризация (начального значение из таблиц Route(движение документов))
	 */
	const iniValRoute = props?.initialValues2?.documents[0]?.route_id;

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

	//////////////////////////
	let user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});
	//////////////////////////

	//Направление для вывода согласованых подписей (круги)
	const stepsDirection = useRef("vertical");

	useEffect(() => {
		props.form2.setFieldsValue(state);
	}, [state]);

	//TODO: Возможно будет хорошей идеей убрать его из "одинокого стейта и перенести в общий" т.к тип договора не меняется
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);

	let [stepCount, setStepCount] = useState({ step: "0" });

	useEffect(() => {
		if (props.initialValues2) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,
				price: iniValDataAgreeList.price,
				subject: iniValDataAgreeList.subject,
				currency_price: iniValDataAgreeList.currency_price,
				executor_name_division: iniValDataAgreeList.executor_name_division,
				sider_signatures_date: iniValDataAgreeList.sider_signatures_date,
				received_from_counteragent_date:
					iniValDataAgreeList.received_from_counteragent_date,
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
				document_logs: { is_read: true },
				log_username: state.log_username,
			});
			setStepCount({ step: iniValue.step });
			setRoutesList(iniValue.route_data);
		}
	}, [props.initialValues2]);

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
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			{/* "Лист согласования на реализацию готовой продукции" */}
			<FormWrap>
				{FormItem("Тип договора: ", iniValue?.route_id?.name)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Предмет договора: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Общая сумма договора в валюте цены договора: ",
					state?.price
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Общая сумма договора в тенге, по курсу НБ РК: ",
					state?.currency_price
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Наименование подразделения, фамилия ответственного исполнителя: ",
					state?.executor_name_division
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: ",
					state?.sider_signatures_date
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Дата получение проекта договора, способ получения от контрагента: ",
					state?.received_from_counteragent_date
				)}
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
			<PrintContainer2 documentData={iniValue} />
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
			{/* ///////////Отправить на регистрацию////////////// */}
			<Divider type={"horizontal"} />
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
			{/* /////////////////////////////////// */}
			{/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
			<FragmentCommentsViewer commentsList={iniValue?.comments} />
			{/* /////////////////////////////////// */}
			{/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
			<FragmentAnyItems />
			{/* /////////////////////////////////// */}
		</Form>
	);
});

export default Update2;
