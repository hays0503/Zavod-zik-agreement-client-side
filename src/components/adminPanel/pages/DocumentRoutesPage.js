import { DeleteOutlined, QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import { Button, Form, Input, Popconfirm, Transfer, Empty, Space, Checkbox, Row, Col } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { handlerQuery, handlerMutation, useUser } from '../../../core/functions'
import ModalInsert from '../../../core/modal/ModalInsert'
import ModalUpdate from '../../../core/modal/ModalUpdate'
import IndependentSelect from '../../../core/IndependentSelect'
import TableContainer from '../../../core/TableContainer'
import TitleMenu from '../../../core/TitleMenu'
import test from '../../../core/functions/test'

import { ArrowRightOutlined, FormOutlined, CloseSquareOutlined } from '@ant-design/icons' // quick actions panel icon

const document_routes = {
  exemplar: 'document_routes',
  table: 'document_routes',
  options: {
    all: {
      /* variables: {
               controller_addresses: { global: {ORDER_BY: ['id DESC']}}
           }, */
      fetchPolicy: 'cache-only'
    },
    one: {
      fetchPolicy: 'standby'
    }
  },
  select: {
    all: gql`
            query document_routes ($document_routes: JSON) {
                document_routes (document_routes: $document_routes) {
                    id
                    name
                    status_in_process
                    status_cancelled
                    status_finished
                    routes
                }
            }
        `,
    one: gql`
            query document_routes($document_routes: JSON) {
                document_routes(document_routes: $document_routes) {
                    id
                    name
                    status_in_process
                    status_cancelled
                    status_finished
                    routes
                }
            }
        `
  },
  subscription: {
    all: gql`
            subscription document_routes ($document_routes: JSON){
                document_routes (document_routes: $document_routes) {
                    id
                    name
                    status_in_process
                    status_cancelled
                    status_finished
                    routes
                }
            }
        `
  },
  insert: gql`
        mutation insertDocumentRoute($document_routes: JSON) {
            insertDocumentRoute(document_routes: $document_routes){
                message
            }
        }
    `,
  update: gql`
        mutation updateDocumentRoute($document_routes: JSON) {
            updateDocumentRoute(document_routes: $document_routes){
                message
            }
        }
    `,
  delete: gql`
        mutation deleteDocumentRoute($document_routes: JSON) {
            deleteDocumentRoute(document_routes: $document_routes){
                message
            }
        }
    `
}

const document_statuses = {
  exemplar: 'document_statuses',
  table: 'document_statuses',
  options: {
    all: {
      fetchPolicy: 'cache-only'
    }
  },
  select: {
    all: gql`
            query document_statuses ($document_statuses: JSON) {
                document_statuses (document_statuses: $document_statuses) {
                    id
                    name
                }
            }
        `
  },
  subscription: {
    all: gql`
            subscription document_statuses ($document_statuses: JSON){
                document_statuses (document_statuses: $document_statuses) {
                    id
                    name
                }
            }
        `
  }
}

const positions = {
  exemplar: 'positions',
  table: 'positions',
  options: {
    all: {
      /* variables: {
               controller_addresses: { global: {ORDER_BY: ['id DESC']}}
           }, */
      fetchPolicy: 'cache-only'
    },
    one: {
      fetchPolicy: 'standby'
    }
  },
  select: {
    all: gql`
            query positions ($positions: JSON) {
                positions (positions: $positions) {
                    id
                    name
                }
            }
        `,
    one: gql`
            query positions($positions: JSON) {
                positions(positions: $positions) {
                    id
                    name
                }
            }
        `
  },
  subscription: {
    all: gql`
            subscription positions ($positions: JSON){
                positions (positions: $positions) {
                    id
                    name
                }
            }
        `
  }
}

const DocumentRoutesPage = React.memo((props) => {
  const user = useUser()
  const visibleModalUpdate = useState(false)

  const [remove, { loading: loadingRemove }] = handlerMutation(useMutation(document_routes.delete))()

  const { loading, data, refetch } = handlerQuery(document_routes, 'all')()
  useEffect(() => { refetch() }, [])
  const list = (data && data[Object.keys(data)[0]] != null)
    ? data[Object.keys(data)[0]].map((item) => {
      return {
        id: item.id,
        key: item.id,
        name: item.name
      }
    })
    : []
  const dict = test([
    { title: 'ID', dataIndex: 'id', width: '15px', type: 'search', tooltip: true },
    { title: 'Название', dataIndex: 'name', width: '150px', type: 'search', tooltip: true }
  ])

  const titleMenu = (tableProps) => {
    return (<TitleMenu
            title='Редактирование маршрутов документа'
            buttons={[
                <ModalInsert title='Добавление маршрута' GQL={document_routes} InsertForm={DocumentRoutesForm} width={750} />,
                <ModalUpdate visibleModalUpdate={visibleModalUpdate} title='Редактирование маршрута' selectedRowKeys={tableProps.selectedRowKeys}
                    GQL={document_routes} UpdateForm={DocumentRoutesForm} update={true} width={750} />,
				<Popconfirm
                    title="Вы уверены?"
                    onConfirm={() => { const variables = {}; variables[document_routes.exemplar] = { id: Number(tableProps.selectedRowKeys[0]), log_username: user.username }; remove({ variables }) }}
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
        <>
        <TableContainer
            data={{ dict, records: list }}
            loading={loading}
            title={titleMenu}
            visibleModalUpdate={visibleModalUpdate}
            />
        </>
  )
})

const DocumentRoutesForm = React.memo((props) => {
  const user = useUser()
  const panelAddButton = useRef()
  const [state, setState] = useState({
    isuseforreport: false,
    log_username: user.username
  })

  useEffect(() => { props.form.setFieldsValue(state); console.log('props top', state) }, [state])

  useEffect(() => {
    if (props.initialValues) {
      setState({
        id: props.initialValues.document_routes[0].id,
        name: props.initialValues.document_routes[0].name,
        status_in_process: props.initialValues.document_routes[0].status_in_process,
        status_cancelled: props.initialValues.document_routes[0].status_cancelled,
        status_finished: props.initialValues.document_routes[0].status_finished,
        routes: props.initialValues.document_routes[0].routes,
			    log_username: state.log_username
      })
      // console.log('props.initialValues routes',props.initialValues)
    }
  }, [props.initialValues])

  const onFinish = (values) => {
    props.onFinish(state)
    // console.log('-------------------------------------------', values);
  }
  return (
        <>
        <Form
            form={props.form}
            name="DocumentRoutesForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}
        >
            <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!',
                    whitespace: true
                  }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Название маршрута документа" />
            </Form.Item>
            <Form.Item
                name="status_in_process"
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!',
                    whitespace: true
                  }
                ]}
            >
                <IndependentSelect disabled={props.disabled} placeholder="Статус в процессе" title="Статус в процессе" query={document_statuses} />
            </Form.Item>
            <Form.Item
                name="status_cancelled"
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!',
                    whitespace: true
                  }
                ]}
            >
                <IndependentSelect disabled={props.disabled} placeholder="Статус - отклонён" title="Статус - отклонён" query={document_statuses} />
            </Form.Item>
            <Form.Item
                name="status_finished"
                rules={[
                  {
                    required: true,
                    message: 'Необходимо для заполнения!',
                    whitespace: true
                  }
                ]}
            >
                <IndependentSelect disabled={props.disabled} placeholder="Статус - завершён" title="Статус - завершён" query={document_statuses} />
            </Form.Item>
            <Form.Item
                name="log_username"
                hidden={true}
            >
                <Input disabled={props.disabled} />
            </Form.Item>

            <Form.List name="routes">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <Space
                                key={field.key}
                                style={{ display: 'flex', marginBottom: 40 }}
                                align="baseline"
                            >
                                <Row gutter={20}>
                                    <Col span={24}>
                                        Участник №: <b>{field.name + 1}</b>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'positionId']}
                                            fieldKey={[field.fieldKey, 'positionId']}
                                        >
                                            <IndependentSelect
                                                disabled={props.disabled}
                                                placeholder="Должность"
                                                title="Должность"
                                                query={positions}
                                                onChange={(value, LabeledValue) => {
                                                  // console.log('setFieldsValue', fields)
                                                  setState(prevState => {
                                                    const old = Object.assign({}, prevState)
                                                    console.log('field.fieldKey', field.fieldKey)
                                                    old.routes[field.name].positionName = LabeledValue.children
                                                    old.routes[field.name].step = field.name + 1
                                                    return old
                                                  })
                                                  // console.log('setFieldsValue value', value, LabeledValue)
                                                  // console.log('setFieldsValue state', state)
                                                  // console.log('setFieldsValue initialValues', props.initialValues)
                                                }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'step']}
                                            fieldKey={[field.fieldKey, 'step']}
                                            hidden={true}
                                        >
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'positionName']}
                                            fieldKey={[field.fieldKey, 'positionName']}
                                            hidden={true}
                                        >
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'returnToCreator']}
                                            fieldKey={[field.fieldKey, 'returnToCreator']}
                                            valuePropName="checked"
                                            rules={[
                                              {
                                                type: 'boolean',
                                                required: false
                                              }
                                            ]}
                                        >
                                            <Checkbox disabled={props.disabled}>Вернуть к исполнителю</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'isExecutor']}
                                            fieldKey={[field.fieldKey, 'isExecutor']}
                                            valuePropName="checked"
                                            rules={[
                                              {
                                                type: 'boolean',
                                                required: false
                                              }
                                            ]}
                                        >
                                            <Checkbox disabled={props.disabled}>Исполнитель?</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            {...field}
                                            label="Выбранные статусы:"
                                            name={[field.name, 'statuses']}
                                            fieldKey={[field.fieldKey, 'statuses']}
                                            rules={[
                                              {
                                                type: 'array',
                                                required: false,
                                                message: 'Необходимо выбрать хотябы одну!'
                                              }
                                            ]}
                                        >
                                            <DocumentStatusesTransfer disabled={props.disabled} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            {...field}
                                            label="Заменяющие лица:"
                                            name={[field.name, 'substitutes']}
                                            fieldKey={[field.fieldKey, 'substitutes']}
                                            rules={[
                                              {
                                                type: 'array',
                                                required: false,
                                                message: 'Необходимо выбрать хотябы одну!'
                                              }
                                            ]}
                                        >
                                            <SubstitutesTransfer disabled={props.disabled} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <i>Убрать</i>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} disabled={props.disabled} style={{ marginLeft: 5 }} />
                                    </Col>
                                </Row>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                disabled={props.disabled}
                                block
                                icon={<PlusOutlined />}
                                ref={panelAddButton}
                            >
                                Добавить участника
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            </Form>
            <Row className='on-approval-from-buttons-wrap'>
                <Col span={24} className='on-approval-form-buttons-container'>
                    <Button
                        disabled={props.disabled}
                        style={{ marginRight: '5px' }}
                        onClick={() => { panelAddButton.current.click() }}
                        icon={<ArrowRightOutlined />} />
                    <span style={{ marginRight: '5px' }}>
                        {props.setViewMode
                          ? <Button
                                onClick={() => { props.setViewMode(false) }}
                                title='Редактировать'
                                icon={<FormOutlined />} />
                          : <Popconfirm
                                title="Вы уверены?"
                                onConfirm={() => { props.save() }}
                                okText="Да"
                                cancelText="Нет"
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            >
                                <Button
                                    title='Сохранить'
                                    icon={<DeleteOutlined />} />
                            </Popconfirm>
                            }
                    </span>
                    <span style={{ marginRight: '5px' }}>
                        <Button
                            onClick={() => { props.setVisible(false); props.setViewMode(true) }}
                            title='Отмена' icon={<CloseSquareOutlined />} />
                    </span>
                </Col>
            </Row>
        </>
  )
})

const DocumentStatusesTransfer = React.memo((props) => {
  const modalFormWidth = 650

  const { loading, data, refetch } = handlerQuery(document_statuses, 'all')()
  useEffect(() => { refetch() }, [])

  const [selectedKeys, setSelectedKeys] = useState([])
  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    props.onChange(nextTargetKeys)
  }

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
    console.log(selectedKeys)
  }

  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

  let mockData = []
  if (!loading) {
    mockData = data.document_statuses.map((item) => {
      return {
        id: item.id,
        key: item.id,
        title: item.name,
        description: item.name
      }
    })
  }
  return (
        <>
            <Transfer
                dataSource={mockData}
                titles={['Все', 'Выбранные']}
                targetKeys={props.value ? props.value : []}
                selectedKeys={selectedKeys}
                onChange={handleChange}
                showSelectAll={false}
                onSelectChange={handleSelectChange}
                render={item => item.title}
                listStyle={{ width: modalFormWidth / 2.2 }}
                style={{ marginBottom: 16 }}

                filterOption={filterOption}

                locale={{
                  itemUnit: '',
                  itemsUnit: '',
                  notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет данных" />,
                  searchPlaceholder: 'Статус'
                }}
                disabled={props.disabled}
            />
        </>
  )
})

const SubstitutesTransfer = React.memo((props) => {
  const modalFormWidth = 650

  const { loading, data, refetch } = handlerQuery(positions, 'all')()
  useEffect(() => { refetch() }, [])

  const [selectedKeys, setSelectedKeys] = useState([])
  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    props.onChange(nextTargetKeys)
  }

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
    console.log(selectedKeys)
  }

  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

  let mockData = []
  if (!loading) {
    mockData = data.positions.map((item) => {
      return {
        id: item.id,
        key: item.id,
        title: item.name,
        description: item.name
      }
    })
  }
  return (
        <>
            <Transfer
                dataSource={mockData}
                titles={['Все', 'Выбранные']}
                targetKeys={props.value ? props.value : []}
                selectedKeys={selectedKeys}
                onChange={handleChange}
                showSelectAll={false}
                onSelectChange={handleSelectChange}
                render={item => item.title}
                listStyle={{ width: modalFormWidth / 2.2 }}
                style={{ marginBottom: 16 }}

                filterOption={filterOption}

                locale={{
                  itemUnit: '',
                  itemsUnit: '',
                  notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет данных" />,
                  searchPlaceholder: 'Позиция'
                }}
                disabled={props.disabled}
            />
        </>
  )
})

export default DocumentRoutesPage
