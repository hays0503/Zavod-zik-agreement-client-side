import { EyeOutlined } from '@ant-design/icons';
import { Button, Collapse, Typography, Form } from 'antd';
import React from 'react';
import { Col } from 'antd';
import { useEffect } from 'react';
import { files } from 'jszip';
import { useState } from 'react';


 const { Panel } = Collapse;
 const { Link } = Typography;

function callback(key) {
    // console.log(key);
}


let OpenDocument = async (item,userId) => {
    console.log("PROPS", item.id)
    const tmp = await fetch('/api/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { user: Number(userId), item: item.id }
        )
    })
    const content = await tmp.json();
    if (content !== undefined) {
        console.log("RESULT", content)
    }
}

let download = async (e) => {
    await fetch("/get-file", {
        method: "POST",
        body: JSON.stringify({ id: e.target.dataset.fileid }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(response => {
        let result = response.result
        let link = document.createElement('a')
        link.href = result.data_file
        link.download = result.filename
        link.click()
    })
}

/**
 * Фрагмент antd дающую возможность просматривать файлы 
 * @param files Массив из файлов для показа их на форме
 * @param userid id пользователя
 */
let FragmentFileViewer = (props) => {
     return (     
    <Form.Item
        name="files"
        className='font-form-header'
        labelCol={{ span: 24 }}
    >
    <Collapse defaultActiveKey={['2']} onChange={callback}>
        <Panel header={<b>Прикреплённые файлы</b>} key="2">
            {props?.files.map((item) => {
                return (<>
                    <div className='document-view-wrap'>
                        <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link> 
                        <Button onClick={() => { OpenDocument(item,props?.userId) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}
        </Panel>
    </Collapse>
    </Form.Item>
    )
}
export default FragmentFileViewer
