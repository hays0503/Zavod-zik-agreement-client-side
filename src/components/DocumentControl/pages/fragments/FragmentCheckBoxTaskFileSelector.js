import { Button, Form, Row, Col, Checkbox, Typography } from "antd";
import {
	FileDownload,
	FileOpenDocument,
	TaskFileDownload,
	TaskFileOpenDocument,
} from "../api/CRU_Document";
import { EyeTwoTone, FileTwoTone } from "@ant-design/icons";
import { FragmentFilePreviewModal } from "./FragmentFilePreviewModal";
import React, { useState, useEffect } from "react";
/**
 * `FragmentCheckBoxTaskFileSelector` возвращает элемент antd в котором можно выбрать файлы по поручениям
 * @param {[`Files`]} files Файлы для отображение прикреплённые в процессе согласование
 * @param {[`Files`]} FileTask Файлы для отображение прикреплённые в процессе (выполннения какого-либо поручения)
 */
export const FragmentCheckBoxTaskFileSelector = (props) => {
	const CheckboxGroup = Checkbox.Group;
	const { Link } = Typography;
	//Предпросмотр файлов
	const [refFilePreview, setRefFilePreview] = useState(null);
	const [isLoadOpen, setIsModalLoad] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	//Открытие модалки
	const showModal = async (item, FileOpen) => {
		setIsModalLoad(!isLoadOpen);
		const FilePreview = await FileOpen(item);
		setRefFilePreview(FilePreview);
		setIsModalLoad(false);
		setIsModalOpen(!isModalOpen);
	};
	const consoleout = () => {
		console.log(
			"props?.form.getFieldValue('task_files')",
			props?.form.getFieldValue("task_files")
		);
		console.log(
			"props?.form.getFieldValue('document_tasks_id_file')",
			props?.form.getFieldValue("document_tasks_id_file")
		);
	};
	const CheckAll = async (isBool = true) => {
		let files = props?.files.map((item) => {
			return item.id;
		});
		props.form.setFieldsValue({
			task_files: files,
		});
		let FileTask = props?.FileTask.map((item) => {
			return item.id;
		});
		props.form.setFieldsValue({
			document_tasks_id_file: FileTask,
		});
		if (isBool) {
			consoleout();
		}
	};

	useEffect(() => {
		CheckAll(false);
	}, []);

	return (
		<>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={15}>
					<h3>
						<b>Выберите необходимые Файлы</b>
					</h3>
				</Col>
				<Col span={9}>
					<Button onClick={CheckAll}>Выбрать все файлы</Button>
				</Col>
			</Row>
			<Form.Item style={{ marginTop: "30px" }} name="task_files">
				<CheckboxGroup defaultChecked={true}>
					{props?.files.map((item) => {
						return (
							<>
								<Row>
									<Col flex="none">
										<Checkbox
											style={{
												padding: "0 16px",
											}}
											value={item.id}
											defaultChecked={true}
											onChange={consoleout}
										/>
									</Col>
									<Col flex="auto">
										<FileTwoTone />
										<Link>
											<a data-fileid={item.id} onClick={FileDownload}>
												{item.filename}
											</a>
										</Link>
										<Button
											title="Предпросмотр файла"
											onClick={async () => {
												showModal(item, FileOpenDocument);
											}}
											shape="circle"
											icon={<EyeTwoTone />}
										/>
									</Col>
								</Row>
							</>
						);
					})}
				</CheckboxGroup>
			</Form.Item>

			{/* //Прикрепить файлы которые добавили на прошлых этапах (!т.е которые добавили по поручению!) */}
			<Form.Item style={{ marginTop: "30px" }} name="document_tasks_id_file">
				<CheckboxGroup defaultChecked={true}>
					{props?.FileTask.map((item) => {
						return (
							<>
								<Row>
									<Col flex="none">
										<Checkbox
											style={{
												padding: "0 16px",
											}}
											value={item.id}
											defaultChecked={true}
											onChange={consoleout}
										/>
									</Col>
									<Col flex="auto">
										<FileTwoTone />
										<Link>
											<a data-fileid={item.id} onClick={TaskFileDownload}>
												{item.filename}
											</a>
										</Link>
										<Button
											title="Предпросмотр файла"
											onClick={async () => {
												showModal(item, TaskFileOpenDocument);
											}}
											shape="circle"
											icon={<EyeTwoTone />}
										/>
									</Col>
								</Row>
							</>
						);
					})}
				</CheckboxGroup>
			</Form.Item>
			<FragmentFilePreviewModal
				refFilePreview={refFilePreview}
				setRefFilePreview={setRefFilePreview}
				isLoadOpen={isLoadOpen}
				setIsModalLoad={setIsModalLoad}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</>
	);
};
