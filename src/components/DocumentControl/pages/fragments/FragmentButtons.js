
import { Row, Col, Divider, Space, Button } from 'antd'

/**
 * Фрагмент antd с кнопками для форм
 * @param {func} ApproveConfirm
 * @param {func} ReturnToSenderConfirm
 * @param {func} ReturnStepBackConfirm
 * @param {func} RejectConfirm
 * @param {func} reasonText
 * @param {func} props
 * @param {func} setState
 * @param {func} user
 */
export const FragmentButtons = (props) => {
  return (
        <>
        <Row>
                <Col span={24}>
                    {props.ApproveConfirm && props.ApproveConfirm()}
                    <Divider type={'vertical'} />
                    <Space>
                        <Divider type={'vertical'} />
                        {props.ReturnToSenderConfirm && props.ReturnToSenderConfirm()}
                        {props.ReturnStepBackConfirm && props.ReturnStepBackConfirm()}
                        <Divider type={'vertical'} />
                        {props.RejectConfirm && props.RejectConfirm()}
                    </Space>
                </Col>
                <Col span={24} className="marginTop">
                    <Button onClick={props.modalCancelHandler}>
                        Отменить
                    </Button>
                    <Divider type={'vertical'} />
                    <Button onClick={props.modalEnableEditHandler}>
                        Редактировать
                    </Button>
                </Col>
            </Row>
        </>
  )
}
