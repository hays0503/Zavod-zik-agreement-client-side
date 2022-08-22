import {EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Radio, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate } from '../../../../../../core/functions';
import constants from "../../../../../../config/constants";
import UploadFile from '../../../../modals/UploadFile';

import FromUserEditToApproveConfirm from './dialogs/FromUserEditToApproveConfirm';
import DeleteFile from '../../common/DeleteFile'

const { Title, Link } = Typography;
const { Step } = Steps;

const price_pattern= /^\d+$/;

let Update3 = React.memo((props) => {
    let user = useUser();

    const [state, setState] = useState({
        log_username: user.username,
    });

    let OpenDocument = async (item) => {
        console.log("PROPS", item.id)
        const tmp = await fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { item }
            )
        })
        const content = await tmp.json();
        if (content != undefined) {
        }
    }

    useEffect(() => { props.form3.setFieldsValue(state) }, [state]);
    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    useEffect(() => {
        if (props.initialValues3) {
            setState({
                id: props.initialValues3.documents[0].id,
                title: props.initialValues3.documents[0].title,
                position: props.initialValues3.documents[0].position,
                username: props.initialValues3.documents[0].username,
                fio: props.initialValues3.documents[0].fio,

                price: props.initialValues3.documents[0].data_agreement_list_production[0].price,
                subject: props.initialValues3.documents[0].data_agreement_list_production[0].subject,
                currency: props.initialValues3.documents[0].data_agreement_list_production[0].currency,
                executor_name_division: props.initialValues3.documents[0].data_agreement_list_production[0].executor_name_division,
                executor_phone_number: props.initialValues3.documents[0].data_agreement_list_production[0].executor_phone_number,
                counteragent_contacts: props.initialValues3.documents[0].data_agreement_list_production[0].counteragent_contacts,

                date_created: props.initialValues3.documents[0].date_created,
                date_modified: props.initialValues3.documents[0].date_modified,
                route_id: props.initialValues3.documents[0].route_id.id,
                status_in_process: props.initialValues3.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues3.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues3.documents[0].route_id.status_finished,
                status_id: props.initialValues3.documents[0].status_id,
                route: props.initialValues3.documents[0].route_data,
                step: props.initialValues3.documents[0].step,
                comments: props.initialValues3.documents[0].comments,
                signatures: props.initialValues3.documents[0].signatures,
                files: props.initialValues3.documents[0].files,
                log_username: state.log_username
            });
            setStepCount({ step: props.initialValues3.documents[0].step })
            setRoutesList(props.initialValues3.documents[0].route_data)
        }
    }, [props.initialValues3]);

    let download = async (e) => {
        let id = e.target.dataset.fileid
        await fetch("/get-file", {
            method: "POST",
            body: JSON.stringify({ id: e.target.dataset.fileid }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json()
        }).then(response => {
            let result = response.result
            let link = document.createElement('a')
            link.href = result.data_file
            link.download = result.filename
            link.click()
        })
    }

    let onFinish = (values) => {
        props.onFinish3(state);
        console.log('+++++++++++++++++++++++', values);
    }

    let radioOptions = [
        { label: 'Закупки товаров, работ и услуг', value: 'Закупки товаров, работ и услуг' },
        { label: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам', value: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам' },
        { label: 'Передача имущества в аренду (бесплатное пользование)', value: 'Передача имущества в аренду (бесплатное пользование)' },
        { label: 'Совместная деятельность', value: 'Совместная деятельность' },
        { label: 'Финансирование (кредитование, обеспечение исполнения обязательств)', value: 'Финансирование (кредитование, обеспечение исполнения обязательств)' },
        { label: 'Прочие обязательства', value: 'Прочие обязательства' }
    ]
    const [radioState, setRadioState] = useState(1);

    const RadioOnChange = (radioValue) => {
        setRadioState(radioValue.target.value);
    };

    return (
        <Form
            form={props.form3}
            name="DocumentsForm3"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}

        >
            <b>От:</b> {props?.initialValues3?.documents[0].fio} <br/>
            <b>Должность:</b> {props?.initialValues3?.documents[0].position}
            <h4><b>Тип договора:</b> ЛИСТ СОГЛАСОВАНИЯ НА ЗАКУП ТРУ ДЛЯ ПРОИЗВОДСТВА ПРОДУКЦИИ</h4>

            <Divider type={'horizontal'} />
            <Form.Item
                name="title"
                label='Наименование контрагента'
                labelCol={{ span: 24 }}
                className='form-input-label'
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование контрагента" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='Предмет договора'
                labelCol={{ span: 24 }}
                className='form-checkbox'
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                ]}
            >
                <Radio.Group disabled={props.disabled} onChange={RadioOnChange} options={radioOptions} className='form-radio' value={radioState} />
            </Form.Item>
            <Form.Item
                name="price"
                label="Общая сумма договора"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Form.Item
                name="currency"
                label="Валюта платежа"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Валюта платежа" />
            </Form.Item>
            <Form.Item
                name='executor_name_division'
                label='Наименование подразделения, фамилия ответственного исполнителя'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование подразделения, фамилия ответственного исполнителя" />
            </Form.Item>
            <Form.Item
                name='executor_phone_number'
                label='Телефон исполнителя'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Телефон исполнителя" />
            </Form.Item>
            <Form.Item
                name='counteragent_contacts'
                label='Контакты контрагента'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Контакты контрагента" />
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                label="Файлы"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо загрузить хотя бы один файл.',
                    }
                ]}
            >
                <UploadFile
                    showUploadList={true}
                    action={"https://" + constants.host + ":" + constants.port + "/document-control/orders"}
                    multiple={true}
                    maxCount={50}
                    onChange={(info) => {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                            console.log('info.file', info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} - загружен успешно.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} - ошибка при загрузке.`);
                        }
                    }}
                />
            </Form.Item>
            {props?.initialValues3?.documents[0].files.map((item) => {
                    return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> 
                            <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />}/> 
                            <DeleteFile item={item} dataProps={props} setState={setState} user={user}/>
                            <br />
                        </div>
                    </>)
                })}
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues3?.documents[0].signatures.map((item) => {  //remove commentsList
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
                <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
                    {
                        routesList.map((item) => {
                            return (
                                <Step title={item.positionName} />
                            )
                        })
                    }
                </Steps>
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="reason"
                label="Замечание"
                labelCol={{ span: 24 }}
            >
            </Form.Item>
            <div>
                {props?.initialValues3?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                        </span>
                    )
                })}
            </div>
            <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <FromUserEditToApproveConfirm dataProps={props} setState={setState} user={user} />
                </Col>
                <Col span={24} className="marginTop">
                    <Button onClick={props.modalCancelHandler}>
                        Отменить
                    </Button>
                    <Divider type={'vertical'} />
                    <Button onClick={props.modalEnableEditHandler}>
                        Редактировать
                    </Button>
                </Col>
            </Row> 
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="comments"
                label="Комментарии"
                labelCol={{ span: 24 }}
            >
                <Button disabled={props.disabled} onClick={props.HandleComment} className="marginTop">Оставить комментарий</Button>
                {props.commentsList.map((item) => {
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
            <Form.Item
                name="date_created"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="route_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="status_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="step"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="log_username"
                hidden={true}
            >
            </Form.Item>
        </Form>
    )
});

export default Update3;