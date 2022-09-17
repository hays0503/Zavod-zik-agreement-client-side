import { Table } from "antd";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UserException } from "../../api/UserException";

let TableContainer = React.memo(({ GQL, ...props }) => {
	let [selectedRowKeys, setSelectedRowKeys] = useState([]);

	let itemKeys = [];

	if (!props.loading) {
		if (props?.data?.records == undefined)
			throw new UserException("Упс. Похоже нет данных для отображение");
		itemKeys = props?.data?.records?.map((item) => {
			return item.id;
		});
	}

	const [readTrue, { loading, error }] = useMutation(GQL.setTaskIsReadTrue, {
		onCompleted: (data) => console.log("Data from mutation", data),
		onError: (error) => console.error("Error creating a post", error),
	});

	useEffect(() => {
		setSelectedRowKeys(
			selectedRowKeys.filter((item) => {
				for (var i = 0; i < itemKeys.length; i++) {
					if (itemKeys[i] == item) {
						return true;
					}
				}
				return false;
			})
		);
	}, [props.data]);

	return (
		<Table
			className="sd-tables-row-hover"
			style={{ minHeight: 168 }}
			loading={props.loading}
			columns={props?.data?.dict}
			dataSource={props?.data?.records}
			scroll={{ y: "calc(100vh - 231px)", minX: 500 }}
			size="small"
			title={
				props.title
					? () => props.title({ selectedRowKeys: selectedRowKeys })
					: null
			}
			bordered={props.bordered}
			onRow={(record, rowIndex) => {
				return {
					onClick: (event) => {
						setSelectedRowKeys([record.key, record.document_id]);
					},
					onDoubleClick: (event) => {
						if (record?.document_tasks_logs?.is_read === false) {
							readTrue({
								variables: {
									task: { id: record.document_tasks_logs.id, is_read: true },
								},
							});
							if (parseInt(record.route_id) === 10) {
								props.visibleModalUpdate[1](true);
							}
							if (parseInt(record.route_id) === 24) {
								props.visibleModalUpdate2[1](true);
							}
							if (parseInt(record.route_id) === 26) {
								props.visibleModalUpdate3[1](true);
							}
							if (parseInt(record.route_id) === 27) {
								props.visibleModalUpdate4[1](true);
							}
							if (parseInt(record.route_id) === 29) {
								props.visibleModalUpdate5[1](true);
							}
						} else {
							if (parseInt(record.route_id) === 10) {
								props.visibleModalUpdate[1](true);
							}
							if (parseInt(record.route_id) === 24) {
								props.visibleModalUpdate2[1](true);
							}
							if (parseInt(record.route_id) === 26) {
								props.visibleModalUpdate3[1](true);
							}
							if (parseInt(record.route_id) === 27) {
								props.visibleModalUpdate4[1](true);
							}
							if (parseInt(record.route_id) === 29) {
								props.visibleModalUpdate5[1](true);
							}
						}
					},
				};
			}}
			pagination={{
				pageSize: 50,
				showSizeChanger: false,
			}}
			rowClassName={(record, index) => {
				let className = "";
				if (record?.document_tasks_logs?.is_read == false) {
					className += "is_read_false";
				}
				if (record.key === selectedRowKeys[0]) {
					return "ant-table-row ant-table-row-level-0 statusSelected";
				}
				return "ant-table-row ant-table-row-level-0", className;
			}}
		/>
	);
});
export default TableContainer;
