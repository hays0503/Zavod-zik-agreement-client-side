import { Popconfirm, Button } from 'antd'
import React, { useState } from 'react'

const FromUserEditToApproveConfirm = React.memo(({ reasonText, dataProps, setState, user, ...props }) => {
  const [confirmText, setConfirmText] = useState('Вы уверены что хотите отправить договор на согласование?')

  const confirm = () => {
    dataProps.handleRouteFromUserEditToApprove2()
    dataProps.form2.submit()
  }

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
            >
                Отправить на согласование
            </Button>
        </Popconfirm>
  )
})

export default FromUserEditToApproveConfirm
