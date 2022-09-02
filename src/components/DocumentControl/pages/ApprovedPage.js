import { DeleteOutlined, QuestionCircleOutlined, FileImageOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import { Button, Form, Input, Popconfirm, Typography, Space, Divider, Row, Col, Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import { handlerQuery, handlerMutation, useUser, formatDate } from '../../../core/functions'
import ModalUpdate from '../modals/ModalUpdate'
import TableContainer from '../tableContainers/TableContainer'
import TitleMenu from '../../../core/TitleMenu'
import test from '../../../core/functions/test'

const { Title, Link } = Typography
const { Step } = Steps

const sendNotification = async () => {
  const tmp = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      { items: true }
    )
  })
  const content = await tmp.json()
}

const ApprovedPage = React.memo((props) => {
  const user = useUser()
  const positionsVariable = user.positions.toString()
  console.log('positionsVariable', positionsVariable)

  const documents = {
    exemplar: 'document',
    table: 'documents',
    options: {
      all: {
        variables: { documents: { global: { positions: positionsVariable, ORDER_BY: ['date_created desc'] } } },
        fetchPolicy: 'cache-only'
      },
      one: {
        fetchPolicy: 'standby'
      }
    },
    select: {
      all: gql`
        query documents ($documents: JSON) {
            documents(documents:$documents) {
                id
                title
                user_id
                username
                position
                fio
                description
                price
                supllier
                subject
                date_created
                date_modified
                status_id
                data_agreement_list{
                    id
                    document_id
                    price
                    subject

                    currency_price
                    executor_name_division
                    sider_signatures_date
                    received_from_counteragent_date
                }
                document_logs{
                    id
                    document_id
                    is_read
                    user_id
                }
                document_statuses{
                    id
                    name
                }
                route_id{
                    id
                    name
                    routes
                    status_in_process
                    status_cancelled
                    status_finished
                }
                step
                route_data
            }
        }`,
      one: gql`
            query documents ($documents: JSON) {
                documents(documents:$documents) {
                    id
                    title
                    user_id
                    username
                    position
                    fio
                    description
                    price
                    supllier
                    subject
                    date_created
                    date_modified
                    status_id
                    data_agreement_list{
                        id
                        document_id
                        price
                        subject
    
                        currency_price
                        executor_name_division
                        sider_signatures_date
                        received_from_counteragent_date
                    }
                    document_logs{
                        id
                        document_id
                        is_read
                        user_id
                    }
                    document_statuses{
                        id
                        name
                    }
                    route_id{
                        id
                        name
                        routes
                        status_in_process
                        status_cancelled
                        status_finished
                    }
                    files{
                        id
                        filename
                    }
                    signatures{
                        id
                        document_id
                        user_id
                        username
                        date_signature
                        position
                        fio
                    }
                    step
                    route_data
                }
            }
        `
    },
    subscription: {
      all: [gql`
        subscription documents ($documents: JSON){
            documents(documents: $documents){
                id
                title
                date_created
                date_modified
                status_id
                document_logs{
                    id
                    document_id
                    is_read
                    user_id
                }
                document_statuses{
                    id
                    name
                }
                route_id{
                    id
                    name
                    routes
                    status_in_process
                    status_cancelled
                    status_finished
                }
                step
                route_data
            }
        }`
      ]
    },
    insert: gql`
       mutation insertDocument($document: JSON) {
        insertDocument(document: $document) {
            type
            message
        }
    }
    `,
    update: gql`
        mutation updateDocument($document: JSON) {
        updateDocument(document: $document) {
            type
            message
        }
    }
    `,
    delete: gql`
        mutation deleteDocument($document: JSON) {
        deleteDocument(document: $document) {
            type
            message
        }
    }
    `
  }

  const visibleModalUpdate = useState(false)
  const visibleModalUpdate2 = useState(false)

  const [remove, { loading: loadingRemove }] = handlerMutation(useMutation(documents.delete))()

  const { loading, data, refetch } = handlerQuery(documents, 'all')()
  useEffect(() => { refetch() }, [])

  const list = (data && data[Object.keys(data)[0]] != null) ? data[Object.keys(data)[0]].map((item) => {
    return {
      id: item.id,
      key: item.id,
      title: item.title,
      date_created: item.date_created,
      date_modified: item.date_modified,
      status_id: item.status_id,
      status: item.document_statuses?.name ? item.document_statuses.name : 'Без статуса',
      route_id: item.route_id.id,
      route: item.route_id?.name ? item.route_id.name : 'Не задан',
      route_data: item.route_data,
      route_step: item.route_data ? item.route_data.findIndex(item => item.positionId == positionsVariable) + 1 : [],
      step: item.step,
      step_count: item.step + ' из ' + item.route_data?.length,
      document_logs: item.document_logs[item.document_logs.findIndex(item => item.user_id == user.id)],
      // step_name:console.log('DDDDDD',item.step)
      step_name: item.route_data?.length > 0 ? item.route_data[item.step - 1].positionName : ''
      // step_name: item.route_id?.routes ? item.route_id.routes[item.route_id.routes.findIndex(item => item.positionId == item.step)].positionName : ''
    }
  }) : []

  // console.log('list2', list2)

  const listFiltered = list.filter((el) => {
    return el.status_id == 4
  })

  // console.log('newArray', newArray)

  const dict = test([
    { title: 'Наименование договора', dataIndex: 'title', width: '214px', type: 'search', tooltip: true, sorter: true },
    { title: 'Дата и время создания', dataIndex: 'date_created', width: '114px', type: 'search', tooltip: true, sorter: true },
    { title: 'Последние изменение', dataIndex: 'date_modified', width: '114px', type: 'search', tooltip: true, sorter: true },
    { title: 'Тип договора', dataIndex: 'route', width: '114px', type: 'search', tooltip: true, sorter: true },
    { title: 'Статус', dataIndex: 'status', width: '80px', tooltip: true, sorter: true },
    { title: 'На подписи', dataIndex: 'step_name', width: '114px' },
    { title: 'Этап', dataIndex: 'step_count', width: '55px' }
    // { title: 'Шаг п.', dataIndex: 'route_step', width: '55px' }
  ])

  const titleMenu = (tableProps) => {
    return (<TitleMenu
            buttons={[
                <ModalUpdate visibleModalUpdate={visibleModalUpdate} visibleModalUpdate2={visibleModalUpdate2} title='Просмотр документа' selectedRowKeys={tableProps.selectedRowKeys}
                    GQL={documents} GQL2={documents} UpdateForm={DocumentsFormUpdate} UpdateForm2={DocumentsFormUpdate2} update={true} width={750} />,
                <Popconfirm
                    title="Вы уверены?"
                    onConfirm={() => { const variables = {}; variables[documents.exemplar] = { id: Number(tableProps.selectedRowKeys[0]), log_username: user.username }; remove({ variables }) }}
                    okText="Да"
                    cancelText="Нет"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    disabled={tableProps.selectedRowKeys.length !== 1}
                >
                    <Button key="remove" type="dashed" danger loading={loadingRemove} disabled={tableProps.selectedRowKeys.length !== 1}><DeleteOutlined />Удалить</Button>
                </Popconfirm>
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
  }

  return (
        <TableContainer
            data={{ dict, records: listFiltered }}
            loading={loading}
            title={titleMenu}
            visibleModalUpdate={visibleModalUpdate}
            visibleModalUpdate2={visibleModalUpdate2}
            GQL={documents}
        />
  )
})

const price_pattern = /^\d+$/

const DocumentsFormUpdate = React.memo((props) => {
  const user = useUser()

  const [state, setState] = useState({
    log_username: user.username
  })

  const OpenDocument = async (item) => {
    // setBtnLoad(true)
    console.log('PROPS', item.id)
    // console.log('RECORD',props.record)
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

  useEffect(() => { props.form.setFieldsValue(state) }, [state])
  const [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
  const [stepCount, setStepCount] = useState({ step: '0' })
  useEffect(() => {
    if (props.initialValues) {
      setState({
        id: props.initialValues.documents[0].id,
        title: props.initialValues.documents[0].title,
        position: props.initialValues.documents[0].position,
        username: props.initialValues.documents[0].username,
        fio: props.initialValues.documents[0].fio,

        description: props.initialValues.documents[0].description,
        price: props.initialValues.documents[0].price,
        supllier: props.initialValues.documents[0].supllier,
        subject: props.initialValues.documents[0].subject,

        date_created: props.initialValues.documents[0].date_created,
        date_modified: props.initialValues.documents[0].date_modified,
        route_id: props.initialValues.documents[0].route_id.id,
        status_in_process: props.initialValues.documents[0].route_id.status_in_process,
        status_cancelled: props.initialValues.documents[0].route_id.status_cancelled,
        status_finished: props.initialValues.documents[0].route_id.status_finished,
        status_id: props.initialValues.documents[0].status_id,
        route: props.initialValues.documents[0].route_data,
        step: props.initialValues.documents[0].step,
        comments: props.initialValues.documents[0].comments,
        signatures: props.initialValues.documents[0].signatures,
        files: props.initialValues.documents[0].files,
        document_logs: props.initialValues.documents[0].document_logs,
        log_username: state.log_username
      })
      console.log('props.initialValues', props.initialValues)
      setStepCount({ step: props.initialValues.documents[0].step })
      setRoutesList(props.initialValues.documents[0].route_data)
    }
  }, [props.initialValues])

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
      link.href = result.data_file /* result.data_file.slice(result.data_file.indexOf(',')+1) */
      link.download = result.filename
      link.click()
    })
  }

  const onFinish = (values) => {
    props.onFinish(state)
    console.log('+++++++++++++++++++++++', values)
  }

  return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}

        >
            <Form.Item
                name="title"
                label='Наименование ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование ТРУ" />
            </Form.Item>
            <Form.Item
                name="supllier"
                label='Поставщик ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='Основание'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="price"
                label='Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  },
                  {
                    pattern: price_pattern,
                    message: 'Можно использовать только цифры!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues?.documents[0].files.map((item) => {
                  const blolbFile = new Blob([`${item.data_file}`], { type: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
                  return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download} >{item.filename} <FileImageOutlined /></a></Link> <br/>
                            {/* <Link><a href={`/uploads/${item.filename}`} data-fileid={item.id} onClick={download} >{item.filename} <FileImageOutlined /></a></Link> <br/> */}
                            <Button onClick={() => { OpenDocument(item) }}>Просмотр</Button> <br />
                        </div>
                    </>)
                })}
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues?.documents[0].signatures.map((item) => { // remove commentsList
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
                <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
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
                    <Button type="primary" htmlType="submit" onClick={props.handleRouteForward}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleRouteBackward}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
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
const DocumentsFormUpdate2 = React.memo((props) => {
  const user = useUser()

  const [state, setState] = useState({
    log_username: user.username
  })

  const OpenDocument = async (item) => {
    // setBtnLoad(true)
    console.log('PROPS', item.id)
    // console.log('RECORD',props.record)
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

  useEffect(() => { props.form2.setFieldsValue(state) }, [state])
  const [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
  const [stepCount, setStepCount] = useState({ step: '0' })
  console.log('PROPS UPDATE DOC 2', props)
  useEffect(() => {
    if (props.initialValues2) {
      setState({
        id: props.initialValues2.documents[0].id,
        title: props.initialValues2.documents[0].title,
        position: props.initialValues2.documents[0].position,
        username: props.initialValues2.documents[0].username,
        fio: props.initialValues2.documents[0].fio,

        description: props.initialValues2.documents[0].data_agreement_list[0].description,
        price: props.initialValues2.documents[0].data_agreement_list[0].price,
        subject: props.initialValues2.documents[0].data_agreement_list[0].subject,

        currency_price: props.initialValues2.documents[0].data_agreement_list[0].currency_price,
        executor_name_division: props.initialValues2.documents[0].data_agreement_list[0].executor_name_division,
        sider_signatures_date: props.initialValues2.documents[0].data_agreement_list[0].sider_signatures_date,
        received_from_counteragent_date: props.initialValues2.documents[0].data_agreement_list[0].received_from_counteragent_date,

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
      })
      console.log('props.initialValues2', props.initialValues2)
      setStepCount({ step: props.initialValues2.documents[0].step })
      setRoutesList(props.initialValues2.documents[0].route_data)
    }
  }, [props.initialValues2])

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
      link.href = result.data_file /* result.data_file.slice(result.data_file.indexOf(',')+1) */
      link.download = result.filename
      link.click()
    })
  }

  const onFinish = (values) => {
    props.onFinish2(state)
    console.log('+++++++++++++++++++++++', values)
  }

  return (
        <Form
            form={props.form2}
            name="DocumentsForm2"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}

        >
            <b>От:</b> {props?.initialValues2?.documents[0].fio} <br/>
            <b>Должность:</b> {props?.initialValues2?.documents[0].position}

            <Divider type={'horizontal'} />

            <Form.Item
                name="title"
                label='Наименование ТРУ2'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование ТРУ" />
            </Form.Item>
            <Form.Item
                name="supllier"
                label='Поставщик ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='Основание'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="price"
                label='Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!'
                  },
                  {
                    pattern: price_pattern,
                    message: 'Можно использовать только цифры!'
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues2?.documents[0].files.map((item) => {
                  const blolbFile = new Blob([`${item.data_file}`], { type: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
                  return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download} >{item.filename} <FileImageOutlined /></a></Link> <br/>
                            {/* <Link><a href={`/uploads/${item.filename}`} data-fileid={item.id} onClick={download} >{item.filename} <FileImageOutlined /></a></Link> <br/> */}
                            <Button onClick={() => { OpenDocument(item) }}>Просмотр</Button> <br />
                        </div>
                    </>)
                })}
            </Form.Item>
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues2?.documents[0].signatures.map((item) => { // remove commentsList
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
                <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
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
                    <Button type="primary" htmlType="submit" onClick={props.handleRouteForward2}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleRouteBackward2}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
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

export default ApprovedPage
