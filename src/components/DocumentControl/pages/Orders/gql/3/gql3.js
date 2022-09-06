import { gql } from '@apollo/client';
let variables = {};

let gql3 = {
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
                reason
                date_created
                date_modified
                status_id
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
                    date_created
                    date_modified
                    status_id
                    reason
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
                reason
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
};

export default gql3;