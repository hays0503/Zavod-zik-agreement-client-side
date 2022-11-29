import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Button, Popconfirm } from "antd";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  handlerQuery,
  handlerMutation,
  useUser,
} from "../../../../core/functions";
import ModalUpdate from "./modals/ModalUpdate";
import TableContainer from "./tableContainers/TableContainer";
import TitleMenu from "../../../../core/TitleMenu";
import test from "../../../../core/functions/TrashComponent1";

import Update1 from "./forms/1/Update1";
import Update2 from "./forms/2/Update2";
import Update3 from "./forms/3/Update3";
import Update4 from "./forms/4/Update4";
import Update5 from "./forms/5/Update5";

let ForExecutionInbox = React.memo((props) => {
  let user = useUser();
  let userVariable = user.id;

  let DocumentTasks = {
    exemplar: "document_tasks",
    table: "document_tasks",
    options: {
      all: {
        variables: {
          document_tasks: {
            global: {
              user_id_receiver: `=${userVariable}`,
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
        query document_tasks($document_tasks: JSON) {
          document_tasks(document_tasks: $document_tasks) {
            id
            document_id
            status
            is_cancelled
            note
            deadline
            date_created
            user_id_created
            fio_created
            user_id_receiver
            fio_receiver
            route_id
            document_options
            task_files
            document_tasks_id_file
            task_statuses {
              id
              name
            }
            document_tasks_logs {
              id
              task_id
              is_read
              type
              user_id
            }
            report
          }
        }
      `,
      one: gql`
        query document_tasks($document_tasks: JSON) {
          document_tasks(document_tasks: $document_tasks) {
            id
            document_id
            status
            is_cancelled
            note
            deadline
            date_created
            user_id_created
            fio_created
            user_id_receiver
            fio_receiver
            route_id
            document_options
            task_files
            document_tasks_id_file
            document_tasks_logs {
              id
              task_id
              is_read
              type
              user_id
            }
            task_statuses {
              id
              name
            }
            document_tasks_files {
              id
              filename
              data_file
              task_id
            }
            report
          }
        }
      `,
    },
    subscription: {
      all: gql`
        subscription document_tasks($document_tasks: JSON) {
          document_tasks(document_tasks: $document_tasks) {
            id
            document_id
            status
            is_cancelled
            note
            deadline
            date_created
            user_id_created
            fio_created
            user_id_receiver
            fio_receiver
            route_id
            document_options
            task_files
            document_tasks_id_file
            task_statuses {
              id
              name
            }
            document_tasks_logs {
              id
              task_id
              is_read
              type
              user_id
            }
            report
          }
        }
      `,
    },
    update: gql`
      mutation updateDocumentTasks($document_tasks: JSON) {
        updateDocumentTasks(document_tasks: $document_tasks) {
          type
          message
        }
      }
    `,
    setTaskIsReadTrue: gql`
      mutation setTaskIsReadTrue($task: JSON) {
        setTaskIsReadTrue(task: $task) {
          type
          message
        }
      }
    `,
  };

  const visibleModalUpdate = useState(false);
  const visibleModalUpdate2 = useState(false);
  const visibleModalUpdate3 = useState(false);
  const visibleModalUpdate4 = useState(false);
  const visibleModalUpdate5 = useState(false);

  const {
    loading: loadingTasks,
    data: dataTasks,
    refetch: refetchTasks,
  } = handlerQuery(DocumentTasks, "all")();

  useEffect(() => {
    refetchTasks();
  }, []);

  let list =
    dataTasks && dataTasks[Object.keys(dataTasks)[0]] != null
      ? dataTasks[Object.keys(dataTasks)[0]].map((item) => {
          return {
            id: item.id,
            key: item.id,
            document_id: item.document_id,
            status: item.status,
            is_cancelled: item.is_cancelled,
            note: item.note,
            deadline: item.deadline,
            date_created: item.date_created,
            user_id_created: item.user_id_created,
            fio_created: item.fio_created,
            user_id_receiver: item.user_id_receiver,
            fio_receiver: item.fio_receiver,
            route_id: item.route_id ? item.route_id : 10,
            document_options: item.document_options,
            task_files: item.task_files ? item.task_files : {},
            task_statuses: item.task_statuses?.name,
            document_tasks_id_file: item?.document_tasks_id_file,
            document_tasks_logs: item.document_tasks_logs
              ? item.document_tasks_logs[
                  item.document_tasks_logs.findIndex(
                    (item) => item.user_id == user.id
                  )
                ]
              : [],
          };
        })
      : [];

  let listFiltered = list.filter((el) => {
    return el.status_id == 4;
  });
  window.localStorage["rows_approved"] = listFiltered.length;

  let dict = test([
    {
      title: "ФИО поручителя",
      dataIndex: "fio_created",
      width: "214px",
      type: "search",
      tooltip: true,
      sorter: (a, b) => a.fio_created.localeCompare(b.fio_created),
    },
    {
      title: "Дата создания",
      dataIndex: "date_created",
      width: "300px",
      type: "search",
      tooltip: true,
      sorter: true,
      sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created),
    },
    {
      title: "Выполнить до",
      dataIndex: "deadline",
      width: "214px",
      type: "search",
      tooltip: true,
      sorter: true,
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
    {
      title: "Статус",
      dataIndex: "task_statuses",
      width: "114px",
      tooltip: true,
    },
    { title: "Задача", dataIndex: "note", width: "214px" },
  ]);

  let titleMenu = (tableProps) => {
    return (
      <TitleMenu
        buttons={[
          <ModalUpdate
            visibleModalUpdate={visibleModalUpdate}
            UpdateForm={Update1}
            visibleModalUpdate2={visibleModalUpdate2}
            UpdateForm2={Update2}
            visibleModalUpdate3={visibleModalUpdate3}
            UpdateForm3={Update3}
            visibleModalUpdate4={visibleModalUpdate4}
            UpdateForm4={Update4}
            visibleModalUpdate5={visibleModalUpdate5}
            UpdateForm5={Update5}
            GQL={DocumentTasks}
            title="Просмотр задания"
            selectedRowKeys={tableProps.selectedRowKeys}
            update={true}
            width={750}
          />,
        ]}
        selectedRowKeys={tableProps.selectedRowKeys}
      />
    );
  };

  return (
    <TableContainer
      data={{ dict, records: list }}
      loading={loadingTasks}
      title={titleMenu}
      visibleModalUpdate={visibleModalUpdate}
      visibleModalUpdate2={visibleModalUpdate2}
      visibleModalUpdate3={visibleModalUpdate3}
      visibleModalUpdate4={visibleModalUpdate4}
      visibleModalUpdate5={visibleModalUpdate5}
      GQL={DocumentTasks}
    />
  );
});

export default ForExecutionInbox;
