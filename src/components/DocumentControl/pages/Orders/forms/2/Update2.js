import {
	Form,
	Divider,
	Typography,
	Steps,
} from "antd";
import React, { useEffect, useState } from "react";
import {
	useUser,
} from "../../../../../../core/functions";

import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

let Update2 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues2?.documents[0];

	let user = useUser();
	const [visible, setVisible] = useState(false);
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	let [stepCount, setStepCount] = useState({ step: "0" });

	const [state, setState] = useState({
		log_username: user.username,
	});

	//////////////////////////////////////////////////////////////////////////////
	/**
	 * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
	 */
	/**
	 * Cтейт для таблиц файлов по поручением
	 */
	const [FileTask, setFileTask] = useState([]);
	useEffect(() => {
		if (iniValue?.id) {
			GetIDNameTaskFile(iniValue?.id).then((value) => {
				setFileTask(value.result);
			});
		}
	}, [iniValue]);
	//////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		props.form2.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		console.log("visible", visible);
	}, [visible]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,
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
				status_cancelled: iniValue.route_id.status_cancelled,
				status_finished: iniValue.route_id.status_finished,
				status_id: iniValue.status_id,
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
	}, [iniValue]);

	let onFinish = () => {
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
			<h4>
				<b>Тип договора:</b> Лист согласования на реализацию готовой продукции
			</h4>

			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Наименование контрагента: ", state?.title)}
			</FormWrap>
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
					state.currency_price
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Наименование подразделения, фамилия ответственного исполнителя: ",
					state.executor_name_division
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					`Подписанный сторонами оригинал договора получен,
                        дата, способ получения от контрагента: `,
					state.sider_signatures_date
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					`Дата получение проекта договора, способ получения от контрагента: `,
					state.received_from_counteragent_date
				)}
			</FormWrap>

			<Divider type={"horizontal"} />

			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{iniValue !== undefined && FileTask !== undefined ? (
				<FragmentTaskAndFileViewer
					files={iniValue?.files}
					files_task={FileTask}
					userId={user.id}
				/>
			) : (
				<h1>Загрузка</h1>
			)}

			<Divider type={"horizontal"} />

			{/*
            Фрагмент antd дающую возможность просматривать состояние
            движений документов (с надстройкой для замещающего)
            */}
			{iniValue && (
				<FragmentStepViewerReplacementDialog
					signatures={iniValue?.signatures}
					setVisible={setVisible}
					stepCount={stepCount}
					routeData={iniValue?.route_data}
					date_created={state.date_created}
					step={iniValue?.step}
				>
					{/* Фрагмент antd дающую возможность устанавливать замещающего */}
					<SelectReplacementDialog
						visible={visible}
						setVisible={setVisible}
						setRoutesList={setRoutesList}
						routesList={routesList}
						stepCount={stepCount}
						routeData={iniValue?.route_data}
						form={props.form}
					/>
				</FragmentStepViewerReplacementDialog>
			)}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd для вывода Замечаний по документу */}
			<FragmentReasonsViewer Reason={iniValue?.reason} />
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
			<FragmentCommentsViewer
				HandleCommentOnChange={props.HandleCommentOnChange}
				disabled={false}
				HandleComment={props.HandleComment}
				commentsList={props.commentsList}
			/>
			{/* /////////////////////////////////// */}

			{/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
			<FragmentAnyItems />
			{/* /////////////////////////////////// */}
		</Form>
	);
});

export default Update2;
