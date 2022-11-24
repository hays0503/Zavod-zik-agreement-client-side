import { DatePicker, Collapse, Divider, Button, Input, Empty } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { FormItemWithProps, FormWrap } from "./FragmentItemWrap";
import moment, { now } from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
import { gql, useMutation } from "@apollo/client";
import { arrayAsString } from "pdf-lib";

const { Panel } = Collapse;

/**
 * `FragmentMitWorkEdit` Фрагмент который изменяет Номер и дату на митворге(в бд) согласно id документа
 * @param {number}  `id` Id номер документа в бд
 * @param {number}  `mitwork_number` Номер на митворге
 * @param {number}  `mitwork_data` Дата на митворге
 */

export const FragmentMitWorkEdit = (props) => {
	//gql мутация для установки данных через бэк в бд
	const SET_MITWORK_DATA = gql`
		mutation UpdateMitWork(
			$id: Int
			$mitworkNumber: String
			$mitworkData: DateTime
		) {
			updateMitWork(
				ID: $id
				mitwork_number: $mitworkNumber
				mitwork_data: $mitworkData
			) {
				type
				message
			}
		}
	`;

	/**
	 * Мутация для установки данных о митворге в базу данных
	 */
	const [setMitworkData, { data }] = useMutation(SET_MITWORK_DATA);

	//Состояние для даты на митворге
	//Инициализируем данными дату на сегодняшний день
	let DataRef = useRef({
		momentData: moment(),
		dataString: moment().format("DD MM YYYY").toString(),
	});

	//Установи дату из бд или сегодняшнею дату
	useEffect(() => {
		DataRef.current = {
			momentData: props.mitwork_data ? moment(props.mitwork_data) : moment(),
			dataString: props.mitwork_data
				? moment(props.mitwork_data).format("DD MM YYYY").toString()
				: moment().format("DD MM YYYY").toString(),
		};
	}, [props.mitwork_data]);

	//Форматирование дат
	const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

	//Активные или не активные элементы управление
	const [visible, setVisible] = useState(true);

	//Id'шник документа в бд
	const [ID, setID] = useState(null);
	//Состояние для поля ввода номера на митворге
	const [InputNumber, setInputNumber] = useState(null);
	//Ссылка на объект ввода (используется для установки фокуса при непризывном вводе)
	const refInputNumber = useRef(null);
	//Состояние для кнопки редактировать или нет (по умолчанию выключено)
	const [editState, setEditState] = useState(false);

	/**
	 * `IfDef` Если у нас есть какие то данные то просто выведем их, иначе выедим логику для заполнение
	 * (+ вкл или выкл режим редактирование за это отвечает состояние `editState`)
	 * @param props  `{variable, Text, Component}`
	 * @returns `{variable}`
	 */
	const IfDef = (props) => {
		const { variable, Text, Component } = props;

		//console.log("variable", variable);

		if (
			variable === undefined ||
			variable === null ||
			variable === "Invalid date" ||
			editState
		)
			return (
				<>
					{Text}
					<Divider type="vertical" />
					{Component}
				</>
			);
		return variable;
	};

	/**
	 * Установим фокус при изменение числа в поле ввода
	 */
	useEffect(() => {
		if (InputNumber) {
			refInputNumber.current.focus({
				cursor: "end",
			});
		}
	}, [InputNumber]);

	/**
	 * Установка ID документа
	 */
	useEffect(() => {
		if (props?.id) setID(props?.id);
	}, [props?.id]);

	return (
		<>
			<Collapse defaultActiveKey={["1"]}>
				<Panel
					header={<b>Митворг</b>}
					key="1"
					extra={
						<>
							{editState ? (
								<Button
									onClick={(event) => {
										// Остановить "проброс" события дальше
										event.stopPropagation();
										setMitworkData({
											variables: {
												id: parseInt(ID),
												mitworkNumber: InputNumber,
												mitworkData: DataRef.current.momentData,
											},
										});
										setEditState(!editState);
										setVisible(!visible);
									}}
								>
									Сохранить
								</Button>
							) : null}
							<Button
								onClick={(event) => {
									// Остановить "проброс" события дальше
									event.stopPropagation();
									setEditState(!editState);
									setInputNumber(props?.mitwork_number);
									setVisible(!visible);
								}}
							>
								{editState ? "Отмена" : "Редактировать"}
							</Button>
						</>
					}
				>
					<FormWrap>
						<FormItemWithProps
							Title={"Дата регистрации на Митворге: "}
							Component={
								<>
									<IfDef
										variable={moment(props?.mitwork_data).format("DD/MM/YYYY")}
										Text={"Установить дату"}
										Component={
											<>
												<DatePicker
													disabled={visible}
													allowClear={false}
													format={dateFormatList}
													locale={locale}
													style={{
														width: 350,
													}}
													defaultValue={DataRef.current.momentData}
													// defaultValue={moment(props?.mitwork_data)}
													placeholder={"Внесите дату регистрации на `Митворге`"}
													onChange={(moment, data) => {
														DataRef.current = {
															momentData: moment,
															dataString: data,
														};													}}
												/>
											</>
										}
									/>
								</>
							}
						/>

						<Divider type="horizontal" />
						<FormItemWithProps
							Title={"Митворг номер: "}
							Component={
								<>
									<IfDef
										variable={props?.mitwork_number}
										Text={"Установить номер"}
										Component={
											<>
												<Input
													disabled={visible}
													style={{
														width: 350,
													}}
													defaultValue={InputNumber}
													placeholder={"Внесите номер договора на `Митворге`"}
													onChange={(value) => {
														setInputNumber(value.target.value);
													}}
													ref={refInputNumber}
												/>
											</>
										}
									/>
								</>
							}
						/>
					</FormWrap>
				</Panel>
			</Collapse>
		</>
	);
};

/**
 * `FragmentMitWork` Фрагмент который отображает Номер и дату на митворге(в бд) согласно id документа
 * @param {number}  `mitwork_number` Номер на митворге
 * @param {number}  `mitwork_data` Дата на митворге
 */

export const FragmentMitWork = (props) => {
	return (
		<>
			<Collapse defaultActiveKey={["1"]}>
				<Panel header={<b>Митворг</b>} key="1">
					<FormWrap>
						<FormItemWithProps
							Title={"Дата регистрации на Митворге: "}
							Component={<>{props?.mitwork_data}</>}
						/>

						<Divider type="horizontal" />
						<FormItemWithProps
							Title={"Митворг номер: "}
							Component={<>{props?.mitwork_number}</>}
						/>
					</FormWrap>
				</Panel>
			</Collapse>
		</>
	);
};
