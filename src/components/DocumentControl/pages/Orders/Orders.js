import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { handlerQuery, handlerMutation, useUser } from '../../../../core/functions';
import ModalInsert from '../../modals/ModalInsert';
import ModalUpdate from '../../modals/ModalUpdate';
import TableContainer from '../../tableContainers/TableContainer';
import TitleMenu from '../../../../core/TitleMenu';
import test from "../../../../core/functions/TrashComponent1";


import Insert1 from './forms/1/Insert1';
import Insert2 from './forms/2/Insert2';
import Insert3 from './forms/3/Insert3';
import Insert4 from './forms/4/Insert4';
import Insert5 from './forms/5/Insert5';

import gql1 from './gql/1/gql1';
import gql2 from './gql/2/gql2';
import gql3 from './gql/3/gql3';
import gql4 from './gql/4/gql4';
import gql5 from './gql/5/gql5';

import Update1 from './forms/1/Update1';
import Update2 from './forms/2/Update2';
import Update3 from './forms/3/Update3';
import Update4 from './forms/4/Update4';
import Update5 from './forms/5/Update5';


let Orders = React.memo((props) => {
    let user = useUser();
    let positionsVariable = user.positions.toString();
    let variables = { documents: { global: { user_id: `=${user.id}`, ORDER_BY: ['date_created desc'] } } };
    gql1.options.all.variables = variables;
    gql2.options.all.variables = variables;
    gql3.options.all.variables = variables;
    gql4.options.all.variables = variables;
    gql5.options.all.variables = variables;
    if (user.admin) variables = {};

    const visibleModalUpdate = useState(false);
    const visibleModalUpdate2 = useState(false);
    const visibleModalUpdate3 = useState(false);
    const visibleModalUpdate4 = useState(false);
    const visibleModalUpdate5 = useState(false);

    const [remove, { loading: loadingRemove }] = handlerMutation(useMutation(gql1.delete))();

    const { loading, data, refetch } = handlerQuery(gql1, 'all')();
    useEffect(() => { refetch() }, []);

    let list = (data && data[Object.keys(data)[0]] != null) ? data[Object.keys(data)[0]].map((item) => {
        return {
            id: item.id,
            key: item.id,
            title: item.title,
            date_created: item.date_created,
            date_modified: item.date_modified,
            status_id: item.status_id,
            status: item.document_statuses?.name ? item.document_statuses.name : 'Без статуса',
            route_id: item.route_id.id,
            route: item.route_id?.name ? item.route_id.name : 'Не задан',
            route_data: item.route_data,
            route_step: item.route_data ? item.route_data.findIndex(item => item.positionId == positionsVariable) + 1 : [],
            step: item.step,
            step_count: item.step + ' из ' + item.route_data?.length,
            //step_name:console.log('DDDDDD',item.step)
            step_name: item.route_data?.length > 0 ? item.route_data[item.step - 1].positionName : '',
            //step_name: item.route_id?.routes ? item.route_id.routes[item.route_id.routes.findIndex(item => item.positionId == item.step)].positionName : ''
        }
    }) : [];


    let dict = test([
        { title: 'Наименование договора', dataIndex: 'title', width: '214px', type: 'search', tooltip: true, sorter: (a, b) => a.title.localeCompare(b.title), sortDirections: ['ascend', 'descend'] },
        { title: 'Дата и время создания', dataIndex: 'date_created', width: '114px', type: 'search', tooltip: true, sorter: true, sorter: (a, b) => new Date(a.date_created) - new Date(b.date_created) },
        { title: 'Последние изменение', dataIndex: 'date_modified', width: '114px', type: 'search', tooltip: true, sorter: true, sorter: (a, b) => new Date(a.date_modified) - new Date(b.date_modified) },
        { title: 'Тип договора', dataIndex: 'route', width: '114px', type: 'search', tooltip: true, sorter: (a, b) => a.route.localeCompare(b.route), sortDirections: ['ascend', 'descend'] },
        { title: 'Статус', dataIndex: 'status', width: '80px', tooltip: true, sorter: (a, b) => a.status.localeCompare(b.status),sortDirections: ['ascend', 'descend'],
        filters:[
            {
                text:'Подписан',
                value:'Подписан'
            },
            {
                text:'В работе',
                value:'В работе'
            },
            {
                text:'Отклонён',
                value:'Отклонён'
            }
        ],onFilter: (value, record) => record.status.indexOf(value) === 0},

        { title: 'На подписи', dataIndex: 'step_name', width: '114px' },
        { title: 'Этап', dataIndex: 'step_count', width: '55px' },
        // { title: 'Шаг п.', dataIndex: 'route_step', width: '55px'}
    ]);


    let titleMenu = (tableProps) => {
        return (
            <TitleMenu
                buttons={[
                    <ModalInsert title='Создание документа'
                        GQL={gql1} Form1={Insert1}
                        GQL2={gql2} Form2={Insert2}
                        GQL3={gql3} Form3={Insert3}
                        GQL4={gql4} Form4={Insert4}
                        GQL5={gql5} Form5={Insert5}
                        width={750} />,
                    <ModalUpdate
                        visibleModalUpdate={visibleModalUpdate} GQL={gql1} UpdateForm={Update1}
                        visibleModalUpdate2={visibleModalUpdate2} GQL2={gql2} UpdateForm2={Update2}
                        visibleModalUpdate3={visibleModalUpdate3} GQL3={gql3} UpdateForm3={Update3}
                        visibleModalUpdate4={visibleModalUpdate4} GQL4={gql4} UpdateForm4={Update4}
                        visibleModalUpdate5={visibleModalUpdate5} GQL5={gql5} UpdateForm5={Update5}
                        title='Просмотр договора' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                    <Popconfirm
                        title="Вы уверены?"
                        onConfirm={() => { let variables = {}; variables[gql1.exemplar] = { id: Number(tableProps.selectedRowKeys[0]), log_username: user.username }; remove({ variables }) }}
                        okText="Да"
                        cancelText="Нет"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        disabled={tableProps.selectedRowKeys.length !== 1}
                    >
                        {user.documentControl.delete ?
                            <Button key="remove" type="dashed" danger loading={loadingRemove} disabled={tableProps.selectedRowKeys.length !== 2}><DeleteOutlined />Удалить</Button> : null}
                    </Popconfirm>
                ]}
                selectedRowKeys={tableProps.selectedRowKeys}
            />)
    };

    return (
        <>
            <TableContainer
                data={{ dict, records: list }}
                loading={loading}
                title={titleMenu}
                visibleModalUpdate={visibleModalUpdate}
                visibleModalUpdate2={visibleModalUpdate2}
                visibleModalUpdate3={visibleModalUpdate3}
                visibleModalUpdate4={visibleModalUpdate4}
                visibleModalUpdate5={visibleModalUpdate5}
            />
            {/*<Button onClick={() => setContext("New Value")}>Change Context</Button> <br /> */}
        </>
    )
});

export default Orders;