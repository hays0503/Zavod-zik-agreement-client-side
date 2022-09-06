import { Form, Input, message, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../core/functions';
import constants from "../../../../../../config/constants";
import UploadFile from '../../../../modals/UploadFile';

let Insert4 = React.memo((props) => {
    let user = useUser();
    const price_pattern = /^\d+$/;
    // const phone_pattern= /^!*([0-9]!*){11,11}$/g;
    const price_max_count = /^.{1,8}$/;
    const [state, setState] = useState({
        log_username: user.username,
    });

    useEffect(() => { props.form4.setFieldsValue(state) }, [state]);

    useEffect(() => {
        if (props.initialValues4) {
            setState({
                id: props.initialValues4.documents[0].id,
                title: props.initialValues4.documents[0].title,

                price: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].price,
                subject: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].subject,
                currency: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].currency,
                executor_name_division: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].executor_name_division,
                executor_phone_number: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].executor_phone_number,
                counteragent_contacts: props.initialValues4.documents[0].data_agreement_list_internal_needs[0].counteragent_contacts,

                date_created: props.initialValues4.documents[0].date_created,
                date_modified: props.initialValues4.documents[0].date_modified,
                route_id: props.initialValues4.documents[0].route_id.id,
                status_in_process: props.initialValues4.documents[0].route_id.status_in_process,
                status_id: props.initialValues4.documents[0].status_id,
                step: props.initialValues4.documents[0].step,
                comments: props.initialValues4.documents[0].comments,
                files: props.initialValues4.documents[0].files,
                log_username: state.log_username
            });
        }
    }, [props.initialValues4]);

    let onFinish = (values) => {
        props.onFinish4(state)
        console.log('-------------------------------------------', values);
    }

    let radioOptions = [
        { label: 'Закупки товаров, работ и услуг', value: 'Закупки товаров, работ и услуг' },
        { label: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам', value: 'Поставка продукции (выполнение работ, оказание услуг) заказчикам' },
        { label: 'Передача имущества в аренду (бесплатное пользование)', value: 'Передача имущества в аренду (бесплатное пользование)' },
        { label: 'Совместная деятельность', value: 'Совместная деятельность' },
        { label: 'Финансирование (кредитование, обеспечение исполнения обязательств)', value: 'Финансирование (кредитование, обеспечение исполнения обязательств)' },
        { label: 'Прочие обязательства', value: 'Прочие обязательства' }
    ]
    const [radioState, setRadioState] = useState(1);

    const RadioOnChange = (radioValue) => {
        setRadioState(radioValue.target.value);
    };

    return (
        <Form
            form={props.form4}
            name="DocumentsForm4"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"

            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}
        >
            <h4>ЛИСТ СОГЛАСОВАНИЯ НА ЗАКУП ТРУ ДЛЯ ВНУТРИЗАВОДСКИХ НУЖД И КАПИТАЛЬНЫХ ЗАТРАТ</h4>
            <Form.Item
                name="title"
                label='Наименование контрагента'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                ]}
            >
                <Input placeholder="Наименование контрагента" />
            </Form.Item>
            <Form.Item
                name="subject"
                label='Предмет договора'
                labelCol={{ span: 24 }}
                className='form-checkbox'
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                ]}
            >
                <Radio.Group disabled={props.disabled} onChange={RadioOnChange} options={radioOptions} className='form-radio' value={radioState} />
            </Form.Item>
            <Form.Item
                name="price"
                label="Общая сумма договора"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    },
                    {
                        pattern: price_pattern,
                        message: 'Можно использовать только цифры!',
                    },
                    {
                        pattern:price_max_count,
                        message:'Общая сумма договора не должна привышать 99999999'
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Общая сумма договора" />
            </Form.Item>
            <Form.Item
                name="currency"
                label="Валюта платежа"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Валюта платежа" />
            </Form.Item>
            <Form.Item
                name='executor_name_division'
                label='Наименование подразделения, фамилия ответственного исполнителя'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Наименование подразделения, фамилия ответственного исполнителя" />
            </Form.Item>
            <Form.Item
                name='executor_phone_number'
                label='Телефон исполнителя'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Телефон исполнителя" />
            </Form.Item>
            <Form.Item
                name='counteragent_contacts'
                label='Контакты контрагента'
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо для заполнения!',
                    }
                ]}
            >
                <Input disabled={props.disabled} placeholder="Контакты контрагента" />
            </Form.Item>
            <Form.Item
                name="files"
                label="Файлы"
                labelCol={{ span: 24 }}
                rules={[
                    {
                        required: true,
                        message: 'Необходимо загрузить хотя бы один файл.',
                    }
                ]}
            >
                <UploadFile
                    showUploadList={true}
                    action={"https://" + constants.host + ":" + constants.port + "/document-control/orders"}
                    multiple={true}
                    maxCount={50}
                    /*accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}*/
                    onChange={(info) => {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                            console.log('info.file', info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} - загружен успешно.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} - ошибка при загрузке.`);
                        }
                    }}
                />
            </Form.Item>
            <Form.Item
                name="date_created"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="route_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="status_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="step"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="log_username"
                hidden={true}
            >
            </Form.Item>
        </Form>
    )
})

export default Insert4;