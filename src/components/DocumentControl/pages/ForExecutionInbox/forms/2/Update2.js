import { Button, Divider, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../../../../../core/functions'
import { FragmentFileViewer, FragmentTaskFileViewer } from '../../../fragments/FragmentFileViewer'
import { FragmentInputArea } from '../../../fragments/FragmentInputArea'
import FragmentUploader from '../../../fragments/FragmentUploader'
import { FormItem, FormWrap } from './../../../fragments/FragmentItemWrap'

const Update2 = React.memo((props) => {
  const user = useUser()

  const [state, setState] = useState({
    log_username: user.username
  })

  const tasksFilesMap = state?.task_files?.map((item) => {
    return item.toString()
  })

  const result = props?.document?.files?.filter(i => tasksFilesMap?.includes(i.id))

  useEffect(() => { props.form.setFieldsValue(state) }, [state])

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
      })
    }
  }, [props.initialValues])

  const onFinish = (values) => {
    values.type = 1
    values.user_id_created = state.user_id_created
    props.onFinish(values)
  }

  return (
    props?.document !== undefined
      ? <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
        >
            {console.info('Вызов Update2 (src\\components\\DocumentControl\\pages\\ForExecutionInbox)')}
            {console.count('Количество вызовов Update2')}
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem('ФИО поручителя: ', state.fio_created)}</FormWrap>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem('Задание: ', state?.note)}</FormWrap>
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />
            {/* /////////////////////////////////// */}
            <h3 className='marginTop'><b>Информация о договоре</b></h3>
            {/* /////////////////////////////////// */}
            <FormWrap>{FormItem('Тип договора: ', props?.document?.route_id?.name)}</FormWrap>
            {/* /////////////////////////////////// */}

            {state?.document_options?.title
              ? <FormWrap>{FormItem('Наименование контрагента: ', props?.document.title)}</FormWrap>
              : 'null'
            }

            {/* /////////////////////////////////// */}
            {state?.document_options?.subject
              ? <FormWrap>{FormItem('Предмет договора: ', props?.document?.data_agreement_list[0]?.subject)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.price
              ? <FormWrap>{FormItem('Общая сумма договора в валюте цены договора: ', props?.document?.data_agreement_list[0]?.price)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.currency_price
              ? <FormWrap>{FormItem('Общая сумма договора в тенге, по курсу НБ РК: ', props?.document?.data_agreement_list[0]?.currency_price)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.executor_name_division
              ? <FormWrap>{FormItem('Наименование подразделения, фамилия ответственного исполнителя: ', props?.document?.data_agreement_list[0]?.executor_name_division)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.sider_signatures_date
              ? <FormWrap>{FormItem('Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: ', props?.document?.data_agreement_list[0]?.sider_signatures_date)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            {state?.document_options?.received_from_counteragent_date
              ? <FormWrap>{FormItem('Дата получение проекта договора, способ получения от контрагента: ', props?.document?.data_agreement_list[0]?.received_from_counteragent_date)}</FormWrap>
              : 'null'
            }
            {/* /////////////////////////////////// */}
            <Divider type={'horizontal'} />

            <h3 className='marginTop'><b>Файлы прикреплённые отправителем</b></h3>
            <FragmentFileViewer files={result}/>

            <Divider type={'horizontal'} />

            {
                (parseInt(state.status) !== 2)
                  ? <>
                        {/* /////////////////////////////////// */}
                        <FragmentInputArea/>
                        {/* /////////////////////////////////// */}
                        <FragmentUploader url={'/document-control/for-execution-inbox'}/>
                        {/* /////////////////////////////////// */}
                    </>
                  : <>
                        {/* /////////////////////////////////// */}
                        <h3><b>Отчёт</b></h3>
                        {state.report ? state.report : ''}
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
            {(state?.status === 1)
              ? <><Divider type={'horizontal'} />
                    <Button type='primary' htmlType="submit">Завершить</Button></>
              : ''
            }
        </Form> : 'Загрузка (пустой рендер)'
  )
})

export default Update2
