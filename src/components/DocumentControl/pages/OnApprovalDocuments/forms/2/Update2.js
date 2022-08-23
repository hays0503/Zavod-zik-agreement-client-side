import { gql } from '@apollo/client'
import { Collapse, Divider, Form, Steps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../../../../../core/functions'
import TitleMenu from '../../../../../../core/TitleMenu'

import ApproveConfirm from './dialogs/ApproveConfirm'
import RejectConfirm from './dialogs/RejectConfirm'
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm'
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm'

//Tasks
import TasksAddDialog2 from '../../../../dialogs/TasksAddDialogs2'
import TaskModalUpdate from '../../modals/TaskModalUpdate'
import UpdateTask2 from './UpdateTask2'

import FragmentUploader from '../../../fragments/FragmentUploader'
import { FragmentAnyItems } from './../../../fragments/FragmentAnyItems'
import { FragmentButtons } from './../../../fragments/FragmentButtons'
import FragmentCommentsViewer from './../../../fragments/FragmentCommentsViewer'
import {FragmentFileViewer} from './../../../fragments/FragmentFileViewer'
import { FormWrap , FormItem } from './../../../fragments/FragmentItemWrap';
import { FragmentReasonsViewer } from './../../../fragments/FragmentReasonsViewer'
import FragmentStepViewer from './../../../fragments/FragmentStepViewer'
import { FragmentTaskList } from './../../../fragments/FragmentTaskList'

let Update2 = React.memo((props) => {

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
                    visibleModalUpdate={visibleModalUpdate} UpdateForm={UpdateTask2} GQL={DocumentTasks}
                    // visibleModalUpdate={visibleModalUpdate} GQL={DocumentTasks}
                    title='Поручение' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                <TasksAddDialog2 visible={visible} setVisible={setVisible} document={props.initialValues2} />
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
    };

    let user = useUser();
    const { Title, Link } = Typography;
    const { Step } = Steps;
    const { Panel } = Collapse;

    const [state, setState] = useState({
        log_username: user.username,
    });
    const visibleModalUpdate = useState(false);
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        props.form2.setFieldsValue(state);
    }, [state]);
    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    useEffect(() => {
        if (props.initialValues2) {
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

                reason: props.initialValues2.documents[0].reason,
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
                document_logs: props.initialValues2.documents[0].document_logs,
                log_username: state.log_username
            });
            setStepCount({ step: props.initialValues2.documents[0].step })
            setRoutesList(props.initialValues2.documents[0].route_data)
        }
    }, [props.initialValues2]);


    let onFinish = (values) => {
        props.onFinish2(state);
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

    const [reasonText, setReasonText] = useState(props?.initialValues?.documents[0]?.reason);
    let ReasonInputChange = (all) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    }

    const [radioState, setRadioState] = useState(props?.initialValues2?.documents[0]?.data_agreement_list[0]?.subject);


    return (
        <Form
            form={props.form2}
            name="DocumentsForm2"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })); console.log('UPDATE2 values', allValues) }}

        >

            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem("От: ",state?.fio)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Должность: ",state?.position)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Тип договора: ","Лист согласования на реализацию готовой продукции")}</FormWrap>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Наименование ТРУ: ",state?.title)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Предмет договора: ",state?.subject)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Общая сумма договора в валюте цены договора: ",state?.price)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Общая сумма договора в тенге, по курсу НБ РК: ",state?.currency_price)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Наименование подразделения, фамилия ответственного исполнителя: ",state?.executor_name_division)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: ",state?.sider_signatures_date)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Дата получение проекта договора, способ получения от контрагента: ",state?.received_from_counteragent_date)}</FormWrap>
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} /> 

            {/* Фрагмент antd дающую возможность загружать файлы */}
            <FragmentUploader/>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/*Фрагмент antd дающую возможность просматривать файлы*/}
            {
                props.initialValues2!==undefined?
                <FragmentFileViewer files={props?.initialValues2?.documents[0]?.files} userId={user.id}/>:
                <h1>Загрузка</h1>
            }
            {/* /////////////////////////////////// */}            

            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
            {
                props.initialValues2!==undefined?
                <FragmentStepViewer
                signatures={props?.initialValues2?.documents[0]?.signatures}
                step={stepCount.step - 1}
                routesList={routesList}/>:
                <h1>Загрузка</h1>
            }
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd с кнопками для форм  */}
            <FragmentButtons
                ApproveConfirm={()=>(<ApproveConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />)}
                ReturnToSenderConfirm={()=>(<ReturnToSenderConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />)}
                ReturnStepBackConfirm={()=>(<ReturnStepBackConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />)}
                RejectConfirm={()=>(<RejectConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />)}
                modalCancelHandler={props.modalCancelHandler}
                modalEnableEditHandler={props.modalEnableEditHandler}
                reasonText={reasonText}
                props={props}
                setState={setState}
                user={user}
            />
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd для вывода Замечаний по документу */}
            <FragmentReasonsViewer 
                disabled={props.disabled}
                ReasonInputChange={ReasonInputChange}
                Reason={state?.reason}
            />
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd для вывода поручений по документам */}
            <FragmentTaskList
                dict={dict}
                documentTasksList={props.documentTasksList}
                visibleModalUpdate={visibleModalUpdate}
                DocumentTasks={DocumentTasks}
                TasksTitleMenu={TasksTitleMenu}
            />
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
            <FragmentCommentsViewer
                    HandleCommentOnChange={props.HandleCommentOnChange} 
                    disabled={props.disabled}
                    HandleComment={props.HandleComment}
                    commentsList={props.commentsList}
            />
            {/* /////////////////////////////////// */}

            {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
            <FragmentAnyItems/>
            {/* /////////////////////////////////// */}

        </Form>
    )
});

export default Update2;