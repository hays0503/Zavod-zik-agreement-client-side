import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { handlerQuery } from '../../../core/functions';
import { Modal, Popconfirm, Select, Button, Form } from 'antd';

let SelectReplacementDialog = React.memo((props) => {


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

    console.log('propsS', props)

    const [form] = Form.useForm();
    useEffect(() => { form.setFieldsValue(state) }, [state]);

    return (
        <>
            <Modal
                title={'Назначение заменяющих должностей'}
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
                        onConfirm={async () => {
                            await form.submit();
                            const tmpPosName = data.positions.filter(el => { return el.id == state.replacement })[0];
                            console.log('form name', tmpPosName, state);
                            props.setRoutesList(prevState => {
                                let old = Object.assign({}, prevState);
                                let tmpIndex = old[0].substitutes.indexOf(props.routeData[props.stepCount.step - 1].positionId)
                                console.log('tmpIndex', tmpPosName.id, tmpIndex)
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
                            {data && data.positions?.length > 0 &&
                                props?.routeData &&
                                props?.stepCount?.step &&
                                data[Object.keys(data)[0]] != null &&
                                props?.routeData[props.stepCount.step - 1]?.substitutes?.length > 0 ?
                                props.routeData[props.stepCount.step - 1].substitutes.map((item, i) => {
                                    if (item != props.routeData.filter(el => { return el.id == item })[0]?.positionId) {
                                        return (
                                            <Select.Option key={item} value={item}>
                                                {data.positions.filter(el => {
                                                    return el.id == item
                                                })[0]?.name
                                                }
                                            </Select.Option>)
                                    }
                                }) : null}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default SelectReplacementDialog;