import { Divider, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import TitleMenu from "../../../../../../core/TitleMenu";

import ApproveConfirm from "./dialogs/ApproveConfirm";
import RejectConfirm from "./dialogs/RejectConfirm";
import ReturnStepBackConfirm from "./dialogs/ReturnStepBackConfirm";
import ReturnToSenderConfirm from "./dialogs/ReturnToSenderConfirm";

//Tasks
import TasksAddDialog2 from "../../../../dialogs/TasksAddDialogs2";
import TaskModalUpdate from "../../modals/TaskModalUpdate";
import UpdateTask2 from "./UpdateTask2";

import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";
import { FragmentButtons } from "./../../../fragments/FragmentButtons";
import FragmentCommentsViewer from "./../../../fragments/FragmentCommentsViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "./../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";
import { FragmentTaskList } from "./../../../fragments/FragmentTaskList";

import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { dict, DocumentTasks } from "./gql";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

//Реализация готовой продукции

const Update2 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues2?.documents[0];

	const user = useUser();
	const [state, setState] = useState({
		log_username: user.username,
	});
	const visibleModalUpdate = useState(false);
	const [visible, setVisible] = useState(false);
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });
	const [reasonText, setReasonText] = useState(iniValue?.reason);

	//////////////////////////////////////////////////////////////////////////////////////////
	/**																					//
	 * Отобразить новое состояние компонентов после обновление (файлов / по поручению)	//
	 */ //
	//
	/**																					//
	 * Cтейт для таблиц файлов по поручением											//
	 */ //
	const [FileTask, setFileTask] = useState([]); //
	//
	const [ReRender, setRerender] = useState(false); //
	useEffect(() => {
		//
		if (iniValue?.id) {
			//
			GetIDNameTaskFile(iniValue?.id).then((value) => {
				//
				setFileTask(value.result); //
			}); //
		} //
	}, [iniValue, ReRender]); //
	//////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		props.form2.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues2) {
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
				reason: iniValue.reason,
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
				document_logs: iniValue.document_logs,
				log_username: state.log_username,
			});
			setStepCount({ step: iniValue.step });
			setRoutesList(iniValue.route_data);
		}
	}, [props.initialValues2]);

	let TasksTitleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<TaskModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						UpdateForm={UpdateTask2}
						GQL={DocumentTasks}
						title="Поручение"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
						setRerender={setRerender} // Стейт функция для обновления
						ReRender={ReRender} // Стейт переменная для обновления
					/>,
					<TasksAddDialog2
						visible={visible}
						setVisible={setVisible}
						document={props.initialValues2}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	let onFinish = (values) => {
		props.onFinish2(state);
	};

	//collapse
	let ReasonInputChange = (all) => {
		if (all.target.value.length > 0) {
			setReasonText(all.target.value);
		} else {
			setReasonText(all.target.value);
		}
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
				//console.log("UPDATE2 values", allValues);
			}}
		>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem(
					"Тип договора: ",
					"Лист согласования на реализацию готовой продукции"
				)}
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

			{/* Фрагмент antd дающую возможность загружать файлы */}
			<FragmentUploader />
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{props.initialValues2 !== undefined && FileTask !== undefined ? (
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

			{/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
			{props.initialValues2 !== undefined ? (
				<FragmentStepViewer
					signatures={iniValue?.signatures}
					step={stepCount.step - 1}
					routesList={routesList}
				/>
			) : (
				<h1>Загрузка</h1>
			)}
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd с кнопками для форм  */}
			<FragmentButtons
				ApproveConfirm={() => (
					<ApproveConfirm
						reasonText={reasonText}
						dataProps={props}
						setState={setState}
						user={user}
					/>
				)}
				ReturnToSenderConfirm={() => (
					<ReturnToSenderConfirm
						reasonText={reasonText}
						dataProps={props}
						setState={setState}
						user={user}
					/>
				)}
				ReturnStepBackConfirm={() => (
					<ReturnStepBackConfirm
						reasonText={reasonText}
						dataProps={props}
						setState={setState}
						user={user}
					/>
				)}
				RejectConfirm={() => (
					<RejectConfirm
						reasonText={reasonText}
						dataProps={props}
						setState={setState}
						user={user}
					/>
				)}
				modalCancelHandler={props.modalCancelHandler}
				modalEnableEditHandler={props.modalEnableEditHandler}
				reasonText={reasonText}
				props={props}
				setState={setState}
				user={user}
			/>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd для вывода Замечаний по документу */}
			<FragmentReasonsViewer
				disabled={props.disabled}
				ReasonInputChange={ReasonInputChange}
				Reason={state?.reason}
			/>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd для вывода поручений по документам */}
			<FragmentTaskList
				dict={dict}
				documentTasksList={props.documentTasksList}
				visibleModalUpdate={visibleModalUpdate}
				DocumentTasks={DocumentTasks}
				TasksTitleMenu={TasksTitleMenu}
			/>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
			<FragmentCommentsViewer
				HandleCommentOnChange={props.HandleCommentOnChange}
				disabled={props.disabled}
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
