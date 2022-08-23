import {Form, Typography, Divider, Steps, Collapse } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useUser} from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'
import { gql } from '@apollo/client'

import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//Tasks
import TasksAddDialog5 from '../../../../dialogs/TasksAddDialog5'
import TaskModalUpdate from '../../modals/TaskModalUpdate'
import UpdateTask5 from './UpdateTask5'
import {FragmentFileViewer} from '../../../fragments/FragmentFileViewer';
import { FormWrap , FormItem } from './../../../fragments/FragmentItemWrap';
import FragmentUploader from '../../../fragments/FragmentUploader';
import FragmentStepViewer from '../../../fragments/FragmentStepViewer';
import { FragmentButtons } from '../../../fragments/FragmentButtons';
import { FragmentReasonsViewer } from '../../../fragments/FragmentReasonsViewer';
import { FragmentTaskList } from '../../../fragments/FragmentTaskList';
import FragmentCommentsViewer from '../../../fragments/FragmentCommentsViewer';
import { FragmentAnyItems } from '../../../fragments/FragmentAnyItems';


let Update5 = React.memo((props) => {

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
                    visibleModalUpdate={visibleModalUpdate} UpdateForm={UpdateTask5} GQL={DocumentTasks}
                    title='Поручение' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                <TasksAddDialog5 visible={visible} setVisible={setVisible} document={props.initialValues5} />
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
    };

    let user = useUser();
    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;

    const { Step } = Steps;
    const { Panel } = Collapse;
    const stepsDirection = useRef('vertical');
    const visibleModalUpdate = useState(false);
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if (props?.initialValues5?.documents[0]?.route_data?.length > 1)
            stepsDirection.current = props?.initialValues5?.documents[0]?.route_data?.length <= 7 ? 'horizontal' : 'vertical'
    }, [props]);

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

    const [reasonText, setReasonText] = useState(props?.initialValues5?.documents[0]?.reason);
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
    const [radioState, setRadioState] = useState(props?.initialValues5?.documents[0]?.data_custom[0]?.subject);

    const RadioOnChange = (radioValue) => {
        setRadioState(radioValue.target.value);
    };

    return (
    <Form
            form={props.form5}
            name="DocumentsForm5"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })); console.log('UPDATE4 values', allValues) }}

        >

            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem("От: ",state?.fio)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Должность: ",state?.position)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Тип договора: ","Другой")}</FormWrap>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Наименование: ",state?.title)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Примечание: ",state?.supllier)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Основание: ",state?.subject)}</FormWrap>
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность загружать файлы */}
            <FragmentUploader/>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/*Фрагмент antd дающую возможность просматривать файлы*/}
            {
                props.initialValues5!==undefined?
                <FragmentFileViewer 
                files={props?.initialValues5?.documents[0]?.files} 
                userId={user.id}/>:
                <h1>Загрузка</h1>
            }
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
            {
                props.initialValues5!==undefined?
                <FragmentStepViewer
                signatures={props?.initialValues5?.documents[0]?.signatures}
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

            <Divider type={'horizontal'}/>

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
})

export default Update5