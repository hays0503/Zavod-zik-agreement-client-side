import { EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Button, Form, Modal, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { handlerQuery, handlerMutation, useUser } from '../../../../../core/functions';



let TaskModalUpdate = React.memo(({ GQL, UpdateForm, ...props }) => {

    const document = {
        exemplar: 'document',
        table: 'documents',
        options: {
            all: {
                variables: { documents: { global: {id:`=${props.selectedRowKeys[1]}`,  ORDER_BY: ['date_created desc'] } } },
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
                price
                supllier
                reason
                subject
                date_created
                date_modified
                status_id
                document_logs{
                    id
                    document_id
                    is_read
                    user_id
                }
                data_custom{
                    id
                    document_id
                    subject
                    remark
                }
                data_one{
                    id
                    document_id
                    price
                    subject
                    supllier
                }
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
                data_agreement_list_production{
                    id
                    document_id
                    price
                    subject
                    currency
                    executor_name_division
                    executor_phone_number
                    counteragent_contacts
                }
                data_agreement_list_internal_needs{
                    id
                    document_id
                    price
                    subject
                    currency
                    executor_name_division
                    executor_phone_number
                    counteragent_contacts
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
                    price
                    supllier
                    subject
                    date_created
                    date_modified
                    reason
                    status_id
                    document_logs{
                        id
                        document_id
                        is_read
                        user_id
                    }
                    data_custom{
                        id
                        document_id
                        subject
                        remark
                    }
                    data_one{
                        id
                        document_id
                        price
                        subject
                        supllier
                    }
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
                    data_agreement_list_production{
                        id
                        document_id
                        price
                        subject
                        currency
                        executor_name_division
                        executor_phone_number
                        counteragent_contacts
                    }
                    data_agreement_list_internal_needs{
                        id
                        document_id
                        price
                        subject
                        currency
                        executor_name_division
                        executor_phone_number
                        counteragent_contacts
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
                user_id
                username
                fio
                position
                date_created
                date_modified
                status_id
                reason
                document_statuses{
                        id
                        name
                    }
                    document_logs{
                        id
                        document_id
                        is_read
                        user_id
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
    `,
        setIsReadTrue: gql`
    mutation setIsReadTrue($document: JSON) {
    setIsReadTrue(document: $document) {
        type
        message
    }
    }
    `
    };

    const [form] = Form.useForm();
    const [viewMode, setViewMode] = useState(true);
    const [visible, setVisible] = props.visibleModalUpdate ? props.visibleModalUpdate : [];

    let variables1 = {}; variables1[GQL.table] = GQL.table ? { global: { id: `= ${props.selectedRowKeys[0]}` } } : {};

    const { loading: loadingOne, data, refetch } = handlerQuery(GQL, 'one', { variables1 })();

    useEffect(() => { if (visible) { refetch(variables1) }; }, [visible]);

    // //------------documents
    let documentVariables = { documents: { global: {id:`=${props.selectedRowKeys[1]}`,  ORDER_BY: ['date_created desc'] } } }
    const { loading: loadingData, data:documentData, refetch:refetchData } = handlerQuery(document, 'one', { variables1 })();
    useEffect(() => { if (visible) { refetchData(documentVariables) }; }, [visible]);
    
    let uploadDocuments = async (files) => {

        console.log(files)
        const filePromises = files.map((file) => {
            // Return a promise per file
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    resolve({ dataFile: e.target.result, fileName: file.name })
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(file.originFileObj);
            });
        });

        // Wait for all promises to be resolved
        const fileInfos = await Promise.all(filePromises);

        console.log('COMPLETED');

        // Profit
        return fileInfos;
    };

    return (
        <>
            <Button
                type="primary"
                disabled={props.selectedRowKeys.length !== 3}
                onClick={() => { setVisible(true) }}
            >
                <EyeOutlined />Просмотр
            </Button>
            <Modal
                title={props.title}
                visible={visible}
                width={900}
                onCancel={() => { setVisible(false); setViewMode(true) }}
                footer={null}
            >
                <UpdateForm
                    document={documentData?.documents[0]}
                    initialValues={data}
                    form={form}
                    onFinish={async(values)=>{
                        let variables = {};
                        let base64 = [];
                        if (values?.files?.fileList) {
                            await uploadDocuments(values.files.fileList).then(result => {
                                base64 = result
                            });
                        };
                        values.docs = base64 ? base64 : [];
                        variables[GQL.exemplar] = {id:props.selectedRowKeys[0],status:2, user_id:values.user_id_created}
                        console.log('values-------',values)
                        // update({ variables })
                    }}
                />
            </Modal>
        </>
    )
})

export default TaskModalUpdate