import { Divider, Select, Spin } from "antd";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const positions = gql`
	query get_free_position($positions: JSON) {
		get_free_position(positions: $positions) {
			id
			name
			id_depart
		}
	}
`;

const DepartamentDictionary = gql`
	query departament_dictionary($departament_dictionary: JSON) {
		departament_dictionary(departament_dictionary: $departament_dictionary) {
			id
			departament_name
		}
	}
`;

/**
 * @function FragmentSelectItems Выпадающий список элементов antd
 * @param {Array} Items Массив с элементами
 * @return {Index} Возвращает индекс выбранного элемента
 */
export const FragmentSelectItems = (props) => {
	console.log("props.valueprops.valueprops.valueprops.value", props.value);

	const [idDepartment, setIdDepartment] = useState(1);

	const [isClick, setClick] = useState(true);

	const QueryDepartment = useQuery(positions, {
		onCompleted: (Data) => {
			console.log("onCompleted:(Data)", Data);
			console.log("onCompleted:(Data)", QueryDepartment.data);
		},
		variables: {
			positions: {
				global: {
					id_depart: `=${idDepartment}`,
				},
			},
		},
	});

	// Запрос словаря с наименованием департаментов
	const { loading, error, data } = useQuery(DepartamentDictionary);
	// Возникла ошибка
	if (error) return <p>Ошибка: {error.message}</p>;
	// Если загрузка показываем прелоадер
	if (loading || !data)
		return (
			<>
				<Spin />
				"Загрузка FragmentSelectItems !"
			</>
		);
	// Отображение списка с наименованием департаментов

	const onChange = (value) => {
		console.log(`selected ${value}`);
		setIdDepartment(value);
		setClick(false);
	};

	return (
		<>
			<h2>Наименование департаментов</h2>
			<Select
				showSearch
				style={{
					width: 200,
				}}
				placeholder="Search to Select"
				optionFilterProp="children"
				filterOption={(input, option) => option.children.includes(input)}
				filterSort={(optionA, optionB) =>
					optionA.children
						.toLowerCase()
						.localeCompare(optionB.children.toLowerCase())
				}
				onChange={onChange}
			>
				{data.departament_dictionary.map((Item) => {
					return (
						<Select.Option value={Item.id}>
							{Item.departament_name}
						</Select.Option>
					);
				})}
			</Select>
			<Divider type="vertical" />
			{console.log(
				(QueryDepartment?.data?.get_free_position !== undefined &&
					QueryDepartment?.data?.get_free_position.length === 0) ||
					isClick
			)}

			<Select
				showSearch
				style={{
					width: 200,
				}}
				placeholder="Search to Select"
				optionFilterProp="children"
				filterOption={(input, option) => option.children.includes(input)}
				filterSort={(optionA, optionB) =>
					optionA.children
						.toLowerCase()
						.localeCompare(optionB.children.toLowerCase())
				}
				disabled={
					(QueryDepartment?.data?.get_free_position !== undefined &&
						QueryDepartment?.data?.get_free_position.length === 0) ||
					isClick
				}
				onChange={(value) => {
					console.log("Второй выпадающий список", value);
					props.onChange([value]);
				}}
			>
				{QueryDepartment.data?.get_free_position.map((Item) => {
					return <Select.Option value={Item.id}>{Item.name}</Select.Option>;
				})}
			</Select>
		</>
	);
};
