import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Row,
  Col,
  Steps,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";

//pop confirm
import FromUserEditToApproveConfirm from "./dialogs/FromUserEditToApproveConfirm";
import FragmentUploader from "./../../../fragments/FragmentUploader";

const { Title, Link } = Typography;
const { Step } = Steps;

const price_pattern = /^\d+$/;

let Update1 = React.memo((props) => {
  let user = useUser();

  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues?.documents[0];
  /**
   * Деструктаризация (начального значение из таблиц Route(движение документов))
   */
  const iniValRoute = props?.initialValues?.documents[0]?.route_id;
  console.log(props);
  console.log(iniValue);
  console.log(iniValRoute);
  const [state, setState] = useState({
    log_username: user.username,
  });

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  useEffect(() => {
    if (props.initialValues) {
      setState({
        id: props.initialValues.documents[0].id,
        title: props.initialValues.documents[0].title,
        position: props.initialValues.documents[0].position,
        username: props.initialValues.documents[0].username,
        fio: props.initialValues.documents[0].fio,

        price: props.initialValues.documents[0].data_one[0].price,
        supllier: props.initialValues.documents[0].data_one[0].supllier,
        subject: props.initialValues.documents[0].data_one[0].subject,

        date_created: props.initialValues.documents[0].date_created,
        date_modified: props.initialValues.documents[0].date_modified,
        route_id: props.initialValues.documents[0].route_id.id,
        status_in_process:
          props.initialValues.documents[0].route_id.status_in_process,
        status_cancelled:
          props.initialValues.documents[0].route_id.status_cancelled,
        status_finished:
          props.initialValues.documents[0].route_id.status_finished,
        status_id: props.initialValues.documents[0].status_id,
        route: props.initialValues.documents[0].route_data,
        step: props.initialValues.documents[0].step,
        comments: props.initialValues.documents[0].comments,
        signatures: props.initialValues.documents[0].signatures,
        files: props.initialValues.documents[0].files,
        //document_logs: props.initialValues.documents[0].document_logs,
        document_logs: { is_read: true },
        log_username: state.log_username,
      });
      //console.log("props.initialValues", props.initialValues);
      setStepCount({ step: props.initialValues.documents[0].step });
      setRoutesList(props.initialValues.documents[0].route_data);
    }
  }, [props.initialValues]);
  //Направление для вывода согласованых подписей (круги)
  const stepsDirection = useRef("vertical");
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
  //////////////////////////////////////////////////////////////////////////////////////////

  let onFinish = () => {
    props.onFinish(state);
    // console.log("+++++++++++++++++++++++", state);
  };

  return (
    <Form
      form={props.form}
      name="DocumentsForm"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
      {/* /////////////////////////////////// */}
      {/* //"Закуп ТРУ" */}
      <FormWrap>{FormItem("Тип договора: ", iniValRoute?.name)}</FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      <Form.Item
        name="title"
        label="Наименование ТРУ"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input disabled={props.disabled} placeholder="Наименование ТРУ" />
      </Form.Item>
      <Form.Item
        name="supllier"
        label="Поставщик ТРУ"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input disabled={props.disabled} placeholder="Поставщик ТРУ" />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Основание"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input disabled={props.disabled} placeholder="Основание" />
      </Form.Item>
      <Form.Item
        name="price"
        label="Общая сумма договора"
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
        <Input disabled={props.disabled} placeholder="Общая сумма договора" />
      </Form.Item>
      <Divider type={"horizontal"} />

      {/* Фрагмент antd дающую возможность загружать файлы */}
      <FragmentUploader />
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />

      {/*Фрагмент antd дающую возможность просматривать файлы*/}
      {props.initialValues !== undefined && FileTask !== undefined ? (
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
          <FromUserEditToApproveConfirm
            dataProps={props}
            setState={setState}
            user={user}
          />
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

export default Update1;
