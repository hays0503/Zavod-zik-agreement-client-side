import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Typography, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../core/functions';
import {FileDownload} from '../../../api/CRU_Document'
import { FormItem, FormWrap } from './../../../fragments/FragmentItemWrap';
import { FileOpenDocument } from './../../../api/CRU_Document';
import { FragmentInputArea } from './../../../fragments/FragmentInputArea';
import FragmentUploader from '../../../fragments/FragmentUploader';
import { FragmentTaskFileViewer } from '../../../fragments/FragmentFileViewer';

let Update1 = React.memo((props) => {
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
            console.log("props.initialValues",props.initialValues)
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
                log_username: state.log_username, // ?
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
        props?.document !== undefined ?
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
        >
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem("ФИО поручителя: ",state.fio_created)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Задание: ",state?.note)}</FormWrap>
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            <h3 className='marginTop'><b>Информация о договоре</b></h3>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem("Тип договора: ",props?.document?.route_id?.name)}</FormWrap>
            {/* /////////////////////////////////// */}

            {console.log("state?.document_options?",state?.document_options)}
            {console.log("props?.document",props?.document)}

            {state?.document_options?.title ?
                <FormWrap>{FormItem ("Наименование ТРУ: ",props?.document.title)}</FormWrap>: null
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.supllier ?
                <FormWrap>{FormItem ("Поставщик ТРУ: ",props?.document.data_one[0].supllier)}</FormWrap>: null
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.subject ?
                <FormWrap>{FormItem ("Основание: ",props?.document.data_one[0].subject)}</FormWrap>: null
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.price ?
                <FormWrap>{FormItem ("Общая сумма договора: ",props?.document.data_one[0].price)}</FormWrap>: null
            }
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            <h3 className='marginTop'><b>Файлы прикреплённые отправителем</b></h3>
            {result?.map((file) => {
                return (<>
                    <div className='document-view-wrap'>
                        <Link><a data-fileid={file.id} onClick={FileDownload}>{file.filename}</a></Link>
                        <Button onClick={() => { FileOpenDocument(file) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            {
                (state.status !== 2) ?
                    <>
                        {/* /////////////////////////////////// */}
                        <FragmentInputArea/>
                        {/* /////////////////////////////////// */}
                        <FragmentUploader url={"/document-control/for-execution-inbox"}/>
                        {/* /////////////////////////////////// */}
                    </>
                    :                        
                    <>
                        {/* /////////////////////////////////// */}
                        <h3><b>Отчёт</b></h3>
                        {state.report?state.report:''}
                        {/* /////////////////////////////////// */}
                        <Divider type={'horizontal'} />
                        {/* /////////////////////////////////// */}
                        <>
                            <h3 className='font-form-header'>
                                <b>Файлы прикреплённые исполнителем</b>
                            </h3>
                            <FragmentTaskFileViewer files={props?.initialValues?.document_tasks[0]?.document_tasks_files}/>
                        </>
                        {/* /////////////////////////////////// */}         
                    </>
            }
            {(state?.status === 1) ?
                <><Divider type={'horizontal'} />
                    <Button type='primary' htmlType="submit">Завершить</Button></>
                : ''
            }
        </Form>:"Загрузка (пустой рендер)"
    )
})

export default Update1