import React, { useState, useEffect } from "react";
import { Menu, Layout, Badge } from "antd";
import {
  DatabaseOutlined,
  CarryOutOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { Link, NavLink } from "react-router-dom";
import { useUser, notifyMe, sendAgentNotification } from "../../core/functions";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

//import { Context } from "../../core/Context";

const { Sider } = Layout;
const { SubMenu } = Menu;

let SiderMenu = (props) => {
  const location = useLocation();
  const user = useUser();
  const { pathname } = location;

  const [collapsedState, setCollapsedState] = useState(false);

  const [con, setCon] = useState({ t1: 2, t2: 3, t3: 3 });
  const [con1, setCon1] = useState({});

  // //subscription try
  const testLogs = gql`
    query document_logs($document_logs: JSON) {
      document_logs(document_logs: $document_logs) {
        id
        document_id
        is_read
        user_id
        type
      }
    }
  `;
  let testSub = gql`
    subscription document_logs($document_logs: JSON) {
      document_logs(document_logs: $document_logs) {
        id
        document_id
        is_read
        user_id
        type
      }
    }
  `;

  //tasks logs gql
  const tasksLogs = gql`
    query document_tasks_logs($document_tasks_logs: JSON) {
      document_tasks_logs(document_tasks_logs: $document_tasks_logs) {
        id
        task_id
        is_read
        user_id
        type
      }
    }
  `;
  let tasksSub = gql`
    subscription document_tasks_logs($document_tasks_logs: JSON) {
      document_tasks_logs(document_tasks_logs: $document_tasks_logs) {
        id
        task_id
        is_read
        user_id
        type
      }
    }
  `;

  const { loading, data, refetch } = useQuery(testLogs, {
    variables: {
      document_logs: {
        global: {
          is_read: "=false",
          user_id: "=" + user.id,
          ORDER_BY: ["date"],
        },
      },
    },
    onCompleted: (data) => {
      let subData = {};
      subData.revised = data.document_logs.filter((el) => {
        return el.type == 4 && el.is_read == false;
      }).length;
      subData.approved = data.document_logs.filter((el) => {
        return el.type == 1 && el.is_read == false;
      }).length;
      subData.rejected = data.document_logs.filter((el) => {
        return el.type == 3 && el.is_read == false;
      }).length;
      subData.onaproval = data.document_logs.filter((el) => {
        return el.type == 2 && el.is_read == false;
      }).length;
      subData.finished = data.document_logs.filter((el) => {
        return el.type == 7 && el.is_read == false;
      }).length;
      setCon(subData);
    },
  });

  const { data: countData, loading: countLoading } = useSubscription(testSub, {
    variables: {
      document_logs: {
        global: {
          is_read: "=false",
          user_id: "=" + user.id,
          ORDER_BY: ["date"],
        },
      },
    },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      let subData = {};
      subData.revised = data.document_logs.filter((el) => {
        return el.type == 4 && el.is_read == false;
      }).length;
      subData.approved = data.document_logs.filter((el) => {
        return el.type == 1 && el.is_read == false;
      }).length;
      subData.rejected = data.document_logs.filter((el) => {
        return el.type == 3 && el.is_read == false;
      }).length;
      subData.onaproval = data.document_logs.filter((el) => {
        return el.type == 2 && el.is_read == false;
      }).length;
      subData.finished = data.document_logs.filter((el) => {
        return el.type == 7 && el.is_read == false;
      }).length;
      //console.log('testSub', data);
      //console.log('testSub2', subData);
      setCon(subData);
      if (
        subData.revised > 0 ||
        subData.approved > 0 ||
        subData.rejected > 0 ||
        subData.onaproval > 0 ||
        subData.finished > 0
      ) {
        sendAgentNotification(user.email);
        notifyMe("Есть новые входящие сообщения.");
      }
    },
  });

  useEffect(() => {
    (() => {
      props.countF(setCon);
    })();
  }, []);

  //tasks logs part
  const {
    loading: taskLoading,
    data: taskData,
    refetch: taskRefetch,
  } = useQuery(tasksLogs, {
    variables: {
      document_tasks_logs: {
        global: {
          is_read: "=false",
          user_id: "=" + user.id,
          ORDER_BY: ["date"],
        },
      },
    },
    onCompleted: (data) => {
      setCon1(data.document_tasks_logs.length);
    },
  });

  const { data: countData1, loading: countLoading1 } = useSubscription(
    tasksSub,
    {
      variables: {
        document_tasks_logs: {
          global: {
            is_read: "=false",
            user_id: "=" + user.id,
            ORDER_BY: ["date"],
          },
        },
      },
      onSubscriptionData: ({ subscriptionData: { data } }) => {
        setCon1(data.document_tasks_logs.length);
        if (con1 > 0) {
          sendAgentNotification(user.email);
          notifyMe("Есть новые входящие сообщения.");
        }
      },
    }
  );

  useEffect(() => {
    switch (pathname) {
      case "/document-control/orders":
        props.setHeaderTitle("Созданные мною");
        break;
      case "/document-control/reviseduser":
        props.setHeaderTitle("На доработку");
        break;
      case "/document-control/approveduser":
        props.setHeaderTitle("Согласованные");
        break;
      case "/document-control/rejecteduser":
        props.setHeaderTitle("Отклонённые");
        break;
      case "/document-control/on-approval":
        props.setHeaderTitle("Входящие");
        break;
      case "/document-control/registration":
        props.setHeaderTitle("Регистрация документов");
        break;
      case "/document-control/documents-finals":
        props.setHeaderTitle("Исполненные");
        break;
      case "/document-control/fulfilled":
        props.setHeaderTitle("Документы подписанные в ООПЗ");
        break;
      case "/document-control/on-approval-list":
        props.setHeaderTitle("Подписанные мною");
        break;
      case "/document-control/approved":
        props.setHeaderTitle("Все документы");
        break;
      case "/document-control/for-execution-inbox":
        props.setHeaderTitle("Входящие задачи");
        break;
      default:
        break;
    }
  }, [pathname]);

  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsedState(collapsed);
  };
  console.log("user ");
  return (
    <Sider
      theme="dark"
      collapsible
      collapsed={collapsedState}
      onCollapse={onCollapse}
    >
      <Menu
        defaultSelectedKeys={pathname}
        className="siderMenu"
        mode="inline"
        defaultOpenKeys={["User", "onApproval", "Admin"]}
      >
        <SubMenu key="User" icon={<DatabaseOutlined />} title="Мои документы">
          {user.documentControl.insert ? (
            <Menu.Item key="/document-control/orders">
              <Link to={"/document-control/orders"}>Созданные мною</Link>
            </Menu.Item>
          ) : null}
          {user.documentControl.revisedUser.select ? (
            <Menu.Item key={"/document-control/reviseduser"}>
              <NavLink to={"/document-control/reviseduser"}>
                На доработку{" "}
                <sup>
                  <Badge count={con.revised} />
                </sup>
              </NavLink>
            </Menu.Item>
          ) : null}
          {user.documentControl.approvedUser.select ? (
            <Menu.Item key={"/document-control/approveduser"}>
              <NavLink to={"/document-control/approveduser"}>
                Согласованные{" "}
                <sup>
                  <Badge count={con.approved} />
                </sup>
              </NavLink>
            </Menu.Item>
          ) : null}

          {user.documentControl.documentsFinals.select ? (
            <Menu.Item key={"/document-control/documents-finals"}>
              <NavLink to={"/document-control/documents-finals"}>
                Исполненные{" "}
                <sup>
                  <Badge count={con.finished} />
                </sup>
              </NavLink>
            </Menu.Item>
          ) : null}

          {user.documentControl.rejectedUser.select ? (
            <Menu.Item key={"/document-control/rejecteduser"}>
              <Link to={"/document-control/rejecteduser"}>
                Отклонённые{" "}
                <sup>
                  <Badge count={con.rejected} />
                </sup>
              </Link>
            </Menu.Item>
          ) : null}
          {user.documentControl.registrationDocuments.select ? (
            <Menu.Item key={"/document-control/registration"}>
              <Link to={"/document-control/registration"}>
                Регистрация документов
              </Link>
            </Menu.Item>
          ) : null}
        </SubMenu>
        {user.documentControl.onApproval.select ||
        user.documentControl.onApprovalList.select ? (
          <SubMenu
            key="onApproval"
            icon={<SafetyCertificateOutlined />}
            title="Подписание"
          >
            {user.documentControl.onApproval.select ? (
              <Menu.Item key="/document-control/on-approval">
                <Link to={"/document-control/on-approval"}>
                  Входящие
                  <sup>
                    <Badge count={con.onaproval} />
                  </sup>
                </Link>
              </Menu.Item>
            ) : null}
            {user.documentControl.onApprovalList.select ? (
              <Menu.Item key="/document-control/on-approval-list">
                <Link to={"/document-control/on-approval-list"}>
                  Подписанные мною
                </Link>
              </Menu.Item>
            ) : null}
            {user.documentControl.fulfilledDocuments.select ? (
              <Menu.Item key={"/document-control/fulfilled"}>
                <NavLink to={"/document-control/fulfilled"}>
                  Документы подписанные в ООПЗ
                </NavLink>
              </Menu.Item>
            ) : null}
          </SubMenu>
        ) : null}

        {user.documentControl.forExecutionInbox.select ? (
          <SubMenu
            key="forExecution"
            icon={<SafetyCertificateOutlined />}
            title="Задачи"
          >
            {user.documentControl.forExecutionInbox.select ? (
              <Menu.Item key="/document-control/for-execution-inbox">
                <Link to={"/document-control/for-execution-inbox"}>
                  Входящие
                  <sup>
                    <Badge count={con1} />
                  </sup>
                </Link>
              </Menu.Item>
            ) : null}
          </SubMenu>
        ) : null}
        {user.documentControl.approved.select ? (
          <SubMenu
            key="Admin"
            icon={<CarryOutOutlined />}
            title="Список (Админ)"
          >
            {user.documentControl.approved.select ? (
              <Menu.Item key={"/document-control/approved"}>
                <NavLink to={"/document-control/approved"}>
                  Все документы
                </NavLink>
              </Menu.Item>
            ) : null}
          </SubMenu>
        ) : null}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
