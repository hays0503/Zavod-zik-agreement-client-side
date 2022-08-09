import { Popconfirm, Button, message } from "antd";
import React, { useState } from "react";

let RejectConfirm = React.memo(({ reasonText, dataProps, setState, user, ...props }) => {

    const [rejectVisible, setRejectVisible] = useState(false)
    const [confirmText, setConfirmText] = useState('Вы уверены что хотите согласовать договор?');

    const rejectConfirm = () => {
        setState(prevState => {
            let old = Object.assign({}, prevState);
            old.reason = null;
            old.reason = dataProps.initialValues4.documents[0].reason ? dataProps.initialValues4.documents[0].reason : [];
            old.reason.push({ text: 'Отклонено: ' + reasonText, userId: user.id, userFio: user.fio, userPosition: user.position_names[0], userName: user.username });
            return old;
        });
        dataProps.handleStatusCancelled();
        setRejectVisible(false);
        dataProps.form4.submit()
    };

    return (
        <Popconfirm
            title={confirmText}
            placement="topLeft"
            disabled={dataProps.disabled}
            visible={rejectVisible}
            onCancel={() => { setRejectVisible(false) }}
            onConfirm={rejectConfirm}
            okText="Да"
            cancelText="Нет">
            <Button type="primary" disabled={dataProps.disabled} onClick={() => {
                if (reasonText == null || reasonText.length == 0) {
                    setRejectVisible(false)
                    message.error('Для отклонения договора нужно указать замечание')
                }
                else {
                    setRejectVisible(true)
                    setConfirmText('Вы уверены что хотите отклонить договор?');
                }
            }}>
                Отклонить
            </Button>
        </Popconfirm>
    )
});

export default RejectConfirm;