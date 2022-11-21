import { EyeOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography, Form, Checkbox } from "antd";
import React from "react";
import {
	FileDownload,
	FileOpenDocument,
	TaskFileDownload,
	TaskFileOpenDocument,
} from "./../api/CRU_Document";
import { SET_IS_ADD_TO_DOCUMENT } from "./../OnApprovalDocuments/forms/1/gql";
import { useMutation, gql, useQuery } from "@apollo/client";

/**
 * Фрагмент antd дающую возможность просматривать файлы
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentFileViewer = (props) => {
	return (
		<Form.Item
			name="files"
			className="font-form-header"
			labelCol={{ span: 24 }}
		>
			<Collapse defaultActiveKey={["2"]} onChange={callback}>
				<Panel header={<b>Прикреплённые файлы</b>} key="2">
					{props?.files.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Link>
										<a data-fileid={item.id} onClick={FileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											FileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
				</Panel>
			</Collapse>
		</Form.Item>
	);
};

/**
 * Фрагмент antd дающую возможность просматривать Файлы прикреплённые отправителем
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentFileViewerReceiver = (props) => {
	//Делаем запрос для отображения файлов которые прикрепил поручитель
	//(эти файлы прикрепляли в прошлых поручениях и они хранятся в document_tasks_files по этому тут такой изврат)

	const GET_TASK_FILE = gql`
		query Task_files_in_id($taskFilesInId: JSON) {
			task_files_in_id(task_files_in_id: $taskFilesInId) {
				id
				filename
				data_file
				task_id
				is_add_to_document
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_TASK_FILE, {
		variables: {
			taskFilesInId: {
				global: {
					id: props?.document_tasks_id_file,
				},
			},
		},
	});

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error.message}</p>;

	return (
		<Form.Item
			name="files"
			className="font-form-header"
			labelCol={{ span: 24 }}
		>
			<Collapse defaultActiveKey={["2"]} onChange={callback}>
				<Panel header={<b>Прикреплённые файлы</b>} key="2">
					{props?.files.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Link>
										<a data-fileid={item.id} onClick={FileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											FileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
					{/* Отображаем Файлы которые уже добавили по поручению на предыдущих шагах */}
					{data.task_files_in_id != null &&
						data?.task_files_in_id.map((item) => {
							return (
								<>
									<div className="document-view-wrap">
										<Link>
											<a data-fileid={item.id} onClick={TaskFileDownload}>
												{item.filename}
											</a>
										</Link>
										<Button
											onClick={() => {
												TaskFileOpenDocument(item);
											}}
											shape="circle"
											icon={<EyeOutlined />}
										/>
										<br />
									</div>
								</>
							);
						})}
				</Panel>
			</Collapse>
		</Form.Item>
	);
};

/**
 * Фрагмент antd дающую возможность просматривать файлы(по поручением)
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentTaskFileViewer = (props) => {
	return (
		<Form.Item
			name="files"
			className="font-form-header"
			labelCol={{ span: 24 }}
		>
			<Collapse defaultActiveKey={["2"]} onChange={callback}>
				<Panel header={<b>Прикреплённые файлы</b>} key="2">
					{props?.files.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Link>
										<a data-fileid={item.id} onClick={TaskFileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											TaskFileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
				</Panel>
			</Collapse>
		</Form.Item>
	);
};

/**
 * Фрагмент antd дающую возможность просматривать файлы(по поручением и обычные файлы из document_tasks)
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentTaskAndFileViewer = (props) => {
	return (
		<Form.Item
			name="files"
			className="font-form-header"
			labelCol={{ span: 24 }}
		>
			<Collapse defaultActiveKey={["2"]} onChange={callback}>
				<Panel header={<b>Прикреплённые файлы</b>} key="2">
					{props?.files.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Link>
										<a data-fileid={item.id} onClick={FileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											FileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
					{props?.files_task.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Link>
										<a data-fileid={item.id} onClick={TaskFileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											TaskFileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
				</Panel>
			</Collapse>
		</Form.Item>
	);
};

/**
 * Фрагмент antd дающую возможность просматривать файлы (+ которые добавили по поручению можно добавить в основной документ прикрепив их)
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentFileViewerOnClick = (props) => {
	const [set_is_add_to_document, { data, loading, error }] = useMutation(
		SET_IS_ADD_TO_DOCUMENT
	);
	return (
		<Form.Item
			name="files"
			className="font-form-header"
			labelCol={{ span: 24 }}
		>
			<Collapse defaultActiveKey={["2"]} onChange={callback}>
				<Panel header={<b>Прикреплённые файлы</b>} key="2">
					{props?.files.map((item) => {
						return (
							<>
								<div className="document-view-wrap">
									<Checkbox
										defaultChecked={item.is_add_to_document} //отметить в интерфейсе был ли добавлен файл
										onChange={(e) => {
											console.log(`${item.id} checked = ${e.target.checked}`);
											set_is_add_to_document({
												variables: {
													ID: Number(item.id),
													State: e.target.checked,
												},
											});
										}}
									/>
									&nbsp; &nbsp;
									<Link>
										<a data-fileid={item.id} onClick={TaskFileDownload}>
											{item.filename}
										</a>
									</Link>
									<Button
										onClick={() => {
											TaskFileOpenDocument(item);
										}}
										shape="circle"
										icon={<EyeOutlined />}
									/>
									<br />
								</div>
							</>
						);
					})}
				</Panel>
			</Collapse>
		</Form.Item>
	);
};

/**
 * Для отладки
 */
function callback(key) {
	// console.log(key);
}

const { Panel } = Collapse;
const { Link } = Typography;
