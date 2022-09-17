import { notification } from "antd";
/**
 * @function UserException Пользовательское исключение
 */
export function UserException(message) {
	this.message = message;
	this.name = "Исключение, определённое пользователем";
	notification["error"]({
		message: message,
		duration: 10,
		placement: "bottomRight",
	});
}
