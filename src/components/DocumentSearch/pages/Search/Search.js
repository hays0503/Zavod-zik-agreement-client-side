import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
	Button,
	Popconfirm,
	Col,
	Row,
	Select,
	DatePicker,
	Form,
	Input,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import {
	useUser,
	accessRedirect,
	handlerQuery,
	download,
	getDDMMYYY,
} from "../../../../core/functions";
import ModalUpdate from "../../modals/ModalUpdate";
import TableContainer from "../../tableContainers/TableContainer";
import test from "../../../../core/TrashComponent2";
import TitleMenu from "../../../../core/TitleMenu";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import moment from "moment";
import format from "date-fns/format";

import gqlMain from "../../gql/gqlMain";

import Update1 from "../../forms/1/Update1";
import Update2 from "../../forms/2/Update2";
import Update3 from "../../forms/3/Update3";
import Update4 from "../../forms/4/Update4";
import Update5 from "../../forms/5/Update5";

const { Option } = Select;

let Search = React.memo((props) => {
	let user = useUser();
	let positionsVariable = user.positions.toString();
	const { RangePicker } = DatePicker;

	let filterForm = Form.useForm();

	const visibleModalUpdate = useState(false);
	const visibleModalUpdate2 = useState(false);
	const visibleModalUpdate3 = useState(false);
	const visibleModalUpdate4 = useState(false);
	const visibleModalUpdate5 = useState(false);

	const [variables, setVariables] = useState();

	const [filters, set_filters] = useState([]);
	const [currentTableData, setCurrentTableData] = useState();

	const { loading, data, refetch } = handlerQuery(gqlMain, "all", {
		variables,
	})();

	let list =
		data && data[Object.keys(data)[0]] != null
			? data[Object.keys(data)[0]].map((item) => {
					let price = 0;
					let title = "-";
					let counteragent_name = "-";

					if (item.data_one.length != 0) {
						price = item.data_one[0].price;
						title = item.title;
						counteragent_name = item.data_one[0].supllier;
					}
					if (item.data_agreement_list.length != 0) {
						price = item.data_agreement_list[0].price;
						counteragent_name = item.title;
					}
					if (item.data_agreement_list_production.length != 0) {
						price = item.data_agreement_list_production[0].price;
						counteragent_name = item.title;
					}
					if (item.data_agreement_list_internal_needs.length != 0) {
						price = item.data_agreement_list_internal_needs[0].price;
						counteragent_name = item.title;
					}
					if (item.data_custom.length != 0) {
						title = item.title;
					}
					return {
						id: item.id,
						key: item.id,
						title: title,
						user_info: item.fio + " " + item.position,
						date_created: item.date_created,
						date_modified: item.date_modified,
						status_id: item.status_id,
						status: item.document_statuses?.name
							? item.document_statuses.name
							: "Без статуса",
						route: item.route_id?.name ? item.route_id.name : "Не задан",
						route_data: item.route_data,
						route_step: item.route_data
							? item.route_data.findIndex(
									(item) => item.positionId == positionsVariable
							  ) + 1
							: [],
						step: item.step,
						route_id: item.route_id.id,
						step_count: item.step + " из " + item.route_data?.length,
						step_name:
							item.route_data?.length > 0
								? item.route_data[item.step - 1].positionName
								: "",
						price: price,
						counteragent_name: counteragent_name,
					};
			  })
			: [];

	const [searchVariables, setSearchVariables] = useState();

	let getDocuments = async (values) => {
		//console.log('values', values)
		if (values.dateFrom == undefined && values.dateTo == undefined) {
			//console.log("undefined");
		} else if (values.dateFrom != undefined && values.dateTo != undefined) {
			let date1 = values.dateFrom._d;
			let date2 = values.dateTo._d;
			// let documentStatus = values.documentStatus ? documentStatus = values.documentStatus : ''
			// let documentType = values.documentType ? documentType = values.documentType : ''
			setVariables({
				documents: {
					global: {
						date_created: `::date<= date'${format(
							date2,
							"dd-MM-yyyy"
						)}' and date_created::date>=date'${format(date1, "dd-MM-yyyy")}'`,
						ORDER_BY: ["date_created desc"],
						// status_id:`=${documentStatus}`,
						// route_id: {id:`=${documentType}`}
					},
				},
			});
		}
		refetch();
	};

	let dict = test([
		{
			title: "Наименование договора",
			dataIndex: "title",
			width: "134px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.title.localeCompare(b.title),
			sortDirections: ["ascend", "descend"],
		},
		{
			title: "Имя контрагента",
			dataIndex: "counteragent_name",
			width: "130px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.counteragent_name.localeCompare(b.counteragent_name),
			sortDirections: ["ascend", "descend"],
		},
		{
			title: "Цена",
			dataIndex: "price",
			width: "55px",
			tooltip: true,
			sorter: (a, b) => a.price - b.price,
			sortDirections: ["ascend", "descend"],
		},
		{
			title: "Дата и время создания",
			dataIndex: "date_created",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: true,
			sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created),
		},
		{
			title: "Последние изменение",
			dataIndex: "date_modified",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: true,
			sorter: (a, b) => new Date(a.date_modified) - new Date(b.date_modified),
		},
		{
			title: "Тип договора",
			dataIndex: "route",
			width: "114px",
			type: "search",
			tooltip: true,
			sorter: (a, b) => a.route.localeCompare(b.route),
			sortDirections: ["ascend", "descend"],
		},
		{
			title: "Статус",
			dataIndex: "status",
			width: "80px",
			tooltip: true,
			sorter: (a, b) => a.status.localeCompare(b.status),
			sortDirections: ["ascend", "descend"],
		},
		{ title: "На подписи", dataIndex: "step_name", width: "114px" },
		{ title: "Этап", dataIndex: "step_count", width: "55px" },
	]);

	let titleMenu = (tableProps) => {
		return (
			<TitleMenu
				buttons={[
					<Button onClick={getExcel}>Выгрузить в таблицу в Excel</Button>,
					<ModalUpdate
						visibleModalUpdate={visibleModalUpdate}
						GQL={gqlMain}
						UpdateForm={Update1}
						visibleModalUpdate2={visibleModalUpdate2}
						GQL2={gqlMain}
						UpdateForm2={Update2}
						visibleModalUpdate3={visibleModalUpdate3}
						GQL3={gqlMain}
						UpdateForm3={Update3}
						visibleModalUpdate4={visibleModalUpdate4}
						GQL4={gqlMain}
						UpdateForm4={Update4}
						visibleModalUpdate5={visibleModalUpdate5}
						GQL5={gqlMain}
						UpdateForm5={Update5}
						title="Согласование договора"
						selectedRowKeys={tableProps.selectedRowKeys}
						update={true}
						width={750}
					/>,
				]}
				selectedRowKeys={tableProps.selectedRowKeys}
			/>
		);
	};
	let getExcel = () => {
		//console.log("currentTableData Excel //////////", currentTableData);
		fetch("/api/tabledata", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ currentTableData }),
		});
		(async () => {
			await download(
				"/api/tabledata",
				"Список договоров " + getDDMMYYY(new Date()) + ".xlsx"
			);
		})();
	};

	const dateFormat = "YYYY-MM-DD HH:mm:ss";

	let onChange = (pagination, filters, sorter, extra) => {
		setCurrentTableData(extra.currentDataSource);
		set_filters(filters);
	};

	return (
		<span>
			<Form
				onFinish={getDocuments}
				// form={filterForm}
				name="filterForm"
				onValuesChange={(changedValues, allValues) => {
					setSearchVariables(
						Object.assign({}, searchVariables, { ...allValues })
					);
				}}
			>
				<Row
					style={{
						paddingLeft: "10px",
						paddingRight: "10px",
						marginBottom: "15px",
						marginTop: "15px",
					}}
				>
					<Col span={2} style={{ marginRight: "25px" }}>
						От:
						<Form.Item name="dateFrom">
							<DatePicker
								format={dateFormat}
								locale={locale}
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
					<Col span={2} style={{ marginRight: "25px" }}>
						До:
						<Form.Item name="dateTo">
							<DatePicker
								format={dateFormat}
								locale={locale}
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
					<Col span={4} style={{ marginRight: "25px" }}>
						Выберите тип договора:
						<Form.Item name="documentType">
							<Select style={{ width: "100%" }}>
								<Option value={10}>Закуп ТРУ</Option>
								<Option value={24}>Реализация готовой продукции</Option>
								<Option value={26}>
									Лист согласования на закуп ТРУ для производства продукции
								</Option>
								<Option value={27}>
									Лист согласования на закуп ТРУ для внутризаводских нужд и
									капитальных затрат
								</Option>
								<Option value={29}>Другой</Option>
								<Option value={undefined}></Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={4} style={{ marginRight: "25px" }}>
						Выберите статус договора:
						<Form.Item name="documentStatus">
							<Select style={{ width: "100%" }}>
								<Option value={5}>В работе</Option>
								<Option value={4}>Утверждён</Option>
								<Option value={2}>Отклонён</Option>
								<Option value={7}>На доработке</Option>
								<Option value={undefined}></Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={2} style={{ marginRight: "25px" }}>
						Цена от:
						<Form.Item name="priceFrom">
							<Input />
						</Form.Item>
					</Col>
					<Col span={2} style={{ marginRight: "25px" }}>
						Цена до:
						<Form.Item name="priceTo">
							<Input />
						</Form.Item>
					</Col>
					<Col span={2} style={{ marginRight: "25px", marginTop: "20px" }}>
						<Button type="primary" htmlType="submit">
							Найти
						</Button>
					</Col>
				</Row>
			</Form>
			<TableContainer
				data={{ dict, records: list }}
				loading={loading ? loading : false}
				title={titleMenu}
				onChange={onChange}
				visibleModalUpdate={visibleModalUpdate}
				visibleModalUpdate2={visibleModalUpdate2}
				visibleModalUpdate3={visibleModalUpdate3}
				visibleModalUpdate4={visibleModalUpdate4}
				visibleModalUpdate5={visibleModalUpdate5}
			/>
		</span>
	);
});

export default Search;
