import { Form, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";

import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import { FragmentStepViewer } from "./../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "./../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

/**
 * Форма 3 Лист согласования на закуп ТРУ для производства продукции
 */
let Update3 = React.memo((props) => {
  let user = useUser();

  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues3?.documents[0];

  const [state, setState] = useState({
    log_username: user.username,
  });

  useEffect(() => {
    props.form3.setFieldsValue(state);
  }, [state]);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  useEffect(() => {
    if (props.initialValues3) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,

        price: iniValue?.data_agreement_list_production[0]?.price,
        subject: iniValue?.data_agreement_list_production[0]?.subject,
        currency: iniValue?.data_agreement_list_production[0]?.currency,
        executor_name_division:
          iniValue?.data_agreement_list_production[0]?.executor_name_division,
        executor_phone_number:
          iniValue?.data_agreement_list_production[0]?.executor_phone_number,
        counteragent_contacts:
          iniValue?.data_agreement_list_production[0]?.counteragent_contacts,

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
        log_username: state.log_username,
      });
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues3]);

  let onFinish = () => {
    props.onFinish3(state);
    //console.log("+++++++++++++++++++++++", values);
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

  const [reasonText, setReasonText] = useState(iniValue?.reason);
  const ReasonInputChange = (all) => {
    if (all.target.value.length > 0) {
      setReasonText(all.target.value);
    } else {
      setReasonText(all.target.value);
    }
  };

  return (
    <Form
      form={props.form3}
      name="DocumentsForm3"
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
      <FormWrap>
        {FormItem("Тип договора: ", iniValue?.route_id?.name)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem("Наименование контрагента: ", state?.title)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Предмет договора: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Валюта платежа: ", state?.currency)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Наименование подразделения, фамилия ответственного исполнителя: ",
          state?.executor_name_division
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem("Телефон исполнителя: ", state?.executor_phone_number)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem("Контакты контрагента: ", state?.counteragent_contacts)}
      </FormWrap>
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />
      {/*Фрагмент antd дающую возможность просматривать файлы*/}
      {props.initialValues3 !== undefined && FileTask !== undefined ? (
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
      {props.initialValues3 !== undefined ? (
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

export default Update3;
