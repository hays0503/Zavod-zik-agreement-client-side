import { Select, Form } from "antd";

/**
 * `FragmentSelectRecepient` фрагмент antd дающий возможность выбирать
 * из выпадающего списка фамилию пользователя для назначения поручения
 * @param {[users]} `users` массив с фамилиями
 * @returns `fragment`
 */
export const FragmentSelectRecepient = (props) => {
	return (
		<>
			<Form.Item
				label="Выберите получателя"
				labelAlign="left"
				labelCol={{ span: 12 }}
				wrapperCol={{ span: 12 }}
				name="recepient"
				rules={[
					{
						required: true,
						message: "Необходимо для заполнения!",
					},
				]}
			>
				<Select
					style={{ width: 100 + "%" }}
					showSearch
					optionFilterProp="children"
					filterOption
					{...props}
					labelInValue={true}
				>
					<Select.Option key={null} value={null}></Select.Option>
					{props?.users?.map((item, i) => {
						return (
							<Select.Option key={item.id} value={item.id}>
								{props?.users[i]?.fio}
							</Select.Option>
						);
					})}
				</Select>
			</Form.Item>
		</>
	);
};
