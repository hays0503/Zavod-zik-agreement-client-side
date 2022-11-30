import { Form, Switch, Row, Col } from "antd";
import { FragmentCustomView } from "./FragmentCustomView";

/**
 * `FragmentSwitchArea` фрагмент antd дающий возможность выбрать через switch
 *  какое поле будет в документе
 * @param {`string`} `data` Данные для отображения
 * @param {'string'} `name` Item для формы
 * @param {'string'} `label` Пояснение что выбираешь (метка)
 * @returns `fragment`
 */
export const FragmentSwitchArea = (props) => {
	return (
		<>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={8}>
					<b>{props.label}</b>
				</Col>
				<Col span={13}>{props?.data}</Col>
				<Col span={1}>
					<Form.Item name={props.name}>
						<Switch defaultChecked={false} />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};

/**
 * `FragmentSwitchArea` фрагмент antd дающий возможность выбрать через switch
 *  какое поле будет в документе (МАССИВ)
 * @param {`string`} `data` Данные для отображения
 * @param {'string'} `name` Item для формы
 * @param {'string'} `label` Пояснение что выбираешь (метка)
 * @returns `fragment`
 */
export const FragmentSwitchAreaArray = (props) => {
	return (
		<>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={8}>
					<b>{props.label}</b>
				</Col>
				<Col span={13}>
					<FragmentCustomView custom_area={props?.data} />
				</Col>
				<Col span={1}>
					<Form.Item name={props.name}>
						<Switch defaultChecked={false} />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};
