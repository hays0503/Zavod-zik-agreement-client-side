import { Popconfirm, Button } from "antd";
import React, { useState } from "react";

let ApproveConfirm = React.memo(({ reasonText, dataProps, setState, user, ...props }) => {

    const [confirmText, setConfirmText] = useState('Вы уверены что хотите согласовать договор?');

    const confirm = () => {
        if (reasonText != null || reasonText?.length > 0) {
            setState(prevState => {
                let old = Object.assign({}, prevState);
                old.reason = null;
                old.reason = dataProps.initialValues.documents[0].reason ? dataProps.initialValues.documents[0].reason : [];
                old.reason.push({ text: 'Замечание: ' + reasonText, userId: user.id, userFio: user.fio, userPosition: user.position_names[0], userName: user.username });
                return old;
            });
        };
        dataProps.handleRouteForward()
        dataProps.form.submit()
    };

    return (
        <Popconfirm
            title={confirmText}
            placement="topLeft"
            disabled={dataProps.disabled}
            onConfirm={confirm}
            okText="Да"
            cancelText="Нет">
            <Button
                disabled={dataProps.disabled}
                type='primary'
                onClick={() => {
                    if (reasonText == null || reasonText.length == 0) {
                        setConfirmText('Вы уверены что хотите согласовать договор без замечаний?')
                    }
                    else {
                        setConfirmText('Вы уверены что хотите согласовать договор?');
                    }
                }}>
                Согласовать
            </Button>
        </Popconfirm>
    )
});

export default ApproveConfirm;