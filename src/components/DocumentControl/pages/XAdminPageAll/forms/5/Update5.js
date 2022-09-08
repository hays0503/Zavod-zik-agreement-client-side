import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Checkbox, Popconfirm, message, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate } from '../../../../../../core/functions';


import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';


let Update5 = React.memo((props) => {
    let user = useUser();
    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;
    const { Step } = Steps;

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
                { user: Number(user.id), item: item.id }
            )
        })
        const content = await tmp.json();
        if (content != undefined) {
            console.log("RESULT", content)
        }
    }
    useEffect(() => {
        props.form5.setFieldsValue(state);
    }, [state]);
    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    useEffect(() => {
        if (props.initialValues5) {
            setState({
                id: props.initialValues5.documents[0].id,
                title: props.initialValues5.documents[0].title,
                position: props.initialValues5.documents[0].position,
                username: props.initialValues5.documents[0].username,
                fio: props.initialValues5.documents[0].fio,

                subject: props.initialValues5.documents[0].data_custom[0].subject,
                remark: props.initialValues5.documents[0].data_custom[0].remark,

                date_created: props.initialValues5.documents[0].date_created,
                date_modified: props.initialValues5.documents[0].date_modified,
                route_id: props.initialValues5.documents[0].route_id.id,
                status_in_process: props.initialValues5.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues5.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues5.documents[0].route_id.status_finished,
                status_id: props.initialValues5.documents[0].status_id,
                route: props.initialValues5.documents[0].route_data,
                step: props.initialValues5.documents[0].step,
                comments: props.initialValues5.documents[0].comments,
                signatures: props.initialValues5.documents[0].signatures,
                files: props.initialValues5.documents[0].files,
                log_username: state.log_username
            });
            setStepCount({ step: props.initialValues5.documents[0].step })
            setRoutesList(props.initialValues5.documents[0].route_data)
        }
    }, [props.initialValues5]);

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
            link.href = result.data_file /*result.data_file.slice(result.data_file.indexOf(',')+1) */
            link.download = result.filename
            link.click()
        })
    }

    let onFinish = (values) => {
        props.onFinish5(state);
    }
    const [reasonText, setReasonText] = useState(props?.initialValues5?.documents[0]?.reason);
    let ReasonInputChange = (all, change) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    }

    let radioOptions = [
        {label:'Закупки товаров, работ и услуг', value:'1'},
        {label:'Поставка продукции (выполнение работ, оказание услуг) заказчикам',value:'2'},
        {label:'Передача имущества в аренду (бесплатное пользование)',value:'3'},
        {label:'Совместная деятельность',value:'4'},
        {label:'Финансирование (кредитование, обеспечение исполнения обязательств)',value:'5'},
        {label:'Прочие обязательства',value:'6'}
    ]
    const[radioState, setRadioState] = useState(props?.initialValues5?.documents[0]?.data_custom[0]?.subject);

    const RadioOnChange = (radioValue) => {
        setRadioState(radioValue.target.value);
    };

    return(
        <Form
        form={props.form5}
            name="DocumentsForm5"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })); console.log('UPDATE4 values',allValues)}}
        
        >
            <b>От:</b> {props?.initialValues5?.documents[0].fio} <br/>
            <b>Должность:</b> {props?.initialValues5?.documents[0].position}
            <h4><b>Тип договора:</b> Другой</h4>
            <Divider type={'horizontal'} />
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Наименование:</Col> <Col span={12}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Примечание:</Col> <Col span={12}>{state.remark}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Основание:</Col> <Col span={12}>{state.subject}</Col>
                </Row>
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues5?.documents[0].files.map((item) => {
                    return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />}/> <br />
                        </div>
                    </>)
                })}
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues5?.documents[0].signatures.map((item) => {  //remove commentsList
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
            </Form.Item>
            <Row>
            <Col span={24}>
                    <Divider type={'horizontal'} />
                    <ApproveConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                    <Divider type={'vertical'} />
                    <Space>
                        <Divider type={'vertical'} />
                        <ReturnToSenderConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                        <ReturnStepBackConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                        <Divider type={'vertical'} />
                        <RejectConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                    </Space>
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
                name="reason"
                label="Замечание"
                labelCol={{ span: 24 }}
            >
            </Form.Item>
            <div>
                <Input
                    disabled={props.disabled}
                    onChange={ReasonInputChange}
                    placeholder="Замечание" />
                {props?.initialValues5?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                    </span>
                    )
                })}
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="comments"
                label="Комментарии"
                labelCol={{ span: 24 }}
            >
                <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange} disabled={props.disabled} />
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
})

export default Update5