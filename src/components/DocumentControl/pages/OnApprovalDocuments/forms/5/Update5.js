import { Form, Typography, Divider, Steps, Collapse } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";
import TitleMenu from "../../../../../../core/TitleMenu";

import ApproveConfirm from "./dialogs/ApproveConfirm";
import RejectConfirm from "./dialogs/RejectConfirm";
import ReturnStepBackConfirm from "./dialogs/ReturnStepBackConfirm";
import ReturnToSenderConfirm from "./dialogs/ReturnToSenderConfirm";

//Tasks
import TasksAddDialog5 from "../../../../dialogs/TasksAddDialog5";
import TaskModalUpdate from "../../modals/TaskModalUpdate";
import UpdateTask5 from "./UpdateTask5";
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import FragmentUploader from "../../../fragments/FragmentUploader";
import FragmentStepViewer from "../../../fragments/FragmentStepViewer";
import { FragmentButtons } from "../../../fragments/FragmentButtons";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentTaskList } from "../../../fragments/FragmentTaskList";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { dict, DocumentTasks } from "./gql";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

const Update5 = React.memo((props) => {
	const user = useUser();
	const stepsDirection = useRef("vertical");
	const visibleModalUpdate = useState(false);
	const [visible, setVisible] = useState(false);
	const [reasonText, setReasonText] = useState(
		props?.initialValues5?.documents[0]?.reason
	);
	const [state, setState] = useState({
		log_username: user.username,
	});
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });

	/**
	 * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
	 */
	const [ReRender, setRerender] = useState(false);
	useEffect(() => {
		console.log("Обновилось состояние !");
		GetIDNameTaskFile(props?.initialValues5?.documents[0]?.id).then((value) => {
			setFileTask(value.result);
		});
	}, [ReRender]);

	/**
	 * Cтейт для таблиц файлов по поручением
	 */
	const [FileTask, setFileTask] = useState([]);
	/**
	 * Инициализация стейта для таблиц файлов по поручением
	 */
	useEffect(() => {
		if (props.initialValues5) {
			GetIDNameTaskFile(props?.initialValues5?.documents[0]?.id).then(
				(value) => {
					setFileTask(value.result);
				}
			);
		}
	}, [props.initialValues5]);

	useEffect(() => {
		if (props?.initialValues5?.documents[0]?.route_data?.length > 1)
			stepsDirection.current =
				props?.initialValues5?.documents[0]?.route_data?.length <= 7
					? "horizontal"
					: "vertical";
	}, [props]);

	useEffect(() => {
		props.form5.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues5) {
			setState({
				id: props.initialValues5.documents[0].id,
				title: props.initialValues5.documents[0].title,
				position: props.initialValues5.documents[0].position,
				username: props.initialValues5.documents[0].username,
				fio: props.initialValues5.documents[0].fio,

				subject: props.initialValues5.documents[0].data_custom[0].subject,
				remark: props.initialValues5.documents[0].data_custom[0].remark,

				date_created: props.initialValues5.documents[0].date_created,
				date_modified: props.initialValues5.documents[0].date_modified,
				route_id: props.initialValues5.documents[0].route_id.id,
				status_in_process:
					props.initialValues5.documents[0].route_id.status_in_process,
				status_cancelled:
					props.initialValues5.documents[0].route_id.status_cancelled,
				status_finished:
					props.initialValues5.documents[0].route_id.status_finished,
				status_id: props.initialValues5.documents[0].status_id,
				route: props.initialValues5.documents[0].route_data,
				step: props.initialValues5.documents[0].step,
				comments: props.initialValues5.documents[0].comments,
				signatures: props.initialValues5.documents[0].signatures,
				files: props.initialValues5.documents[0].files,
				log_username: state.log_username,
			});
			setStepCount({ step: props.initialValues5.documents[0].step });
			setRoutesList(props.initialValues5.documents[0].route_data);
		}
	}, [props.initialValues5]);

	const TasksTitleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<TaskModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						UpdateForm={UpdateTask5}
						GQL={DocumentTasks}
						title="Поручение"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
						setRerender={setRerender} // Стейт функция для обновления
						ReRender={ReRender} // Стейт переменная для обновления
					/>,
					<TasksAddDialog5
						visible={visible}
						setVisible={setVisible}
						document={props.initialValues5}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	const onFinish = (values) => {
		props.onFinish5(state);
	};

	const ReasonInputChange = (all, change) => {
		if (all.target.value.length > 0) {
			setReasonText(all.target.value);
		} else {
			setReasonText(all.target.value);
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
				console.log("UPDATE4 values", allValues);
			}}
		>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Тип договора: ", "Другой")}</FormWrap>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Примечание: ", state?.supllier)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность загружать файлы */}
			<FragmentUploader />
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{props.initialValues5 !== undefined && FileTask !== undefined ? (
				<FragmentTaskAndFileViewer
					files={props?.initialValues5?.documents[0]?.files}
					files_task={FileTask}
					userId={user.id}
				/>
			) : (
				<h1>Загрузка</h1>
			)}
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
			{props.initialValues5 !== undefined ? (
				<FragmentStepViewer
					signatures={props?.initialValues5?.documents[0]?.signatures}
					stepsDirection={stepsDirection.current}
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

export default Update5;
