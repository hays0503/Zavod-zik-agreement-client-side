import { Form, Input } from "antd";

export const FragmentInputBoxTitle = (props) => {
	return (
		<Form.Item
			name="title"
			label={props.label}
			labelCol={{ span: 24 }}
			rules={[
				{
					required: true,
					message: "Необходимо для заполнения!",
				},
			]}
		>
			<Input disabled={props.disabled} placeholder={props.placeholder} />
		</Form.Item>
	);
};

export const FragmentInputBoxSupllier = (props) => {
	return (
		<Form.Item
			name="supllier"
			label={props.label}
			labelCol={{ span: 24 }}
			rules={[
				{
					required: true,
					message: "Необходимо для заполнения!",
				},
			]}
		>
			<Input disabled={props.disabled} placeholder={props.placeholder} />
		</Form.Item>
	);
};

export const FragmentInputBoxSubject = (props) => {
	return (
		<Form.Item
			name="subject"
			label={props.label}
			labelCol={{ span: 24 }}
			rules={[
				{
					required: true,
					message: "Необходимо для заполнения!",
				},
			]}
		>
			<Input
				rows={4}
				disabled={props.disabled}
				placeholder={props.placeholder}
			/>
		</Form.Item>
	);
};

export const FragmentInputBoxPrice = (props) => {
    const price_pattern = /^\d+$/;
	const price_max_count = /^.{1,8}$/;
	return (
		<Form.Item
			name="price"
			label={props.label}
			labelCol={{ span: 24 }}
            rules={[
                {
                    required: true,
                    message: "Необходимо для заполнения!",
                },
                {
                    pattern: price_pattern,
                    message: "Можно использовать только цифры!",
                },
                {
                    pattern: price_max_count,
                    message: "Общая сумма договора не должна превышать 99999999",
                },
            ]}
		>
			<Input
				rows={4}
				disabled={props.disabled}
				placeholder={props.placeholder}
			/>
		</Form.Item>
	);
};
