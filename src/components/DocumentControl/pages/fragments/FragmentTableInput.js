import { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";

export const FragmentTableInput = (props) => {
	const [rowItem, setRowItem] = useState([
		{ key: "Опишите для чего это поле", data: "Внесите информацию в это поле" },
	]);

	useEffect(() => {
		console.log(rowItem);
	}, [rowItem]);

	return (
		<>
			<Form.Item
				name={"custom_area"}
				label={"Дополнительные поля"}
				labelCol={{ span: 24 }}
			>
				<Button
					onClick={() => {
						console.log("Добавить еще поле");
						setRowItem([
							...rowItem,
							{
								key: "Опишите для чего это поле",
								data: "Внесите информацию в это поле",
							},
						]);
					}}
				>
					Добавить еще поле
				</Button>
				<div style={{ display: "flex", width: "700px" }}>
					<table style={{ marginTop: "5px", width: "700px" }}>
						{rowItem.map((item, iterator) => {
							let Edit = rowItem;
							return (
								<tr>
									<table style={{ marginTop: "5px", width: "700px" }}>
										<table style={{ marginTop: "5px", width: "700px" }}>
											<tr style={{ marginTop: "5px" }}>
												<td style={{ width: "300px" }}>
													<Input
														placeholder={item.key}
														onChange={(value) => {
															Edit[iterator].key =
																value.nativeEvent.srcElement.value;
															setRowItem(Edit);
															props?.form.setFieldsValue({
																custom_area: rowItem,
															});
														}}
													/>
												</td>
												<td style={{ width: "550px" }}></td>
											</tr>
										</table>
										<table style={{ marginTop: "5px", width: "700px" }}>
											<tr style={{ marginTop: "5px" }}>
												<td style={{ width: "700px" }}>
													<Input
														rows={3}
														placeholder={item.data}
														onChange={(value) => {
															Edit[iterator].data =
																value.nativeEvent.srcElement.value;
															setRowItem(Edit);
															props?.form.setFieldsValue({
																custom_area: rowItem,
															});
														}}
													/>
												</td>
											</tr>
										</table>
									</table>
								</tr>
							);
						})}
					</table>
				</div>
			</Form.Item>
		</>
	);
};
