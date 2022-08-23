import { EyeOutlined } from '@ant-design/icons';
import { Button, Collapse, Typography, Form } from 'antd';
import React from 'react';
import { Col } from 'antd';
import { useEffect } from 'react';
import { files } from 'jszip';
import { useState } from 'react';
import { FileDownload, FileOpenDocument, TaskFileDownload, TaskFileOpenDocument } from './../api/CRU_Document';

/**
 * Фрагмент antd дающую возможность просматривать файлы 
 * @param files Массив из файлов для показа их на форме
 */
export const  FragmentFileViewer = (props) => {
    console.log('FragmentFileViewer',props?.files)
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
                        <Link><a data-fileid={item.id} onClick={FileDownload}>{item.filename}</a></Link> 
                        <Button onClick={() => { FileOpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}
        </Panel>
    </Collapse>
    </Form.Item>
    )
}

/**
 * Фрагмент antd дающую возможность просматривать файлы(по поручением) 
 * @param files Массив из файлов для показа их на форме
 */
export const FragmentTaskFileViewer = (props) => {
    console.log('FragmentTaskFileViewer',props?.files)
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
                        <Link><a data-fileid={item.id} onClick={TaskFileDownload}>{item.filename}</a></Link> 
                        <Button onClick={() => { TaskFileOpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                    </div>
                </>)
            })}
        </Panel>
    </Collapse>
    </Form.Item>
    )
}


/**
 * Для отладки
 */
function callback(key) {
    // console.log(key);
}

const { Panel } = Collapse;
const { Link } = Typography;
