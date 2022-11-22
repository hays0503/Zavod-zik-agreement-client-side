import { Button, Divider, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import {
	FragmentFileViewerReceiver,
	FragmentFileViewerOnClick,
} from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";

let Update1 = React.memo((props) => {
	/**
	 * 	Деструктаризация (начального значение)
	 */
	const iniTask = props?.initialValues?.document_tasks[0];
	/////////////////////////////////////////////////////////
	let user = useUser();
	/////////////////////////////////////////////////////////
	const [state, setState] = useState({
		log_username: user.username,
	});
	/////////////////////////////////////////////////////////
	let tasksFilesMap = state?.task_files?.map((item) => {
		return item.toString();
	});
	/////////////////////////////////////////////////////////
	const result = props?.document?.files?.filter((i) =>
		tasksFilesMap?.includes(i.id)
	);
	/////////////////////////////////////////////////////////
	useEffect(() => {
		props.form.setFieldsValue(state);
	}, [state]);
	/////////////////////////////////////////////////////////
	useEffect(() => {
		if (props.initialValues) {
			//console.log("props.initialValues", props.initialValues);
			setState({
				id: iniTask.id,
				document_id: iniTask.document_id,
				status: iniTask.status,
				is_cancelled: iniTask.is_cancelled,
				note: iniTask.note,
				deadline: iniTask.deadline,
				date_created: iniTask.date_created,
				fio_created: iniTask.fio_created,
				user_id_created: iniTask.user_id_created,
				user_id_receiver: iniTask.user_id_receiver,
				fio_receiver: iniTask.fio_receiver,
				route_id: iniTask.route_id,
				document_options: iniTask.document_options,
				task_files: iniTask.task_files,
				report: iniTask.report,
				document_tasks_files: iniTask.document_tasks_files,
				log_username: state.log_username,
				task_statuses: iniTask.task_statuses,
				document_tasks_id_file: iniTask.document_tasks_id_file, // Файлы которые уже добавили по поручению на предыдущих шагах
			});
		}
	}, [props.initialValues]);
	/////////////////////////////////////////////////////////
	let onFinish = () => {};
	/////////////////////////////////////////////////////////
	return (
		<Form form={props.form} name="DocumentsForm" onFinish={onFinish}>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("ФИО поручителя: ", state.fio_created)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Задание: ", state.note)}</FormWrap>
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />
			<h3 className="marginTop">
				<b>Информация о договоре</b>
			</h3>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Тип договора: ", state.props?.document?.route_id?.name)}
			</FormWrap>
			{/* /////////////////////////////////// */}
			{state?.document_options?.title === true ? (
				<FormWrap>
					{FormItem("Наименование ТРУ: ", props?.document?.title)}
				</FormWrap>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}
			{state?.document_options?.supllier === true ? (
				<FormWrap>
					{FormItem("Поставщик ТРУ: ", props?.document?.data_one[0]?.supllier)}
				</FormWrap>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}
			{state?.document_options?.subject === true ? (
				<FormWrap>
					{FormItem("Основание: ", props?.document?.data_one[0]?.subject)}
				</FormWrap>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}
			{state?.document_options?.price === true ? (
				<FormWrap>
					{FormItem(
						"Общая сумма договора: ",
						props?.document?.data_one[0]?.price
					)}
				</FormWrap>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* /////////////////////////////////// */}
			<h3 className="marginTop">
				<b>Файлы прикреплённые отправителем</b>
			</h3>
			{/* /////////////////////////////////// */}
			{result !== undefined ? (
				<FragmentFileViewerReceiver
					files={result}
					document_tasks_id_file={state.document_tasks_id_file}
				/>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			{/* /////////////////////////////////// */}
			{state.status === 2 ? (
				<>
					{/* /////////////////////////////////// */}
					<h3>
						<b>Отчёт</b>
					</h3>
					{state.report ? state.report : ""}
					{/* /////////////////////////////////// */}
					<Divider type={"horizontal"} />
					<h3 className="font-form-header">
						<b>Файлы прикреплённые исполнителем</b>
					</h3>
					{/* /////////////////////////////////// */}
					<FragmentFileViewerOnClick files={state?.document_tasks_files} />
					{/* /////////////////////////////////// */}
				</>
			) : (
				""
			)}
			{/* /////////////////////////////////// */}
			{state?.status === 1 && state?.user_id_created !== user.id ? (
				<>
					<Divider type={"horizontal"} />
					<Button type="primary" htmlType="submit">
						Завершить
					</Button>
				</>
			) : (
				""
			)}
		</Form>
	);
});

export default Update1;
