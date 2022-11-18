import { Form, Divider, Collapse, Button } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../../../core/functions";

//Tasks
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";

const Update5 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues5?.documents[0];

  const user = useUser();
  const stepsDirection = useRef("vertical");
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState({
    log_username: user.username,
  });
  const [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  const [stepCount, setStepCount] = useState({ step: "0" });

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
    if (iniValue?.route_data?.length > 1)
      stepsDirection.current =
        iniValue?.route_data?.length <= 7 ? "horizontal" : "vertical";
  }, [props]);

  useEffect(() => {
    props.form5.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues5) {
      setState({
        id: iniValue.id,
        title: iniValue.title,
        position: iniValue.position,
        username: iniValue.username,
        fio: iniValue.fio,
        user_id: iniValue.user_id,
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
        mitwork_number: iniValue.mitwork_number,
        mitwork_data: iniValue.mitwork_data,
      });
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues5]);

  const onFinish = () => {
    props.onFinish5(state);
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
      <FormWrap>{FormItem("Тип договора: ", "Другой")}</FormWrap>
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

      <FragmentMitWork
        id={iniValue?.id}
        mitwork_number={state?.mitwork_number}
        mitwork_data={state?.mitwork_data}
      />

      <Divider type={"horizontal"} />

      <Collapse>
        <Collapse.Panel header={<b>Файлы</b>}>
          {/* Загрузка файлов */}
          <FragmentUploader />

          <Divider type={"horizontal"} />

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

      <Collapse>
        <Collapse.Panel header={<b>Подписи</b>}>
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
        </Collapse.Panel>
      </Collapse>

      <Divider type={"horizontal"} />

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

      <Divider type={"horizontal"} />

      <Button
        danger={true}
        htmlType="submit"
        onClick={() => {
          setState({ ...state, status_id: "10" });
          console.log(state);
        }}
      >
        Документ исполнен
      </Button>

      {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
      <FragmentAnyItems />
      {/* /////////////////////////////////// */}
    </Form>
  );
});

export default Update5;
