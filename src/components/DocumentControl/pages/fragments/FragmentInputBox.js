import { Form, Input, Radio, Select } from "antd";
import React, { useState } from "react";

const price_pattern = /^\d+$/;
const price_max_count = /^.{1,15}$/;
const phone_pattern = /^!*([0-9]!*){11,11}$/g;

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxTitle = (props) => {
  return (
    <Form.Item
      name="title"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};
/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxRemark = (props) => {
  return (
    <Form.Item
      name="remark"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};
/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxSupllier = (props) => {
  return (
    <Form.Item
      name="supllier"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};
/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxSubject = (props) => {
  return (
    <Form.Item
      name="subject"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input
        rows={4}
        disabled={props.disabled}
        placeholder={props.placeholder}
      />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxSubjectRadio = (props) => {
  let radioOptions = [
    {
      label: "Закупки товаров, работ и услуг",
      value: "Закупки товаров, работ и услуг",
    },
    {
      label: "Поставка продукции (выполнение работ, оказание услуг) заказчикам",
      value: "Поставка продукции (выполнение работ, оказание услуг) заказчикам",
    },
    {
      label: "Передача имущества в аренду (бесплатное пользование)",
      value: "Передача имущества в аренду (бесплатное пользование)",
    },
    { label: "Совместная деятельность", value: "Совместная деятельность" },
    {
      label: `Финансирование (кредитование, обеспечение исполнения обязательств)`,
      value: `Финансирование (кредитование, обеспечение исполнения обязательств)`,
    },
    { label: "Прочие обязательства", value: "Прочие обязательства" },
  ];
  const [radioState, setRadioState] = useState(1);

  const RadioOnChange = (radioValue) => {
    setRadioState(radioValue.target.value);
  };
  return (
    <Form.Item
      name="subject"
      label={props.label}
      labelCol={{ span: 24 }}
      className="form-checkbox"
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Radio.Group
        disabled={props.disabled}
        onChange={RadioOnChange}
        options={radioOptions}
        className="form-radio"
        value={radioState}
      />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxPrice = (props) => {
  return (
    <Form.Item
      name="price"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
        {
          pattern: price_pattern,
          message: "Можно использовать только цифры!",
        },
        {
          pattern: price_max_count,
          message: "Общая сумма договора не должна превышать 15 знаков",
        },
      ]}
    >
      <Input
        rows={4}
        disabled={props.disabled}
        placeholder={props.placeholder}
      />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxCurrency = (props) => {
  return (
    <Form.Item
      name="currency"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Select
        disabled={props.disabled}
        defaultValue={props.placeholder}
        options={[
          {
            value: "₸(тенге)",
            label: "₸(тенге)",
          },
          {
            value: "₽(рубль)",
            label: "₽(рубль)",
          },
          {
            value: "$(доллар)",
            label: "$(доллар)",
          },
          {
            value: "€(евро)",
            label: "€(евро)",
          },
          {
            value: "£(фунт)",
            label: "£(фунт)",
          },
          {
            value: "¥(юань)",
            label: "¥(юань)",
          },
        ]}
      />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxCurrencyPrice = (props) => {
  return (
    <Form.Item
      name="currency_price"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
        {
          pattern: price_pattern,
          message: "Можно использовать только цифры!",
        },
        {
          pattern: price_max_count,
          message: "Общая сумма договора не должна превышать 15 знаков",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxExecutorNameDivision = (props) => {
  return (
    <Form.Item
      name="executor_name_division"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxExecutorSiderSignaturesDate = (props) => {
  return (
    <Form.Item
      name="sider_signatures_date"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxExecutorReceivedFromCounteragentDate = (props) => {
  return (
    <Form.Item
      name="received_from_counteragent_date"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxExecutorPhoneNumber = (props) => {
  return (
    <Form.Item
      name="executor_phone_number"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
        {
          pattern: phone_pattern,
          message: "Номер введен не корректно",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};

/**
 *
 * @param {string} label Метка заполняемой области
 * @param {string} placeholder Подсказка для области заполнение
 * @returns {Form.Item} Form.Item Возвращает фрагмент формы
 */
export const FragmentInputBoxCounteragentContacts = (props) => {
  return (
    <Form.Item
      name="counteragent_contacts"
      label={props.label}
      labelCol={{ span: 24 }}
      rules={[
        {
          required: true,
          message: "Необходимо для заполнения!",
        },
        {
          pattern: phone_pattern,
          message: "Номер введен не корректно",
        },
      ]}
    >
      <Input disabled={props.disabled} placeholder={props.placeholder} />
    </Form.Item>
  );
};
