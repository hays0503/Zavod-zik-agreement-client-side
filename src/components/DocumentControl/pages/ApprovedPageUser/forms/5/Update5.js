import { Button, Form, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../../../core/functions";
import { GetIDNameTaskFile } from "../../../api/CRU_Document";
import { FragmentAnyItems } from "../../../fragments/FragmentAnyItems";
import FragmentCommentsViewer from "../../../fragments/FragmentCommentsViewer";
import { FragmentTaskAndFileViewer } from "../../../fragments/FragmentFileViewer";
import { FormItem, FormWrap } from "../../../fragments/FragmentItemWrap";
import { FragmentReasonsViewer } from "../../../fragments/FragmentReasonsViewer";
import { FragmentStepViewer } from "../../../fragments/FragmentStepViewer";
import PrintContainer5 from "./PrintContainer5";

let Update5 = React.memo((props) => {
  /**
   * Деструктаризация (начального значение)
   */
  const iniValue = props?.initialValues5?.documents[0];
  console.log("console.log(iniValue)", iniValue);
  /**
   * Деструктаризация (Специфичные данные для Листа согласования Другой)
   */
  const iniValDataCustom = props?.initialValues5?.documents[0]?.data_custom[0];
  /**
   * Деструктаризация (начального значение из таблиц Route(движение документов))
   */
  const iniValRoute = props?.initialValues5?.documents[0]?.route_id;

  //////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Отобразить новое состояние компонентов после обновление (файлов / по поручению)
   */

  //////////////////////
  let user = useUser();
  const [state, setState] = useState({
    log_username: user.username,
  });
  /////////////////////////////

  /**
   * Cтейт для таблиц файлов по поручением
   */
  const [FileTask, setFileTask] = useState([]);

  //TODO: Сделать просмотр отправленных поручений
  const [ReRender, setRerender] = useState(false);
  useEffect(() => {
    if (iniValue?.id) {
      GetIDNameTaskFile(iniValue?.id).then((value) => {
        setFileTask(value.result);
      });
    }
  }, [iniValue, ReRender]);
  //////////////////////////////////////////////////////////////////////////////////////////

  //Направление для вывода согласованых подписей (круги)
  const stepsDirection = useRef("vertical");

  useEffect(() => {
    props.form5.setFieldsValue(state);
  }, [state]);

  //TODO: Возможно будет хорошей идеей убрать его из "одинокого стейта и перенести в общий" т.к тип договора не меняется
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

        subject: iniValDataCustom.subject,
        remark: iniValDataCustom.remark,

        date_created: iniValue.date_created,
        date_modified: iniValue.date_modified,
        route_id: iniValRoute.id,
        status_in_process: iniValRoute.status_in_process,
        status_cancelled: iniValRoute.status_cancelled,
        status_finished: iniValRoute.status_finished,
        //Установить статус на доработку (для кнопки "Оправка на регистрацию")
        status_id: "8",
        route: iniValue.route_data,
        step: iniValue.step,
        comments: iniValue.comments,
        signatures: iniValue.signatures,
        files: iniValue.files,
        log_username: state.log_username,
        reason: iniValue.reason,
      });
      setStepCount({ step: iniValue.step });
      setRoutesList(iniValue.route_data);
    }
  }, [props.initialValues5]);

  let onFinish = (values) => {
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
      {/* Другой */}
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
      {/* /////////////////////////////////// */}
      {/*Фрагмент antd дающую возможность просматривать файлы*/}
      {iniValue?.files !== undefined && FileTask !== undefined ? (
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
      {/* /////////////////////////////////// */}
      {console.log(iniValue?.data_custom)}
      {iniValue?.data_custom !== undefined ? (
        <>
          <h3>
            <b>Файл согласованного договора</b>
          </h3>
          <PrintContainer5 documentData={iniValue} />
        </>
      ) : (
        <h1>Загрузка</h1>
      )}
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      {/* Фрагмент antd дающую возможность просматривать состояние движений документов */}
      {iniValue?.signatures !== undefined ? (
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
      {/* ///////////Отправить на регистрацию////////////// */}
      <Button type="primary" htmlType="submit">
        Отправить на регистрацию
      </Button>
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* /////////////////////////////////// */}
      {/* Фрагмент antd для вывода Замечаний по документу */}
      <FragmentReasonsViewer Reason={iniValue?.reason} />
      {/* /////////////////////////////////// */}
      <Divider type={"horizontal"} />
      {/* Фрагмент antd дающую возможность просматривать комментарии к документам */}
      <FragmentCommentsViewer commentsList={iniValue?.comments} />
      {/* /////////////////////////////////// */}
      {/* Фрагмент antd элементами для хранение данных (ну или типо того) */}
      <FragmentAnyItems />
      {/* /////////////////////////////////// */}
    </Form>
  );
});

export default Update5;
