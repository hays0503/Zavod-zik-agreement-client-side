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

let Update5 = React.memo((props) => {
  let user = useUser();
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues5?.documents[0];
  /**
   * Деструктаризация (начального значение из таблиц Route(движение документов))
   */
  const iniValRoute = props?.initialValues5?.documents[0]?.route_id;

  const stepsDirection = useRef("vertical");
  useEffect(() => {
    if (props?.initialValues5?.documents[0]?.route_data?.length > 1)
      stepsDirection.current =
        props?.initialValues5?.documents[0]?.route_data?.length <= 7
          ? "horizontal"
          : "vertical";
  }, [props]);

  const [state, setState] = useState({
    log_username: user.username,
  }); //console.log

  useEffect(() => {
    props.form5.setFieldsValue(state);
  }, [state]);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  useEffect(() => {
    if (props.initialValues5) {
      setState({
        id: props.initialValues5.documents[0].id,
        title: props.initialValues5.documents[0].title,
        position: props.initialValues5.documents[0].position,
        username: props.initialValues5.documents[0].username,
        fio: props.initialValues5.documents[0].fio,

        subject: props.initialValues5.documents[0].data_custom[0].subject,
        remark: props.initialValues5.documents[0].data_custom[0].remark,

        date_created: props.initialValues5.documents[0].date_created,
        date_modified: props.initialValues5.documents[0].date_modified,
        route_id: props.initialValues5.documents[0].route_id.id,
        status_in_process:
          props.initialValues5.documents[0].route_id.status_in_process,
        status_cancelled:
          props.initialValues5.documents[0].route_id.status_cancelled,
        status_finished:
          props.initialValues5.documents[0].route_id.status_finished,
        status_id: props.initialValues5.documents[0].status_id,
        route: props.initialValues5.documents[0].route_data,
        step: props.initialValues5.documents[0].step,
        comments: props.initialValues5.documents[0].comments,
        signatures: props.initialValues5.documents[0].signatures,
        files: props.initialValues5.documents[0].files,
        log_username: state.log_username,
      });
      setStepCount({ step: props.initialValues5.documents[0].step });
      setRoutesList(props.initialValues5.documents[0].route_data);
    }
  }, [props.initialValues5]);

  let onFinish = () => {
    props.onFinish5(state);
    // console.log("+++++++++++++++++++++++", state);
  };

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

  return (
    <Form
      form={props.form5}
      name="DocumentsForm5"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      {/* Другое */}
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
        label="Наименование"
        labelCol={{ span: 24 }}
        className="form-input-label"
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input disabled={props.disabled} placeholder="Наименование" />
      </Form.Item>
      <Form.Item
        name="remark"
        label="Примечание"
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input disabled={props.disabled} placeholder="Примечание" />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Основание"
        className="form-input-label"
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Необходимо для заполнения!",
          },
        ]}
      >
        <Input.TextArea
          rows={4}
          disabled={props.disabled}
          placeholder="Основание"
        />
      </Form.Item>
      <Divider type={"horizontal"} />
      {/* Фрагмент antd дающую возможность загружать файлы */}
      <FragmentUploader />
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />

      {/*Фрагмент antd дающую возможность просматривать файлы*/}
      {props.initialValues5 !== undefined && FileTask !== undefined ? (
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

export default Update5;
