import { Form, Divider, Collapse, Button } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

//Tasks
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import { FragmentCustomView } from "../../../fragments/FragmentCustomView";

const Update5 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValues = props?.initialValues5?.documents[0];

	const user = useUser();
	const stepsDirection = useRef("vertical");
	const [visible, setVisible] = useState(false);
	const [state, setState] = useState({
		log_username: user.username,
	});
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });

	//////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
	 */
	/**
	 * Cтейт для таблиц файлов по поручением
	 */
	const [FileTask, setFileTask] = useState([]);
	useEffect(() => {
		if (iniValues?.id) {
			GetIDNameTaskFile(iniValues?.id).then((value) => {
				setFileTask(value.result);
			});
		}
	}, [iniValues]);
	//////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		if (iniValues?.route_data?.length > 1)
			stepsDirection.current =
				iniValues?.route_data?.length <= 7 ? "horizontal" : "vertical";
	}, [props]);

	useEffect(() => {
		props.form5.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (props.initialValues5) {
			setState({
				id: iniValues.id,
				title: iniValues.title,
				position: iniValues.position,
				username: iniValues.username,
				fio: iniValues.fio,
				user_id: iniValues.user_id,
				subject: iniValues.data_custom[0].subject,
				remark: iniValues.data_custom[0].remark,
				custom_area: iniValues.data_custom[0].custom_area,

				date_created: iniValues.date_created,
				date_modified: iniValues.date_modified,
				route_id: iniValues.route_id.id,
				status_in_process: iniValues.route_id.status_in_process,
				status_cancelled: iniValues.route_id.status_cancelled,
				status_finished: iniValues.route_id.status_finished,
				status_id: iniValues.status_id,
				route: iniValues.route_data,
				step: iniValues.step,
				comments: iniValues.comments,
				signatures: iniValues.signatures,
				files: iniValues.files,
				log_username: state.log_username,
				mitwork_number: iniValues.mitwork_number,
				mitwork_data: iniValues.mitwork_data,
			});
			setStepCount({ step: iniValues.step });
			setRoutesList(iniValues.route_data);
		}
	}, [props.initialValues5]);

	const onFinish = () => {
		props.onFinish5(state);
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
			}}
		>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>
				{FormItem("Тип договора: ", iniValues?.route_id?.name)}
			</FormWrap>
			{/* /////////////////////////////////// */}

			{/* //Кастомные поля */}
			<FragmentCustomView custom_area={state?.custom_area} />

			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Примечание: ", state?.supllier)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />

			<FragmentMitWork
				mitwork_number={state?.mitwork_number}
				mitwork_data={state?.mitwork_data}
			/>

			<Divider type={"horizontal"} />

			<Collapse>
				<Collapse.Panel header={<b>Файлы</b>}>
					{/* Загрузка файлов */}
					<FragmentUploader />

					<Divider type={"horizontal"} />

					{/*Фрагмент antd дающую возможность просматривать файлы*/}
					{iniValues !== undefined && FileTask !== undefined ? (
						<FragmentTaskAndFileViewer
							files={iniValues?.files}
							files_task={FileTask}
							userId={user.id}
						/>
					) : (
						<h1>Загрузка</h1>
					)}
				</Collapse.Panel>
			</Collapse>

			{/* /////////////////////////////////// */}

			<Divider type={"horizontal"} />

			<Collapse>
				<Collapse.Panel header={<b>Подписи</b>}>
					{/*
			Фрагмент antd дающую возможность просматривать состояние
			движений документов (с надстройкой для замещающего)
			*/}
					{iniValues && (
						<FragmentStepViewerReplacementDialog
							signatures={iniValues?.signatures}
							setVisible={setVisible}
							stepCount={stepCount}
							routeData={iniValues?.route_data}
							date_created={state.date_created}
							step={iniValues?.step}
						>
							{/* Фрагмент antd дающую возможность устанавливать замещающего */}
							<SelectReplacementDialog
								visible={visible}
								setVisible={setVisible}
								setRoutesList={setRoutesList}
								routesList={routesList}
								stepCount={stepCount}
								routeData={iniValues?.route_data}
								form={props.form}
							/>
						</FragmentStepViewerReplacementDialog>
					)}
				</Collapse.Panel>
			</Collapse>

			<Divider type={"horizontal"} />

			<Collapse>
				<Collapse.Panel header={<b>Замечание</b>}>
					{/* Фрагмент antd для вывода Замечаний по документу */}
					<FragmentReasonsViewer Reason={iniValues?.reason} />
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
				</Collapse.Panel>
			</Collapse>

			<Divider type={"horizontal"} />

			<Button
				danger={true}
				htmlType="submit"
				onClick={() => {
					setState({ ...state, status_id: "10" });
					console.log(state);
				}}
			>
				Документ исполнен
			</Button>

			{/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
			<FragmentAnyItems />
			{/* /////////////////////////////////// */}
		</Form>
	);
});

export default Update5;
