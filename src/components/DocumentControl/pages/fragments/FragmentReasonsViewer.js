import { Form, Input } from "antd";
import {
	ExclamationCircleOutlined,
	LikeTwoTone,
	SafetyCertificateTwoTone,
} from "@ant-design/icons";

/**
 * Фрагмент antd для вывода Замечаний по документу
 * @param disabled Включен или выключен элемент управления
 * @param ReasonInputChange Функция обратного вызова по изменению состояния объекта
 * @param Reason Список замечаний
 */
export const FragmentReasonsViewer = (props) => {
	return (
		<>
			<Form.Item
				className="font-form-header"
				name="reason"
				label="Замечание"
				labelCol={{ span: 24 }}
			></Form.Item>
			<div>
				{
					//Если определены флаг disable и callback функция то выводим Input
					props?.disabled != undefined &&
						props?.ReasonInputChange != undefined && (
							<Input
								disabled={props.disabled}
								onChange={props.ReasonInputChange}
								placeholder="Замечание"
								style={{ marginBottom: "15px" }}
							/>
						)
				}
				
				{props?.Reason !== undefined && props?.Reason?.length !== undefined ? (
					props?.Reason?.map((item) => {
						return (
							<span style={{ font: "1.2rem bold" }}>
								<br />
								<span style={{ color: "red", font: "1.8rem bold" }}>
									<ExclamationCircleOutlined />
								</span>
								{" " + item.text + " - " + item.userPosition}
							</span>
						);
					})
				) : (
					<div style={{ fontSize: "1.3rem" }}>
						<SafetyCertificateTwoTone twoToneColor={"rgb(10,170,10)"} />
						На данный момент замечаний к текущему документу нет.
						<LikeTwoTone twoToneColor={"rgb(10,180,10)"} />
					</div>
				)}
			</div>
		</>
	);
};
