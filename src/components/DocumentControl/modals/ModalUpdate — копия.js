import { EyeOutlined } from '@ant-design/icons';
import { useMutation,useQuery,gql } from '@apollo/client';
import { Button, Form, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { handlerQuery, handlerMutation, useUser } from '../../../core/functions';

const insertComment = gql`
       mutation insertComment($comment: JSON) {
        insertComment(comment: $comment) {
            type
            message
        }
    }
`;

const insertSignature = gql`
       mutation insertSignature($signature: JSON) {
        insertSignature(signature: $signature) {
            type
            message
        }
    }
`;

const deleteSignature = gql`
       mutation deleteSignature($signature: JSON) {
        deleteSignature(signature: $signature) {
            type
            message
        }
    }
`;

const comments = gql`
        query document_comments($document_comments: JSON) {
            document_comments(document_comments:$document_comments) {
                id
                comment
                document_id
                user_id
                position
                username
                fio
                date
            }
        }
    `;



let ModalUpdate = React.memo(({ GQL, GQL2, UpdateForm, UpdateForm2, ...props }) => {

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const [visible, setVisible] = props.visibleModalUpdate;
    const [viewMode, setViewMode] = useState(true);
    const [visible2, setVisible2] = props.visibleModalUpdate2;

    const user = useUser();

    //-------modal handling
    let modalCancelHandler = () => {
        setVisible(false); setVisible2(false);
        setViewMode(true)
    }

    let modalEnableEditHandler = () => {
        setViewMode(false);
    }

    const { confirm } = Modal;
    function showSendConfirm() {
        confirm({
            title: 'Вы действительно хотите отправить документ?',
            content: `test`,
            okText: 'Отправить',
            cancelText: 'Отмена',
            onOk() { },
            onCancel() { },
        });
    }

    //---------------------------------------------------------------------------data view handling
    let variables1 = {}; variables1[GQL.table] = { global: { id: `= ${props.selectedRowKeys[0]}` } };
    let variables2 = {}; variables2[GQL2.table] = { global: { id: `= ${props.selectedRowKeys[0]}` } };

    console.log('props', props)
    console.log('props.selectedRowKeys[0]', props.selectedRowKeys[0])

    const { loading: loadingOne, data, refetch } = handlerQuery(GQL, 'one', { variables1 })();
    const { loading: loadingTwo, data:data2, refetch:refetch2 } = handlerQuery(GQL2, 'one', { variables2 })();


    useEffect(() => { if (data) { form.resetFields() } }, [data]);
    useEffect(() => {if (data2) {form2.resetFields() } }, [data2]);

    useEffect(() => { if (visible) { refetch(variables1) } }, [visible]);
    useEffect(() => { if (visible2) { refetch2(variables2) } }, [visible2]);
    //-----------------------------------------------------------------------------------------------------


    //-------------mutations
    const [update, { loading: loadingUpdate }] = handlerMutation(useMutation(GQL.update), () => { setVisible(false); setViewMode(true); setVisible2(false) })();


    //---------comments
    const [commentText, setCommentText] = useState();
    let commentVariables = props?.selectedRowKeys[0] ? { variables: { document_comments: { global: { document_id: `= ${props.selectedRowKeys[0]}`, ORDER_BY: ['date'] } } } } : {};
    const { loading: loadingComments, data: dataComments, refetch: refetchComments } = useQuery(comments, commentVariables);
    useEffect(() => { if (visible) { refetchComments(commentVariables) } }, [visible]);
    let commentsList = (dataComments && dataComments[Object.keys(dataComments)[0]] != null) ? dataComments[Object.keys(dataComments)[0]].map((item) => {
        return {
            id: item.id,
            key: item.id,
            comment: item.comment ? item.comment : '',
            position: item.position ? item.position: '',
            document_id: item.document_id ? item.document_id : '',
            user_id: item.user_id ? item.user_id : '',
            username: item.username,
            fio: item.fio,
            date: item.date ? item.date : ''
        }
    }) : [];
    //console.log('commentsdata', dataComments)

    const [dataComment, { loading: loadingMutation, error: errorMutation }] = useMutation(insertComment, {
        //refetchQueries: [{ query: comments, variables: commentVariables }],
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });
    let handleComment = () => {
        dataComment({ variables: { comment: { user_id: user.id, username: user.username, fio: user.fio, document_id: props.selectedRowKeys[0], position: user.position_names[0], comment: commentText } } });
        refetchComments(commentVariables)
    };
    let HandleCommentOnChange = (all, change) => {
        if (all.target.value.length > 0) {
            setCommentText(all.target.value)
        }
    }
    /*const lastIndexOf = (array, key) => {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i].key === key)
                return i;
        }
        return -1;
    };*/

    //----------signatures
    const [step, setStep] = useState();
    const [status, setStatus] = useState();
    const [routeData, setRouteData] = useState();
    const [dataSignature, { loading: loadingSignature, error: errorSignature }] = useMutation(insertSignature, {
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });
    const [dataSignatureDelete, { loading: loadingSignatureDelete, error: errorSignatureDelete }] = useMutation(deleteSignature, {
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });

    //--------------------------------------------approve processes
    let handleRouteForward = () => {

        let routeFinishIndex = data.documents[0].route_id.routes.length;
        let routeCurrentIndex = data.documents[0].step;

        // SEARCH POSITION ID
        setRouteData(data.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex + 1 }))
        if (routeCurrentIndex < routeFinishIndex) {
            setStep(routeCurrentIndex + 1);
            if (status != 5) setStatus(5);
            const signatureFilter = data.documents[0].signatures.filter(e => e.document_id == data.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
        else if (routeCurrentIndex = routeFinishIndex) {
            setStep(routeCurrentIndex);
            setStatus(4);
            const signatureFilter = data.documents[0].signatures.filter(e => e.document_id == data.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
            //alert("Конец маршрута, документ утверждён")
        }

        //console.log('Initial props', props);
        //console.log('routeFinishIndex', routeFinishIndex, routeCurrentIndex);
    };
    let handleRouteForward2 = () => {

        let routeFinishIndex = data2.documents[0].route_id.routes.length;
        let routeCurrentIndex = data2.documents[0].step;

        setRouteData(data2.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex + 1 }))
        if (routeCurrentIndex < routeFinishIndex) {
            setStep(routeCurrentIndex + 1)
            if (status != 5) setStatus(5);
            const signatureFilter = data2.documents[0].signatures.filter(e => e.document_id == data2.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
        else if (routeCurrentIndex = routeFinishIndex) {
            setStep(routeCurrentIndex);
            setStatus(4);
            const signatureFilter = data2.documents[0].signatures.filter(e => e.document_id == data2.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
    }


    let handleRouteBackward = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data.documents[0].step;

        // SEARCH POSITION ID
        setRouteData(data.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
        if (routeCurrentIndex > routeFirstIndex) {
            setStep(routeCurrentIndex - 1)
        }
        else if (routeCurrentIndex = routeFirstIndex) {
            setStep(routeCurrentIndex);
            //alert("Достигнуто начало маршрута.")
        }

        //console.log('Initial props', props);
        //console.log('routeFirstIndex', routeFirstIndex, routeCurrentIndex);
    }
    let handleRouteBackward2 = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data2.documents[0].step;

        setRouteData(data2.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
        if (routeCurrentIndex > routeFirstIndex) {
            setStep(routeCurrentIndex - 1)
        }
        else if (routeCurrentIndex = routeFirstIndex) {
            setStep(routeCurrentIndex);
        }
    };

    let handleRouteReturnToSender = () => {
        //setStep(0); doe not work
        setStatus(7);
    };

    let handleRouteFromUserEditToApprove = () => { //user send to approve
        let routeFinishIndex = data.documents[0].route_id.routes.length;
        let routeCurrentIndex = data.documents[0].step;

        setRouteData(data.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }

    //------------------document statuses
    let handleStatusCancelled=() => {
        setStatus(2);
    };


    //---------------------------------------debug
    useEffect(() => { console.log('loadingOne status:', loadingOne) }, [loadingOne]);
    useEffect(() => { console.log('loadingTwo status:', loadingTwo) }, [loadingTwo]);


    console.log('route_data', routeData)
    console.log('data', data)

    return (
        <>
            <Button
                type="primary"
                disabled={props.selectedRowKeys.length !== 2}
                onClick={() => { setVisible(true) }}
            >
                <EyeOutlined />Просмотр
            </Button>
            <Modal
                title={props.title}
                visible={visible}

                centered
                // width={props.width?props.width:450}
                width={900}
                onOk={() => { form.submit() }}
                onCancel={() => { setVisible(false); setViewMode(true) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <UpdateForm
                    commentsList={commentsList}
                    HandleComment={handleComment}
                    HandleCommentOnChange={HandleCommentOnChange}

                    handleRouteForward={handleRouteForward}
                    handleRouteBackward={handleRouteBackward}

                    handleRouteReturnToSender={handleRouteReturnToSender}

                    handleRouteFromUserEditToApprove={handleRouteFromUserEditToApprove}

                    handleStatusCancelled={handleStatusCancelled}

                    modalCancelHandler={modalCancelHandler}
                    modalEnableEditHandler={modalEnableEditHandler}

                    form={form}
                    onFinish={(values) => {
                        let variables = {};
                        console.log('values on finish', values);
                        if (step) { values.step = step };
                        if (status) { values.status_id = status };
                        values.is_read = false
                        if (routeData && routeData[0]?.positionId) { values.positionId = routeData[0].positionId }
                        values.route_id = 10;
                        variables[GQL.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues={data}
                    disabled={viewMode}
                />
            </Modal>
            <Modal
                title={props.title}
                visible={visible2}
                centered
                // width={props.width?props.width:450}
                width={900}
                onOk={() => { form2.submit() }}
                onCancel={() => { setVisible2(false); setViewMode(true) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <UpdateForm2
                    commentsList={commentsList}
                    HandleComment={handleComment}
                    HandleCommentOnChange={HandleCommentOnChange}

                    handleRouteForward2={handleRouteForward2}
                    handleRouteBackward2={handleRouteBackward2}

                    handleStatusCancelled={handleStatusCancelled}

                    modalCancelHandler={modalCancelHandler}
                    modalEnableEditHandler={modalEnableEditHandler}

                    form2={form2}
                    onFinish2={(values) => {
                        let variables = {};
                        console.log('values on finish', values);
                        if (step) { values.step = step };
                        if (status) { values.status_id = status };
                        values.is_read = false
                        if (routeData && routeData[0]?.positionId) { values.positionId = routeData[0].positionId }
                        values.route_id = 24;
                        variables[GQL.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues2={data2}
                    disabled={viewMode}
                />
            </Modal>
        </>
    );
});

export default ModalUpdate;