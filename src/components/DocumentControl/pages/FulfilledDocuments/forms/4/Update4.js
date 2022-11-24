import { Form, Divider, Collapse, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";

//Tasks
import { FormWrap, FormItem } from "./../../../fragments/FragmentItemWrap";
import FragmentUploader from "./../../../fragments/FragmentUploader";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import { GetIDNameTaskFile } from "./../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "./../../../fragments/FragmentFileViewer";
import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";

const Update4 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValues = props?.initialValues4?.documents[0];

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
    props.form4.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues4) {
      setState({
        id: iniValues.id,
        title: iniValues.title,
        position: iniValues.position,
        username: iniValues.username,
        fio: iniValues.fio,
        user_id: iniValues.user_id,

        price: iniValues.data_agreement_list_internal_needs[0].price,
        subject: iniValues.data_agreement_list_internal_needs[0].subject,
        currency: iniValues.data_agreement_list_internal_needs[0].currency,
        executor_name_division:
          iniValues.data_agreement_list_internal_needs[0]
            .executor_name_division,
        executor_phone_number:
          iniValues.data_agreement_list_internal_needs[0].executor_phone_number,
        counteragent_contacts:
          iniValues.data_agreement_list_internal_needs[0].counteragent_contacts,

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
  }, [props.initialValues4]);

  const onFinish = () => {
    props.onFinish4(state);
  };

  //collapse

  return (
    <Form
      form={props.form4}
      name="DocumentsForm4"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
        //console.log("UPDATE4 values", allValues);
      }}
    >
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("От: ", state?.fio)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Должность: ", state?.position)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem("Тип договора: ", iniValues?.route_id?.name)}
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
        {FormItem(
          "Наименование подразделения, фамилия ответственного исполнителя: ",
          state?.counteragent_contacts
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />

      {/* Фрагмент antd дающую возможность загружать файлы */}
      <FragmentUploader />
      {/* /////////////////////////////////// */}

      <Divider type={"horizontal"} />

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

export default Update4;
