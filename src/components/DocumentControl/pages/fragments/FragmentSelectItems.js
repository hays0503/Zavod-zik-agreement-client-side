import { Divider, Select, Spin } from "antd";
import {
	useQuery,
	gql,
} from "@apollo/client";

const positions = gql`
	query positions($positions: JSON) {
		positions(positions: $positions) {
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

const  GetPosition = async (id) => {
	// const { loading, error, data } = useQuery(positions);
	// return { loading, error, data };
};

/**
 * @function FragmentSelectItems Выпадающий список элементов antd
 * @param {Array} Items Массив с элементами
 * @return {Index} Возвращает индекс выбранного элемента
 */
export const FragmentSelectItems = (props) => {
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
		const PositionDataObject = GetPosition(value);
		console.log(
			"console.log(PositionDataObject.data)",
			PositionDataObject.data
		);
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
		</>
	);
};
