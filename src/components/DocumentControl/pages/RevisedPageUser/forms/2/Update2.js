import {
  Button,
  Form,
  Input,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Steps,
  Radio,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

import FromUserEditToApproveConfirm from "./dialogs/FromUserEditToApproveConfirm";

import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import FragmentUploader from "./../../../fragments/FragmentUploader";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";

const { Title, Link } = Typography;
const { Step } = Steps;

const price_pattern = /^\d+$/;

let Update2 = React.memo((props) => {
  let user = useUser();
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues2?.documents[0];
  /**
   * Деструктаризация (начального значение из таблиц Route(движение документов))
   */
  const iniValRoute = props?.initialValues2?.documents[0]?.route_id;
  const [state, setState] = useState({
    log_username: user.username,
  });

  useEffect(() => {
    props.form2.setFieldsValue(state);
  }, [state]);
  //console.log("PROPS UPDATE DOC 2", props);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  useEffect(() => {
    if (props.initialValues2) {
      setState({
        id: props.initialValues2.documents[0].id,
        title: props.initialValues2.documents[0].title,
        position: props.initialValues2.documents[0].position,
        username: props.initialValues2.documents[0].username,
        fio: props.initialValues2.documents[0].fio,

        price: props.initialValues2.documents[0].data_agreement_list[0].price,
        subject:
          props.initialValues2.documents[0].data_agreement_list[0].subject,

        currency_price:
          props.initialValues2.documents[0].data_agreement_list[0]
            .currency_price,
        executor_name_division:
          props.initialValues2.documents[0].data_agreement_list[0]
            .executor_name_division,
        sider_signatures_date:
          props.initialValues2.documents[0].data_agreement_list[0]
            .sider_signatures_date,
        received_from_counteragent_date:
          props.initialValues2.documents[0].data_agreement_list[0]
            .received_from_counteragent_date,

        date_created: props.initialValues2.documents[0].date_created,
        date_modified: props.initialValues2.documents[0].date_modified,
        route_id: props.initialValues2.documents[0].route_id.id,
        status_in_process:
          props.initialValues2.documents[0].route_id.status_in_process,
        status_cancelled:
          props.initialValues2.documents[0].route_id.status_cancelled,
        status_finished:
          props.initialValues2.documents[0].route_id.status_finished,
        status_id: props.initialValues2.documents[0].status_id,
        route: props.initialValues2.documents[0].route_data,
        step: props.initialValues2.documents[0].step,
        comments: props.initialValues2.documents[0].comments,
        signatures: props.initialValues2.documents[0].signatures,
        files: props.initialValues2.documents[0].files,
        //document_logs: props.initialValues.documents[0].document_logs,
        document_logs: { is_read: true },
        log_username: state.log_username,
      });
      //console.log("props.initialValues2", props.initialValues2);
      setStepCount({ step: props.initialValues2.documents[0].step });
      setRoutesList(props.initialValues2.documents[0].route_data);
    }
  }, [props.initialValues2]);
  /**
   * Cтейт для таблиц файлов по поручением
   */
  const [FileTask, setFileTask] = useState([]);
  useEffect(() => {
    if (iniValue?.id) {
      GetIDNameTaskFile(iniValue?.id).then((value) => {
        setFileTask(value.result);
      });
    }
  }, [iniValue]);
  //////////////////////////////////////////////////////////////////////////////

  let onFinish = () => {
    props.onFinish2(state);
    //console.log("+++++++++++++++++++++++", values);
  };

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
      label:
        "Финансирование (кредитование, обеспечение исполнения обязательств)",
      value:
        "Финансирование (кредитование, обеспечение исполнения обязательств)",
    },
    { label: "Прочие обязательства", value: "Прочие обязательства" },
  ];
  const [radioState, setRadioState] = useState(
    props?.initialValues2?.documents[0]?.data_agreement_list[0]?.subject
  );

  const RadioOnChange = (radioValue) => {
    setRadioState(radioValue.target.value);
  };
  //Направление для вывода согласованых подписей (круги)
  const stepsDirection = useRef("vertical");
  return (
    <Form
      form={props.form2}
      name="DocumentsForm2"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      {/* //Реализация готовой продукции */}
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Тип договора: ", iniValRoute?.name)}</FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      <Form.Item
        name="title"
        label="Наименование контрагента"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Наименование контрагента"
        />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Предмет договора"
        labelCol={{ span: 24 }}
        className="form-input-label"
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
      <Form.Item
        name="price"
        label="Общая сумма договора в валюте цены договора"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
          {
            pattern: price_pattern,
            message: "Можно использовать только цифры!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Общая сумма договора в валюте цены договора"
        />
      </Form.Item>
      <Form.Item
        name="currency_price"
        label="Общая сумма договора в тенге, по курсу НБ РК"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Общая сумма договора в тенге, по курсу НБ РК"
        />
      </Form.Item>
      <Form.Item
        name="executor_name_division"
        label="Наименование подразделения, фамилия ответственного исполнителя"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Наименование подразделения, фамилия ответственного исполнителя"
        />
      </Form.Item>
      <Form.Item
        name="sider_signatures_date"
        label="Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Дата, способ получения от контрагента"
        />
      </Form.Item>
      <Form.Item
        name="received_from_counteragent_date"
        label="Дата получение проекта договора, способ получения от контрагента"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input
          disabled={props.disabled}
          placeholder="Дата получение проекта договора, способ получения от контрагента"
        />
      </Form.Item>
      <Divider type={"horizontal"} />

      {/* Фрагмент antd дающую возможность загружать файлы */}
      <FragmentUploader />
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />

      {/*Фрагмент antd дающую возможность просматривать файлы*/}
      {props.initialValues2 !== undefined && FileTask !== undefined ? (
        <FragmentTaskAndFileViewer
          files={iniValue?.files}
          files_task={FileTask}
          userId={user.id}
        />
      ) : (
        <h1>Загрузка</h1>
      )}
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />
      {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
      {iniValue?.signatures !== undefined ? (
        <FragmentStepViewer
          signatures={iniValue?.signatures}
          stepsDirection={stepsDirection.current}
          step={stepCount.step - 1}
          routesList={routesList}
        />
      ) : (
        <h1>Загрузка</h1>
      )}
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* Фрагмент antd для вывода Замечаний по документу */}
      <FragmentReasonsViewer Reason={iniValue?.reason} />
      {/* /////////////////////////////////// */}
      <Row>
        <Col span={24}>
          <Divider type={"horizontal"} />
          <Space>
            <FromUserEditToApproveConfirm
              dataProps={props}
              setState={setState}
              user={user}
            />
            <Divider type={"vertical"} />
          </Space>
        </Col>
        <Col span={24} className="marginTop">
          <Button onClick={props.modalCancelHandler}>Отменить</Button>
          <Divider type={"vertical"} />
          <Button onClick={props.modalEnableEditHandler}>Редактировать</Button>
        </Col>
      </Row>
      <Divider type={"horizontal"} />
      {/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
      <FragmentCommentsViewer
        HandleCommentOnChange={props.HandleCommentOnChange}
        disabled={false}
        HandleComment={props.HandleComment}
        commentsList={props.commentsList}
      />
      {/* /////////////////////////////////// */}

      {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
      <FragmentAnyItems />
      {/* /////////////////////////////////// */}
    </Form>
  );
});

export default Update2;
