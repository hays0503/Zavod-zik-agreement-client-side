import { Form, Input } from "antd";

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
				{/* {console.log(`${props?.disabled} ${props?.ReasonInputChange}`)} */}
				{
					//Если определены флаг disable и callback функция то выводим Input
					props?.disabled != undefined &&
						props?.ReasonInputChange != undefined && (
							<Input
								disabled={props.disabled}
								onChange={props.ReasonInputChange}
								placeholder="Замечание"
							/>
						)
				}
				{props?.reason?.map((item) => {
					return (
						<span>
							<span>{item.text + "-" + item.userPosition}</span>
							<br />
						</span>
					);
				})}
			</div>
		</>
	);
};
