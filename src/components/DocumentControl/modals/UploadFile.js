import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

let UploadFile = (props) => {
	return (
		<Dragger
			{...props}
			beforeUpload={(file, fileList) => {
				//console.log('beforeUpload file', file);
				//console.log("beforeUpload fileList", fileList);
				if (file.size > 5500000) {
					message.error({
						key: "msgKeyFileError",
						content: `Файл - ${file.name} :размер слишком большой.`,
						duration: 30,
						className: "custom-class",
						style: {
							marginTop: "20vh",
						},
						onClick: () => message.destroy("msgKeyFileError"),
					});
				}
				if (
					file.type !== "image/png" &&
					file.type !== "image/jpg" &&
					file.type !== "image/jpeg" &&
					file.type !==
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
					file.type !==
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
					file.type !== "application/pdf" &&
					file.type !== "application/msword" &&
					file.type !== "application/vnd.ms-excel"
				) {
					message.error({
						key: "msgKeyFileTypeError",
						content: `Файл - ${file.name} :нельзя загружать такой тип файла.`,
						duration: 30,
						onClick: () => message.destroy("msgKeyFileTypeError"),
					});
				}
				return (file.size < 5500000 && file.type === "image/png") ||
					(file.size < 5500000 && file.type === "image/jpg") ||
					(file.size < 5500000 && file.type === "image/jpeg") ||
					(file.size < 5500000 &&
						file.type ===
							"application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
					(file.size < 5500000 &&
						file.type ===
							"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
					(file.size < 5500000 && file.type === "application/pdf") ||
					(file.size < 5500000 && file.type === "application/msword") ||
					(file.size < 5500000 && file.type === "application/vnd.ms-excel")
					? true
					: Upload.LIST_IGNORE;
			}}
		>
			<p className="ant-upload-drag-icon">
				<InboxOutlined />
			</p>
			<p className="ant-upload-text">
				Кликните мышью тут или перенесите файл на эту форму для загрузки файла{" "}
			</p>
			<p className="ant-upload-hint">Можно загружать за раз несколько файлов</p>
		</Dragger>
	);
};

export default UploadFile;
