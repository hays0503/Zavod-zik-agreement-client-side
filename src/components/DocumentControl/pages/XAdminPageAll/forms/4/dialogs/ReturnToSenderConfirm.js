import { Popconfirm, Button } from "antd";
import React, { useState } from "react";

let ReturnToSenderConfirm = React.memo(({ reasonText, dataProps, setState, user, ...props }) => {

    const [confirmText, setConfirmText] = useState('Вы уверены что хотите вернуть текущий договор на доработку исполнителю?');

    const confirm = () => {
        if (reasonText != null || reasonText?.length > 0) {
            setState(prevState => {
                let old = Object.assign({}, prevState);
                old.reason = null;
                old.reason = dataProps.initialValues4.documents[0].reason ? dataProps.initialValues4.documents[0].reason : [];
                old.reason.push({ text: 'Замечание: ' + reasonText, userId: user.id, userFio: user.fio, userPosition: user.position_names[0], userName: user.username });
                return old;
            });
        };
        dataProps.handleRouteReturnToSender()
        dataProps.form4.submit()
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
                        setConfirmText('Вы уверены что хотите вернуть текущий договор на доработку без замечаний?')
                    }
                    else {
                        setConfirmText('Вы уверены что хотите вернуть текущий договор на доработку исполнителю?');
                    }
                }}>
                Вернуть на доработку
            </Button>
        </Popconfirm>
    )
});

export default ReturnToSenderConfirm;