import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { Button, Popconfirm } from "antd";
import React, { useEffect, useState, useRef } from "react";
import {
  handlerQuery,
  handlerMutation,
  useUser,
  notifyMe,
} from "../../../../core/functions";
import ModalUpdate from "../../modals/ModalUpdate";
import TableContainerIsRead from "../../tableContainers/TableContainerIsRead";
import TitleMenu from "../../../../core/TitleMenu";
import test from "../../../../core/functions/TrashComponent1";

import Update1 from "./forms/1/Update1";
import Update2 from "./forms/2/Update2";
import Update3 from "./forms/3/Update3";
import Update4 from "./forms/4/Update4";
import Update5 from "./forms/5/Update5";

let RejectedDocumentsUser = React.memo((props) => {
  let user = useUser();
  let userVariable = user.id;
  let positionsVariable = user.positions.toString();

  let documents = {
    exemplar: "document",
    table: "documents",
    options: {
      all: {
        variables: {
          documents: {
            global: {
              user_id: `=${userVariable}`,
              ORDER_BY: ["date_created desc"],
            },
          },
        },
        fetchPolicy: "cache-only",
      },
      one: {
        fetchPolicy: "standby",
      },
    },
    select: {
      all: gql`
        query documents($documents: JSON) {
          documents(documents: $documents) {
            id
            title
            user_id
            username
            position
            fio
            price
            supllier
            subject
            date_created
            date_modified
            reason
            status_id
            document_logs {
              id
              document_id
              is_read
              user_id
            }
            data_custom {
              id
              document_id
              subject
              remark
            }
            data_one {
              id
              document_id
              price
              subject
              supllier
            }
            data_agreement_list {
              id
              document_id
              price
              subject

              currency_price
              executor_name_division
              sider_signatures_date
              received_from_counteragent_date
            }
            data_agreement_list_production {
              id
              document_id
              price
              subject
              currency
              executor_name_division
              executor_phone_number
              counteragent_contacts
            }
            data_agreement_list_internal_needs {
              id
              document_id
              price
              subject
              currency
              executor_name_division
              executor_phone_number
              counteragent_contacts
            }
            document_statuses {
              id
              name
            }
            route_id {
              id
              name
              routes
              status_in_process
              status_cancelled
              status_finished
            }
            step
            route_data
          }
        }
      `,
      one: gql`
        query documents($documents: JSON) {
          documents(documents: $documents) {
            id
            title
            user_id
            username
            position
            fio
            price
            supllier
            subject
            date_created
            date_modified
            reason
            status_id
            data_one {
              id
              document_id
              price
              subject
              supllier
            }
            data_custom {
              id
              document_id
              subject
              remark
            }
            data_agreement_list {
              id
              document_id
              price
              subject

              currency_price
              executor_name_division
              sider_signatures_date
              received_from_counteragent_date
            }
            data_agreement_list_production {
              id
              document_id
              price
              subject
              currency
              executor_name_division
              executor_phone_number
              counteragent_contacts
            }
            data_agreement_list_internal_needs {
              id
              document_id
              price
              subject
              currency
              executor_name_division
              executor_phone_number
              counteragent_contacts
            }
            document_logs {
              id
              document_id
              is_read
              user_id
            }
            document_statuses {
              id
              name
            }
            route_id {
              id
              name
              routes
              status_in_process
              status_cancelled
              status_finished
            }
            files {
              id
              filename
            }
            signatures {
              id
              document_id
              user_id
              username
              date_signature
              position
              fio
            }
            step
            route_data
          }
        }
      `,
    },
    subscription: {
      all: [
        gql`
          subscription documents($documents: JSON) {
            documents(documents: $documents) {
              id
              title
              user_id
              username
              fio
              position
              date_created
              date_modified
              status_id
              reason
              document_logs {
                id
                document_id
                is_read
                user_id
              }
              document_statuses {
                id
                name
              }
              route_id {
                id
                name
                routes
                status_in_process
                status_cancelled
                status_finished
              }
              step
              route_data
            }
          }
        `,
      ],
    },
    insert: gql`
      mutation insertDocument($document: JSON) {
        insertDocument(document: $document) {
          type
          message
        }
      }
    `,
    update: gql`
      mutation updateDocument($document: JSON) {
        updateDocument(document: $document) {
          type
          message
        }
      }
    `,
    delete: gql`
      mutation deleteDocument($document: JSON) {
        deleteDocument(document: $document) {
          type
          message
        }
      }
    `,
    setIsReadTrue: gql`
      mutation setIsReadTrue($document: JSON) {
        setIsReadTrue(document: $document) {
          type
          message
        }
      }
    `,
  };

  const count = useRef(0);

  const visibleModalUpdate = useState(false);
  const visibleModalUpdate2 = useState(false);
  const visibleModalUpdate3 = useState(false);
  const visibleModalUpdate4 = useState(false);
  const visibleModalUpdate5 = useState(false);

  const [remove, { loading: loadingRemove }] = handlerMutation(
    useMutation(documents.delete)
  )();

  const { loading, data, refetch } = handlerQuery(documents, "all")();
  useEffect(() => {
    refetch();
  }, []);

  let list =
    data && data[Object.keys(data)[0]] != null
      ? data[Object.keys(data)[0]].map((item) => {
          count.current = data.documents.length;
          return {
            id: item.id,
            key: item.id,
            title: item.title,
            date_created: item.date_created,
            //console.loged: item.date_modified,
            status_id: item.status_id,
            status: item.document_statuses?.name
              ? item.document_statuses.name
              : "Без статуса",
            route_id: item.route_id.id,
            route: item.route_id?.name ? item.route_id.name : "Не задан",
            route_data: item.route_data,
            route_step: item.route_data
              ? item.route_data.findIndex(
                  (item) => item.positionId == positionsVariable
                ) + 1
              : [],
            step: item.step,
            step_count: item.step + " из " + item.route_data?.length,
            //document_logs: item.document_logs[item.document_logs.findIndex(item => item.user_id == user.id)],
            document_logs: item.document_logs
              ? item.document_logs[
                  item.document_logs.findIndex(
                    (item) => item.user_id == user.id
                  )
                ]
              : [],
            //step_name:console.log('DDDDDD',item.step)
            step_name:
              item.route_data?.length > 0
                ? item.route_data[item.step - 1].positionName
                : "",
            //step_name: item.route_id?.routes ? item.route_id.routes[item.route_id.routes.findIndex(item => item.positionId == item.step)].positionName : ''
          };
        })
      : [];

  //console.log('list', list)
  //console.log("data", data);
  //console.log('list2', list2)

  let listFiltered = list.filter((el) => {
    return el.status_id == 2;
  });
  window.localStorage["rows_rejected"] = listFiltered.length;

  //console.log('newArray', newArray)

  let dict = test([
    {
      title: "Наименование договора",
      dataIndex: "title",
      width: "214px",
      type: "search",
      tooltip: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Дата и время создания",
      dataIndex: "date_created",
      width: "114px",
      type: "search",
      tooltip: true,
      sorter: true,
      sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created),
    },
    {
      title: "Последние изменение",
      dataIndex: "date_modified",
      width: "114px",
      type: "search",
      tooltip: true,
      sorter: true,
      sorter: (a, b) => new Date(a.date_modified) - new Date(b.date_modified),
    },
    {
      title: "Тип договора",
      dataIndex: "route",
      width: "114px",
      type: "search",
      tooltip: true,
      sorter: (a, b) => a.route.localeCompare(b.route),
    },
    {
      title: "Статус",
      dataIndex: "status",
      width: "80px",
      tooltip: true,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    { title: "На подписи", dataIndex: "step_name", width: "114px" },
    { title: "Этап", dataIndex: "step_count", width: "55px" },
    // { title: 'шаг п.', dataIndex: 'route_step', width: '55px' }
  ]);

  let titleMenu = (tableProps) => {
    return (
      <TitleMenu
        buttons={[
          <ModalUpdate
            visibleModalUpdate={visibleModalUpdate}
            GQL={documents}
            UpdateForm={Update1}
            visibleModalUpdate2={visibleModalUpdate2}
            GQL2={documents}
            UpdateForm2={Update2}
            visibleModalUpdate3={visibleModalUpdate3}
            GQL3={documents}
            UpdateForm3={Update3}
            visibleModalUpdate4={visibleModalUpdate4}
            GQL4={documents}
            UpdateForm4={Update4}
            visibleModalUpdate5={visibleModalUpdate5}
            GQL5={documents}
            UpdateForm5={Update5}
            title="Просмотр документа"
            selectedRowKeys={tableProps.selectedRowKeys}
            update={true}
            width={750}
          />,
          <Popconfirm
            title="Вы уверены?"
            onConfirm={() => {
              let variables = {};
              variables[documents.exemplar] = {
                id: Number(tableProps.selectedRowKeys[0]),
                log_username: user.username,
              };
              remove({ variables });
            }}
            okText="Да"
            cancelText="Нет"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            disabled={tableProps.selectedRowKeys.length !== 1}
          >
            {user.documentControl.delete ? (
              <Button
                key="remove"
                type="dashed"
                danger
                loading={loadingRemove}
                disabled={tableProps.selectedRowKeys.length !== 2}
              >
                <DeleteOutlined />
                Удалить
              </Button>
            ) : null}
          </Popconfirm>,
        ]}
        selectedRowKeys={tableProps.selectedRowKeys}
      />
    );
  };

  return (
    <>
      <TableContainerIsRead
        data={{ dict, records: listFiltered }}
        loading={loading}
        title={titleMenu}
        visibleModalUpdate={visibleModalUpdate}
        visibleModalUpdate2={visibleModalUpdate2}
        visibleModalUpdate3={visibleModalUpdate3}
        visibleModalUpdate4={visibleModalUpdate4}
        visibleModalUpdate5={visibleModalUpdate5}
        GQL={documents}
      />
      {/* <h1>Раздел функционирует не полностью, в разработке.</h1> */}
    </>
  );
});

export default RejectedDocumentsUser;
