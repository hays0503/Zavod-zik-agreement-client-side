import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";

import { Form, Divider } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

let Update1 = React.memo((props) => {
  const iniValue = props?.initialValues?.documents[0];

  let user = useUser();
  const stepsDirection = useRef("vertical");

  const [state, setState] = useState({
    log_username: user.username,
  });

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
  const [reasonText, setReasonText] = useState(iniValue?.reason);

  const ReasonInputChange = (all) => {
    if (all.target.value.length > 0) {
      setReasonText(all.target.value);
    } else {
      setReasonText(all.target.value);
    }
  };

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (iniValue?.route_data?.length > 1)
      stepsDirection.current =
        iniValue?.route_data?.length <= 7 ? "horizontal" : "vertical";
  }, [props]);

  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  //console.log("PROPS UPDATE DOC", props);
  useEffect(() => {
    if (props.initialValues) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,
        description: iniValue.description,

        price: iniValue.data_one[0].price,
        supllier: iniValue.data_one[0].supllier,
        subject: iniValue.data_one[0].subject,
        currency: iniValue.data_one[0].currency,

        date_created: iniValue.date_created,
        date_modified: iniValue.date_modified,
        route_id: iniValue.route_id.id,
        status_in_process: iniValue.route_id.status_in_process,
        status_cancelled: iniValue.route_id.status_cancelled,
        status_finished: iniValue.route_id.status_finished,
        status_id: iniValue.status_id,
        route: iniValue.route_data,
        step: iniValue.step,
        comments: iniValue.comments,
        signatures: iniValue.signatures,
        files: iniValue.files,
        document_logs: iniValue.document_logs,
        log_username: state.log_username,
      });
      //console.log("props.initialValues", props.initialValues);
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues]);

  let onFinish = () => {
    props.onFinish(state);
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
      <FormWrap>
        {FormItem("Тип договора: ", iniValue?.route_id?.name)}
      </FormWrap>
      {/* /////////////////////////////////// */}

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
      {props.initialValues !== undefined ? (
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
      <FragmentReasonsViewer
        disabled={props.disabled}
        ReasonInputChange={ReasonInputChange}
        Reason={state?.reason}
      />
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
      <FragmentCommentsViewer
        HandleCommentOnChange={props.HandleCommentOnChange}
        disabled={props.disabled}
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
