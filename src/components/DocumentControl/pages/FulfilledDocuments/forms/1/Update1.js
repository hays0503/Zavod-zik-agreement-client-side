import { Form, Divider, Button, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import FragmentUploader from "../../../fragments/FragmentUploader";

const Update1 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues?.documents[0];

	const user = useUser();
	const [visible, setVisible] = useState(false);
	const [routesList, setRoutesList] = useState([
		{ positionName: "Тип договора не выбран." },
	]);
	const [stepCount, setStepCount] = useState({ step: "0" });

	const [state, setState] = useState({
		log_username: user.username,
	});

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
		props.form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		if (iniValue) {
			setState({
				id: iniValue.id,
				title: iniValue.title,
				position: iniValue.position,
				username: iniValue.username,
				fio: iniValue.fio,
				price: iniValue.data_one[0].price,
				supllier: iniValue.data_one[0].supllier,
				subject: iniValue.data_one[0].subject,
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
				mitwork_number: iniValue.mitwork_number,
				mitwork_data: iniValue.mitwork_data,
			});
			setStepCount({ step: iniValue.step });
			setRoutesList(iniValue.route_data);
		}
	}, [iniValue]);

	let onFinish = () => {
		props.onFinish(state);
	};

	return (
		<Form
			form={props.form}
			name="DocumentsForm"
			onFinish={onFinish}
			scrollToFirstError
			autoComplete="off"
			onValuesChange={(_changedValues, allValues) => {
				setState(Object.assign({}, state, { ...allValues }));
			}}
		>
			{/* Закуп ТРУ*/}
			<h4>
				<b>Тип договора:</b> {iniValue?.route_id?.name}
			</h4>

			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>

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
					{iniValue !== undefined && FileTask !== undefined ? (
						<FragmentTaskAndFileViewer
							files={iniValue?.files}
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
				</Collapse.Panel>
			</Collapse>

			<Divider type={"horizontal"} />

			<Collapse>
				<Collapse.Panel header={<b>Замечание</b>}>
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

export default Update1;
