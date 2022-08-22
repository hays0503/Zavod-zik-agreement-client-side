import {EyeOutlined} from '@ant-design/icons';
import { Button, Form, Input, Divider, Row, Col, Typography, Steps, Modal, Popconfirm,Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser, formatDate, getDiffHours } from '../../../../../../core/functions';

import { gql, useMutation } from '@apollo/client';
import { handlerQuery } from '../../../../../../core/functions';

let Update1 = React.memo((props) => {
    let user = useUser();
    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;

    const { Step } = Steps;
    const [visible, setVisible] = useState(false);

    const [state, setState] = useState({
        log_username: user.username,
    });

    let OpenDocument = async (item) => {
        // setBtnLoad(true)
        console.log("PROPS", item.id)
        // console.log('RECORD',props.record)
        const tmp = await fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { user:Number(user.id),item:item.id }
            )
        })
        const content = await tmp.json();
        if (content != undefined) {
            console.log("RESULT", content)
        }
    }

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);
    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    useEffect(() => {
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
                route: props.initialValues.documents[0].route_data,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                signatures: props.initialValues.documents[0].signatures,
                files: props.initialValues.documents[0].files,
                log_username: state.log_username
            });
            console.log('props.initialValues', props.initialValues)
            setStepCount({ step: props.initialValues.documents[0].step })
            setRoutesList(props.initialValues.documents[0].route_data)
        }
    }, [props.initialValues]);


    let onFinish = (values) => {
        props.onFinish(state);
        console.log('+++++++++++++++++++++++', values);
    }

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

    return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}

        >
            <h4><b>Тип договора:</b> Закуп ТРУ</h4>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Наименование ТРУ: </Col> <Col span={12}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Поставщик ТРУ: </Col> <Col span={12}>{state.supllier}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Основание: </Col> <Col span={12}>{state.subject}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>Общая сумма договора:</Col> <Col span={12}>{state.price}</Col>
                </Row>
            </div>
            <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues?.documents[0].files.map((item) => {
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
                {props?.initialValues?.documents[0].signatures.map((item) => {  //remove commentsList
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
                <SelectDialog visible={visible} setVisible={setVisible} setRoutesList={setRoutesList} routesList={routesList} stepCount={stepCount}
                    routeData={props?.initialValues?.documents[0]?.route_data} form={props.form}/>
                <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
                    {
                        props?.initialValues?.documents[0].route_data.map((item, i) => {
                            return (
                                <>
                                    <Step 
                                        title={item.positionName}
                                        onClick={() => {
                                        console.log('step click', item);
                                        if (props.initialValues.documents[0].step == i+1) {
                                            setVisible(true)
                                        }
                                    }}
                                        subTitle={
                                        i == stepCount.step - 1 && state?.signatures?.length > 0 || stepCount.step==1 ?
                                            (() => {
                                                if (stepCount.step == 1&& i==0) {
                                                    let tmpD = getDiffHours(new Date(state.date_created), new Date());
                                                    console.log('tmpD1', tmpD)
                                                    return tmpD?.toString()
                                                }
                                                if (i != 0 && state?.signatures[i-1]?.date_signature) {
                                                    let tmpD = getDiffHours(new Date(state.signatures[state.signatures.length - 1].date_signature), new Date());
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
                {props?.initialValues?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                        </span>
                    )
                })}
            </div>
            <Row>
                <Col span={24}>
                    <Button onClick={props.modalCancelHandler}>
                        Отменить
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
});

let SelectDialog = React.memo((props) => {


    let positions = {
        exemplar: 'positions',
        table: 'positions',
        options: {
            all: {
                /*variables: {
                   controller_addresses: { global: {ORDER_BY: ['id DESC']}}
               },*/
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
    };

    const updateDocumentRoutePosition = gql`
       mutation updateDocument($document: JSON) {
        updateDocument(document: $document) {
            type
            message
        }
    }
`;

    const { loading, data, refetch } = handlerQuery(positions, 'all')();
    useEffect(() => { refetch() }, []);

    const [mutateRoutePosition, { loading: loadingMutation, error: errorMutation }] = useMutation(updateDocumentRoutePosition, {
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });

    const [state, setState] = useState({});

    let onFinish = (values) => {
        console.log(values)
    }

    console.log('propsS',props)

    const [form] = Form.useForm();
    useEffect(() => { form.setFieldsValue(state) }, [state]);

    return (
        <>
            <Modal
                title={'Заменяющие лица'}
                visible={props.visible}
                centered
                width={450}
                onOk={() => { }}
                onCancel={() => { props.setVisible(false) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={[
                    <Button key="cancel" onClick={() => { props.setVisible(false) }}>Отмена</Button>,
                    <Popconfirm
                        title={'Действительно заменить и сохранить изменения?'}
                        placement="topLeft"
                        disabled={state.replacement ? false : true}
                        onConfirm={async() => {
                            await form.submit();
                            const tmpPosName = data.positions.filter(el => { return el.id == state.replacement })[0];
                            console.log('form name', tmpPosName,state);
                            props.setRoutesList(prevState => {
                                let old = Object.assign({}, prevState);
                                let tmpIndex = old[0].substitutes.indexOf(props.routeData[props.stepCount.step - 1].positionId)
                                console.log('tmpIndex', tmpPosName.id,tmpIndex)
                                if (old[0].substitutes.indexOf(props.routeData[props.stepCount.step - 1].positionId) === -1) {
                                    old[0].substitutes.push(tmpPosName.id)
                                }
                                old[0].positionName = tmpPosName.name;
                                old[0].positionId = tmpPosName.id;
                                console.log('step old', old);
                                return old;
                            });
                            props.form.submit();
                            console.log('test'); props.setVisible(false)
                        }}
                        okText="Да"
                        cancelText="Нет">
                        <Button
                            disabled={state.replacement ? false : true}
                            type='primary'
                        >Сохранить</Button>
                    </Popconfirm>

                ]}
            >
                <Form
                    form={form}
                    name="ReplacementSelectForm"
                    onFinish={onFinish}
                    scrollToFirstError
                    autoComplete="off"
                    onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}
                >
                    <Form.Item
                        label="Выберите заменяющего"
                        labelAlign="left"
                        name="replacement"
                        rules={[
                            {
                                required: true,
                                message: 'Необходимо для заполнения!'
                            },
                        ]}
                    >
                        <Select
                            style={{ width: 100 + "%" }}
                            showSearch
                            optionFilterProp="children"
                            filterOption
                            {...props}
                        >
                            <Select.Option key={null} value={null}></Select.Option>
                            {data && data.positions?.length > 0 ? props.routeData?.map((item, i) => {
                                return (item.substitutes && props.stepCount.step == i + 1 ?
                                    <Select.Option key={item.substitutes[0]} value={item.substitutes[0]}>
                                        {data.positions.filter(el => { return el.id == item.substitutes[0] })[i].name}
                                    </Select.Option> :null)
                            }):null}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default Update1;