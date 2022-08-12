import { EyeOutlined } from '@ant-design/icons';
import { useMutation,useQuery,gql } from '@apollo/client';
import { Button, Form, Modal, message } from 'antd';
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
const deleteFile = gql`
        mutation deleteFile($document_files :JSON){
            deleteFile(document_files:$document_files){
                type
                message
            }
        }`

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



let ModalUpdate = React.memo(({ GQL, GQL2, GQL3, GQL4, GQL5, UpdateForm, UpdateForm2, UpdateForm3, UpdateForm4, UpdateForm5, ...props }) => {

    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const [form5] = Form.useForm();

    const [visible, setVisible] = props.visibleModalUpdate ? props.visibleModalUpdate:[];
    const [visible2, setVisible2] = props.visibleModalUpdate2 ? props.visibleModalUpdate2:[];
    const [visible3, setVisible3] = props.visibleModalUpdate3 ? props.visibleModalUpdate3:[];
    const [visible4, setVisible4] = props.visibleModalUpdate4 ? props.visibleModalUpdate4:[];
    const [visible5, setVisible5] = props.visibleModalUpdate5 ? props.visibleModalUpdate5:[];
    const [viewMode, setViewMode] = useState(true);

    const user = useUser();

    //-------modal handling
    let modalCancelHandler = () => {
        setVisible(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false)
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
    let variables1 = {}; variables1[GQL.table] = GQL.table ?{ global: { id: `= ${props.selectedRowKeys[0]}` } } : {};
    let variables2 = {}; variables2[GQL2.table] = GQL2.table ? { global: { id: `= ${props.selectedRowKeys[0]}` } } : {};
    let variables3 = {}; variables3[GQL3?.table ? GQL3.table : {}] = { global: { id: `= ${props.selectedRowKeys[0]}` } };
    let variables4 = {}; variables4[GQL4?.table ? GQL4.table : {}] = { global: { id: `= ${props.selectedRowKeys[0]}` } };
    let variables5 = {}; variables5[GQL5?.table ? GQL5.table : {}] = { global: { id: `= ${props.selectedRowKeys[0]}` } };

    const { loading: loadingOne, data, refetch } = handlerQuery(GQL, 'one', { variables1 })();
    const { loading: loadingTwo, data: data2, refetch: refetch2 } = handlerQuery(GQL2, 'one', { variables2 })();
    const { loading: loadingThree, data: data3, refetch: refetch3 } = handlerQuery(GQL3, 'one', { variables3 })();
    const { loading: loadingFour, data: data4, refetch: refetch4 } = handlerQuery(GQL4, 'one', { variables4 })();
    const { loading: loadingFive, data: data5, refetch: refetch5 } = handlerQuery(GQL5, 'one', { variables5 })();

    useEffect(() => {if (data) {form.resetFields() } }, [data]);
    useEffect(() => {if (data2) {form2.resetFields() } }, [data2]);
    useEffect(() => {if (data3) {form3.resetFields() } }, [data3]);
    useEffect(() => {if (data4) {form4.resetFields() } }, [data4]);
    useEffect(() => {if (data5) {form5.resetFields() } }, [data5]);

    useEffect(() => { if (visible) { refetch(variables1) }; }, [visible]);
    useEffect(() => { if (visible2) { refetch2(variables2); } }, [visible2]);
    useEffect(() => { if (visible3) { refetch3(variables3); } }, [visible3]);
    useEffect(() => { if (visible4) { refetch4(variables4); } }, [visible4]);
    useEffect(() => { if (visible5) { refetch5(variables5); } }, [visible5]);
    //-----------------------------------------------------------------------------------------------------

    //-------------mutations
    const [update, { loading: loadingUpdate }] = handlerMutation(useMutation(GQL.update), () => { setVisible(false); setVisible2(false); setVisible3(false); setVisible4(false); setVisible5(false); setViewMode(true); })();

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
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });
    let handleComment = (form) => {
        dataComment({ variables: { comment: { user_id: user.id, username: user.username, fio: user.fio, document_id: props.selectedRowKeys[0], position: user.position_names[0], comment: commentText } } });
        refetchComments(commentVariables);
        form.resetFields(["comments"]);
    };
    let HandleCommentOnChange = (all, change) => {
        if (all.target.value.length > 0) {
            setCommentText(all.target.value)
        }
    }

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

        let routeFinishIndex = data.documents[0].route_data.length;
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
        }

    };
    let handleRouteForward2 = () => {

        let routeFinishIndex = data2.documents[0].route_data.length;
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
    let handleRouteForward3 = () => {

        let routeFinishIndex = data3.documents[0].route_data.length;
        let routeCurrentIndex = data3.documents[0].step;

        setRouteData(data3.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex + 1 }))
        if (routeCurrentIndex < routeFinishIndex) {
            setStep(routeCurrentIndex + 1)
            if (status != 5) setStatus(5);
            const signatureFilter = data3.documents[0].signatures.filter(e => e.document_id == data3.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
        else if (routeCurrentIndex = routeFinishIndex) {
            setStep(routeCurrentIndex);
            setStatus(4);
            const signatureFilter = data3.documents[0].signatures.filter(e => e.document_id == data3.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
    }
    let handleRouteForward4 = () => {

        let routeFinishIndex = data4.documents[0].route_data.length;
        let routeCurrentIndex = data4.documents[0].step;

        setRouteData(data4.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex + 1 }))
        if (routeCurrentIndex < routeFinishIndex) {
            setStep(routeCurrentIndex + 1)
            if (status != 5) setStatus(5);
            const signatureFilter = data4.documents[0].signatures.filter(e => e.document_id == data4.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
        else if (routeCurrentIndex = routeFinishIndex) {
            setStep(routeCurrentIndex);
            setStatus(4);
            const signatureFilter = data4.documents[0].signatures.filter(e => e.document_id == data4.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
    }
    let handleRouteForward5 = () => {

        let routeFinishIndex = data5.documents[0].route_data.length;
        let routeCurrentIndex = data5.documents[0].step;

        setRouteData(data5.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex + 1 }))
        if (routeCurrentIndex < routeFinishIndex) {
            setStep(routeCurrentIndex + 1)
            if (status != 5) setStatus(5);
            const signatureFilter = data5.documents[0].signatures.filter(e => e.document_id == data5.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
        else if (routeCurrentIndex = routeFinishIndex) {
            setStep(routeCurrentIndex);
            setStatus(4);
            const signatureFilter = data5.documents[0].signatures.filter(e => e.document_id == data5.documents[0].id && e.user_id == user.id);
            if (signatureFilter.filter(e => e.user_id == user.id).length == 0) {
                dataSignature({ variables: { signature: { user_id: user.id, username: user.username, position: user.position_names[0], fio: user.fio, document_id: props.selectedRowKeys[0] } } });
            }
        }
    }

    const showInfoMessageRouteUnavailable = () => {
        message.info('Нельзя возвратить документ на нулевой уровень, достигнуто начало маршрута.', 10);
    };
    let handleRouteBackward = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data.documents[0].step;

        setRouteData(data.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
        if (routeCurrentIndex > routeFirstIndex) {
            setStep(routeCurrentIndex - 1)
        }
        else if (routeCurrentIndex = routeFirstIndex) {
            setStep(routeCurrentIndex);
            showInfoMessageRouteUnavailable();
        }
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
            showInfoMessageRouteUnavailable();
        }
    };
    let handleRouteBackward3 = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data3.documents[0].step;

        setRouteData(data3.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
        if (routeCurrentIndex > routeFirstIndex) {
            setStep(routeCurrentIndex - 1)
        }
        else if (routeCurrentIndex = routeFirstIndex) {
            setStep(routeCurrentIndex);
            showInfoMessageRouteUnavailable();
        }
    };
    let handleRouteBackward4 = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data4.documents[0].step;

        setRouteData(data4.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
        if (routeCurrentIndex > routeFirstIndex) {
            setStep(routeCurrentIndex - 1)
        }
        else if (routeCurrentIndex = routeFirstIndex) {
            setStep(routeCurrentIndex);
            showInfoMessageRouteUnavailable();
        }
    };
    let handleRouteBackward5 = () => {

        let routeFirstIndex = 1;
        let routeCurrentIndex = data5.documents[0].step;

        setRouteData(data5.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex - 1 }))
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
        let routeCurrentIndex = data.documents[0].step;

        setRouteData(data.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }
    let handleRouteFromUserEditToApprove2 = () => { //user send to approve
        let routeCurrentIndex = data2.documents[0].step;

        setRouteData(data2.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }
    let handleRouteFromUserEditToApprove3 = () => { //user send to approve
        let routeCurrentIndex = data3.documents[0].step;

        setRouteData(data3.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }
    let handleRouteFromUserEditToApprove4 = () => { //user send to approve
        let routeCurrentIndex = data4.documents[0].step;

        setRouteData(data4.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }
    let handleRouteFromUserEditToApprove5 = () => { //user send to approve
        let routeCurrentIndex = data5.documents[0].step;

        setRouteData(data5.documents[0].route_data.filter((el) => { return el.step == routeCurrentIndex}))
        setStatus(5);
    }
    //------------------document statuses
    let handleStatusCancelled=() => {
        setStatus(2);
    };


    //---------------------------------------debug
    // useEffect(() => { console.log('loadingOne status:', loadingOne) }, [loadingOne]);
    // useEffect(() => { console.log('loadingTwo status:', loadingTwo) }, [loadingTwo]);
    // useEffect(() => { console.log('loadingThree status:', loadingThree) }, [loadingThree]);
    // useEffect(() => { console.log('loadingFour status:', loadingFour) }, [loadingFour]);

    console.log('route_data', routeData)
    console.log('data', data)


    let HandleDeleteFile = (file) => {
        console.log('CLIIIICK',file)
        fileDelete({variables:{document_files:{id:file.id}}})
    }
    const [fileDelete, { loading: loadingFileDelete, error: errorDileDelete }] = useMutation(deleteFile, {
        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });

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

                    HandleDeleteFile={HandleDeleteFile}

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

                    handleRouteReturnToSender={handleRouteReturnToSender}

                    HandleDeleteFile={HandleDeleteFile}

                    handleRouteFromUserEditToApprove2={handleRouteFromUserEditToApprove2}

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
                        variables[GQL2.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues2={data2}
                    disabled={viewMode}
                />
            </Modal>
            <Modal
                title={props.title}
                visible={visible3}
                centered
                // width={props.width?props.width:450}
                width={900}
                onOk={() => { form3.submit() }}
                onCancel={() => { setVisible3(false); setViewMode(true) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <UpdateForm3
                    commentsList={commentsList}
                    HandleComment={handleComment}
                    HandleCommentOnChange={HandleCommentOnChange}

                    handleRouteForward3={handleRouteForward3}
                    handleRouteBackward3={handleRouteBackward3}

                    HandleDeleteFile={HandleDeleteFile}

                    handleRouteReturnToSender={handleRouteReturnToSender}

                    handleRouteFromUserEditToApprove3={handleRouteFromUserEditToApprove3}

                    handleStatusCancelled={handleStatusCancelled}

                    modalCancelHandler={modalCancelHandler}
                    modalEnableEditHandler={modalEnableEditHandler}

                    form3={form3}
                    onFinish3={(values) => {
                        let variables = {};
                        console.log('values on finish', values);
                        if (step) { values.step = step };
                        if (status) { values.status_id = status };
                        values.is_read = false
                        if (routeData && routeData[0]?.positionId) { values.positionId = routeData[0].positionId }
                        values.route_id = 26;
                        variables[GQL3.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues3={data3}
                    disabled={viewMode}
                />
            </Modal>
            <Modal
                title={props.title}
                visible={visible4}
                centered
                // width={props.width?props.width:450}
                width={900}
                onOk={() => { form4.submit() }}
                onCancel={() => { setVisible4(false); setViewMode(true) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <UpdateForm4
                    commentsList={commentsList}
                    HandleComment={handleComment}
                    HandleCommentOnChange={HandleCommentOnChange}

                    handleRouteForward4={handleRouteForward4}
                    handleRouteBackward4={handleRouteBackward4}

                    HandleDeleteFile={HandleDeleteFile}

                    handleRouteReturnToSender={handleRouteReturnToSender}

                    handleRouteFromUserEditToApprove4={handleRouteFromUserEditToApprove4}

                    handleStatusCancelled={handleStatusCancelled}

                    modalCancelHandler={modalCancelHandler}
                    modalEnableEditHandler={modalEnableEditHandler}

                    form4={form4}
                    onFinish4={(values) => {
                        let variables = {};
                        console.log('values on finish', values);
                        if (step) { values.step = step };
                        if (status) { values.status_id = status };
                        values.is_read = false
                        if (routeData && routeData[0]?.positionId) { values.positionId = routeData[0].positionId }
                        values.route_id = 27;
                        variables[GQL.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues4={data4}
                    disabled={viewMode}
                />
            </Modal>
            <Modal
                title={props.title}
                visible={visible5}
                centered
                // width={props.width?props.width:450}
                width={900}
                onOk={() => { form5.submit() }}
                onCancel={() => { setVisible5(false); setViewMode(true) }}

                maskClosable={false}
                destroyOnClose={true}
                footer={null}
            >
                <UpdateForm5
                    commentsList={commentsList}
                    HandleComment={handleComment}
                    HandleCommentOnChange={HandleCommentOnChange}

                    handleRouteForward5={handleRouteForward5}
                    handleRouteBackward5={handleRouteBackward5}

                    HandleDeleteFile={HandleDeleteFile}

                    handleRouteReturnToSender={handleRouteReturnToSender}

                    handleRouteFromUserEditToApprove5={handleRouteFromUserEditToApprove5}

                    handleStatusCancelled={handleStatusCancelled}

                    modalCancelHandler={modalCancelHandler}
                    modalEnableEditHandler={modalEnableEditHandler}

                    form5={form5}
                    onFinish5={(values) => {
                        let variables = {};
                        console.log('values on finish', values);
                        if (step) { values.step = step };
                        if (status) { values.status_id = status };
                        values.is_read = false
                        if (routeData && routeData[0]?.positionId) { values.positionId = routeData[0].positionId }
                        values.route_id = 29;
                        variables[GQL.exemplar] = values;
                        update({ variables })
                    }}
                    initialValues5={data5}
                    disabled={viewMode}
                />
            </Modal>
        </>
    );
});

export default ModalUpdate;