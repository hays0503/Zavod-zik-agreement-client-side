import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { handlerQuery, getDDMMYYYHHmm } from '../../../core/functions'
import { Modal, Popconfirm, Select, Button, Form, DatePicker, Input } from 'antd'
import 'moment/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'

const TasksDoneDialog = React.memo((props) => {
  const users = {
    exemplar: 'user',
    table: 'users',
    options: {
      all: {
        variables: {
          users: { global: { ORDER_BY: ['username asc'] } }
        },
        fetchPolicy: 'cache-only'
      },
      one: {
        fetchPolicy: 'standby'
      }
    },
    select: {
      all: gql`
            query users ($users: JSON) {
                users(users: $users) {
                    id
                    username
                    admin
                    accesses
                    positions
                    domain_username
                    fio
                    email
                }
            }
        `,
      one: gql`
            query users ($users: JSON) {
                users(users: $users) {
                    id
                    username
                    password
                    admin
                    accesses
                    positions
                    domain_username
                    fio
                    email
                }
            }
        `
    },
    subscription: {
      all: gql`
            subscription users ($users: JSON) {
                users(users: $users) {
                    id
                    username
                    admin
                    accesses
                    positions
                    domain_username
                    fio
                    email
                }
            }
        `
    }
  }

  const { loading, data, refetch } = handlerQuery(users, 'all')()
  useEffect(() => { refetch() }, [])

  /* const [mutateAddTask, { loading: loadingMutation, error: errorMutation }] = useMutation(updateDocumentRoutePosition, {
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    }); */

  const [state, setState] = useState({})

  const onFinish = (values) => {
    console.log('values', values)
    console.log('datef', getDDMMYYYHHmm(values.deadline._d))
  }

  console.log('propsS', props)

  const [form] = Form.useForm()
  useEffect(() => { form.setFieldsValue(state) }, [state])

  // date & time utils
  const onChangeDatePicker = (date, dateString) => {
    console.log('datep', date, dateString)
  }

  return (
        <>
            <Modal
                title={'Создание поручения'}
                visible={props.visible}
                centered
                width={550}
                onOk={() => { }}
                onCancel={() => { props.setVisible(false) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={[
                    <Button key="cancel" onClick={() => { props.setVisible(false) }}>Отмена</Button>,
                    <Popconfirm
                        title={'Отправить поручение?'}
                        placement="topLeft"
                        disabled={!state.recepient}
                        onConfirm={async () => {
                          await form.submit()
                        }}
                        okText="Да"
                        cancelText="Нет">
                        <Button
                            type='primary'
                            htmlType="submit"
                        >Сохранить</Button>
                    </Popconfirm>

                ]}
            >
                <Form
                    form={form}
                    name="TaskAddForm"
                    onFinish={onFinish}
                    scrollToFirstError
                    autoComplete="off"
                    onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}
                >
                    <Form.Item
                        label="Выберите получателя"
                        labelAlign="left"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                        name="recepient"
                        rules={[
                          {
                            required: true,
                            message: 'Необходимо для заполнения!'
                          }
                        ]}
                    >
                        <Select
                            style={{ width: 100 + '%' }}
                            showSearch
                            optionFilterProp="children"
                            filterOption
                            {...props}
                        >
                            <Select.Option key={null} value={null}></Select.Option>
                            {data?.users?.map((item, i) => {
                              return (
                                    <Select.Option key={item.id} value={item.fio}>
                                        {data?.users[i]?.fio}
                                    </Select.Option>)
                            })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Срок для исполнения до"
                        labelAlign="left"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                        name="deadline"
                        rules={[
                          {
                            required: true,
                            message: 'Необходимо для заполнения!'
                          }
                        ]}
                    >
                        <DatePicker
                            locale={locale}
                            format={'DD-MM-YYYY HH:mm'}
                            showTime={{ format: 'HH:mm' }}
                            onChange={onChangeDatePicker}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Примечание"
                        labelAlign="left"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                        name="note"
                        rules={[
                          {
                            required: true,
                            message: 'Необходимо для заполнения!'
                          }
                        ]}
                    >
                        <Input.TextArea rows={5}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
  )
})

export default TasksDoneDialog
