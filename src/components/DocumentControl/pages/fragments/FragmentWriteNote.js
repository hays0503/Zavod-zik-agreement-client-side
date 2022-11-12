import { Form, Input } from "antd";

/**
 * `FragmentWriteNote` фрагмент antd дающий возможность написать
 * задание к исполненною в поручение
 * @returns `fragment`
 */
export const FragmentWriteNote = () => {
	const onChangeDatePicker = (date, dateString) => {
		// console.log('datep', date, dateString);
	};
	return (
		<>
			<Form.Item
				label="Задача"
				labelAlign="left"
				labelCol={{ span: 12 }}
				wrapperCol={{ span: 12 }}
				name="note"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Input.TextArea rows={5} />
			</Form.Item>
		</>
	);
};
