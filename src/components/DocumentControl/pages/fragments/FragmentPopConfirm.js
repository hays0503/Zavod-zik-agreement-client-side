import { Button, Popconfirm } from "antd";
import { Children } from "react";

/**
 * `FragmentPopConfirmClose` фрагмент antd возвращающий подтверждение дял `закрытие` формы
 * @param {string} `title` Текст для утверждения
 * @param {CallbackFunc} `setPopconfirmInModalVisible` установить видимой или нет
 * @returns `fragment`
 */
export const FragmentPopConfirmClose = (props) => {
	return (
		<>
			<Popconfirm
				title={props.title}
				onConfirm={() => {
					props.setVisible(false);
					props.setPopconfirmInModalVisible(false);
				}}
				onCancel={() => {
					props.setPopconfirmInModalVisible(false);
				}}
				okText="Да"
				cancelText="Нет"
			>
				{props.children}
			</Popconfirm>
		</>
	);
};

/**
 * `FragmentPopConfirmSend` фрагмент antd возвращающий подтверждение дял `отправки` формы
 * @param {string} `title` Текст для утверждения
 * @param {bool} `disabled` установить видимой или нет
 * @param {form} `form` текущая форма
 * @returns `fragment`
 */
export const FragmentPopConfirmSend = (props) => {
	return (
		<>
			<Popconfirm
				title={props.title}
				placement="topLeft"
				disabled={props.disabled}
                onConfirm={async () => {
                    await props.form.submit();
                }}
				okText="Да"
				cancelText="Нет"
			>
				{props.children}
			</Popconfirm>
		</>
	);
};
