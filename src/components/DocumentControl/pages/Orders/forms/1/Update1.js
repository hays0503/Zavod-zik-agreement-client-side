import { Form, Divider, Steps } from "antd";

import React, { useEffect, useState } from "react";

import { useUser } from "../../../../../../core/functions";

import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FormItem, FormWrap } from "./../../../fragments/FragmentItemWrap";
import { FragmentAnyItems } from "./../../../fragments/FragmentAnyItems";

const Update1 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues?.documents[0];

  const user = useUser();
  const { Step } = Steps;
  const [visible, setVisible] = useState(false);
  const [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  const [stepCount, setStepCount] = useState({ step: "0" });

  const [state, setState] = useState({
    log_username: user.username,
  });

  /**
   * Cтейт для таблиц файлов по поручением
   */
  const [FileTask, setFileTask] = useState([]);
  /**
   * Инициализация стейта для таблиц файлов по поручением
   */
  useEffect(() => {
    if (props.initialValues) {
      GetIDNameTaskFile(iniValue?.id).then((value) => {
        setFileTask(value.result);
      });
    }
  }, [props.initialValues]);

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues) {
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
      });
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues]);

  let onFinish = (values) => {
    props.onFinish(state);
  };

  return (
    <Form
      form={props.form}
      name="DocumentsForm"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(_changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      <h4>
        <b>Тип договора:</b> Закуп ТРУ
      </h4>

      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>

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

      {/*
			Фрагмент antd дающую возможность просматривать состояние
			движений документов (с надстройкой для замещающего)
			*/}
      {iniValue && (
        <FragmentStepViewerReplacementDialog
          signatures={iniValue?.signatures}
          setVisible={setVisible}
          stepCount={stepCount}
          routeData={iniValue?.route_data}
          date_created={state.date_created}
          step={iniValue?.step}
        >
          {/* Фрагмент antd дающую возможность устанавливать замещающего */}
          <SelectReplacementDialog
            visible={visible}
            setVisible={setVisible}
            setRoutesList={setRoutesList}
            routesList={routesList}
            stepCount={stepCount}
            routeData={iniValue?.route_data}
            form={props.form}
          />
        </FragmentStepViewerReplacementDialog>
      )}

      <Divider type={"horizontal"} />

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

      {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
      <FragmentAnyItems />
      {/* /////////////////////////////////// */}
    </Form>
  );
});

export default Update1;
