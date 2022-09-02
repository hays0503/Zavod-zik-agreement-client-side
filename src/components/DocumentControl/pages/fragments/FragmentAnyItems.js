
import { Form } from 'antd'
/**
 * Фрагмент antd элементами для хранение данных (ну или типо того)
 */
export const FragmentAnyItems = (props) => {
  return (
            <>
                <Form.Item
                name="date_created"
                hidden={true}
                />

                <Form.Item
                name="route_id"
                hidden={true}
                />

                <Form.Item
                name="status_id"
                hidden={true}
                />

                <Form.Item
                name="step"
                hidden={true}
                />

                <Form.Item
                name="log_username"
                hidden={true}
                />
            </>
  )
}
