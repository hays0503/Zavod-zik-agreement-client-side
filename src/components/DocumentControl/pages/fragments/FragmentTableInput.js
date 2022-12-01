import { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { PlusCircleTwoTone } from "@ant-design/icons";

export const FragmentTableInput = (props) => {
	const [rowItem, setRowItem] = useState([]);

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
					icon={
						<PlusCircleTwoTone
							style={{ fontSize: "16px" }}
							twoToneColor={"rgb(10,180,10)"}
						/>
					}
					onClick={() => {
						console.log("Добавить еще поле");
						setRowItem([
							...rowItem,
							{
								key: "",
								data: "",
							},
						]);
					}}
				>
					Добавить еще поле
				</Button>
				<div style={{ display: "flex", width: "700px" }}>
					<table style={{ marginTop: "5px", width: "700px" }}>
						{rowItem?.map((item, iterator) => {
							let Edit = rowItem;
							return (
								<tr>
									<table style={{ marginTop: "5px", width: "700px" }}>
										<table style={{ marginTop: "5px", width: "700px" }}>
											<tr style={{ marginTop: "5px" }}>
												<td style={{ width: "300px" }}>
													<Input
														placeholder={"Наименование"}
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
														placeholder={"Содержание"}
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
