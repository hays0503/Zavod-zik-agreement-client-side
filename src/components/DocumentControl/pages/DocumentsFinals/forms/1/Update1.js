import { Collapse, Divider, Form, Steps, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { formatDate, useUser } from "../../../../../../core/functions";

import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import { FragmentReasonsViewer } from "./../../../fragments/FragmentReasonsViewer";
import { PrintContainer } from "./../../../ApprovedPageUser/forms/1/PrintContainer";

const { Title, Link } = Typography;
const { Step } = Steps;

let Update1 = React.memo((props) => {
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

  let user = useUser();

  const [state, setState] = useState({
    log_username: user.username,
  });

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (iniValue) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,
        price: iniValue.data_one[0].price,
        supllier: iniValue.data_one[0].supllier,
        subject: iniValue.data_one[0].subject,
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
      <b>От:</b> {iniValue?.fio} <br />
      <b>Должность:</b> {iniValue?.position}
      {/* Закуп ТРУ */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues?.documents[0].route_id.name}
      </h4>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <h3>
        <b>Файл согласованного договора</b>
      </h3>
      {/* /////////////////////////////////// */}
      <PrintContainer printData={iniValue} documentData={iniValue} />
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
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

export default Update1;
