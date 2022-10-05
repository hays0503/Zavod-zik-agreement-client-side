import { Popconfirm, Button } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

let DeleteFile = React.memo(
	({ item, reasonText, dataProps, setState, user, ...props }) => {
		const [confirmText, setConfirmText] = useState(
			"Вы уверены что хотите удалить прикреплённый файл?"
		);

		const confirm = () => {
			dataProps.HandleDeleteFile(item);
			setState((prevState) => {
				//console.log('item', item)
				let old = Object.assign({}, prevState);
				let index = old.files.findIndex((file) => file.id == item.id);
				old.files.splice(index, 1);
				//console.log("OOOLLLLDDDDD+++++++++", index, old.files);
				return old;
			});
			//console.log("ITEM", item);
		};

		return (
			<Popconfirm
				title={confirmText}
				placement="topLeft"
				disabled={dataProps.disabled}
				onConfirm={confirm}
				okText="Да"
				cancelText="Нет"
			>
				<Button
					disabled={dataProps.disabled}
					type="primary"
					icon={<DeleteOutlined />}
				/>
			</Popconfirm>
		);
	}
);

export default DeleteFile;
