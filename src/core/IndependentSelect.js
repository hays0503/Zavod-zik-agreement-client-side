import { CloseOutlined } from '@ant-design/icons';
import { Button, Select, Row, Col } from 'antd';
import React, { useEffect } from 'react';
import { handlerQuery } from './functions';

let IndependentSelect = React.memo(({ query, placeholder, clear, ...props }) => {
    const { loading, data, refetch } = handlerQuery(query, 'all')();
    useEffect(() => { refetch() }, [])

    //make sure below the select value are the same from DB (i.e. int==int, bigint==bigint)
    return (
        <Row justify='space-between'>
            <Col flex='auto'>
                <Select
                    style={clear ? { width: 100 + "%" } : null}
                    placeholder={placeholder}

                    loading={loading}
                    showSearch
                    optionFilterProp="children"
                    filterOption
                    {...props}
                >
					<Select.Option key={null} value={null}></Select.Option>
                    {data ? data[Object.keys(data)[0]].map((item) => {
                        return (
                            <Select.Option key={item.id} value={item.id}>
                                {item[Object.keys(item).filter((field) => {
                                    return (field !== 'id' && field !== '__typename')
                                })[0]]}
                            </Select.Option>)
                    }) : []}
                </Select>
            </Col>

            {clear ? <Col><Button style={{padding: 5}} type='dashed' onClick={() => { props.onChange(null) }}><CloseOutlined /></Button></Col> : null}
        </Row>
    )
});

export default IndependentSelect;