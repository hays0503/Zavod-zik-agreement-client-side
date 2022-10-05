import { Form, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import TitleMenu from "../../../../../../core/TitleMenu";

import ApproveConfirm from "./dialogs/ApproveConfirm";
import RejectConfirm from "./dialogs/RejectConfirm";
import ReturnStepBackConfirm from "./dialogs/ReturnStepBackConfirm";
import ReturnToSenderConfirm from "./dialogs/ReturnToSenderConfirm";

//Tasks
import TasksAddDialog4 from "../../../../dialogs/TasksAddDialog4";
import TaskModalUpdate from "../../modals/TaskModalUpdate";
import UpdateTask4 from "./UpdateTask4";
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import FragmentUploader from "./../../../fragments/FragmentUploader";
import { FragmentStepViewer } from "../../../fragments/FragmentStepViewer";
import { FragmentButtons } from "./../../../fragments/FragmentButtons";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentTaskList } from "../../../fragments/FragmentTaskList";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { dict, DocumentTasks } from "./gql";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

const Update4 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues4?.documents[0];

	const user = useUser();
	const visibleModalUpdate = useState(false);
	const [visible, setVisible] = useState(false);
	const [reasonText, setReasonText] = useState(iniValue?.reason);
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });
	const [state, setState] = useState({
		log_username: user.username,
	});

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
		props.form4.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues4) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,

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
	}, [props.initialValues4]);

	const onFinish = () => {
		props.onFinish4(state);
	};

	//collapse
	const ReasonInputChange = (all) => {
		if (all.target.value.length > 0) {
			setReasonText(all.target.value);
		} else {
			setReasonText(all.target.value);
		}
	};

	const TasksTitleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<TaskModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						UpdateForm={UpdateTask4}
						GQL={DocumentTasks}
						title="Поручение"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
						setRerender={setRerender} // Стейт функция для обновления
						ReRender={ReRender} // Стейт переменная для обновления
					/>,
					<TasksAddDialog4
						visible={visible}
						setVisible={setVisible}
						document={props.initialValues4}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
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
				//console.log("UPDATE4 values", allValues);
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
				{FormItem(
					"Наименование подразделения, фамилия ответственного исполнителя: ",
					state?.counteragent_contacts
				)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность загружать файлы */}
			<FragmentUploader />
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{props.initialValues4 !== undefined && FileTask !== undefined ? (
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
			{props.initialValues4 !== undefined ? (
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

export default Update4;
