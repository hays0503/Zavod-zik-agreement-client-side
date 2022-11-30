import { Form, Divider } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentCustomView } from "../../../fragments/FragmentCustomView";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";

let Update5 = React.memo((props) => {
	const iniValue = props?.initialValues5?.documents[0];
	let user = useUser();
	const stepsDirection = useRef("vertical");

	//////////////////////////////////////////////////////////////////////////////////////////
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
	//////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		if (iniValue?.route_data?.length > 1)
			stepsDirection.current =
				iniValue?.route_data?.length <= 7 ? "horizontal" : "vertical";
	}, [props]);

	const [visible, setVisible] = useState(false);
	let [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	let [stepCount, setStepCount] = useState({ step: "0" });

	const [state, setState] = useState({
		log_username: user.username,
	});

	useEffect(() => {
		props.form5.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,

				subject: iniValue.data_custom[0].subject,
				remark: iniValue.data_custom[0].remark,
				custom_area: iniValue.data_custom[0].custom_area,

				date_created: iniValue.date_created,
				date_modified: iniValue.date_modified,
				route_id: iniValue.route_id.id,
				status_in_process: iniValue.route_id.status_in_process,
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

	let onFinish = (values) => {
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
			{/* Другой */}
			<h4>
				<b>Тип договора:</b> {props?.initialValues5?.documents[0].route_id.name}
			</h4>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование : ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Примечание: ", state?.remark)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>

			{/* //Кастомные поля */}
			{console.log("Кастомные поля", state?.custom_area)}
			<FragmentCustomView custom_area={state?.custom_area} />

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
			{/* /////////////////////////////////// */}

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

export default Update5;
