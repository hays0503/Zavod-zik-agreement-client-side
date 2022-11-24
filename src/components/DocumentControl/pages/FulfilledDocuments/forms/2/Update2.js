import { Button, Collapse, Divider, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import FragmentUploader from "../../../fragments/FragmentUploader";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewerReplacementDialog } from "../../../fragments/FragmentStepViewer";

import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FragmentMitWork } from "../../../fragments/FragmentMitWork";
import SelectReplacementDialog from "../../../../dialogs/SelectReplacementDialog";

//Реализация готовой продукции

const Update2 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValues = props?.initialValues2?.documents[0];

  const user = useUser();
  const [state, setState] = useState({
    log_username: user.username,
  });
  const [visible, setVisible] = useState(false);
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
    if (iniValues?.id) {
      GetIDNameTaskFile(iniValues?.id).then((value) => {
        setFileTask(value.result);
      });
    }
  }, [iniValues]);
  //////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    props.form2.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues2) {
      setState({
        id: iniValues.id,
        title: iniValues.title,
        position: iniValues.position,
        username: iniValues.username,

        user_id: iniValues.user_id,
        fio: iniValues.fio,
        price: iniValues.data_agreement_list[0].price,
        subject: iniValues.data_agreement_list[0].subject,
        currency_price: iniValues.data_agreement_list[0].currency_price,
        executor_name_division:
          iniValues.data_agreement_list[0].executor_name_division,
        sider_signatures_date:
          iniValues.data_agreement_list[0].sider_signatures_date,
        received_from_counteragent_date:
          iniValues.data_agreement_list[0].received_from_counteragent_date,
        reason: iniValues.reason,
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
        document_logs: iniValues.document_logs,
        log_username: state.log_username,
        mitwork_number: iniValues.mitwork_number,
        mitwork_data: iniValues.mitwork_data,
      });
      setStepCount({ step: iniValues.step });
      setRoutesList(iniValues.route_data);
    }
  }, [props.initialValues2]);

  let onFinish = () => {
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
        //console.log("UPDATE2 values", allValues);
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
      <FormWrap>{FormItem("Наименование ТРУ: ", state?.title)}</FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>{FormItem("Предмет договора: ", state?.subject)}</FormWrap>
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
          state?.currency_price
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Наименование подразделения, фамилия ответственного исполнителя: ",
          state?.executor_name_division
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Подписанный сторонами оригинал договора получен, дата, способ получения от контрагента: ",
          state?.sider_signatures_date
        )}
      </FormWrap>
      {/* /////////////////////////////////// */}
      <FormWrap>
        {FormItem(
          "Дата получение проекта договора, способ получения от контрагента: ",
          state?.received_from_counteragent_date
        )}
      </FormWrap>

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

export default Update2;
