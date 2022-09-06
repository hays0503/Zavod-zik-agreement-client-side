import { Form, Steps, Input, Button } from 'antd';
import React from 'react';
import { formatDate } from '../../../../core/functions';

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
        className='font-form-header'
        name="comments"
        label="Комментарии"
        labelCol={{ span: 24 }}
    >
        <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange} disabled={props.disabled} />
        <Button disabled={props.disabled} onClick={() => { props.HandleComment(props.form) }} className="marginTop">Оставить комментарий</Button>
        {props?.commentsList.map((item) => {
            return (
                <div className='comments'>
                    <li className='comment-item'>
                        <span className='user-position-comment'>{item.position}</span>
                        <span className='user-name-comment'> ({item.fio}) </span>
                        <span className='user-date-time-comment'>{item.date}</span><br />
                        <span className='comment'>{item.comment}</span>
                    </li>
                </div>

            )
        })}
    </Form.Item>
)
}
export default FragmentCommentsViewer





