import { Popconfirm} from "antd";
import React from "react";

let ConfirmDialog = React.memo(({ Button, ...props }) => {
    return (
        <Popconfirm
            disabled={props.disabled ? props.disabled : false}
            placement={props.placement ? props.placement : "topLeft"}
            title={props.confirmText ? props.confirmText : 'Подтверждение:'}
            onConfirm={props.confirm}
            onCancel={props.cancel}
            okText={props.okText ? props.okText:"Да"}
            cancelText={props.cancelText ? props.cancelText:"Нет"}
        >
            {Button}
        </Popconfirm>
    )
});

export default ConfirmDialog;