import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Typography, Space, Divider, Row, Col, Steps, Collapse, Table, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate } from '../../../../../../core/functions';
import UploadFile from '../../../../modals/UploadFile';
import constants from '../../../../../../config/constants'

let Update4 = React.memo((props) => {
    let user = useUser();
    const { Link } = Typography;

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

    let tasksFilesMap = state?.task_files?.map((item) => {
        return item.toString()
    })

    const result = props?.document?.files?.filter(i => tasksFilesMap?.includes(i.id));

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

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);

    useEffect(() => {
        if (props.initialValues) {
            setState({
                id: props.initialValues.document_tasks[0].id,
                document_id: props.initialValues.document_tasks[0].document_id,
                status: props.initialValues.document_tasks[0].status,
                is_cancelled: props.initialValues.document_tasks[0].is_cancelled,
                note: props.initialValues.document_tasks[0].note,
                deadline: props.initialValues.document_tasks[0].deadline,
                date_created: props.initialValues.document_tasks[0].date_created,
                fio_created: props.initialValues.document_tasks[0].fio_created,
                user_id_created: props.initialValues.document_tasks[0].user_id_created,
                user_id_receiver: props.initialValues.document_tasks[0].user_id_receiver,
                fio_receiver: props.initialValues.document_tasks[0].fio_receiver,
                route_id: props.initialValues.document_tasks[0].route_id,
                document_options: props.initialValues.document_tasks[0].document_options,
                task_files: props.initialValues.document_tasks[0].task_files,
                log_username: state.log_username,
                report: props.initialValues.document_tasks[0].report ? props.initialValues.document_tasks[0].report : '',
                document_tasks_files: props.initialValues.document_tasks[0].document_tasks_files ? props.initialValues.document_tasks[0].document_tasks_files : [],
                task_statuses: props.initialValues.document_tasks[0].task_statuses
            });
        }
    }, [props.initialValues]);

    let onFinish = (values) => {
        values.type = 1
        values.user_id_created = state.user_id_created
        props.onFinish(values)
        console.log('values2222', values)
    }

    return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
        >
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>ФИО поручителя: </Col> <Col span={12}>{state.fio_created}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Задание: </Col> <Col span={12}>{state.note}</Col>
                </Row>
            </div>

            <Divider type={'horizontal'} />

            <h3 className='marginTop'><b>Информация о договоре</b></h3>

            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Тип договора: </Col>
                    <Col span={12}>{props?.document?.route_id?.name}</Col>
                </Row>
            </div>
            {(state?.document_options?.title == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Наименование: </Col>
                        <Col span={12}>{props?.document?.title}</Col>
                    </Row>
                </div> : ''
            }
            {(state?.document_options?.subject == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Основание: </Col>
                        <Col span={12}>{props?.document?.data_custom[0]?.subject}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.price == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Примечание: </Col>
                        <Col span={12}>{props?.document?.data_custom[0]?.remark}</Col>
                    </Row>
                </div>
                : ''
            }
            <Divider type={'horizontal'} />

            <h3 className='marginTop'><b>Файлы прикреплённые отправителем</b></h3>

            {result?.map((file) => {
                return (<>
                    <div className='document-view-wrap'>
                        <Link><a data-fileid={file.id} onClick={download}>{file.filename}</a></Link> <Button onClick={() => { OpenDocument(file) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}

            <Divider type={'horizontal'} />

            {
                (state.status != 2) ?
                    <>
                        <Form.Item
                            name='report'
                            className='font-form-header'
                            label='Отчёт'
                            labelCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Необходимо загрузить хотя бы один файл.',
                                }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="files"
                            className='font-form-header'
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
                                action={"https://" + constants.host + ":" + constants.port + "/document-control/for-execution-inbox"}
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
                    </>
                    :
                    <div>
                        <h3><b>Отчёт</b></h3>
                        {state.report ? state.report : ''}
                        <Divider type={'horizontal'} />
                        <div>
                            <h3 className='font-form-header'><b>Файлы прикреплённые исполнителем</b></h3>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                {props?.initialValues?.document_tasks[0]?.document_tasks_files.map((item) => {
                                    return (<>
                                        <Col span={24} className='document-view-wrap'>
                                            <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                                        </Col>
                                    </>)
                                })}
                            </Row>
                        </div>
                    </div>
            }

            {(state?.status == 1) ?
                <><Divider type={'horizontal'} />
                    <Button type='primary' htmlType="submit">Завершить</Button></>
                : ''
            }
        </Form>
    )
})

export default Update4