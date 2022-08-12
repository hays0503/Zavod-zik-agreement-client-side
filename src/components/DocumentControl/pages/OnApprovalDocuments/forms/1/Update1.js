import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Collapse, Table, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useUser, formatDate, handlerQuery } from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'
import { gql, useMutation } from '@apollo/client';
import UploadFile from '../../../../modals/UploadFile';
import constants from "../../../../../../config/constants";

//pop confirm
import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//zip
import JSZip from "jszip"
import DonwloadMultipleZip from '../../../../../../core/util/DonwloadMultipleZip'
//tasks
import UpdateTask1 from './UpdateTask1'
import TasksAddDialog from '../../../../dialogs/TasksAddDialog';
import TasksTableContainer from '../../tableContainers/TasksTableContainer'
import TaskModalUpdate from '../../modals/TaskModalUpdate'


let Update1 = React.memo((props) => {

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
                    visibleModalUpdate={visibleModalUpdate} UpdateForm={UpdateTask1} GQL={DocumentTasks}
                    title='Поручение' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                <TasksAddDialog visible={visible} setVisible={setVisible} document={props.initialValues} />
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
    };

    let user = useUser();

    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    const visibleModalUpdate = useState(false);

    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;

    const { Step } = Steps;
    const { Panel } = Collapse;
    const stepsDirection = useRef('vertical');
    useEffect(() => {
        if (props?.initialValues?.documents[0]?.route_data?.length > 1)
            stepsDirection.current = props?.initialValues?.documents[0]?.route_data?.length <= 7 ? 'horizontal' : 'vertical'
    }, [props]);

    //Tasks
    const [visible, setVisible] = useState(false)

    const [state, setState] = useState({
        log_username: user.username,

    });

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

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);
    useEffect(() => {
        console.log("Props.initialValues",props.initialValues);
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,
                position: props.initialValues.documents[0].position,
                username: props.initialValues.documents[0].username,
                fio: props.initialValues.documents[0].fio,

                price: props.initialValues?.documents[0]?.data_one[0]?.price,
                supllier: props.initialValues.documents[0].data_one[0].supllier,
                subject: props.initialValues.documents[0].data_one[0].subject,

                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues.documents[0].route_id.status_finished,
                status_id: props.initialValues.documents[0].status_id,
                reason: props.initialValues.documents[0].reason,
                route: props.initialValues.documents[0].route_data,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                signatures: props.initialValues.documents[0].signatures,
                files: props.initialValues.documents[0].files,
                document_logs: props.initialValues.documents[0].document_logs,
                log_username: state.log_username
            });
            setStepCount({ step: props.initialValues.documents[0].step })
            setRoutesList(props.initialValues.documents[0].route_data)
        }
    }, [props.initialValues]);

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
        props.onFinish(state);
        // console.log('Values --++++++++++', values)
    }

    //confirmations
    const [reasonText, setReasonText] = useState(props?.initialValues?.documents[0]?.reason);
    const ReasonInputChange = (all, change) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    };

    //collapse
    function callback(key) {
        // console.log(key);
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

    //   let zip = new JSZip();
    // zip.file("Hello.txt", "Hello World\n");
    // let img = zip.folder("images");
    // img.file("smile.pdf", imgData, { base64: true });

    // zip.generateAsync({ type: "blob" }).then(function (content) {
    //     // see FileSaver.js
    //     console.log('content', content)
    //     let link = document.createElement('a')
    //     let url = window.URL || window.webkitURL;
    //     link.href = url.createObjectURL(content) 
    //     link.download = 'test.zip'
    //     link.click()
    //     //saveAs(content, "example.zip");
    // });

    return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}
        >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8}> <b>От: </b></Col> <Col span={16}>{props?.initialValues?.documents[0].fio}</Col>
                <Col span={8}><b>Должность: </b></Col> <Col span={16}>{props?.initialValues?.documents[0].position}</Col>
                <Col span={8}><b>Тип договора: </b></Col> <Col span={16}>Закуп ТРУ</Col>
            </Row>

            <Divider type={'horizontal'} />

            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Наименование ТРУ: </b></Col> <Col span={16}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Поставщик ТРУ: </b></Col> <Col span={16}>{state.supllier}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Основание: </b></Col> <Col span={16}>{state.subject}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Общая сумма договора: </b></Col> <Col span={16}>{state.price}</Col>
                </Row>
            </div>
            
            <Divider type={'horizontal'} />

            {
            /* <Form.Item
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
                    accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}
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
            </Form.Item> */
            }

            <Collapse defaultActiveKey={['2']} onChange={callback}>
                <Panel header={<b>Прикреплённые файлы</b>} key="2">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        {props?.initialValues?.documents[0].files.map((item) => {
                            return (<>
                                <Col span={12} className='document-view-wrap'>
                                    <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link>
                                    <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                                </Col>
                            </>)
                        })}
                    </Row>
                </Panel>
            </Collapse>
            <Divider type={'horizontal'} />
            {/* <Button onClick={() => { console.log('test') }}>Download Pdf</Button> */}
            {/* <Button onClick={() => { DonwloadMultipleZip(props?.initialValues?.documents[0].files, 'test2.zip') }}>Download Zip</Button> */}
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues?.documents[0].signatures.map((item) => {  //remove commentsList
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
                    direction={stepsDirection.current}
                    responsive={true}
                    current={stepCount.step - 1}
                    className="steps-form-update">
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
                {props?.initialValues?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                    </span>
                    )
                })}
            </div>

            <Divider type={'horizontal'} />

            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header="Созданные мною поручения по данному договору" key="1">
                    {/* <Button title={'Создать новое поручение по данному договору'} onClick={() => { setVisible(true) }} icon={<PlusOutlined />} /> */}
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
                <Button disabled={props.disabled} onClick={() => { props.HandleComment(props.form) }} className="marginTop">Оставить комментарий</Button>
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

export default Update1;