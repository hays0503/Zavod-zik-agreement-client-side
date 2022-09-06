import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Divider, Row, Col, Typography,Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate, getDiffHours } from '../../../../../../core/functions';

import SelectReplacementDialog from '../../../../dialogs/SelectReplacementDialog';

let Update2 = React.memo((props) => {
    let user = useUser();
    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;

    const { Step } = Steps;
    const [visible, setVisible] = useState(false);
    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })

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
                { user:Number(user.id),item:item.id }
            )
        })
        const content = await tmp.json();
        if (content != undefined) {
            console.log("RESULT", content)
        }
    }

    useEffect(() => { props.form2.setFieldsValue(state) }, [state]);

    useEffect(() => {
        if (props.initialValues2) {
            console.log('props.initialValues 22222', props.initialValues2)
            setState({
                id: props.initialValues2.documents[0].id,
                title: props.initialValues2.documents[0].title,
                position: props.initialValues2.documents[0].position,
                username: props.initialValues2.documents[0].username,
                fio: props.initialValues2.documents[0].fio,

                price: props.initialValues2.documents[0].data_agreement_list[0].price,
                subject: props.initialValues2.documents[0].data_agreement_list[0].subject,

                currency_price: props.initialValues2.documents[0].data_agreement_list[0].currency_price,
                executor_name_division: props.initialValues2.documents[0].data_agreement_list[0].executor_name_division,
                sider_signatures_date: props.initialValues2.documents[0].data_agreement_list[0].sider_signatures_date,
                received_from_counteragent_date: props.initialValues2.documents[0].data_agreement_list[0].received_from_counteragent_date,

                date_created: props.initialValues2.documents[0].date_created,
                date_modified: props.initialValues2.documents[0].date_modified,
                route_id: props.initialValues2.documents[0].route_id.id,
                status_in_process: props.initialValues2.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues2.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues2.documents[0].route_id.status_finished,
                status_id: props.initialValues2.documents[0].status_id,
                route: props.initialValues2.documents[0].route_data,
                step: props.initialValues2.documents[0].step,
                comments: props.initialValues2.documents[0].comments,
                signatures: props.initialValues2.documents[0].signatures,
                files: props.initialValues2.documents[0].files,
                log_username: state.log_username
            });
            console.log('props.initialValues 2', props.initialValues2)
            setStepCount({ step: props.initialValues2.documents[0].step })
            setRoutesList(props.initialValues2.documents[0].route_data)
        }
    }, [props.initialValues2]);


    let onFinish = (values) => {
        props.onFinish2(state);
        console.log('+++++++++++++++++++++++', values);
    }

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

    let radioOptions = [
        {label:'Закупки товаров, работ и услуг', value:'1'},
        {label:'Поставка продукции (выполнение работ, оказание услуг) заказчикам',value:'2'},
        {label:'Передача имущества в аренду (бесплатное пользование)',value:'3'},
        {label:'Совместная деятельность',value:'4'},
        {label:'Финансирование (кредитование, обеспечение исполнения обязательств)',value:'5'},
        {label:'Прочие обязательства',value:'6'}
    ]
    const[radioState, setRadioState] = useState(props?.initialValues2?.documents[0]?.data_agreement_list[0]?.subject);

    const RadioOnChange = (radioValue) => {
        setRadioState(radioValue.target.value);
    };

    return (
        <Form
            form={props.form2}
            name="DocumentsForm2"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}

        >
            <h4><b>Тип договора:</b> Лист согласования на реализацию готовой продукции</h4>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Наименование контрагента:</Col> <Col span={12}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Предмет договора:</Col> <Col span={12}>{state.subject}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>Общая сумма договора в валюте цены договора:</Col> <Col span={12}>{state.price}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>Общая сумма договора в тенге, по курсу НБ РК:</Col> <Col span={12}>{state.currency_price}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>Наименование подразделения, фамилия ответственного исполнителя:</Col> <Col span={12}>{state.executor_name_division}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента:</Col> <Col span={12}>{state.sider_signatures_date}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>Дата получение проекта договора, способ получения от контрагента:</Col> <Col span={12}>{state.received_from_counteragent_date}</Col>
                </Row>
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues2?.documents[0].files.map((item) => {
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
                {props?.initialValues2?.documents[0].signatures.map((item) => {  //remove commentsList
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
                <SelectReplacementDialog visible={visible} setVisible={setVisible} setRoutesList={setRoutesList} routesList={routesList} stepCount={stepCount}
                    routeData={props?.initialValues2?.documents[0]?.route_data} form={props.form} />
                <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
                    {
                        props?.initialValues2?.documents[0].route_data.map((item, i) => {
                            return (
                                <>
                                    <Step
                                        title={item.positionName}
                                        onClick={() => {
                                            console.log('step click', item);
                                            if (props.initialValues2.documents[0].step == i + 1) {
                                                setVisible(true)
                                            }
                                        }}
                                        subTitle={
                                            i == stepCount.step - 1 && state?.signatures?.length > 0 || stepCount.step == 1 ?
                                                (() => {
                                                    if (stepCount.step == 1 && i == 0) {
                                                        let tmpD = getDiffHours(new Date(state.date_created), new Date());
                                                        console.log('tmpD1', tmpD)
                                                        return tmpD?.toString()
                                                    }
                                                    if (i != 0 && state?.signatures[i - 1]?.date_signature) {
                                                        let tmpD = getDiffHours(new Date(state.signatures[state.signatures.length - 1].date_signature), new Date());
                                                        console.log('tmpD2', tmpD)
                                                        return tmpD?.toString()
                                                    }
                                                })()
                                                : null
                                        }
                                    />
                                </>
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
                {props?.initialValues2?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                        </span>
                    )
                })}
            </div>
            {/* <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteForward2}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteBackward}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
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
            </Row> */}
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="comments"
                label="Комментарии"
                labelCol={{ span: 24 }}
            >
                <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange}/>
                <Button onClick={props.HandleComment} className="marginTop">Оставить комментарий</Button>
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



export default Update2;