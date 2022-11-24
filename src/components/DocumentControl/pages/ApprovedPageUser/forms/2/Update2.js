import { EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Steps,
  Checkbox,
  Radio,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useUser, formatDate } from "../../../../../../core/functions";
import PrintContainer2 from "./PrintContainer2";
import UploadFile from "../../../../modals/UploadFile";
import constants from "../../../../../../config/constants";

const { Title, Link } = Typography;
const { Step } = Steps;

const price_pattern = /^\d+$/;

let Update2 = React.memo((props) => {
  let user = useUser();

  const [state, setState] = useState({
    log_username: user.username,
  });

  let OpenDocument = async (item) => {
    // setBtnLoad(true)
    //console.log("PROPS", item.id);
    // console.log('RECORD',props.record)
    const tmp = await fetch("/api/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: Number(user.id), item: item.id }),
    });
    const content = await tmp.json();
    if (content != undefined) {
      //console.log("RESULT", content);
    }
  };

  useEffect(() => {
    props.form2.setFieldsValue(state);
  }, [state]);

  let [routesList, setRoutesList] = useState([
    { positionName: "Тип договора не выбран." },
  ]);

  let [stepCount, setStepCount] = useState({ step: "0" });

  useEffect(() => {
    if (props.initialValues2) {
      setState({
        id: props.initialValues2.documents[0].id,
        title: props.initialValues2.documents[0].title,
        position: props.initialValues2.documents[0].position,
        username: props.initialValues2.documents[0].username,
        fio: props.initialValues2.documents[0].fio,

        price: props.initialValues2.documents[0].data_agreement_list[0].price,
        subject:
          props.initialValues2.documents[0].data_agreement_list[0].subject,

        currency_price:
          props.initialValues2.documents[0].data_agreement_list[0]
            .currency_price,
        executor_name_division:
          props.initialValues2.documents[0].data_agreement_list[0]
            .executor_name_division,
        sider_signatures_date:
          props.initialValues2.documents[0].data_agreement_list[0]
            .sider_signatures_date,
        received_from_counteragent_date:
          props.initialValues2.documents[0].data_agreement_list[0]
            .received_from_counteragent_date,

        date_created: props.initialValues2.documents[0].date_created,
        date_modified: props.initialValues2.documents[0].date_modified,
        route_id: props.initialValues2.documents[0].route_id.id,
        status_in_process:
          props.initialValues2.documents[0].route_id.status_in_process,
        status_cancelled:
          props.initialValues2.documents[0].route_id.status_cancelled,
        status_finished:
          props.initialValues2.documents[0].route_id.status_finished,
        //Установить статус на доработку (для кнопки "Оправка на регистрацию")
        status_id: "8",
        route: props.initialValues2.documents[0].route_data,
        step: props.initialValues2.documents[0].step,
        comments: props.initialValues2.documents[0].comments,
        signatures: props.initialValues2.documents[0].signatures,
        files: props.initialValues2.documents[0].files,
        //document_logs: props.initialValues.documents[0].document_logs,
        document_logs: { is_read: true },
        log_username: state.log_username,
      });
      setStepCount({ step: props.initialValues2.documents[0].step });
      setRoutesList(props.initialValues2.documents[0].route_data);
    }
  }, [props.initialValues2]);

  let download = async (e) => {
    let id = e.target.dataset.fileid;
    await fetch("/get-file", {
      method: "POST",
      body: JSON.stringify({ id: e.target.dataset.fileid }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        let result = response.result;
        let link = document.createElement("a");
        link.href =
          result.data_file; /*result.data_file.slice(result.data_file.indexOf(',')+1) */
        link.download = result.filename;
        link.click();
      });
  };

  let onFinish = (values) => {
    props.onFinish2(state);
    //console.log("+++++++++++++++++++++++", values);
  };

  let radioOptions = [
    { label: "Закупки товаров, работ и услуг", value: "1" },
    {
      label: "Поставка продукции (выполнение работ, оказание услуг) заказчикам",
      value: "2",
    },
    {
      label: "Передача имущества в аренду (бесплатное пользование)",
      value: "3",
    },
    { label: "Совместная деятельность", value: "4" },
    {
      label:
        "Финансирование (кредитование, обеспечение исполнения обязательств)",
      value: "5",
    },
    { label: "Прочие обязательства", value: "6" },
  ];
  const [radioState, setRadioState] = useState(
    props?.initialValues2?.documents[0]?.data_agreement_list[0]?.subject
  );

  const RadioOnChange = (radioValue) => {
    setRadioState(radioValue.target.value);
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
      <b>От:</b> {props?.initialValues2?.documents[0].fio} <br />
      <b>Должность:</b> {props?.initialValues2?.documents[0].position}
      <h4>
        {/*Лист согласования на реализацию готовой продукции*/}
        <b>Тип договора:</b>
        {props?.initialValues2?.documents[0].route_id.name}
      </h4>
      <Divider type={"horizontal"} />
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>Наименование контрагента:</Col>
          <Col span={12}>{state.title}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>Предмет договора:</Col>
          <Col span={12}>{state.subject}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>Общая сумма договора в валюте цены договора:</Col>
          <Col span={12}>{state.price}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>Общая сумма договора в тенге, по курсу НБ РК:</Col>
          <Col span={12}>{state.currency_price}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            Наименование подразделения, фамилия ответственного исполнителя:
          </Col>
          <Col span={12}>{state.executor_name_division}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            Подписанный сторонами оригинал договора получен, дата, способ
            получения от контрагента:
          </Col>
          <Col span={12}>{state.sider_signatures_date}</Col>
        </Row>
      </div>
      <div className="form-item-wrap">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            Дата получение проекта договора, способ получения от контрагента:
          </Col>
          <Col span={12}>{state.received_from_counteragent_date}</Col>
        </Row>
      </div>
      <Divider type={"horizontal"} />
      <h3>
        <b>Файлы</b>
      </h3>
      {props?.initialValues2?.documents[0].files.map((item) => {
        return (
          <>
            <div className="document-view-wrap">
              <Link>
                <a data-fileid={item.id} onClick={download}>
                  {item.filename}
                </a>
              </Link>
              <Button
                onClick={() => {
                  OpenDocument(item);
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
              <br />
            </div>
          </>
        );
      })}
      <Divider type={"horizontal"} />
      <h3>
        <b>Файл согласованного договора</b>
      </h3>
      <PrintContainer2
        printData={props?.initialValues2?.documents[0]?.id}
        documentData={props?.initialValues2}
      />
      {/* <Divider type={'horizontal'} />
            <Form.Item
                name="files"
                className='font-form-header'
                label="Загрузите файл согласованного договора"
                labelCol={{ span: 24 }}
            >
                <UploadFile
                    showUploadList={true}
                    action={"https://" + constants.host + ":" + constants.port + "/document-control/orders"}
                    multiple={true}
                    maxCount={50}
                    accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}
                    onChange={(info) => {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                            //console.log('info.file', info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} - загружен успешно.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} - ошибка при загрузке.`);
                        }
                    }}
                />
            </Form.Item> */}
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
        {/* <Steps labelPlacement="vertical" size="small" current={stepCount.step - 1} className="steps-form-update">
                    {
                        routesList.map((item) => {
                            return (
                                <Step title={item.positionName} />
                            )
                        })
                    }
                </Steps> */}
      </Form.Item>
      <Divider type={"horizontal"} />
      <Button
        type="primary"
        htmlType="submit"
        onClick={() => {
          //console.log("state-----------", state);
        }}
      >
        Отправить на регистрацию
      </Button>
      <Divider type={"horizontal"} />
      <Form.Item
        className="font-form-header"
        name="reason"
        label="Замечание"
        labelCol={{ span: 24 }}
      ></Form.Item>
      <div>
        {props?.initialValues2?.documents[0]?.reason?.map((item) => {
          return (
            <span>
              <span>{item.text + "-" + item.userPosition}</span>
              <br />
            </span>
          );
        })}
      </div>
      {/* <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <Button type="primary" htmlType="submit" onClick={props.handleRouteForward2}>
                        Согласовать
                    </Button>
                    <Space>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleRouteBackward2}>Вернуть на доработку</Button>
                        <Divider type={'vertical'} />
                        <Button type="primary" htmlType="submit" onClick={props.handleStatusCancelled}>Отклонить</Button>
                    </Space>
                </Col>
                <Col span={24} className="marginTop">
                    <Button onClick={props.modalCancelHandler}>
                        Отменить
                    </Button>
                    <Divider type={'vertical'} />
                    <Button onClick={props.modalEnableEditHandler}>
                        Редактировать
                    </Button>
                </Col>
            </Row> */}
      <Divider type={"horizontal"} />
      <Form.Item
        className="font-form-header"
        name="comments"
        label="Комментарии"
        labelCol={{ span: 24 }}
      >
        {/* <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange} disabled={props.disabled} />
                <Button disabled={props.disabled} onClick={props.HandleComment} className="marginTop">Оставить комментарий</Button> */}
        {props.commentsList.map((item) => {
          return (
            <div className="comments">
              <li className="comment-item">
                <span className="user-position-comment">{item.position}</span>
                <span className="user-name-comment"> ({item.fio}) </span>
                <span className="user-date-time-comment">{item.date}</span>
                <br />
                <span className="comment">{item.comment}</span>
              </li>
            </div>
          );
        })}
      </Form.Item>
      <Form.Item name="date_created" hidden={true}></Form.Item>
      <Form.Item name="route_id" hidden={true}></Form.Item>
      <Form.Item name="status_id" hidden={true}></Form.Item>
      <Form.Item name="step" hidden={true}></Form.Item>
      <Form.Item name="log_username" hidden={true}></Form.Item>
    </Form>
  );
});

export default Update2;
