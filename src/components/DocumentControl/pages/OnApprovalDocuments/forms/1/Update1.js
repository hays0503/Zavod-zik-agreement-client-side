import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Collapse} from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'
import { gql} from '@apollo/client';


//pop confirm
import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//tasks
import UpdateTask1 from './UpdateTask1'
import TasksAddDialog from '../../../../dialogs/TasksAddDialog';
import TasksTableContainer from '../../tableContainers/TasksTableContainer'
import TaskModalUpdate from '../../modals/TaskModalUpdate'
import FragmentFileViewer from './../../../fragments/FragmentFileViewer';
import FragmentUploader from './../../../fragments/FragmentUploader';
import FragmentStepViewer from './../../../fragments/FragmentStepViewer';
import { FormItem, FormWrap } from './../../../fragments/FragmentItemWrap';
import { FragmentButtons } from './../../../fragments/FragmentButtons';
import { FragmentReasonsViewer } from '../../../fragments/FragmentReasonsViewer';
import { FragmentTaskList } from './../../../fragments/FragmentTaskList';
import FragmentCommentsViewer from '../../../fragments/FragmentCommentsViewer';

/**
 * Форма для вывода документа по клику "Закуп ТРУ"
 */
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

                price: props.initialValues.documents[0].data_one[0].price,
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


    let onFinish = (values) => {
        props.onFinish(state);
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


    return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}
        >

            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem("От: ",state?.fio)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Должность: ",state?.position)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Тип договора: ","Закуп ТРУ")}</FormWrap>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Наименование ТРУ: ",state?.title)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Поставщик ТРУ: ",state?.supllier)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Основание: ",state?.subject)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Общая сумма договора: ",state?.price)}</FormWrap>
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} /> 


            {/* Фрагмент antd дающую возможность загружать файлы */}
            <FragmentUploader/>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/*Фрагмент antd дающую возможность просматривать файлы*/}
            {
                props.initialValues!==undefined?
                <FragmentFileViewer files={props?.initialValues?.documents[0]?.files} userId={user.id}/>:
                <h1>Загрузка</h1>
            }
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
            {
                props.initialValues!==undefined?
                <FragmentStepViewer
                signatures={props?.initialValues?.documents[0]?.signatures}
                stepsDirection={stepsDirection.current}
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
                Reason={props?.initialValues?.documents[0]?.reason}
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


            <FragmentCommentsViewer
                    HandleCommentOnChange={props.HandleCommentOnChange} 
                    disabled={props.disabled}
                    HandleComment={props.HandleComment}
                    commentsList={props.commentsList}
            />


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