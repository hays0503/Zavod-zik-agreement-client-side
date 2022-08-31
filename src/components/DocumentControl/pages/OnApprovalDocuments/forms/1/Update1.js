import { Divider, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import TitleMenu from "../../../../../../core/TitleMenu";

//pop confirm
import ApproveConfirm from "./dialogs/ApproveConfirm";
import RejectConfirm from "./dialogs/RejectConfirm";
import ReturnStepBackConfirm from "./dialogs/ReturnStepBackConfirm";
import ReturnToSenderConfirm from "./dialogs/ReturnToSenderConfirm";

//tasks
import TasksAddDialog from "../../../../dialogs/TasksAddDialog";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import TaskModalUpdate from "../../modals/TaskModalUpdate";
import { FragmentButtons } from "./../../../fragments/FragmentButtons";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import FragmentStepViewer from "./../../../fragments/FragmentStepViewer";
import { FragmentTaskList } from "./../../../fragments/FragmentTaskList";
import FragmentUploader from "./../../../fragments/FragmentUploader";
import UpdateTask1 from "./UpdateTask1";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { dict, DocumentTasks } from "./gql";

const Update1 = React.memo((props) => {
	const stepsDirection = useRef("vertical");
	const user = useUser();
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });
	const visibleModalUpdate = useState(false);

	//confirmations
	const [reasonText, setReasonText] = useState(
		props?.initialValues?.documents[0]?.reason
	);
	//Tasks
	const [visible, setVisible] = useState(false);
	const [state, setState] = useState({
		log_username: user.username,
	});

	/**
	 * Cтейт для таблиц файлов по поручением
	 */
	const [FileTask, setFileTask] = useState([]);
	/**
	 * Инициализация стейта для таблиц файлов по поручением
	 */
	useEffect(() => {
		if (props.initialValues) {
			GetIDNameTaskFile(props?.initialValues?.documents[0]?.id).then(
				(value) => {
					setFileTask(value.result);
				}
			);
		}
	}, [props.initialValues]);

	useEffect(() => {
		if (props?.initialValues?.documents[0]?.route_data?.length > 1)
			stepsDirection.current =
				props?.initialValues?.documents[0]?.route_data?.length <= 7
					? "horizontal"
					: "vertical";
	}, [props]);

	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);
	useEffect(() => {
		if (props.initialValues) {
			setState({
				id: props.initialValues.documents[0].id,
				title: props.initialValues.documents[0].title,
				position: props.initialValues.documents[0].position,
				username: props.initialValues.documents[0].username,
				fio: props.initialValues.documents[0].fio,

				price: props.initialValues.documents[0].data_one[0].price,
				supllier: props.initialValues.documents[0].data_one[0].supllier,
				subject: props.initialValues.documents[0].data_one[0].subject,

				date_created: props.initialValues.documents[0].date_created,
				date_modified: props.initialValues.documents[0].date_modified,
				route_id: props.initialValues.documents[0].route_id.id,
				status_in_process:
					props.initialValues.documents[0].route_id.status_in_process,
				status_cancelled:
					props.initialValues.documents[0].route_id.status_cancelled,
				status_finished:
					props.initialValues.documents[0].route_id.status_finished,
				status_id: props.initialValues.documents[0].status_id,
				reason: props.initialValues.documents[0].reason,
				route: props.initialValues.documents[0].route_data,
				step: props.initialValues.documents[0].step,
				comments: props.initialValues.documents[0].comments,
				signatures: props.initialValues.documents[0].signatures,
				files: props.initialValues.documents[0].files,
				document_logs: props.initialValues.documents[0].document_logs,
				log_username: state.log_username,
			});
			setStepCount({ step: props.initialValues.documents[0].step });
			setRoutesList(props.initialValues.documents[0].route_data);
		}
	}, [props.initialValues]);

	let onFinish = (values) => {
		props.onFinish(state);
	};

	let TasksTitleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<TaskModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						UpdateForm={UpdateTask1}
						GQL={DocumentTasks}
						title="Поручение"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
					/>,
					<TasksAddDialog
						visible={visible}
						setVisible={setVisible}
						document={props.initialValues}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};

	const ReasonInputChange = (all) => {
		if (all.target.value.length > 0) {
			setReasonText(all.target.value);
		} else {
			setReasonText(all.target.value);
		}
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
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Тип договора: ", "Закуп ТРУ")}</FormWrap>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность загружать файлы */}
			<FragmentUploader />
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/*Фрагмент antd дающую возможность просматривать файлы*/}
			{props.initialValues !== undefined && FileTask !== undefined ? (
				<FragmentTaskAndFileViewer
					files={props?.initialValues?.documents[0]?.files}
					files_task={FileTask}
					userId={user.id}
				/>
			) : (
				<h1>Загрузка</h1>
			)}
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
			{props.initialValues !== undefined ? (
				<FragmentStepViewer
					signatures={props?.initialValues?.documents[0]?.signatures}
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

export default Update1;
