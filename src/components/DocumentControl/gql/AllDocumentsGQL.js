import { gql } from '@apollo/client';

let AllDocumentsGQL = {
    exemplar: 'document',
    table: 'documents',
    options: {
        all: {
            variables: {
                
            },
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
                subject
                date_created
                date_modified
                status_id
                reason
                document_tasks{
                    id
                    document_id
                    status
                    is_cancelled
                    note
                    deadline
                
                    user_id_created
                    fio_created
                    user_id_receiver
                    fio_receiver
                }
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
                status_id
                reason
                data_one{
                    id
                    document_id
                    price
                    subject
                    supllier
                }
                document_tasks{
                    id
                    document_id
                    status
                    is_cancelled
                    note
                    deadline
                    
                    
                    user_id_created
                    fio_created
                    user_id_receiver
                    fio_receiver
                }
                data_custom{
                    id
                    document_id
                    subject
                    remark
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
            user_id
            username
            position
            fio
            reason
            price
            supllier
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
            document_tasks{
                id
                document_id
                status
                is_cancelled
                note
                deadline
                user_id_created
                fio_created
                user_id_receiver
                fio_receiver
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
`,
    setIsReadTrue: gql`
    mutation setIsReadTrue($document: JSON) {
    setIsReadTrue(document: $document) {
        type
        message
    }
}
`};

export default AllDocumentsGQL