import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Typography, Divider, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../core/functions';
import { FileDownload, FileOpenDocument, TaskFileDownload, TaskFileOpenDocument } from '../../../api/CRU_Document';

let Update2 = React.memo((props) => {
    let user = useUser();
    const { Link } = Typography;

    const [state, setState] = useState({
        log_username: user.username,
    });

    let tasksFilesMap = state?.task_files?.map((item) => {
        return item.toString()
    })

    const result = props?.document?.files?.filter(i => tasksFilesMap?.includes(i.id));

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
                report: props.initialValues.document_tasks[0].report,
                document_tasks_files: props.initialValues.document_tasks[0].document_tasks_files,
                log_username: state.log_username,
                task_statuses: props.initialValues.document_tasks[0].task_statuses
            });
        }
    }, [props.initialValues]);

    let onFinish = () => {
        // props.onFinish(state)
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
                    <Col span={12}>Тип договора: </Col> <Col span={12}>{props?.document?.route_id?.name}</Col>
                </Row>
            </div>
            {(state?.document_options?.title == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Наименование контрагента: </Col> <Col span={12}>{props?.document?.title}</Col>
                    </Row>
                </div> : ''
            }
            {(state?.document_options?.subject == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Предмет договора: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.subject}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.price == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Общая сумма договора в валюте цены договора: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.price}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.currency_price == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Общая сумма договора в тенге, по курсу НБ РК: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.currency_price}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.executor_name_division == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Наименование подразделения, фамилия ответственного исполнителя: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.executor_name_division}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.sider_signatures_date == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.sider_signatures_date}</Col>
                    </Row>
                </div>
                : ''
            }
            {(state?.document_options?.sider_signatures_date == true) ?
                <div className='form-item-wrap'>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>Дата получение проекта договора, способ получения от контрагента: </Col> <Col span={12}>{props?.document?.data_agreement_list[0]?.received_from_counteragent_date}</Col>
                    </Row>
                </div>
                : ''
            }

            <Divider type={'horizontal'} />

            <h3 className='marginTop'><b>Файлы прикреплённые отправителем</b></h3>

            {result?.map((file) => {
                return (<>
                    <div className='document-view-wrap'>
                        <Link><a data-fileid={file.id} onClick={FileDownload}>{file.filename}</a></Link> <Button onClick={() => { FileOpenDocument(file) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}
            {
                (state.status === 2) ?
                    <div>
                        <Divider type={'horizontal'} />
                        <h3><b>Отчёт</b></h3>
                        {state.report ? state.report : ''}
                        <Divider type={'horizontal'} />
                        <div>
                            <h3 className='font-form-header'><b>Файлы прикреплённые исполнителем</b></h3>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                {state.document_tasks_files.map((item) => {
                                    return (<>
                                            <Link><a data-fileid={item.id} onClick={TaskFileDownload}>{item.filename}</a></Link>
                                            <Button onClick={() => { TaskFileOpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                                    </>)
                                })}
                            </Row>
                        </div>
                    </div>
                    : ''
            }

            {(state?.status === 1 && state?.user_id_created !== user.id) ?
                <><Divider type={'horizontal'} />
                    <Button type='primary' htmlType="submit">Завершить</Button></>
                : ''
            }
        </Form>
    )
})

export default Update2