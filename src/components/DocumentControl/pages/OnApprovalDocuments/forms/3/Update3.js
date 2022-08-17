import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Checkbox, Popconfirm, message, Radio, Collapse } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate } from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'
import { gql, useMutation } from '@apollo/client'

import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//Tasks
import TasksTableContainer from '../../tableContainers/TasksTableContainer'
import TasksAddDialog3 from '../../../../dialogs/TasksAddDialog3'
import TaskModalUpdate from '../../modals/TaskModalUpdate'
import UpdateTask3 from './UpdateTask3'
import UploadFile from './../../../../modals/UploadFile';
import constants from './../../../../../../config/constants';

let Update3 = React.memo((props) => {

    let DocumentTasks = {
        exemplar: 'document_tasks',
        table: 'document_tasks',
        options: {
            all: {
                fetchPolicy: 'standby'
            },
            one: {
                fetchPolicy: 'standby'
            }
        },
        select: {
            all: gql`
                query document_tasks ($document_tasks: JSON){
                    document_tasks(document_tasks: $document_tasks){
                        id
                        document_id
                        status
                        is_cancelled
                        note
                        deadline
                        date_created
                        user_id_created
                        fio_created
                        user_id_receiver
                        fio_receiver
                        route_id
                        document_options
                        task_files
                        report
                        document_tasks_files{
                            id
                            filename
                            data_file
                            task_id
                        }
                    }
                }
            `,
            one: gql`
            query document_tasks ($document_tasks: JSON){
                document_tasks(document_tasks: $document_tasks){
                    id
                    document_id
                    status
                    is_cancelled
                    note
                    deadline
                    date_created
                    user_id_created
                    fio_created
                    user_id_receiver
                    fio_receiver
                    route_id
                    document_options
                    task_files
                    report
                    document_tasks_files{
                        id
                        filename
                        data_file
                        task_id
                    }
                }
            }
            `
        },
        subscription: {
            all: gql`
            subscription document_tasks ($document_tasks: JSON) {
                document_tasks(document_tasks: $document_tasks) {
                    id
                    document_id
                    status
                    is_cancelled
                    note
                    deadline
                    date_created
                    user_id_created
                    fio_created
                    user_id_receiver
                    fio_receiver
                }
            }
        `
        },
        insert: gql`
        mutation insertDocumentTasks($document_tasks: JSON) {
            insertDocumentTasks(document_tasks: $document_tasks) {
                type
                message
            }
        }
        `,
        setTaskIsReadTrue: gql`
        mutation setTaskIsReadTrue($task: JSON) {
            setTaskIsReadTrue(task: $task){
                type
                message
            }
        }
        `
    }

    let TasksTitleMenu = (tableProps) => {
        return (<TitleMenu
            buttons={[
                <TaskModalUpdate
                    visibleModalUpdate={visibleModalUpdate} UpdateForm={UpdateTask3} GQL={DocumentTasks}
                    title='Поручение' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                <TasksAddDialog3 visible={visible} setVisible={setVisible} document={props.initialValues3} />
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
    };

    let user = useUser();
    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;
    const { Step } = Steps;
    const { Panel } = Collapse;

    const [state, setState] = useState({
        log_username: user.username,
    });
    const visibleModalUpdate = useState(false);
    const [visible, setVisible] = useState(false)

    let OpenDocument = async (item) => {
        // setBtnLoad(true)
        console.log("PROPS", item.id)
        // console.log('RECORD',props.record)
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
        props.form3.setFieldsValue(state);

    }, [state]);
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
            link.href = result.data_file /*result.data_file.slice(result.data_file.indexOf(',')+1) */
            link.download = result.filename
            link.click()
        })
    }

    let onFinish = (values) => {
        props.onFinish3(state);
        console.log('+++++++++++++++++++++++', values);
    }

    const dict = [
        {
            title: 'У кого',
            dataIndex: 'fio_receiver',
            key: 'fio_receiver',
            width: '200px'
        },
        {
            title: 'Срок',
            dataIndex: 'deadline',
            key: 'deadline',
            width: '200px'
        },
        {
            title: 'Статус',
            dataIndex: 'task_statuses',
            key: 'task_statuses',
            width: '150px'
        },
        {
            title: 'Задача',
            dataIndex: 'note',
            key: 'note',
            width: '250px'
        },
    ];

    //collapse
    function callback(key) {
        // console.log(key);
    }

    const [reasonText, setReasonText] = useState(props?.initialValues3?.documents[0]?.reason);
    let ReasonInputChange = (all, change) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    }

    let radioOptions = [
        { label: 'Закупки товаров, работ и услуг', value: '1' },
        { label: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам', value: '2' },
        { label: 'Передача имущества в аренду (бесплатное пользование)', value: '3' },
        { label: 'Совместная деятельность', value: '4' },
        { label: 'Финансирование (кредитование, обеспечение исполнения обязательств)', value: '5' },
        { label: 'Прочие обязательства', value: '6' }
    ]
    const [radioState, setRadioState] = useState(props?.initialValues3?.documents[0]?.data_agreement_list_production[0]?.subject);

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

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })); console.log('UPDATE3 values', allValues) }}

        >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}><b>От: </b></Col> <Col span={12}>{props?.initialValues3?.documents[0].fio}</Col>
                <Col span={12}><b>Должность: </b></Col> <Col span={12}>{props?.initialValues3?.documents[0].position}</Col>
                <Col span={12}><b>Тип договора: </b></Col> <Col span={12}>Лист согласования на реализацию готовой продукции</Col>
            </Row>
            <Divider type={'horizontal'} />
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Наименование контрагента: </b></Col> <Col span={12}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Предмет договора: </b></Col> <Col span={12}>{state.subject}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Общая сумма договора: </b></Col> <Col span={12}>{state.price}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Валюта платежа: </b></Col> <Col span={12}>{state.currency}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Наименование подразделения, фамилия ответственного исполнителя: </b></Col> <Col span={12}>{state.executor_name_division}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Телефон исполнителя: </b></Col> <Col span={12}>{state.executor_phone_number}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}><b>Контакты контрагента: </b></Col> <Col span={12}>{state.counteragent_contacts}</Col>
                </Row>
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                <UploadFile
                    showUploadList={true}
                    action={"https://" + constants.host + ":" + constants.port + "/document-control/orders"}
                    multiple={true}
                    maxCount={50}
                    /*accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}*/
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
            <Divider type={'horizontal'} />
            <Collapse defaultActiveKey={['2']} onChange={callback}>
                    <Panel header={<b>Прикреплённые файлы</b>} key="2">
                        {props?.initialValues3?.documents[0].files.map((item) => {
                            return (<>
                                <div className='document-view-wrap'>
                                    <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                                </div>
                            </>)
                        })}
                    </Panel>
                </Collapse>
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
                {props?.initialValues3?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                    </span>
                    )
                })}
            </div>
            <Divider type={'horizontal'} />

            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header="Созданные мною поручения по данному договору" key="1">
                <TasksTableContainer
                        data={{ dict, records: props.documentTasksList }}
                        visibleModalUpdate={visibleModalUpdate}
                        GQL={DocumentTasks}
                        title={TasksTitleMenu}
                    />
                </Panel>
            </Collapse>

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

export default Update3