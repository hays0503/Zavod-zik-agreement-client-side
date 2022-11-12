import { Form, DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";

/**
 * `FragmentDeadline` фрагмент antd дающий возможность выбирать
 * дату исполнения поручения (до какого числа)
 * @returns `fragment`
 */
export const FragmentDeadline = () => {
	const onChangeDatePicker = (date, dateString) => {
		// console.log('datep', date, dateString);
	};
	return (
		<>
			<Form.Item
				label="Срок для исполнения до"
				labelAlign="left"
				labelCol={{ span: 12 }}
				wrapperCol={{ span: 12 }}
				name="deadline"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<DatePicker
					locale={locale}
					format={"DD-MM-YYYY HH:mm"}
					showTime={{ format: "HH:mm" }}
					onChange={onChangeDatePicker}
				/>
			</Form.Item>
		</>
	);
};
