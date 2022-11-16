import { Form, Divider, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import PrintContainer5 from "./PrintContainer5";

let Update5 = React.memo((props) => {
	/**
	 * Деструктаризация (начального значение)
	 */
	const iniValue = props?.initialValues5?.documents[0];
	const AgreementList = iniValue?.data_custom[0];

	let user = useUser();

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

				subject: AgreementList.subject,
				remark: AgreementList.remark,

				date_created: iniValue.date_created,
				date_modified: iniValue.date_modified,
				route_id: iniValue.route_id.id,
				status_in_process: iniValue.route_id.status_in_process,
				status_cancelled: iniValue.route_id.status_cancelled,
				status_finished: iniValue.route_id.status_finished,
				//Установить статус на доработку (для кнопки "Оправка на регистрацию")
				status_id: "8",
				route: iniValue.route_data,
				step: iniValue.step,
				comments: iniValue.comments,
				signatures: iniValue.signatures,
				files: iniValue.files,
				log_username: state.log_username,
				mitwork_number: iniValue.mitwork_number,
				mitwork_data: iniValue.mitwork_data,
			});
		}
	}, [iniValue]);

	let onFinish = (values) => {
		props.onFinish4(state);
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
			<h4>
				<b>Тип договора:</b> Другой
			</h4>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
			{/* /////////////////////////////////// */}
			<FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			<h3>
				<b>Файл согласованного договора</b>
			</h3>
			<PrintContainer5
				printData={props?.initialValues5?.documents[0].id}
				documentData={props?.initialValues5}
			/>
			<Divider type={"horizontal"} />
			<Form.Item
				className="font-form-header"
				name="signatures"
				label="Подписи"
				labelCol={{ span: 24 }}
			>
				{props?.initialValues5?.documents[0].signatures.map((item) => {
					//remove commentsList
					return (
						<>
							<div className="signature-view-wrap">
								<span className="signature-view-position">{item.position}</span>
								<span className="signature-view-username">{item.fio}</span>
								<span className="signature-view-date">
									{formatDate(item.date_signature)}
								</span>
							</div>
						</>
					);
				})}
			</Form.Item>
			{/* /////////////////////////////////// */}
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<FragmentMitWork
				mitwork_number={state?.mitwork_number}
				mitwork_data={state?.mitwork_data}
			/>
			<Divider type={"horizontal"} />
			{/* /////////////////////////////////// */}
			<Collapse>
				<Collapse.Panel header={<b>Файлы</b>}>
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
			{/* /////////////////////////////////// */}
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
			{/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
			<FragmentAnyItems />
		</Form>
	);
});

export default Update5;
