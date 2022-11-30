import { Form, Typography, Divider, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";

let Update4 = React.memo((props) => {
  let user = useUser();
  const { Title, Link } = Typography;
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues4?.documents[0];

  const [state, setState] = useState({
    log_username: user.username,
  });

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
    props.form4.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues4) {
      setState({
        id: props.initialValues4.documents[0].id,
        title: props.initialValues4.documents[0].title,
        position: props.initialValues4.documents[0].position,
        username: props.initialValues4.documents[0].username,
        fio: props.initialValues4.documents[0].fio,

        price:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.price,
        subject:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.subject,
        currency:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.currency,
        executor_name_division:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.executor_name_division,
        executor_phone_number:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.executor_phone_number,
        counteragent_contacts:
          props.initialValues4.documents[0]
            ?.data_agreement_list_internal_needs[0]?.counteragent_contacts,

        date_created: props.initialValues4.documents[0].date_created,
        date_modified: props.initialValues4.documents[0].date_modified,
        route_id: props.initialValues4.documents[0].route_id.id,
        status_in_process:
          props.initialValues4.documents[0].route_id.status_in_process,
        status_cancelled:
          props.initialValues4.documents[0].route_id.status_cancelled,
        status_finished:
          props.initialValues4.documents[0].route_id.status_finished,
        status_id: props.initialValues4.documents[0].status_id,
        route: props.initialValues4.documents[0].route_data,
        step: props.initialValues4.documents[0].step,
        comments: props.initialValues4.documents[0].comments,
        signatures: props.initialValues4.documents[0].signatures,
        files: props.initialValues4.documents[0].files,
        log_username: state.log_username,
      });
    }
  }, [props.initialValues4]);

  let onFinish = () => {
    props.onFinish4(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  const [radioState, setRadioState] = useState(
    props?.initialValues4?.documents[0]?.data_agreement_list_internal_needs[0]
      ?.subject
  );

  return (
    <Form
      form={props.form4}
      name="DocumentsForm4"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      {/* Лист согласования на реализацию готовой продукции */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues4?.documents[0].route_id.name}
      </h4>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      <FormWrap>
        {FormItem("Наименование контрагента: ", state?.title)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Предмет договора: ", state.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Валюта платежа: ", state.currency)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          `Наименование подразделения, 
					фамилия ответственного исполнителя: `,
          state.executor_name_division
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(`Телефон исполнителя: `, state.executor_phone_number)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(`Контакты контрагента: `, state.counteragent_contacts)}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />

      <Form.Item
        className="font-form-header"
        name="signatures"
        label="Подписи"
        labelCol={{ span: 24 }}
      >
        {iniValue?.signatures.map((item) => {
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

export default Update4;
