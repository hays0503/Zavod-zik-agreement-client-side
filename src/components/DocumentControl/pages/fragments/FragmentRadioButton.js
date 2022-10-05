import { Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";

export const FragmentRadioButton = (props) => {
	//Инициализация начального состояния из бд
	const [radioActiveItem, setRadioActiveItem] = useState(-1);

	const returnValuePosition = () => {
		if (props.is_boss) {
			//console.log("IsBoss");
			return 1;
		}
		if (props.is_vice_director) {
			//console.log("is_vice_director");
			return 2;
		}
		if (props.is_user) {
			//console.log("IsUser");
			return 3;
		}
		return -1;
	};

	useEffect(() => {
		setRadioActiveItem(returnValuePosition);
	}, [props.is_boss, props.is_vice_director, props.is_user]);

	/**
	 * Выбрать позицию в департаменте (is_boss|is_vice_director|is_user)
	 */
	const SelectPositionInDepart = ({ disabled }) => {
		const onChange = (e) => {
			const newState = {
				id: props.stateValue.id,
				name: props.stateValue.name,
				accesses: props.stateValue.accesses,
				log_username: props.stateValue.log_username,
				is_boss: false,
				is_vice_director: false,
				is_user: false,
				id_depart: props.stateValue.id_depart,
			};
			switch (e.target.value) {
				//Обязанности выполняемой должности
				case 1: //Директор департамента
					setRadioActiveItem(1);
					newState.is_boss = true;
					break;
				case 2: //Замещающий обязанности директора департамента
					setRadioActiveItem(2);
					newState.is_vice_director = true;
					break;
				case 3: //Обычный пользователь из департамента
					setRadioActiveItem(3);
					newState.is_user = true;
					break;
				default:
			}
			//console.log("newState", newState);
			props.setStateValue(newState);
		};

		return (
			<Radio.Group
				onChange={onChange}
				name="radiogroup"
				defaultValue={radioActiveItem}
				buttonStyle="solid"
				disabled={disabled}
			>
				<Radio value={1}>Директор департамента</Radio>
				<Radio value={2}>Замещающий обязанности директора департамента</Radio>
				<Radio value={3}>Обычный пользователь из департамента</Radio>
			</Radio.Group>
		);
	};

	return (
		<>
			<Form.Item>
				<SelectPositionInDepart disabled={props.disabled} />
			</Form.Item>
		</>
	);
};
