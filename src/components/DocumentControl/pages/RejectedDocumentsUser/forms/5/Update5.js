import { Form, Typography, Divider, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";

let Update5 = React.memo((props) => {
  let user = useUser();
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues5?.documents[0];
  const { Title, Link } = Typography;
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
    props.form5.setFieldsValue(state);
  }, [state]);

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
    }
  }, [props.initialValues5]);

  let onFinish = () => {
    props.onFinish5(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  const [radioState, setRadioState] = useState(
    props?.initialValues5?.documents[0]?.data_custom[0]?.subject
  );

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
      {/* Другой */}
      <h4>
        <b>Тип договора:</b> {props?.initialValues5?.documents[0].route_id.name}
      </h4>
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />

      <Form.Item
        className="font-form-header"
        name="signatures"
        label="Подписи"
        labelCol={{ span: 24 }}
      >
        {props?.initialValues5?.documents[0].signatures.map((item) => {
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

export default Update5;
