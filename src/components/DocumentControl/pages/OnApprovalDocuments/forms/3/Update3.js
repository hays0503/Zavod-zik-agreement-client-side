import { Form, Typography, Divider, Steps, Collapse } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'


import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//Tasks
import TasksAddDialog3 from '../../../../dialogs/TasksAddDialog3'
import TaskModalUpdate from '../../modals/TaskModalUpdate'
import UpdateTask3 from './UpdateTask3'
import { FormWrap , FormItem } from './../../../fragments/FragmentItemWrap';
import FragmentUploader from './../../../fragments/FragmentUploader';
import FragmentStepViewer from './../../../fragments/FragmentStepViewer';
import { FragmentButtons } from '../../../fragments/FragmentButtons';
import { FragmentReasonsViewer } from './../../../fragments/FragmentReasonsViewer';
import { FragmentTaskList } from './../../../fragments/FragmentTaskList';
import FragmentCommentsViewer from '../../../fragments/FragmentCommentsViewer';
import { FragmentAnyItems } from '../../../fragments/FragmentAnyItems';
import { GetIDNameTaskFile } from './../../../api/CRU_Document'
import { dict, DocumentTasks } from './gql'
import { FragmentTaskAndFileViewer } from './../../../fragments/FragmentFileViewer';

/**
 * Форма 3 Лист согласования на закуп ТРУ для производства продукции
 */

let Update3 = React.memo((props) => {

    const user = useUser();

    const visibleModalUpdate = useState(false);
    const [visible, setVisible] = useState(false)
    const [reasonText, setReasonText] = useState(props?.initialValues3?.documents[0]?.reason);
    const [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    const [stepCount, setStepCount] = useState({ step: '0' })
    const [state, setState] = useState({
        log_username: user.username,
    });
    /**
     * Cтейт для таблиц файлов по поручением
     */
     const [FileTask , setFileTask] = useState([])
    /**
     * Инициализация стейта для таблиц файлов по поручением
     */
    useEffect(() => {
        if (props.initialValues3) {
        GetIDNameTaskFile(props?.initialValues3?.documents[0]?.id).then(value=>{
            setFileTask(value.result)
        })

    }},[props.initialValues3])

    useEffect(() => {
        props.form3.setFieldsValue(state);
    }, [state]);

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


    const onFinish = (values) => {
        props.onFinish3(state);
    }


    const ReasonInputChange = (all, change) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    }

    const TasksTitleMenu = (tableProps) => {
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

    return (
        <Form
            form={props.form3}
            name="DocumentsForm3"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })); console.log('UPDATE3 values', allValues) }}

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
            <FormWrap>{FormItem ("Наименование контрагента: ",state?.title)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Предмет договора: ",state?.subject)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Основание: ",state?.subject)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Общая сумма договора: ",state?.price)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Валюта платежа: ",state?.currency)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Наименование подразделения, фамилия ответственного исполнителя: ",state?.executor_name_division)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Телефон исполнителя: ",state?.executor_phone_number)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem ("Контакты контрагента: ",state?.counteragent_contacts)}</FormWrap>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />
            
            {/* Фрагмент antd дающую возможность загружать файлы */}
            <FragmentUploader/>
            {/* /////////////////////////////////// */}

            <Divider type={'horizontal'} />

            
            {console.log("props?.initialValues3?.documents[0]?.files",props?.initialValues3?.documents[0]?.files)}
            {console.log("FileTask",FileTask)}

            {/*Фрагмент antd дающую возможность просматривать файлы*/}
            {
                props.initialValues3!==undefined && FileTask!==undefined?
                <FragmentTaskAndFileViewer files={props?.initialValues3?.documents[0]?.files} files_task={FileTask} userId={user.id}/>:
                <h1>Загрузка</h1>
            }
            {/* /////////////////////////////////// */}  

            <Divider type={'horizontal'} />

            {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
            {
                props.initialValues3!==undefined?
                <FragmentStepViewer
                signatures={props?.initialValues3?.documents[0]?.signatures}
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
})

export default Update3