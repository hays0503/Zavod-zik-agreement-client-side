import { DeleteOutlined, QuestionCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Button, Form, Input, Popconfirm, Typography, Space, Divider, message, Row, Col } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import { handlerQuery, handlerMutation, useUser, notifyMe, formatDate } from '../../core/functions';
import ModalInsert from './modals/ModalInsert';
import ModalUpdate from './modals/ModalUpdate';
import IndependentSelect from '../../core/IndependentSelect';
import TableContainer from './tableContainers/TableContainer';
import TitleMenu from '../../core/TitleMenu';
import test from "../../core/functions/test";

import { Context } from "../../core/Context";

import UploadFile from './modals/UploadFile';

const { Title, Link } = Typography;


let document_routes = {
    exemplar: 'document_routes',
    table: 'document_routes',
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
            query document_routes ($document_routes: JSON) {
                document_routes (document_routes: $document_routes) {
                    id
                    name
                    routes
                }
            }
        `,
        one: gql`
            query document_routes($document_routes: JSON) {
                document_routes(document_routes: $document_routes) {
                    id
                    name
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
};

let document_statuses = {
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
};

let userNames = {
    select: {
        all: gql`
            query users {
                users {
                    id
                    username
                }
            }
        `
    },
    subscription: {
        all: gql`
            subscription users {
                users {
                    id
                    username
                }
            }
        `,
    },
}

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

let sendNotification = async () => {
    const tmp = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { items: true }
        )
    })
    const content = await tmp.json();
}


let InputDocuments = React.memo((props) => {
    let user = useUser();
    let positionsVariable = user.positions.toString();
    let userVariable = user.id;
    let variables = { documents: { global: { user_id: `=${userVariable}`, ORDER_BY: ['date_created desc'] } } }
    if (user.admin) variables = {};
    //console.log('positionsVariable', positionsVariable)


    let documents = {
        exemplar: 'document',
        table: 'documents',
        options: {
            all: {
                variables: variables,
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
                prise
                supllier
                subject
                date_created
                date_modified
                status_id
                data_agreement_list{
                    id
                    document_id
                    description
                    price
                    supllier
                    subject
                    reason
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
                    prise
                    supllier
                    subject
                    date_created
                    date_modified
                    status_id
                    data_agreement_list{
                        id
                        document_id
                        description
                        price
                        supllier
                        subject
                        reason
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
                signatures{
                        id
                        document_id
                        user_id
                        username
                        date_signature
                        position
                    }
                step
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
    };

    //subscriptions
    const { data: dataSub, loading: loadingSub } = useSubscription(
        documents.subscription.all[0],
        { variables: { documents: { global: { step: '>0', ORDER_BY: ['date_created desc'] } } } }
    );
    useEffect(() => {
        if (!loadingSub && dataSub && dataSub[Object.keys(dataSub)[0]] != null) {
            console.log('notification', dataSub)
            sendNotification();
            notifyMe('Есть новые входящие сообщения');
        }
    }, [dataSub]);

    const visibleModalUpdate = useState(false);
    const visibleModalUpdate2 = useState(false);

    const [remove, { loading: loadingRemove }] = handlerMutation(useMutation(documents.delete))();

    const { loading, data, refetch } = handlerQuery(documents, 'all')();
    useEffect(() => { refetch() }, []);

    let list = (data && data[Object.keys(data)[0]] != null) ? data[Object.keys(data)[0]].map((item) => {
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
                route_data: item.route_id?.routes ? item.route_id.routes : [],
                route_step: item.route_id?.routes ? item.route_id.routes.findIndex(item => item.positionId == positionsVariable) + 1 : [],
                step: item.step,
                step_count: item.step + ' из ' + item.route_id.routes.length,
                //step_name:console.log('DDDDDD',item.step)
                step_name: item?.route_id?.routes?.length > 0 ? item.route_id.routes[item.step-1].positionName : ''
                //step_name: item.route_id?.routes ? item.route_id.routes[item.route_id.routes.findIndex(item => item.positionId == item.step)].positionName : ''
            }
    }) : [];

    /*list[0].temp = 'try';
    let list2 = list.map((item) => {
        return {
            id: item.id,
            key: item.id,
            title: item.title,
            date_created: item.date_created,
            date_modified: item.date_modified,
            status_id: item.status_id,
            status: item.status,
            route_id: item.route_id,
            route: item.route,
            route_data: item.route_data,
            route_test: item?.route_data?.length > 0 ? Object.values(item.route_data[0].positionId): [], //console.log('T',item.id):[]
            step: item.step
        }
    });
    */

    //console.log('list', list)
    //console.log('list2', list2)

    let dict = test([
        { title: 'Наименование договора', dataIndex: 'title', width: '214px', type: 'search', tooltip: true, sorter: true },
        { title: 'Дата и время создания', dataIndex: 'date_created', width: '114px', type: 'search', tooltip: true, sorter: true, sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created) },
        { title: 'Последние изменение', dataIndex: 'date_modified', width: '114px', type: 'search', tooltip: true, sorter: true, sorter: (a, b) => new Date(a.date_modified) - new Date(b.date_modified) },
        { title: 'Тип договора', dataIndex: 'route', width: '114px', type: 'search', tooltip: true, sorter: true },
        { title: 'Статус', dataIndex: 'status', width: '80px', tooltip: true, sorter: true },
        { title: 'На подписи', dataIndex: 'step_name', width: '114px' },
        { title: 'Этап', dataIndex: 'step_count', width: '55px' },
        // { title: 'Шаг п.', dataIndex: 'route_step', width: '55px'}
    ]);


    let titleMenu = (tableProps) => {
        return (
        <TitleMenu
            buttons={[
                <ModalInsert title='Создание документа' GQL={documents} Form1={DocumentsFormInsert} Form2={DocumentsFormInsert2} width={750} />,
                <ModalUpdate visibleModalUpdate={visibleModalUpdate} visibleModalUpdate2={visibleModalUpdate2} title='Редактирование документа' selectedRowKeys={tableProps.selectedRowKeys}
                    GQL={documents} UpdateForm={DocumentsFormUpdate} UpdateForm2={DocumentsFormUpdate2} update={true} width={750} />,
                <Popconfirm
                    title="Вы уверены?"
                    onConfirm={() => { let variables = {}; variables[documents.exemplar] = { id: Number(tableProps.selectedRowKeys[0]), log_username: user.username }; remove({ variables }) }}
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
    };

    // const [context, setContext] = useContext(Context);

    return (
        <>
        <TableContainer
            data={{ dict, records: list }}
            loading={loading}
            title={titleMenu}
            visibleModalUpdate={visibleModalUpdate}
            visibleModalUpdate2={visibleModalUpdate2}
            />
            {/*<Button onClick={() => setContext("New Value")}>Change Context</Button> <br /> */}
            </>
    )
});


let DocumentsFormInsert = React.memo((props) => {
    let user = useUser();
    const [state, setState] = useState({
        log_username: user.username,
    });

    const [fileList, setFileList] = useState([])
    const upload = {
        name: 'file',
        multiple: true,
        onChange(info) {
            console.log(info);
            setFileList(fileList)
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);

    useEffect(() => {
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,
                description: props.initialValues.documents[0].description,
                prise: props.initialValues.documents[0].prise,
                supllier: props.initialValues.documents[0].supllier,
                subject: props.initialValues.documents[0].subject,
                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_id: props.initialValues.documents[0].status_id,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                files: props.initialValues.documents[0].files,
                log_username: state.log_username
            });
        }
    }, [props.initialValues]);

    let onFinish = (values) => {
        props.onFinish(state)
        console.log('-------------------------------------------', values);
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
            <Form.Item
                name="title"
                label='Наименование ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
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
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='"Основание'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input.TextArea rows={4} disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="prise"
                label='"Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Form.Item
                name="files"
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                <UploadFile props={upload} />
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

const price_pattern= /^\d+$/;

let DocumentsFormUpdate = React.memo((props) => {
    let user = useUser();

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

    useEffect(() => {
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,
                position: props.initialValues.documents[0].position,
                username: props.initialValues.documents[0].username,
                fio: props.initialValues.documents[0].fio,
                description: props.initialValues.documents[0].description,
                prise: props.initialValues.documents[0].prise,
                supllier: props.initialValues.documents[0].supllier,
                subject: props.initialValues.documents[0].subject,
                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues.documents[0].route_id.status_finished,
                status_id: props.initialValues.documents[0].status_id,
                route: props.initialValues.documents[0].route_id.routes,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                signatures: props.initialValues.documents[0].signatures,
                files: props.initialValues.documents[0].files,
                log_username: state.log_username
            });
            console.log('props.initialValues',props.initialValues)
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
            <Form.Item
                name="title"
                label='Наименование ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
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
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='"Основание'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="prise"
                label='"Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                        whitespace: true,
                    },
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
                    let blolbFile = new Blob([`${item.data_file}`], { type: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
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
            </Form.Item>
            <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteForward}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteBackward}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
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
});






let DocumentsFormInsert2 = React.memo((props) => {
    let user = useUser();
    const [state, setState] = useState({
        log_username: user.username,
    });

    const [fileList, setFileList] = useState([])
    const upload = {
        name: 'file',
        multiple: true,
        onChange(info) {
            console.log(info);
            setFileList(fileList)
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);

    useEffect(() => {
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,

                description: props.initialValues.documents[0].data_agreement_list[0].description,
                prise: props.initialValues.documents[0].data_agreement_list[0].price,
                supllier: props.initialValues.documents[0].data_agreement_list[0].supllier,
                subject: props.initialValues.documents[0].data_agreement_list[0].subject,

                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_id: props.initialValues.documents[0].status_id,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                files: props.initialValues.documents[0].files,
                log_username: state.log_username
            });
        }
    }, [props.initialValues]);

    let onFinish = (values) => {
        props.onFinish(state)
        console.log('-------------------------------------------', values);
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
            <Form.Item
                name="title"
                label='Наименование ТРУ2'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
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
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='"Основание'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input.TextArea rows={4} disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="prise"
                label='"Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Form.Item
                name="files"
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                <UploadFile props={upload} />
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



let DocumentsFormUpdate2 = React.memo((props) => {
    let user = useUser();

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

    useEffect(() => {
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,
                position: props.initialValues.documents[0].position,
                username: props.initialValues.documents[0].username,
                fio: props.initialValues.documents[0].fio,
                
                description: props.initialValues.documents[0].data_agreement_list[0].description,
                prise: props.initialValues.documents[0].data_agreement_list[0].price,
                supllier: props.initialValues.documents[0].data_agreement_list[0].supllier,
                subject: props.initialValues.documents[0].data_agreement_list[0].subject,
                
                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues.documents[0].route_id.status_finished,
                status_id: props.initialValues.documents[0].status_id,
                route: props.initialValues.documents[0].route_id.routes,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                signatures: props.initialValues.documents[0].signatures,
                files: props.initialValues.documents[0].files,
                log_username: state.log_username
            });
            console.log('props.initialValues', props.initialValues)
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
            <Form.Item
                name="title"
                label='Наименование ТРУ'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
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
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='"Основание'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                ]}
            >
                <Input disabled={props.disabled} placeholder="Основание" />
            </Form.Item>
            <Form.Item
                name="prise"
                label='"Общая сумма договора'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                        whitespace: true,
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                        whitespace: true,
                    },
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
                    let blolbFile = new Blob([`${item.data_file}`], { type: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
                    return (<>
                        <div className='document-view-wrap'>
                            <Link><a data-fileid={item.id} onClick={download} >{item.filename} <FileImageOutlined /></a></Link> <br />
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
            </Form.Item>
            <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteForward}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleRouteBackward}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button disabled={props.disabled} type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
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
});



export default InputDocuments;