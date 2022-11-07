import { Divider, Select, Spin } from "antd";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

/**
 *	@description C помощью этого `gql` запроса будут запрашиваться свободные вакансии в каком либо департаменте, включая текущую позицию пользователя, если такая имеется
 */
const positions = gql`
  query get_free_position($positions: JSON) {
    get_free_position(positions: $positions) {
      id
      name
      id_depart
    }
  }
`;
/**
 * @description С помощью этого `gql` запроса будут запрашиваться словари с названием департаментов
 */
const DepartmentDictionary = gql`
  query department_dictionary($department_dictionary: JSON) {
    department_dictionary(department_dictionary: $department_dictionary) {
      id
      department_name
    }
  }
`;

/**
 * @description Запрос одной позиции по id
 */
const GetPosition = gql`
  query position($position: JSON) {
    position(position: $position) {
      id
      name
      id_depart
    }
  }
`;

/**
 * @function `FragmentSelectItems` Выпадающий список элементов antd
 * @param {Array} `Items` Массив с элементами
 * @param {Boolean} `disabled` Включены ли эти элементы
 * @param {Int} `idDepartment` Номер департамента в котором состоит пользователь
 * @return {Int} `Index` Возвращает индекс выбранного элемента
 */
export const FragmentSelectItems = (props) => {
  const [idDepartment, setIdDepartment] = useState(props?.idDepartment);
  let currentPositionId = props?.idPosition;
  const [positionName, setPositionName] = useState("Наименование должности");
  const [isClick, setClick] = useState(true);

  const PositionName = useQuery(GetPosition, {
    onCompleted: (Data) => {
      setPositionName(
        Data.position[0].name ? Data.position[0].name : positionName
      );
    },
    variables: {
      position: {
        global: {
          id: `=${currentPositionId}`,
        },
      },
    },
  });

  const QueryDepartment = useQuery(positions, {
    onCompleted: (Data) => {
      //   console.log("onCompleted:(Data)", Data);
      //console.log("onCompleted:(Data)", QueryDepartment?.data);
    },
    fetchPolicy: "no-cache",
    variables: {
      positions: {
        global: {
          id_depart: `=${idDepartment}`,
        },
      },
    },
  });

  // Запрос словаря с наименованием департаментов
  const { loading, error, data } = useQuery(DepartmentDictionary);
  // Возникла ошибка
  if (error) return <p>Ошибка: {error.message}</p>;
  // Если загрузка показываем прелоадер
  if (loading || !data)
    return (
      <>
        <Spin />
        "Загрузка FragmentSelectItems !"
      </>
    );
  // Отображение списка с наименованием департаментов

  const onDepartmentChange = (value) => {
    setIdDepartment(value);
    setPositionName("Наименование должности");
    setClick(false);
  };

  return (
    <>
      <h2>Наименование департаментов</h2>
      <Select
        showSearch
        style={{
          width: 200,
        }}
        placeholder="Наименование департамента"
        optionFilterProp="children"
        filterOption={(input, option) => option.children.includes(input)}
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
        onChange={(value) => onDepartmentChange(value)}
        disabled={props.disabled}
        defaultValue={
          data?.department_dictionary[idDepartment - 1]?.department_name
        }
      >
        {data.department_dictionary.map((Item) => {
          return (
            <Select.Option value={Item.id}>
              {Item.department_name}
            </Select.Option>
          );
        })}
      </Select>
      <Divider type="vertical" />

      <Select
        showSearch
        style={{
          width: 200,
        }}
        placeholder={positionName}
        optionFilterProp="children"
        filterOption={(input, option) => option.children.includes(input)}
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
        disabled={
          (QueryDepartment?.data?.get_free_position !== undefined &&
            QueryDepartment?.data?.get_free_position.length === 0) ||
          isClick
        }
        onChange={(value) => {
          props.onChange([value]);
        }}
        defaultValue={null}
      >
        {QueryDepartment.data?.get_free_position.map((Item) => {
          return <Select.Option value={Item.id}>{Item.name}</Select.Option>;
        })}
      </Select>
    </>
  );
};

/**
 * @function `FragmentSelectDepartment ` Выводит список департаментов
 * @param   {value} `stateValue` функция по установки стейта
 * @param  {setFunc} `setStateValue` функция по установки стейта
 */
export const FragmentSelectDepartment = (props) => {
  // Запрос словаря с наименованием департаментов
  const { loading, error, data } = useQuery(DepartmentDictionary);
  // Возникла ошибка
  if (error) return <p>Ошибка: {error.message}</p>;
  // Если загрузка показываем прелоадер
  if (loading || !data)
    return (
      <>
        <Spin />
        "Загрузка FragmentSelectItems !"
      </>
    );
  // Отображение списка с наименованием департаментов

  const onChange = (value) => {
    const newState = {
      id: props.stateValue.id,
      name: props.stateValue.name,
      accesses: props.stateValue.accesses,
      log_username: props.stateValue.log_username,
      is_boss: props.stateValue.is_boss,
      is_vice_director: props.stateValue.is_vice_director,
      is_user: props.stateValue.is_user,
      id_depart: value,
    };
    props.setStateValue(newState);
  };

  return (
    <Select
      showSearch
      style={{
        width: 400,
      }}
      placeholder="Search to Select"
      optionFilterProp="children"
      filterOption={(input, option) => option.children.includes(input)}
      filterSort={(optionA, optionB) =>
        optionA.children
          .toLowerCase()
          .localeCompare(optionB.children.toLowerCase())
      }
      defaultValue={
        props?.stateValue !== undefined ? props?.stateValue.id_depart : 0
      }
      onChange={onChange}
    >
      {data.department_dictionary.map((Item) => {
        return (
          <Select.Option value={Item.id}>{Item.department_name}</Select.Option>
        );
      })}
    </Select>
  );
};
