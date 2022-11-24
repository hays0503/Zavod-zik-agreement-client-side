import { Form, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";

import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "./../../../fragments/FragmentCommentsViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "./../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";

import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

let Update2 = React.memo((props) => {
  let user = useUser();

  const iniValue = props?.initialValues2?.documents[0];

  const [state, setState] = useState({
    log_username: user.username,
  });

  useEffect(() => {
    props.form2.setFieldsValue(state);
    //console.log("state2 form", state);
  }, [state]);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  //console.log("PROPS UPDATE DOC 2", props);
  useEffect(() => {
    if (props.initialValues2) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,

        description: iniValue.data_agreement_list[0].description,
        price: iniValue.data_agreement_list[0].price,
        subject: iniValue.data_agreement_list[0].subject,

        currency_price: iniValue.data_agreement_list[0].currency_price,
        executor_name_division:
          iniValue.data_agreement_list[0].executor_name_division,
        sider_signatures_date:
          iniValue.data_agreement_list[0].sider_signatures_date,
        received_from_counteragent_date:
          iniValue.data_agreement_list[0].received_from_counteragent_date,

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
      //console.log("props.initialValues2", props.initialValues2);
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues2]);
  const [reasonText, setReasonText] = useState(iniValue?.reason);

  const ReasonInputChange = (all, change) => {
    if (all.target.value.length > 0) {
      setReasonText(all.target.value);
    } else {
      setReasonText(all.target.value);
    }
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
  //////////////////////////////////////////////////////////////////////////////////////////

  let onFinish = () => {
    props.onFinish2(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  return (
    <Form
      form={props.form2}
      name="DocumentsForm2"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
        //console.log("UPDATE2 values", allValues);
      }}
    >
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
      {/* /////////////////////////////////// */}
      {/* "Лист согласования на реализацию готовой продукции" */}
      <FormWrap>
        {FormItem("Тип договора: ", iniValue?.route_id?.name)}
      </FormWrap>
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />

      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Предмет договора: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Общая сумма договора в валюте цены договора: ",
          state?.price
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Общая сумма договора в тенге, по курсу НБ РК: ",
          state?.currency_price
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Наименование подразделения, фамилия ответственного исполнителя: ",
          state?.executor_name_division
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: ",
          state?.sider_signatures_date
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Дата получение проекта договора, способ получения от контрагента: ",
          state?.received_from_counteragent_date
        )}
      </FormWrap>
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
      {props.initialValues2 !== undefined ? (
        <FragmentStepViewer
          signatures={iniValue?.signatures}
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

export default Update2;
