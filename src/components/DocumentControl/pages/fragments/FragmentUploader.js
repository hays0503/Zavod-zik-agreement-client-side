import UploadFile from '../../modals/UploadFile'
import constants from '../../../../config/constants'
import { message, Form } from 'antd'

/**
 * Фрагмент antd дающую возможность загружать файлы
 *
 */
const FragmentUploader = (props) => {
  return (<>

        <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Необходимо загрузить хотя бы один файл.'
                  }
                ]}
            >
                <UploadFile
                    showUploadList={true}
                    action={'https://' + constants.host + ':' + constants.port + `${props.url}`}
                    multiple={true}
                    maxCount={50}
                    /* accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"} */
                    onChange={(info) => {
                      const { status } = info.file
                      if (status !== 'uploading') {
                        console.log('info.file', info.file, info.fileList)
                      }
                      if (status === 'done') {
                        message.success(`${info.file.name} - загружен успешно.`)
                      } else if (status === 'error') {
                        message.error(`${info.file.name} - ошибка при загрузке.`)
                      }
                    }}
                />
            </Form.Item>
   </>)
}
FragmentUploader.defaultProps = { url: '/document-control/orders' }

export default FragmentUploader
