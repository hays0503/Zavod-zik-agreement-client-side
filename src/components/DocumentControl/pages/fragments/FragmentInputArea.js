
import { Form, Input } from 'antd'

/**
 *
 * Фрагмент antd для считывание текста пользователем
 * @param {string} name Имя формы. Будет префиксом идентификатора поля
 * @param {string} label Текст метки
 */
export const FragmentInputArea = (props) => {
  return (
        <>
            <Form.Item
                name={props.name}
                className='font-form-header'
                label={props.label}
                labelCol={{ span: 24 }}
                rules={
                    [{
                      required: true,
                      message: 'Поле не может быть пустым'
                    }]
                }
            >
            <Input.TextArea />
            </Form.Item>
        </>
  )
}
FragmentInputArea.defaultProps = { name: 'report', label: 'Отчёт' }
