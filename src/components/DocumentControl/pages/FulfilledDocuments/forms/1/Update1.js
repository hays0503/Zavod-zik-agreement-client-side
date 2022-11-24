import { Form, Divider, Button, Collapse } from "antd";
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
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import FragmentUploader from "../../../fragments/FragmentUploader";

const Update1 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValues = props?.initialValues?.documents[0];

  const user = useUser();
  const [visible, setVisible] = useState(false);
  const [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);
  const [stepCount, setStepCount] = useState({ step: "0" });

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
    if (iniValues?.id) {
      GetIDNameTaskFile(iniValues?.id).then((value) => {
        setFileTask(value.result);
      });
    }
  }, [iniValues]);
  //////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (iniValues) {
      setState({
        id: iniValues.id,
        title: iniValues.title,
        position: iniValues.position,

        user_id: iniValues.user_id,
        username: iniValues.username,
        fio: iniValues.fio,
        price: iniValues.data_one[0].price,
        supllier: iniValues.data_one[0].supllier,
        subject: iniValues.data_one[0].subject,
        date_created: iniValues.date_created,
        date_modified: iniValues.date_modified,
        route_id: iniValues.route_id.id,
        status_in_process: iniValues.route_id.status_in_process,
        status_cancelled: iniValues.route_id.status_cancelled,
        status_finished: iniValues.route_id.status_finished,
        status_id: iniValues.status_id,
        route: iniValues.route_data,
        step: iniValues.step,
        comments: iniValues.comments,
        signatures: iniValues.signatures,
        files: iniValues.files,
        log_username: state.log_username,
        mitwork_number: iniValues.mitwork_number,
        mitwork_data: iniValues.mitwork_data,
      });
      setStepCount({ step: iniValues.step });
      setRoutesList(iniValues.route_data);
    }
  }, [iniValues]);

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
      onValuesChange={(_changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      {/* Закуп ТРУ*/}
      <h4>
        <b>Тип договора:</b> {iniValues?.route_id?.name}
      </h4>

      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Поставщик ТРУ: ", state?.supllier)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Основание: ", state?.subject)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Общая сумма договора: ", state?.price)}</FormWrap>

      <FragmentMitWork
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
          {iniValues !== undefined && FileTask !== undefined ? (
            <FragmentTaskAndFileViewer
              files={iniValues?.files}
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
          {iniValues && (
            <FragmentStepViewerReplacementDialog
              signatures={iniValues?.signatures}
              setVisible={setVisible}
              stepCount={stepCount}
              routeData={iniValues?.route_data}
              date_created={state.date_created}
              step={iniValues?.step}
            >
              {/* Фрагмент antd дающую возможность устанавливать замещающего */}
              <SelectReplacementDialog
                visible={visible}
                setVisible={setVisible}
                setRoutesList={setRoutesList}
                routesList={routesList}
                stepCount={stepCount}
                routeData={iniValues?.route_data}
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
          <FragmentReasonsViewer Reason={iniValues?.reason} />
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

export default Update1;
