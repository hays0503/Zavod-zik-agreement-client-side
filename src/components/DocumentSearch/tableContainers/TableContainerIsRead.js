import { Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

let TableContainer = React.memo(({ GQL, ...props }) => {
    const location = useLocation();
    const { pathname } = location;


    let [selectedRowKeys, setSelectedRowKeys] = useState([]);
    let itemKeys = [];
    if (!props.loading) {
        itemKeys = props.data.records.map((item) => {
            return item.id
        });
    }
    // const [readTrue,  loading ] = handlerMutation(useMutation(GQL.setIsReadTrue))();


    const [readTrue, { loading , error }] = useMutation(GQL.setIsReadTrue, {

        onCompleted: (data) => console.log("Data from mutation", data),
        onError: (error) => console.error("Error creating a post", error)
    });
    
    let variables= {}
    useEffect(() => {
        setSelectedRowKeys(selectedRowKeys.filter((item) => {
            for (var i = 0; i < itemKeys.length; i++) {
                if (itemKeys[i] == item) {
                    return true;
                }
            }
            return false;
        }));
    }, [props.data]);

    // console.log("props TableContainer", props.data.records[0])
    return (
        <>
            <Table
                className='sd-tables-row-hover'
                loading={props.loading}
                style={{ minHeight: 168 }}
                columns={props.data.dict}
                dataSource={props.data.records}
                scroll={{ y: 'calc(100vh - 231px)', minX: 500 }}
                size='small'
                title={props.title ? () => (props.title({ selectedRowKeys: selectedRowKeys })) : null}
                bordered={props.bordered}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setSelectedRowKeys([record.key, record.route_id])
                            console.log("RECORD",record)
                        },
                        onDoubleClick: event => {
                            if(record?.document_logs?.is_read == false){
                                readTrue({ variables: { document: { id: record.document_logs.id,is_read:true} } });
                                if(record.route_id == 10){
                                    props.visibleModalUpdate[1](true)
                                }
                                if(record.route_id == 24){
                                    props.visibleModalUpdate2[1](true)
                                }
                                if(record.route_id == 26){
                                    props.visibleModalUpdate3[1](true)
                                }
                                if(record.route_id == 27){
                                    props.visibleModalUpdate4[1](true)
                                }
                                if(record.route_id == 29){
                                    props.visibleModalUpdate5[1](true)
                                }
                            }else{
                                if(record.route_id == 10){
                                    props.visibleModalUpdate[1](true)
                                }
                                if(record.route_id == 24){
                                    props.visibleModalUpdate2[1](true)
                                }
                                if(record.route_id == 26){
                                    props.visibleModalUpdate3[1](true)
                                }
                                if(record.route_id == 27){
                                    props.visibleModalUpdate4[1](true)
                                }
                                if(record.route_id == 29){
                                    props.visibleModalUpdate5[1](true)
                                }
                            }
                        }
                    }
                }}
                pagination={{
                    // simple: true,
                    pageSize: 50,
                    //defaultCurrent=6, - to check both commented
                    //total={props.data.records.length},
                    showSizeChanger: false
                }}
                rowClassName={(record, index) => {
                    let className = ''
                    if (record?.document_logs?.is_read == false){
                        className += 'is_read_false'
                    }
                    if (record.key === selectedRowKeys[0]) {
                        return 'ant-table-row ant-table-row-level-0 statusSelected';
                    }
                    return 'ant-table-row ant-table-row-level-0', className;
                }}
            />
        </>
    );
});

export default TableContainer

