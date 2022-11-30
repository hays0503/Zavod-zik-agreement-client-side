import { Form, Typography, Divider, Steps, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";

import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "./../../../fragments/FragmentReasonsViewer";

const { Title, Link } = Typography;
const { Step } = Steps;

let Update1 = React.memo((props) => {
  let user = useUser();
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues?.documents[0];

  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
   */
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
        currency: props.initialValues.documents[0].data_one[0].currency,

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
        document_logs: { is_read: true },
        log_username: state.log_username,
      });
      setStepCount({ step: props.initialValues.documents[0].step });
      setRoutesList(props.initialValues.documents[0].route_data);
    }
  }, [props.initialValues]);

  let onFinish = () => {
    props.onFinish(state);
    //console.log("+++++++++++++++++++++++", values);
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
      {/* Закуп ТРУ */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues?.documents[0].route_id.name}
      </h4>
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Валюта платежа: ", state?.currency)}</FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      <Form.Item
        className="font-form-header"
        name="signatures"
        label="Подписи"
        labelCol={{ span: 24 }}
      >
        {props?.initialValues?.documents[0].signatures.map((item) => {
          //remove commentsList
          return (
            <>
              <div className="signature-view-wrap">
                <span className="signature-view-position">{item.position}</span>
                <span className="signature-view-username">{item.fio}</span>
                <span className="signature-view-date">
                  {formatDate(item.date_signature)}
                </span>
              </div>
            </>
          );
        })}
      </Form.Item>
      <Divider type={"horizontal"} />
      <Collapse>
        <Collapse.Panel header={<b>Файлы</b>}>
          {/*Фрагмент antd дающую возможность просматривать файлы*/}
          {iniValue !== undefined && FileTask !== undefined ? (
            <FragmentTaskAndFileViewer
              files={iniValue?.files}
              files_task={FileTask}
              userId={user.id}
            />
          ) : (
            <h1>Загрузка</h1>
          )}
        </Collapse.Panel>
      </Collapse>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <Collapse>
        <Collapse.Panel header={<b>Замечание</b>}>
          {/* Фрагмент antd для вывода Замечаний по документу */}
          <FragmentReasonsViewer Reason={iniValue?.reason} />
          {/* /////////////////////////////////// */}
          <Divider type={"horizontal"} />
          {/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
          <FragmentCommentsViewer
            HandleCommentOnChange={props.HandleCommentOnChange}
            disabled={false}
            HandleComment={props.HandleComment}
            commentsList={props.commentsList}
          />
          {/* /////////////////////////////////// */}
        </Collapse.Panel>
      </Collapse>
      {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
      <FragmentAnyItems />
    </Form>
  );
});

export default Update1;
