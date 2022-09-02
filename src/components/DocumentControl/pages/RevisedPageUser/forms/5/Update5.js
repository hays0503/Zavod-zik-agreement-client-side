import { EyeOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Radio, message } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { useUser, formatDate } from '../../../../../../core/functions'
import constants from '../../../../../../config/constants'
import UploadFile from '../../../../modals/UploadFile'

import FromUserEditToApproveConfirm from './dialogs/FromUserEditToApproveConfirm'
import DeleteFile from '../../common/DeleteFile'

const { Title, Link } = Typography

const { Step } = Steps

const price_pattern = /^\d+$/

const Update5 = React.memo((props) => {
  const user = useUser()

  const stepsDirection = useRef('vertical')
  useEffect(() => {
    if (props?.initialValues5?.documents[0]?.route_data?.length > 1) { stepsDirection.current = props?.initialValues5?.documents[0]?.route_data?.length <= 7 ? 'horizontal' : 'vertical' }
  }, [props])

  const [state, setState] = useState({
    log_username: user.username
  })

  const OpenDocument = async (item) => {
    console.log('PROPS', item.id)
    const tmp = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { item }
      )
    })
    const content = await tmp.json()
    if (content != undefined) {
      console.log('RESULT', content)
    }
  }

  useEffect(() => { props.form5.setFieldsValue(state) }, [state])
  const [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
  const [stepCount, setStepCount] = useState({ step: '0' })
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
      })
      setStepCount({ step: props.initialValues5.documents[0].step })
      setRoutesList(props.initialValues5.documents[0].route_data)
    }
  }, [props.initialValues5])

  const download = async (e) => {
    const id = e.target.dataset.fileid
    await fetch('/get-file', {
      method: 'POST',
      body: JSON.stringify({ id: e.target.dataset.fileid }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json()
    }).then(response => {
      const result = response.result
      const link = document.createElement('a')
      link.href = result.data_file
      link.download = result.filename
      link.click()
    })
  }

  const onFinish = (values) => {
    props.onFinish5(state)
    console.log('+++++++++++++++++++++++', values)
  }

  const radioOptions = [
    { label: 'Закупки товаров, работ и услуг', value: 'Закупки товаров, работ и услуг' },
    { label: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам', value: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам' },
    { label: 'Передача имущества в аренду (бесплатное пользование)', value: 'Передача имущества в аренду (бесплатное пользование)' },
    { label: 'Совместная деятельность', value: 'Совместная деятельность' },
    { label: 'Финансирование (кредитование, обеспечение исполнения обязательств)', value: 'Финансирование (кредитование, обеспечение исполнения обязательств)' },
    { label: 'Прочие обязательства', value: 'Прочие обязательства' }
  ]

  const [radioState, setRadioState] = useState(1)

  const RadioOnChange = (radioValue) => {
    setRadioState(radioValue.target.value)
  }

  return (
        <Form
            form={props.form5}
            name="DocumentsForm5"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}

        >
            <b>От:</b> {props?.initialValues5?.documents[0].fio} <br/>
            <b>Должность:</b> {props?.initialValues5?.documents[0].position}
            <h4><b>Тип договора:</b> Закуп ТРУ</h4>

            <Divider type={'horizontal'} />
            <Form.Item
                name="title"
                label='Наименование'
                labelCol={{ span: 24 }}
                className='form-input-label'
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование" />
            </Form.Item>
            <Form.Item
                name="remark"
                label='Примечание'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Примечание" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='Основание'
                className='form-input-label'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input.TextArea rows={4} disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                label="Файлы"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо загрузить хотя бы один файл.'
                  }
                ]}
            >
                <UploadFile
                    showUploadList={true}
                    action={'https://' + constants.host + ':' + constants.port + '/document-control/orders'}
                    multiple={true}
                    maxCount={50}
                    onChange={(info) => {
                      const { status } = info.file
                      if (status !== 'uploading') {
                        console.log('info.file', info.file, info.fileList)
                      }
                      if (status === 'done') {
                        message.success(`${info.file.name} - загружен успешно.`)
                      } else if (status === 'error') {
                        message.error(`${info.file.name} - ошибка при загрузке.`)
                      }
                    }}
                />
            </Form.Item>
            {props?.initialValues5?.documents[0].files.map((item) => {
              return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link>
                            <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />}/>
                            <DeleteFile item={item} dataProps={props} setState={setState} user={user}/>
                            <br />
                        </div>
                    </>)
            })}
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues5?.documents[0].signatures.map((item) => {
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
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="reason"
                label="Замечание"
                labelCol={{ span: 24 }}
            >
            </Form.Item>
            <div>
                {props?.initialValues5?.documents[0]?.reason?.map((item) => {
                  return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                        </span>
                  )
                })}
            </div>
            <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <FromUserEditToApproveConfirm dataProps={props} setState={setState} user={user} />
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

export default Update5
