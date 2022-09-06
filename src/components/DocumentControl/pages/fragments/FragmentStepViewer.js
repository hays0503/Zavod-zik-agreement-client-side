import { Form, Steps } from 'antd';
import React from 'react';
import { formatDate } from '../../../../core/functions';

 const { Step } = Steps;

/**
 * Фрагмент antd дающую возможность просматривать состояние движений документов 
 * @param props.signatures 
 * @param props.stepsDirection Направление "шагов" в движение документов
 * @param props.step Этап("шаг") движение документов
 * @param props.routesList Массив "шагов" движений документов
 */

let FragmentStepViewer = (props) => {
    return (     
        <Form.Item
        className='font-form-header'
        name="signatures"
        label="Подписи"
        labelCol={{ span: 24 }}
    >
        {props?.signatures.map((item) => {  //remove commentsList
            return (<>
                <div className='signature-view-wrap'>
                    <span className='signature-view-position'>
                        {item.position}
                    </span>
                    <span className='signature-view-username'>
                        {item.fio}
                    </span>
                    <span className='signature-view-date'>
                        {formatDate(item.date_signature)}
                    </span>
                </div>
            </>)
        })}
        <Steps
            labelPlacement="vertical"
            size="small"
            direction={props?.stepsDirection.current}
            responsive={true}
            current={props?.step}
            className="steps-form-update">
            {
                props?.routesList.map((item) => {
                    return (
                        <Step title={item.positionName} />
                    )
                })
            }
        </Steps>
    </Form.Item>
)
}

FragmentStepViewer.defaultProps = {stepsDirection: 'vertical'};

export default FragmentStepViewer





