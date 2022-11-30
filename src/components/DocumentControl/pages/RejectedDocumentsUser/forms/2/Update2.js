import { Form, Typography, Divider, Steps, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";

import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";

const { Title, Link } = Typography;
const { Step } = Steps;

let Update2 = React.memo((props) => {
  let user = useUser();

  const [state, setState] = useState({
    log_username: user.username,
  });

  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues2?.documents[0];

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

  useEffect(() => {
    props.form2.setFieldsValue(state);
  }, [state]);
  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  let [stepCount, setStepCount] = useState({ step: "0" });
  //console.log("PROPS UPDATE DOC 2", props);
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

  let onFinish = () => {
    props.onFinish2(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  const [radioState, setRadioState] = useState(
    props?.initialValues2?.documents[0]?.data_agreement_list[0]?.subject
  );

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
      {/* Лист согласования на реализацию готовой продукции */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues2?.documents[0].route_id.name}
      </h4>
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование контрагента:", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Предмет договора: ", state.subject)}</FormWrap>
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
          state.currency_price
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Наименование подразделения, фамилия ответственного исполнителя: ",
          state.executor_name_division
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          `Подписанный сторонами оригинал договора получен,
								дата, способ получения от контрагента: `,
          state.sider_signatures_date
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          `Дата получение проекта договора,
								способ получения от контрагента: `,
          state.received_from_counteragent_date
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      <Form.Item
        className="font-form-header"
        name="signatures"
        label="Подписи"
        labelCol={{ span: 24 }}
      >
        {props?.initialValues2?.documents[0].signatures.map((item) => {
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
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
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

export default Update2;
