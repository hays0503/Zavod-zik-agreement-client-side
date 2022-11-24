import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Tree,
  Divider,
  Checkbox,
  Tag,
  Transfer,
  Empty,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  handlerMutation,
  handlerQuery,
  useUser,
} from "../../../core/functions";
import ModalInsert from "../../../core/modal/ModalInsert";
import ModalUpdate from "../../../core/modal/ModalUpdate";
import TitleMenu from "../../../core/TitleMenu";
import TableContainer from "../../../core/TableContainer";
import test from "../../../core/functions/TrashComponent1";
import { FragmentSelectItems } from "./../../DocumentControl/pages/fragments/FragmentSelectItems";

const modalFormWidth = 650;

//конфигуратор запросов graphql
let users = {
  exemplar: "user",
  table: "users",
  options: {
    all: {
      variables: {
        users: { global: { ORDER_BY: ["username asc"] } },
      },
      fetchPolicy: "cache-and-network",
    },
    one: {
      fetchPolicy: "cache-and-network",
    },
  },
  select: {
    all: gql`
      query users($users: JSON) {
        users(users: $users) {
          id
          username
          admin
          accesses
          positions
          domain_username
          fio
          email
          department_relationship {
            id_department
          }
        }
      }
    `,
    one: gql`
      query users($users: JSON) {
        users(users: $users) {
          id
          username
          password
          admin
          accesses
          positions
          domain_username
          fio
          email
          department_relationship {
            id_department
          }
        }
      }
    `,
  },
  subscription: {
    all: gql`
      subscription users($users: JSON) {
        users(users: $users) {
          id
          username
          admin
          accesses
          positions
          domain_username
          fio
          email
          department_relationship {
            id_department
          }
        }
      }
    `,
  },
  insert: gql`
    mutation insertUser($user: JSON) {
      insertUser(user: $user) {
        message
        type
      }
    }
  `,
  update: gql`
    mutation updateUser($user: JSON) {
      updateUser(user: $user) {
        message
        type
      }
    }
  `,
  delete: gql`
    mutation deleteUser($user: JSON) {
      deleteUser(user: $user) {
        message
        type
      }
    }
  `,
};

let positions = {
  exemplar: "positions",
  table: "positions",
  options: {
    all: {
      fetchPolicy: "cache-only",
    },
    one: {
      fetchPolicy: "standby",
    },
  },
  select: {
    all: gql`
      query positions($positions: JSON) {
        positions(positions: $positions) {
          id
          name
        }
      }
    `,
    one: gql`
      query positions($positions: JSON) {
        positions(positions: $positions) {
          id
          name
        }
      }
    `,
  },
  subscription: {
    all: gql`
      subscription positions($positions: JSON) {
        positions(positions: $positions) {
          id
          name
        }
      }
    `,
  },
  insert: gql`
    mutation insertPosition($positions: JSON) {
      insertPosition(positions: $positions) {
        message
      }
    }
  `,
  update: gql`
    mutation updatePosition($positions: JSON) {
      updatePosition(positions: $positions) {
        message
      }
    }
  `,
  delete: gql`
    mutation deletePosition($positions: JSON) {
      deletePosition(positions: $positions) {
        message
      }
    }
  `,
};

//регистрация
let UsersPage = React.memo((props) => {
  let user = useUser();
  const visibleModalUpdate = useState(false);

  const [remove, { loading: loadingRemove }] = handlerMutation(
    useMutation(users.delete)
  )();

  const { loading, data, refetch } = handlerQuery(users, "all")();
  useEffect(() => {
    refetch();
  }, []);

  const {
    loading: loadingPositions,
    data: positionsData,
    refetch: refetchPositions,
  } = handlerQuery(positions, "all")();
  useEffect(() => {
    refetchPositions();
  }, []);

  //Лист выдачи данных
  let list =
    data && data.users != null
      ? data.users.map((item) => {
          return {
            id: item.id,
            key: item.id,
            username: item.username,
            access: item.admin ? "АДМИНИСТРАТОР" : "ПОЛЬЗОВАТЕЛЬ",
            positions: item.positions,
            fio: item.fio,
            email: item.email,
            department_relationship:
              item.department_relationship?.id_department,
            positionName: positionsData.positions
              .filter((e) => e.id == item.positions)
              .map((obj) => obj.name)[0],
          };
        })
      : [];

  //Шапка таблицы
  let dict = test([
    {
      title: "Логин",
      dataIndex: "username",
      width: 100,
      tooltip: true,
    },
    {
      title: "Роль",
      dataIndex: "access",
      align: "center",
      width: 100,
      render: (text, record) => {
        switch (record.access) {
          case "АДМИНИСТРАТОР":
            return <Tag color="green">{text}</Tag>;
          case "ПОЛЬЗОВАТЕЛЬ":
            return <Tag color="geekblue">{text}</Tag>;
          default:
            return text;
        }
      },
    },
    {
      title: "Должность",
      dataIndex: "positionName",
      width: 150,
      tooltip: true,
    },
  ]);

  let titleMenu = (tableProps) => {
    return (
      <TitleMenu
        title="Редактирование пользователя"
        buttons={[
          <ModalInsert
            title="Добавление пользователя"
            GQL={users}
            InsertForm={WorkersWorkerdForm}
            width={modalFormWidth}
          />,
          <ModalUpdate
            visibleModalUpdate={visibleModalUpdate}
            title="Редактирование пользователя"
            width={modalFormWidth}
            selectedRowKeys={tableProps.selectedRowKeys}
            GQL={users}
            UpdateForm={WorkersWorkerdForm}
            update={true}
          />,
          <Popconfirm
            title="Вы уверены?"
            onConfirm={() => {
              let variables = {};
              variables[users.exemplar] = {
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
            <Button
              key="remove"
              type="dashed"
              danger
              loading={loadingRemove}
              disabled={tableProps.selectedRowKeys.length !== 1}
            >
              <DeleteOutlined />
              Удалить
            </Button>
          </Popconfirm>,
        ]}
        selectedRowKeys={tableProps.selectedRowKeys}
      />
    );
  };

  return (
    <TableContainer
      data={{ dict, records: list }}
      loading={loading}
      title={titleMenu}
      visibleModalUpdate={visibleModalUpdate}
      bordered={true}
    />
  );
});

const WorkersWorkerdForm = React.memo((props) => {
  let user = useUser();
  const [state, setState] = useState({
    username: "",
    password: "",
    admin: false,
    accesses: [],
    positions: [],
    domain_username: "",
    fio: "",
    email: "",
    log_username: user.username,
  });

  useEffect(() => {
    props.form.setFieldsValue(state);
  }, [state]);

  useEffect(() => {
    if (props.initialValues) {
      setState({
        id: props.initialValues.users[0].id,
        username: props.initialValues.users[0].username,
        password: props.initialValues.users[0].password,
        admin: props.initialValues.users[0].admin,
        accesses: props.initialValues.users[0].accesses,
        positions: props.initialValues.users[0].positions,
        domain_username: props.initialValues.users[0].domain_username,
        fio: props.initialValues.users[0].fio,
        email: props.initialValues.users[0].email,
        log_username: user.username,
      });
    }
  }, [props.initialValues]);

  let onFinish = (values) => {
    props.onFinish(state);
  };

  return (
    <Form
      form={props.form}
      name="WorkersWorkerdForm"
      onFinish={onFinish}
      scrollToFirstError
      autoComplete="off"
      onValuesChange={(changedValues, allValues) => {
        setState(Object.assign({}, state, { ...allValues }));
      }}
    >
      <Row justify="center">
        <Col flex="auto">
          <Form.Item
            name="username"
            label="Имя пользователя"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Необходимо для заполнения!",
                whitespace: true,
              },
            ]}
          >
            <Input disabled={props.disabled} placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            name="domain_username"
            label="Логин домена"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Необходимо для заполнения!",
                whitespace: true,
              },
            ]}
          >
            <Input disabled={props.disabled} placeholder="Логин домена" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электронная почта для извещений"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Необходимо для заполнения!",
                whitespace: true,
              },
            ]}
          >
            <Input disabled={props.disabled} placeholder="Почта" />
          </Form.Item>
          <Form.Item
            name="fio"
            label="Ф.И.О инициалы для подписи"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Необходимо для заполнения!",
                whitespace: true,
              },
            ]}
          >
            <Input
              disabled={props.disabled}
              placeholder="Ф.И.О инициалы для подписи"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: !props.initialValues,
                message: "Необходимо для заполнения!",
                whitespace: true,
              },
            ]}
          >
            <Input.Password
              disabled={props.disabled}
              placeholder="Пароль"
              className="accountInput"
            />
          </Form.Item>
          <Form.Item
            name="admin"
            valuePropName="checked"
            rules={[
              {
                type: "boolean",
              },
            ]}
            shouldUpdate
          >
            <Checkbox disabled={props.disabled}>Администратор</Checkbox>
          </Form.Item>

          <Form.Item name="positions">
            <FragmentSelectItems
              disabled={props.disabled}
              idPosition={
                props?.initialValues?.users[0]?.positions[0]
                  ? props?.initialValues?.users[0]?.positions[0]
                  : null
              }
              idDepartment={
                props?.initialValues?.users[0]?.department_relationship
                  ?.id_department
              }
            />
          </Form.Item>

          <Form.Item name="log_username" hidden={true}>
            <Input disabled={props.disabled} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

/**
 * @deprecated Устарело
 */
// let PositionsTransfer = React.memo((props) => {
// 	const modalFormWidth = 650;

// 	console.log("console.log(props.value)", props.value);

// 	const { loading, data, refetch } = handlerQuery(positions, "all")();
// 	useEffect(() => {
// 		refetch();
// 	}, []);

// 	const [selectedKeys, setSelectedKeys] = useState([]);
// 	let handleChange = (nextTargetKeys, direction, moveKeys) => {
// 		props.onChange(nextTargetKeys);
// 	};

// 	let handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
// 		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
// 		console.log(selectedKeys);
// 	};

// 	let filterOption = (inputValue, option) =>
// 		option.description.indexOf(inputValue) > -1;

// 	let mockData = [];
// 	if (!loading) {
// 		mockData = data.positions.map((item) => {
// 			return {
// 				id: item.id,
// 				key: item.id,
// 				title: item.name,
// 				description: item.name,
// 			};
// 		});
// 	}
// 	return (
// 		<>
// 			<Transfer
// 				dataSource={mockData}
// 				showSearch={true}
// 				titles={["Все", "Выбранные"]}
// 				targetKeys={props.value ? props.value : []}
// 				selectedKeys={selectedKeys}
// 				onChange={handleChange}
// 				showSelectAll={false}
// 				onSelectChange={handleSelectChange}
// 				render={(item) => item.title}
// 				listStyle={{ width: modalFormWidth / 2.2 }}
// 				style={{ marginBottom: 16 }}
// 				filterOption={filterOption}
// 				locale={{
// 					itemUnit: "",
// 					itemsUnit: "",
// 					notFoundContent: (
// 						<Empty
// 							image={Empty.PRESENTED_IMAGE_SIMPLE}
// 							description="Нет данных"
// 						/>
// 					),
// 					searchPlaceholder: "Статус",
// 				}}
// 				disabled={props.disabled}
// 			/>
// 		</>
// 	);
// });

export default UsersPage;
