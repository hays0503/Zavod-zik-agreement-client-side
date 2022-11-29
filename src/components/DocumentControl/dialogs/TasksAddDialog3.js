import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  handlerQuery,
  getDDMMYYYHHmm,
  useUser,
  handlerMutation,
} from "../../../core/functions";
import { Modal, Button, Form, Divider } from "antd";
import "moment/locale/ru";
import { FragmentCheckBoxTaskFileSelector } from "../pages/fragments/FragmentCheckBoxTaskFileSelector";
import { AllUserGQL } from "./../gql/AllUserGQL";
import { AllDocumentTaskGQL } from "./../gql/AllDocumentTaskGQL";
import { FragmentSelectRecepient } from "./../pages/fragments/FragmentSelectRecepient";
import { FragmentDeadline } from "./../pages/fragments/FragmentDeadline";
import { FragmentWriteNote } from "./../pages/fragments/FragmentWriteNote";
import { FragmentSwitchArea } from "./../pages/fragments/FragmentSwitchArea";
import {
  FragmentPopConfirmClose,
  FragmentPopConfirmSend,
} from "./../pages/fragments/FragmentPopConfirm";

let TasksAddDialog3 = React.memo((props) => {
  let user = useUser();

  const [insert, { loading: documentTasksInsertLoading }] = handlerMutation(
    useMutation(AllDocumentTaskGQL.insert)
  )();
  const { loading, data, refetch } = handlerQuery(AllUserGQL, "all")();

  useEffect(() => {
    refetch();
  }, []);

  const [state, setState] = useState({});

  let onFinish = (values) => {
    let taskData = {
      variables: {
        document_tasks: {
          document_id: props.document.documents[0].id,
          status: "1",
          is_cancelled: "false",
          note: values.note,
          deadline: getDDMMYYYHHmm(values.deadline._d),
          user_id_created: `${user.id}`,
          fio_created: user.fio,
          user_id_receiver: `${values.recepient.value}`,
          fio_receiver: values.recepient.label,
          route_id: props.document.documents[0].route_id.id,
          document_options: {
            title: values.title == undefined ? false : values.title,
            subject: values.subject == undefined ? false : values.subject,
            price: values.price == undefined ? false : values.price,
            currency: values.currency == undefined ? false : values.currency,
            executor_name_division:
              values.executor_name_division == undefined
                ? false
                : values.executor_name_division,
            executor_phone_number:
              values.executor_phone_number == undefined
                ? false
                : values.executor_phone_number,
            counteragent_contacts:
              values.counteragent_contacts == undefined
                ? false
                : values.counteragent_contacts,
          },
          task_files: `{${values.task_files.map((item) => parseInt(item))}}`,
          files: values.files,
          document_tasks_id_file: `{${values.document_tasks_id_file.map(
            (item) => parseInt(item)
          )}}`,
        },
      },
    };
    // console.log(values);
    // console.log(taskData);
    insert(taskData);
    props.setVisible(false);
    window.location.reload();
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(state);
  }, [state]);

  let [popconfirmInModalVisible, setPopconfirmInModalVisible] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          props.setVisible(true);
        }}
      >
        <PlusCircleOutlined />
        Создать
      </Button>
      <Modal
        title={"Создание поручения"}
        visible={props.visible}
        centered
        width={800}
        onOk={() => {}}
        closable={false}
        // onCancel={() => { props.setVisible(false) }}

        maskClosable={false}
        destroyOnClose={true}
        footer={[
          // фрагмент antd возвращающий подтверждение дял `закрытие` формы
          <FragmentPopConfirmClose
            title="Вы уверены что хотите закрыть?"
            setPopconfirmInModalVisible={setPopconfirmInModalVisible}
            setVisible={props.setVisible}
          >
            <Button key="cancel">Закрыть</Button>
          </FragmentPopConfirmClose>,
          // фрагмент antd возвращающий подтверждение дял `отправки` формы
          <FragmentPopConfirmSend
            title="Отправить поручение?"
            disabled={state.recepient ? false : true}
            form={form}
          >
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </FragmentPopConfirmSend>,
        ]}
      >
        <Form
          form={form}
          name="TaskAddForm"
          onFinish={onFinish}
          scrollToFirstError
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            setState(Object.assign({}, state, { ...allValues }));
          }}
        >
          {/*`FragmentSelectRecepient` 
						фрагмент antd дающий возможность выбирать
						из выпадающего списка фамилию пользователя
						для назначения поручения */}
          <FragmentSelectRecepient users={data?.users} />

          {/* `FragmentDeadline` 
						фрагмент antd дающий возможность выбирать
						дату исполнения поручения (до какого числа) */}
          <FragmentDeadline />

          {/* `FragmentWriteNote` фрагмент antd дающий возможность
					написать задание к исполненною в поручение*/}
          <FragmentWriteNote />

          <Divider type={"horizontal"} />

          <h3 className="marginTop marginBottom">
            <b>Выберите необходимые поля</b>
          </h3>

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={props?.document?.documents[0]?.title}
            name={"title"}
            label={"Наименование контрагента:"}
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.subject
            }
            name={"subject"}
            label={"Предмет договора:"}
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.price
            }
            name={"price"}
            label={"Общая сумма договора:"}
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.currency
            }
            name={"currency"}
            label={"Валюта платежа: "}
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.executor_name_division
            }
            name={"executor_name_division"}
            label={
              "Наименование подразделения, фамилия ответственного исполнителя:"
            }
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.executor_phone_number
            }
            name={"executor_phone_number"}
            label={"Телефон исполнителя:"}
          />

          {/* `FragmentSwitchArea` 
					фрагмент antd дающий возможность выбрать через switch
					какое поле будет в документе */}
          <FragmentSwitchArea
            data={
              props?.document?.documents[0]?.data_agreement_list_production[0]
                ?.counteragent_contacts
            }
            name={"counteragent_contacts"}
            label={"Контакты контрагента:"}
          />

          <Divider type={"horizontal"} />

          {/* //возвращает элемент antd в котором можно выбрать файлы по поручениям */}
          <FragmentCheckBoxTaskFileSelector
            form={form}
            files={props?.document?.documents[0]?.files}
            FileTask={props?.FileTask}
          />
        </Form>
      </Modal>
    </>
  );
});

export default TasksAddDialog3;
