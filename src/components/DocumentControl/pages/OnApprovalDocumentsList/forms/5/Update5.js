import { Form, Divider } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

//Tasks
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import { FragmentStepViewer } from "../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";

let Update5 = React.memo((props) => {
  let user = useUser();

  const [reasonText, setReasonText] = useState(iniValue?.reason);
  const iniValue = props?.initialValues5?.documents[0];
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
  });

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
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,

        subject: iniValue.data_custom[0].subject,
        remark: iniValue.data_custom[0].remark,

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
  }, [props.initialValues5]);

  let onFinish = () => {
    props.onFinish5(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  const ReasonInputChange = (all) => {
    if (all.target.value.length > 0) {
      setReasonText(all.target.value);
    } else {
      setReasonText(all.target.value);
    }
  };

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
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
      {/* /////////////////////////////////// */}
      {/* "Другой" */}
      <FormWrap>
        {FormItem("Тип договора: ", iniValue?.route_id?.name)}
      </FormWrap>
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Примечание: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
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
      {props.initialValues5 !== undefined ? (
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

export default Update5;
