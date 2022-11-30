import { Form, Divider, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";
import PrintContainer2 from "./PrintContainer2";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";

let Update2 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues2?.documents[0];
  const AgreementList = iniValue?.data_agreement_list[0];

  let user = useUser();

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
    props.form2.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (iniValue) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,
        price: AgreementList.price,
        subject: AgreementList.subject,
        currency_price: AgreementList.currency_price,
        executor_name_division: AgreementList.executor_name_division,
        sider_signatures_date: AgreementList.sider_signatures_date,
        received_from_counteragent_date:
          AgreementList.received_from_counteragent_date,
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
        mitwork_number: iniValue.mitwork_number,
        mitwork_data: iniValue.mitwork_data,
      });
    }
  }, [iniValue]);

  let onFinish = (values) => {
    props.onFinish2(state);
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
      }}
    >
      <b>От:</b> {iniValue?.fio} <br />
      <b>Должность:</b> {iniValue?.position}
      {/* Лист согласования на реализацию готовой продукции */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues2?.documents[0].route_id.name}
      </h4>
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
      {/* /////////////////////////////////// */}
      <h3>
        <b>Файл согласованного договора</b>
      </h3>
      <PrintContainer2 documentData={iniValue} />
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
      <FragmentMitWork
        mitwork_number={state?.mitwork_number}
        mitwork_data={state?.mitwork_data}
      />
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
