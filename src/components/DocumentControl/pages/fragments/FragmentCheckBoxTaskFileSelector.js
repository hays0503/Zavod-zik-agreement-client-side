import { Button, Form, Row, Col, Checkbox, Typography } from "antd";
import {
	FileDownload,
	FileOpenDocument,
	TaskFileDownload,
	TaskFileOpenDocument,
} from "../api/CRU_Document";
import { EyeOutlined } from "@ant-design/icons";
/**
 * `FragmentCheckBoxTaskFileSelector` возвращает элемент antd в котором можно выбрать файлы по поручениям
 * @param {[`Files`]} files Файлы для отображение прикреплённые в процессе согласование
 * @param {[`Files`]} FileTask Файлы для отображение прикреплённые в процессе (выполннения какого-либо поручения)
 */
export const FragmentCheckBoxTaskFileSelector = (props) => {
	const CheckboxGroup = Checkbox.Group;
	const { Link } = Typography;

	let CheckAll = () => {
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
	};

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
				<CheckboxGroup>
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
											defaultChecked={false}
										/>
									</Col>
									<Col flex="auto">
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
									</Col>
								</Row>
							</>
						);
					})}
				</CheckboxGroup>
			</Form.Item>

			{/* //Прикрепить файлы которые добавили на прошлых этапах (!т.е которые добавили по поручению!) */}
			<Form.Item style={{ marginTop: "30px" }} name="document_tasks_id_file">
				<CheckboxGroup>
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
											defaultChecked={false}
										/>
									</Col>
									<Col flex="auto">
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
									</Col>
								</Row>
							</>
						);
					})}
				</CheckboxGroup>
			</Form.Item>
		</>
	);
};
