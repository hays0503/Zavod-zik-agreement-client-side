import { Form, Steps, Input, Button } from "antd";
import React from "react";
import { MessageTwoTone, SafetyCertificateTwoTone } from "@ant-design/icons";

const { Step } = Steps;

/**
 * Фрагмент antd дающую возможность просматривать комментарии к документам
 * @param HandleCommentOnChange
 * @param disabled
 * @param HandleComment
 * @param commentsList
 * @param item
 */
let FragmentCommentsViewer = (props) => {
	return (
		<Form.Item
			className="font-form-header"
			name="comments"
			label="Комментарии"
			labelCol={{ span: 24 }}
		>
			{
				//Если определены флаг disable и callback функция то выводим Input
				props?.disabled != undefined &&
					props?.HandleCommentOnChange != undefined && (
						<>
							<Input.TextArea
								rows={7}
								name="comment"
								onChange={props.HandleCommentOnChange}
								disabled={props.disabled}
							/>

							<Button
								disabled={props.disabled}
								onClick={() => {
									props.HandleComment(props.form);
								}}
								className="marginTop"
							>
								Оставить комментарий
							</Button>
						</>
					)
			}
			{props?.commentsList !== undefined &&
			props?.commentsList?.length !== undefined &&
			props?.commentsList?.length !== 0 ? (
				props?.commentsList.map((item) => {
					return (
						<div className="comments">
							<li className="comment-item">
								<span className="user-position-comment">{item.position}</span>
								<span className="user-name-comment"> ({item.fio}) </span>
								<span className="user-date-time-comment">{item.date}</span>
								<br />
								<span className="comment">{item.comment}</span>
							</li>
						</div>
					);
				})
			) : (
				<div style={{ fontSize: "1.3rem" }}>
					<SafetyCertificateTwoTone twoToneColor={"rgb(10,170,10)"} />
					На данный момент комментариев к текущему документу нет.
					<MessageTwoTone twoToneColor={"rgb(10,180,10)"} />
				</div>
			)}
		</Form.Item>
	);
};
export default FragmentCommentsViewer;
