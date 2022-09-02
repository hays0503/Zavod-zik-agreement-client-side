import { EyeOutlined } from '@ant-design/icons'
import { Button, Form, Input, Divider, Row, Col, Typography, Steps } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { useUser, formatDate, getDiffHours } from '../../../../../../core/functions'

import SelectReplacementDialog from '../../../../dialogs/SelectReplacementDialog'

const Update5 = React.memo((props) => {
  const user = useUser()
  const price_pattern = /^\d+$/
  const { Title, Link } = Typography

  const { Step } = Steps
  const stepsDirection = useRef('vertical')
  useEffect(() => {
    if (props?.initialValues5?.documents[0]?.route_data?.length > 1) { stepsDirection.current = props?.initialValues5?.documents[0]?.route_data?.length <= 7 ? 'horizontal' : 'vertical' }
  }, [props])

  const [visible, setVisible] = useState(false)
  const [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
  const [stepCount, setStepCount] = useState({ step: '0' })

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
        { user: Number(user.id), item: item.id }
      )
    })
    const content = await tmp.json()
    if (content != undefined) {
      console.log('RESULT', content)
    }
  }

  useEffect(() => { props.form5.setFieldsValue(state) }, [state])

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

  const onFinish = (values) => {
    props.onFinish5(state)
    console.log('+++++++++++++++++++++++', values)
  }

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

  return (
        <Form
            form={props.form5}
            name="DocumentsForm5"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues })) }}
        >
            <h4><b>Тип договора:</b> Другой</h4>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Наименование:</Col> <Col span={12}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Примечание:</Col> <Col span={12}>{state.remark}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Основание:</Col> <Col span={12}>{state.subject}</Col>
                </Row>
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues5?.documents[0].files.map((item) => {
                  return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />}/> <br />
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
                {props?.initialValues5?.documents[0].signatures.map((item) => { // remove commentsList
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
                <SelectReplacementDialog visible={visible} setVisible={setVisible} setRoutesList={setRoutesList} routesList={routesList} stepCount={stepCount}
                    routeData={props?.initialValues5?.documents[0]?.route_data} form={props.form} />
                <Steps
                    labelPlacement="vertical"
                    size="small"
                    direction={stepsDirection.current}
                    responsive={true}
                    current={stepCount.step - 1}
                    className="steps-form-update">
                    {
                        props?.initialValues5?.documents[0].route_data.map((item, i) => {
                          return (
                                <>
                                    <Step
                                        title={item.positionName}
                                        onClick={() => {
                                          console.log('step click', item)
                                          if (props.initialValues5.documents[0].step == i + 1) {
                                            setVisible(true)
                                          }
                                        }}
                                        subTitle={
                                            i == stepCount.step - 1 && state?.signatures?.length > 0 || stepCount.step == 1
                                              ? (() => {
                                                  if (stepCount.step == 1 && i == 0) {
                                                    const tmpD = getDiffHours(new Date(state.date_created), new Date())
                                                    console.log('tmpD1', tmpD)
                                                    return tmpD?.toString()
                                                  }
                                                  if (i != 0 && state?.signatures[i - 1]?.date_signature) {
                                                    const tmpD = getDiffHours(new Date(state.signatures[state.signatures.length - 1].date_signature), new Date())
                                                    console.log('tmpD2', tmpD)
                                                    return tmpD?.toString()
                                                  }
                                                })()
                                              : null
                                        }
                                    />
                                </>
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
            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="comments"
                label="Комментарии"
                labelCol={{ span: 24 }}
            >
                <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange}/>
                <Button onClick={props.HandleComment} className="marginTop">Оставить комментарий</Button>
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
