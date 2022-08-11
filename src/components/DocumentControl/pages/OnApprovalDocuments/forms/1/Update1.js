import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Space, Divider, Row, Col, Steps, Collapse, Table, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useUser, formatDate, handlerQuery } from '../../../../../../core/functions';
import TitleMenu from '../../../../../../core/TitleMenu'
import { gql, useMutation } from '@apollo/client';
import UploadFile from '../../../../modals/UploadFile';
import constants from "../../../../../../config/constants";

//pop confirm
import ApproveConfirm from './dialogs/ApproveConfirm';
import RejectConfirm from './dialogs/RejectConfirm';
import ReturnStepBackConfirm from './dialogs/ReturnStepBackConfirm';
import ReturnToSenderConfirm from './dialogs/ReturnToSenderConfirm';

//tasks
import UpdateTask1 from './UpdateTask1'
import TasksAddDialog from '../../../../dialogs/TasksAddDialog';
import TasksTableContainer from '../../tableContainers/TasksTableContainer'
import TaskModalUpdate from '../../modals/TaskModalUpdate'


let Update1 = React.memo((props) => {

    let DocumentTasks = {
        exemplar: 'document_tasks',
        table: 'document_tasks',
        options: {
            all: {
                fetchPolicy: 'standby'
            },
            one: {
                fetchPolicy: 'standby'
            }
        },
        select: {
            all: gql`
                query document_tasks ($document_tasks: JSON){
                    document_tasks(document_tasks: $document_tasks){
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
                        report
                        document_tasks_files{
                            id
                            filename
                            data_file
                            task_id
                        }
                    }
                }
            `,
            one: gql`
            query document_tasks ($document_tasks: JSON){
                document_tasks(document_tasks: $document_tasks){
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
                    report
                    document_tasks_files{
                        id
                        filename
                        data_file
                        task_id
                    }
                }
            }
            `
        },
        subscription: {
            all: gql`
            subscription document_tasks ($document_tasks: JSON) {
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
                }
            }
        `
        },
        insert: gql`
        mutation insertDocumentTasks($document_tasks: JSON) {
            insertDocumentTasks(document_tasks: $document_tasks) {
                type
                message
            }
        }
        `,
        setTaskIsReadTrue: gql`
        mutation setTaskIsReadTrue($task: JSON) {
            setTaskIsReadTrue(task: $task){
                type
                message
            }
        }
        `
    }

    let TasksTitleMenu = (tableProps) => {
        return (<TitleMenu
            buttons={[
                <TaskModalUpdate
                    visibleModalUpdate={visibleModalUpdate} UpdateForm={UpdateTask1} GQL={DocumentTasks}
                    title='Поручение' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />,
                <TasksAddDialog visible={visible} setVisible={setVisible} document={props.initialValues} />
            ]}
            selectedRowKeys={tableProps.selectedRowKeys}
        />)
    };

    let user = useUser();

    let [routesList, setRoutesList] = useState([{ positionName: 'Тип договора не выбран.' }])
    let [stepCount, setStepCount] = useState({ step: '0' })
    const visibleModalUpdate = useState(false);

    const price_pattern = /^\d+$/;
    const { Title, Link } = Typography;

    const { Step } = Steps;
    const { Panel } = Collapse;
    const stepsDirection = useRef('vertical');
    useEffect(() => {
        if (props?.initialValues?.documents[0]?.route_data?.length > 1)
            stepsDirection.current = props?.initialValues?.documents[0]?.route_data?.length <= 7 ? 'horizontal' : 'vertical'
    }, [props]);

    //Tasks
    const [visible, setVisible] = useState(false)

    const [state, setState] = useState({
        log_username: user.username,

    });

    let OpenDocument = async (item) => {
        // setBtnLoad(true)
        console.log("PROPS", item.id)
        // console.log('RECORD',props.record)
        const tmp = await fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                { user: Number(user.id), item: item.id }
            )
        })
        const content = await tmp.json();
        if (content != undefined) {
            console.log("RESULT", content)
        }
    }

    useEffect(() => { props.form.setFieldsValue(state) }, [state]);
    useEffect(() => {
        console.log("Props.initialValues",props.initialValues);
        if (props.initialValues) {
            setState({
                id: props.initialValues.documents[0].id,
                title: props.initialValues.documents[0].title,
                position: props.initialValues.documents[0].position,
                username: props.initialValues.documents[0].username,
                fio: props.initialValues.documents[0].fio,

                price: props.initialValues.documents[0].data_one[0].price,
                supllier: props.initialValues.documents[0].data_one[0].supllier,
                subject: props.initialValues.documents[0].data_one[0].subject,

                date_created: props.initialValues.documents[0].date_created,
                date_modified: props.initialValues.documents[0].date_modified,
                route_id: props.initialValues.documents[0].route_id.id,
                status_in_process: props.initialValues.documents[0].route_id.status_in_process,
                status_cancelled: props.initialValues.documents[0].route_id.status_cancelled,
                status_finished: props.initialValues.documents[0].route_id.status_finished,
                status_id: props.initialValues.documents[0].status_id,
                reason: props.initialValues.documents[0].reason,
                route: props.initialValues.documents[0].route_data,
                step: props.initialValues.documents[0].step,
                comments: props.initialValues.documents[0].comments,
                signatures: props.initialValues.documents[0].signatures,
                files: props.initialValues.documents[0].files,
                document_logs: props.initialValues.documents[0].document_logs,
                log_username: state.log_username
            });
            setStepCount({ step: props.initialValues.documents[0].step })
            setRoutesList(props.initialValues.documents[0].route_data)
        }
    }, [props.initialValues]);

    let download = async (e) => {
        let id = e.target.dataset.fileid
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
            link.href = result.data_file /*result.data_file.slice(result.data_file.indexOf(',')+1) */
            link.download = result.filename
            link.click()
        })
    }

    let onFinish = (values) => {
        props.onFinish(state);
        // console.log('Values --++++++++++', values)
    }

    //confirmations
    const [reasonText, setReasonText] = useState(props?.initialValues?.documents[0]?.reason);
    const ReasonInputChange = (all, change) => {
        if (all.target.value.length > 0) {
            setReasonText(all.target.value)
        } else {
            setReasonText(all.target.value)
        }
    };

    //collapse
    function callback(key) {
        // console.log(key);
    }

    const dict = [
        {
            title: 'У кого',
            dataIndex: 'fio_receiver',
            key: 'fio_receiver',
            width: '200px'
        },
        {
            title: 'Срок',
            dataIndex: 'deadline',
            key: 'deadline',
            width: '200px'
        },
        {
            title: 'Статус',
            dataIndex: 'task_statuses',
            key: 'task_statuses',
            width: '150px'
        },
        {
            title: 'Задача',
            dataIndex: 'note',
            key: 'note',
            width: '250px'
        },
    ];

    /*let imgData ='PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRvcjogQ29yZWxEUkFXIFg4IC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgd2lkdGg9IjIxMG1tIgogICBoZWlnaHQ9IjIxMG1tIgogICB2ZXJzaW9uPSIxLjEiCiAgIHN0eWxlPSJzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyB0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IGltYWdlLXJlbmRlcmluZzpvcHRpbWl6ZVF1YWxpdHk7IGZpbGwtcnVsZTpldmVub2RkOyBjbGlwLXJ1bGU6ZXZlbm9kZCIKICAgdmlld0JveD0iMCAwIDIxMDAwIDIxMDAwIgogICBpZD0ic3ZnNDAxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ6aWsuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIj48bWV0YWRhdGEKICAgaWQ9Im1ldGFkYXRhNDA1Ij48cmRmOlJERj48Y2M6V29yawogICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlCiAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAyOCIKICAgaWQ9Im5hbWVkdmlldzQwMyIKICAgc2hvd2dyaWQ9ImZhbHNlIgogICBpbmtzY2FwZTp6b29tPSIwLjU5NDY4MjU1IgogICBpbmtzY2FwZTpjeD0iLTEwMy42MTkzMSIKICAgaW5rc2NhcGU6Y3k9IjM5OS45Nzc3OCIKICAgaW5rc2NhcGU6d2luZG93LXg9IjEzNTIiCiAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIzIiAvPgogPGRlZnMKICAgaWQ9ImRlZnM0Ij48bGluZWFyR3JhZGllbnQKICAgaWQ9ImxpbmVhckdyYWRpZW50MjI0NSIKICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIj48c3RvcAogICAgIGlkPSJzdG9wMjI0MSIKICAgICBvZmZzZXQ9IjAiCiAgICAgc3R5bGU9InN0b3AtY29sb3I6IzhmYTViNTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcAogICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM5YWFlYmM7c3RvcC1vcGFjaXR5OjE7IgogICAgIG9mZnNldD0iMC4zNTYzNzcyNyIKICAgICBpZD0ic3RvcDIyNTEiIC8+PHN0b3AKICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxIgogICAgIG9mZnNldD0iMC41MTM4NTc5IgogICAgIGlkPSJzdG9wMjI0NyIgLz48c3RvcAogICAgIGlkPSJzdG9wMjI0OSIKICAgICBvZmZzZXQ9IjAuNjI2NDk0NjUiCiAgICAgc3R5bGU9InN0b3AtY29sb3I6I2NjZDVkZDtzdG9wLW9wYWNpdHk6MTsiIC8+PHN0b3AKICAgICBpZD0ic3RvcDIyNDMiCiAgICAgb2Zmc2V0PSIxIgogICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNjOWQzZGI7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD4KICA8c3R5bGUKICAgdHlwZT0idGV4dC9jc3MiCiAgIGlkPSJzdHlsZTIiPgogICA8IVtDREFUQVsKICAgIC5zdHIwIHtzdHJva2U6IzlCQTBBRTtzdHJva2Utd2lkdGg6NzAuNTY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kfQogICAgLmZpbDEge2ZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVyb30KICAgIC5maWwwIHtmaWxsOiM5QkEwQUU7ZmlsbC1ydWxlOm5vbnplcm99CiAgIF1dPgogIDwvc3R5bGU+CiAKICAKICAKIAogICAKICAgCiAgPGxpbmVhckdyYWRpZW50CiAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MjI0NSIKICAgaWQ9ImxpbmVhckdyYWRpZW50MjIyOS01IgogICB4MT0iMzAwMC44ODAxIgogICB5MT0iMTExMTciCiAgIHgyPSIxNDk5NS42MTkiCiAgIHkyPSIxMTA1NC4wNzkiCiAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPjxsaW5lYXJHcmFkaWVudAogICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDIyNDUiCiAgIGlkPSJsaW5lYXJHcmFkaWVudDI2OTAiCiAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICB4MT0iMzAwMC44ODAxIgogICB5MT0iMTExMTciCiAgIHgyPSIxNDk5NS42MTkiCiAgIHkyPSIxMTA1NC4wNzkiIC8+PGZpbHRlcgogICBpbmtzY2FwZTpsYWJlbD0iTWV0YWwgQ2FzdGluZyIKICAgaW5rc2NhcGU6bWVudT0iQmV2ZWxzIgogICBpbmtzY2FwZTptZW51LXRvb2x0aXA9IlNtb290aCBkcm9wLWxpa2UgYmV2ZWwgd2l0aCBtZXRhbGxpYyBmaW5pc2giCiAgIHN0eWxlPSJjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM6c1JHQjsiCiAgIGlkPSJmaWx0ZXIxMDQwIj48ZmVDb2xvck1hdHJpeAogICAgIHZhbHVlcz0iMC4zNyIKICAgICB0eXBlPSJzYXR1cmF0ZSIKICAgICBpbj0iU291cmNlR3JhcGhpYyIKICAgICByZXN1bHQ9InJlc3VsdDEiCiAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMDMwIiAvPjxmZUdhdXNzaWFuQmx1cgogICAgIHN0ZERldmlhdGlvbj0iNyIKICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyMTAzMiIgLz48ZmVTcGVjdWxhckxpZ2h0aW5nCiAgICAgc3BlY3VsYXJFeHBvbmVudD0iOCIKICAgICBzcGVjdWxhckNvbnN0YW50PSIzLjg4IgogICAgIHN1cmZhY2VTY2FsZT0iMTAiCiAgICAgaWQ9ImZlU3BlY3VsYXJMaWdodGluZzEwMzYiPjxmZURpc3RhbnRMaWdodAogICAgICAgYXppbXV0aD0iMjI1IgogICAgICAgZWxldmF0aW9uPSIxNyIKICAgICAgIGlkPSJmZURpc3RhbnRMaWdodDEwMzQiIC8+PC9mZVNwZWN1bGFyTGlnaHRpbmc+PGZlQ29tcG9zaXRlCiAgICAgaW4yPSJyZXN1bHQxIgogICAgIG9wZXJhdG9yPSJhdG9wIgogICAgIGlkPSJmZUNvbXBvc2l0ZTEwMzgiIC8+PC9maWx0ZXI+PGZpbHRlcgogICBpbmtzY2FwZTptZW51LXRvb2x0aXA9IkJyaWdodCBtZXRhbGxpYyBlZmZlY3QgZm9yIGFueSBjb2xvciIKICAgaW5rc2NhcGU6bWVudT0iQmV2ZWxzIgogICBpbmtzY2FwZTpsYWJlbD0iQnJpZ2h0IE1ldGFsIgogICBzdHlsZT0iY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzOnNSR0I7IgogICBpZD0iZmlsdGVyMTY5MCI+PGZlR2F1c3NpYW5CbHVyCiAgICAgcmVzdWx0PSJyZXN1bHQ2IgogICAgIHN0ZERldmlhdGlvbj0iOCIKICAgICBpbj0iU291cmNlR3JhcGhpYyIKICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxNjcwIiAvPjxmZUNvbXBvc2l0ZQogICAgIGluMj0iU291cmNlR3JhcGhpYyIKICAgICBpbj0icmVzdWx0NiIKICAgICBvcGVyYXRvcj0ieG9yIgogICAgIHJlc3VsdD0icmVzdWx0MTAiCiAgICAgaWQ9ImZlQ29tcG9zaXRlMTY3MiIgLz48ZmVHYXVzc2lhbkJsdXIKICAgICByZXN1bHQ9InJlc3VsdDIiCiAgICAgc3RkRGV2aWF0aW9uPSI4IgogICAgIGlkPSJmZUdhdXNzaWFuQmx1cjE2NzQiIC8+PGZlQ29tcG9zaXRlCiAgICAgaW4yPSJTb3VyY2VHcmFwaGljIgogICAgIG9wZXJhdG9yPSJhdG9wIgogICAgIGluPSJyZXN1bHQxMCIKICAgICByZXN1bHQ9InJlc3VsdDkxIgogICAgIGlkPSJmZUNvbXBvc2l0ZTE2NzYiIC8+PGZlQ29tcG9zaXRlCiAgICAgcmVzdWx0PSJyZXN1bHQ0IgogICAgIGluPSJyZXN1bHQyIgogICAgIG9wZXJhdG9yPSJ4b3IiCiAgICAgaW4yPSJyZXN1bHQ5MSIKICAgICBpZD0iZmVDb21wb3NpdGUxNjc4IiAvPjxmZUdhdXNzaWFuQmx1cgogICAgIGluPSJyZXN1bHQ0IgogICAgIHJlc3VsdD0icmVzdWx0MyIKICAgICBzdGREZXZpYXRpb249IjQiCiAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyMTY4MCIgLz48ZmVTcGVjdWxhckxpZ2h0aW5nCiAgICAgcmVzdWx0PSJyZXN1bHQ1IgogICAgIHNwZWN1bGFyRXhwb25lbnQ9IjUiCiAgICAgc3BlY3VsYXJDb25zdGFudD0iMS4xIgogICAgIHN1cmZhY2VTY2FsZT0iMTgiCiAgICAgaWQ9ImZlU3BlY3VsYXJMaWdodGluZzE2ODQiPjxmZURpc3RhbnRMaWdodAogICAgICAgYXppbXV0aD0iMjM1IgogICAgICAgZWxldmF0aW9uPSI1NSIKICAgICAgIGlkPSJmZURpc3RhbnRMaWdodDE2ODIiIC8+PC9mZVNwZWN1bGFyTGlnaHRpbmc+PGZlQ29tcG9zaXRlCiAgICAgaW49InJlc3VsdDMiCiAgICAgazM9IjEuMSIKICAgICBrMj0iMC41IgogICAgIG9wZXJhdG9yPSJhcml0aG1ldGljIgogICAgIHJlc3VsdD0icmVzdWx0NyIKICAgICBpbjI9InJlc3VsdDUiCiAgICAgazE9IjAuNSIKICAgICBpZD0iZmVDb21wb3NpdGUxNjg2IiAvPjxmZUNvbXBvc2l0ZQogICAgIGluPSJyZXN1bHQ3IgogICAgIG9wZXJhdG9yPSJhdG9wIgogICAgIGluMj0iU291cmNlR3JhcGhpYyIKICAgICByZXN1bHQ9InJlc3VsdDgiCiAgICAgaWQ9ImZlQ29tcG9zaXRlMTY4OCIgLz48L2ZpbHRlcj48ZmlsdGVyCiAgIGlua3NjYXBlOm1lbnUtdG9vbHRpcD0iQnJpZ2h0IG1ldGFsbGljIGVmZmVjdCBmb3IgYW55IGNvbG9yIgogICBpbmtzY2FwZTptZW51PSJCZXZlbHMiCiAgIGlua3NjYXBlOmxhYmVsPSJCcmlnaHQgTWV0YWwiCiAgIHN0eWxlPSJjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM6c1JHQiIKICAgaWQ9ImZpbHRlcjE2OTAtMiI+PGZlR2F1c3NpYW5CbHVyCiAgICAgcmVzdWx0PSJyZXN1bHQ2IgogICAgIHN0ZERldmlhdGlvbj0iOCIKICAgICBpbj0iU291cmNlR3JhcGhpYyIKICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxNjcwLTQiIC8+PGZlQ29tcG9zaXRlCiAgICAgaW4yPSJTb3VyY2VHcmFwaGljIgogICAgIGluPSJyZXN1bHQ2IgogICAgIG9wZXJhdG9yPSJ4b3IiCiAgICAgcmVzdWx0PSJyZXN1bHQxMCIKICAgICBpZD0iZmVDb21wb3NpdGUxNjcyLTYiIC8+PGZlR2F1c3NpYW5CbHVyCiAgICAgcmVzdWx0PSJyZXN1bHQyIgogICAgIHN0ZERldmlhdGlvbj0iOCIKICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxNjc0LTMiIC8+PGZlQ29tcG9zaXRlCiAgICAgaW4yPSJTb3VyY2VHcmFwaGljIgogICAgIG9wZXJhdG9yPSJhdG9wIgogICAgIGluPSJyZXN1bHQxMCIKICAgICByZXN1bHQ9InJlc3VsdDkxIgogICAgIGlkPSJmZUNvbXBvc2l0ZTE2NzYtNSIgLz48ZmVDb21wb3NpdGUKICAgICByZXN1bHQ9InJlc3VsdDQiCiAgICAgaW49InJlc3VsdDIiCiAgICAgb3BlcmF0b3I9InhvciIKICAgICBpbjI9InJlc3VsdDkxIgogICAgIGlkPSJmZUNvbXBvc2l0ZTE2NzgtNyIgLz48ZmVHYXVzc2lhbkJsdXIKICAgICBpbj0icmVzdWx0NCIKICAgICByZXN1bHQ9InJlc3VsdDMiCiAgICAgc3RkRGV2aWF0aW9uPSI0IgogICAgIGlkPSJmZUdhdXNzaWFuQmx1cjE2ODAtMiIgLz48ZmVTcGVjdWxhckxpZ2h0aW5nCiAgICAgcmVzdWx0PSJyZXN1bHQ1IgogICAgIHNwZWN1bGFyRXhwb25lbnQ9IjUiCiAgICAgc3BlY3VsYXJDb25zdGFudD0iMS4xMDAwMDAwMiIKICAgICBzdXJmYWNlU2NhbGU9IjE4IgogICAgIGlkPSJmZVNwZWN1bGFyTGlnaHRpbmcxNjg0LTgiPjxmZURpc3RhbnRMaWdodAogICAgICAgYXppbXV0aD0iMjM1IgogICAgICAgZWxldmF0aW9uPSI1NSIKICAgICAgIGlkPSJmZURpc3RhbnRMaWdodDE2ODItMSIgLz48L2ZlU3BlY3VsYXJMaWdodGluZz48ZmVDb21wb3NpdGUKICAgICBrND0iMCIKICAgICBpbj0icmVzdWx0MyIKICAgICBrMz0iMS4xIgogICAgIGsyPSIwLjUiCiAgICAgb3BlcmF0b3I9ImFyaXRobWV0aWMiCiAgICAgcmVzdWx0PSJyZXN1bHQ3IgogICAgIGluMj0icmVzdWx0NSIKICAgICBrMT0iMC41IgogICAgIGlkPSJmZUNvbXBvc2l0ZTE2ODYtMiIgLz48ZmVDb21wb3NpdGUKICAgICBpbj0icmVzdWx0NyIKICAgICBvcGVyYXRvcj0iYXRvcCIKICAgICBpbjI9IlNvdXJjZUdyYXBoaWMiCiAgICAgcmVzdWx0PSJyZXN1bHQ4IgogICAgIGlkPSJmZUNvbXBvc2l0ZTE2ODgtMyIgLz48L2ZpbHRlcj48ZmlsdGVyCiAgIGlua3NjYXBlOmxhYmVsPSJNZXRhbCBDYXN0aW5nIgogICBpbmtzY2FwZTptZW51PSJCZXZlbHMiCiAgIGlua3NjYXBlOm1lbnUtdG9vbHRpcD0iU21vb3RoIGRyb3AtbGlrZSBiZXZlbCB3aXRoIG1ldGFsbGljIGZpbmlzaCIKICAgc3R5bGU9ImNvbG9yLWludGVycG9sYXRpb24tZmlsdGVyczpzUkdCOyIKICAgaWQ9ImZpbHRlcjIzMzAiPjxmZUNvbG9yTWF0cml4CiAgICAgdmFsdWVzPSIwLjM3IgogICAgIHR5cGU9InNhdHVyYXRlIgogICAgIGluPSJTb3VyY2VHcmFwaGljIgogICAgIHJlc3VsdD0icmVzdWx0MSIKICAgICBpZD0iZmVDb2xvck1hdHJpeDIzMjAiIC8+PGZlR2F1c3NpYW5CbHVyCiAgICAgc3RkRGV2aWF0aW9uPSI3IgogICAgIGluPSJTb3VyY2VBbHBoYSIKICAgICBpZD0iZmVHYXVzc2lhbkJsdXIyMzIyIiAvPjxmZVNwZWN1bGFyTGlnaHRpbmcKICAgICBzcGVjdWxhckV4cG9uZW50PSI4IgogICAgIHNwZWN1bGFyQ29uc3RhbnQ9IjMuODgiCiAgICAgc3VyZmFjZVNjYWxlPSIxMCIKICAgICBpZD0iZmVTcGVjdWxhckxpZ2h0aW5nMjMyNiI+PGZlRGlzdGFudExpZ2h0CiAgICAgICBhemltdXRoPSIyMjUiCiAgICAgICBlbGV2YXRpb249IjE3IgogICAgICAgaWQ9ImZlRGlzdGFudExpZ2h0MjMyNCIgLz48L2ZlU3BlY3VsYXJMaWdodGluZz48ZmVDb21wb3NpdGUKICAgICBpbjI9InJlc3VsdDEiCiAgICAgb3BlcmF0b3I9ImF0b3AiCiAgICAgaWQ9ImZlQ29tcG9zaXRlMjMyOCIgLz48L2ZpbHRlcj48L2RlZnM+CiAKPGcKICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgaWQ9ImxheWVyMiIKICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDIiIC8+PGcKICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgaWQ9ImxheWVyNCIKICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDQiIC8+PGcKICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgaWQ9ImxheWVyMSIKICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgIHN0eWxlPSJvcGFjaXR5OjEiPjxnCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIzIgogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAzIj48ZwogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMS43Mjg2NjQ2LDAsMCwyLjA0OTQ0NywtNTE2Ni42NTczLC0xMjM5My4yNzUpIgogICAgICAgc3R5bGU9ImNsaXAtcnVsZTpldmVub2RkO29wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOnVybCgjbGluZWFyR3JhZGllbnQyMjI5LTUpO3N0cm9rZS13aWR0aDoxLjAwNTQxNjYzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpiZXZlbDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5O3NoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247dGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uIgogICAgICAgaWQ9ImczOTctMiI+PHBhdGgKICAgICAgICAgY2xhc3M9ImZpbDAiCiAgICAgICAgIGQ9Im0gOTMyNCw2MjQyIGMgLTEzNDgsMCAtMjQ5Nyw0NzEgLTM0NDcsMTQyOCAtODc3LDg3MCAtMTM0OCwxOTEzIC0xNDIxLDMxMjggbCAtMTQ1NSwzNTkgMTQ0OCwtMTEzIGMgMCwyNyAwLDQ2IDAsNzMgMCwxMzQyIDQ3MiwyNDkxIDE0MjgsMzQ0NyA5NTAsOTUwIDIwOTksMTQyOCAzNDQ3LDE0MjggMTM0MiwwIDI0OTEsLTQ3OCAzNDQ3LC0xNDI4IDIwLC0yMCA0MCwtNDAgNjAsLTYwIGwgMTg0NywxNDY4IC0xNTk0LC0xNzUzIGMgNzQ0LC04ODQgMTExNSwtMTkyMCAxMTE1LC0zMTAyIDAsLTkxMCAtMjE5LC0xNzI3IC02NTAsLTI0NTcgbCAxNTQxLC0yMTg2IC0xOTUzLDE2MDEgYyAtMTEzLC0xMzkgLTIzMywtMjcyIC0zNjYsLTQwNSAtOTU2LC05NTcgLTIxMDUsLTE0MjggLTM0NDcsLTE0MjggeiBtIC00NDM3LDQ3NjkgdiAwIGwgMTQ1NSwtMTIwIC0zNTIsNzY0IGggNzY0IGwgLTk2MywxMzI4IDIwMTIsLTc3NyAtNTMxLDE5OTMgMzY1MywtMzUwNyAtODYzLDE2MTQgMjQ0NCwxOTQ2IGMgLTcsMTMgLTE0LDEzIC0yNywyNyAtODYzLDg2MyAtMTkxOSwxMzAxIC0zMTQ4LDEzMDEgLTEyMjIsMCAtMjI3MiwtNDM4IC0zMTQyLC0xMzAxIC04NjMsLTg3MCAtMTMwMiwtMTkyMCAtMTMwMiwtMzE0OSAwLC00MCAwLC03OSAwLC0xMTkgeiBtIDI4ODMsNDY1IHYgMCAtMzY2IGggLTY4NCBsIDc2NCwtMTE2MiAtMjk0Myw3MzcgYyA5MywtMTA0MiA1MTgsLTE5MzkgMTI4MiwtMjY5NiA4NzAsLTg3MCAxOTIwLC0xMzA5IDMxNDIsLTEzMDkgMTIyOSwwIDIyODUsNDM5IDMxNDgsMTMwOSAxMjAsMTEzIDIyNiwyMzIgMzMyLDM1OCBsIC0zMzAxLDI2OTcgNzg0LC0xNzYwIHogbSAzMzY4LDU5NyB2IDAgbCAyMTM4LC0zMDI4IGMgMzM5LDYyNCA1MDUsMTMyMSA1MTIsMjA4NSAtNywxMDYzIC0zMzIsMTk5MyAtOTc3LDI3ODMgeiIKICAgICAgICAgaWQ9InBhdGgzOTUtMSIKICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6dXJsKCNsaW5lYXJHcmFkaWVudDI2OTApO3N0cm9rZS13aWR0aDoxLjAwNTQxNjYzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpiZXZlbDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIgLz48L2c+PC9nPjwvZz48L3N2Zz4='

    let zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    let img = zip.folder("images");
    img.file("smile.pdf", imgData, { base64: true });

    zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        console.log('content', content)
        let link = document.createElement('a')
        let url = window.URL || window.webkitURL;
        link.href = url.createObjectURL(content) 
        link.download = 'test.zip'
        link.click()
        //saveAs(content, "example.zip");
    });*/

    return (
        <Form
            form={props.form}
            name="DocumentsForm"
            onFinish={onFinish}
            scrollToFirstError
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => { setState(Object.assign({}, state, { ...allValues, })) }}
        >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8}> <b>От: </b></Col> <Col span={16}>{props?.initialValues?.documents[0].fio}</Col>
                <Col span={8}><b>Должность: </b></Col> <Col span={16}>{props?.initialValues?.documents[0].position}</Col>
                <Col span={8}><b>Тип договора: </b></Col> <Col span={16}>Закуп ТРУ</Col>
            </Row>

            <Divider type={'horizontal'} />

            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Наименование ТРУ: </b></Col> <Col span={16}>{state.title}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Поставщик ТРУ: </b></Col> <Col span={16}>{state.supllier}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Основание: </b></Col> <Col span={16}>{state.subject}</Col>
                </Row>
            </div>
            <div className='form-item-wrap'>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}><b>Общая сумма договора: </b></Col> <Col span={16}>{state.price}</Col>
                </Row>
            </div>
            
            <Divider type={'horizontal'} />

            {
            /* <Form.Item
                name="files"
                className='font-form-header'
                label="Файлы"
                labelCol={{ span: 24 }}
            >
                <UploadFile
                    showUploadList={true}
                    action={"https://" + constants.host + ":" + constants.port + "/document-control/orders"}
                    multiple={true}
                    maxCount={50}
                    accept={".doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,*.pdf"}
                    onChange={(info) => {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                            console.log('info.file', info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} - загружен успешно.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} - ошибка при загрузке.`);
                        }
                    }}
                />
            </Form.Item> */
            }

            <Collapse defaultActiveKey={['2']} onChange={callback}>
                <Panel header={<b>Прикреплённые файлы</b>} key="2">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        {props?.initialValues?.documents[0].files.map((item) => {
                            return (<>
                                <Col span={12} className='document-view-wrap'>
                                    <Link><a data-fileid={item.id} onClick={download}>{item.filename}</a></Link>
                                    <Button onClick={() => { OpenDocument(item) }} shape="circle" icon={<EyeOutlined />} /> <br />
                                </Col>
                            </>)
                        })}
                    </Row>
                </Panel>
            </Collapse>
            <Divider type={'horizontal'} />
            {/* <Button onClick={() => { console.log('test') }}>Download Pdf</Button> */}
            <Form.Item
                className='font-form-header'
                name="signatures"
                label="Подписи"
                labelCol={{ span: 24 }}
            >
                {props?.initialValues?.documents[0].signatures.map((item) => {  //remove commentsList
                    return (<>
                        <div className='signature-view-wrap'>
                            <span className='signature-view-position'>
                                {item.position}
                            </span>
                            <span className='signature-view-username'>
                                {item.fio}
                            </span>
                            <span className='signature-view-date'>
                                {formatDate(item.date_signature)}
                            </span>
                        </div>
                    </>)
                })}
                <Steps
                    labelPlacement="vertical"
                    size="small"
                    direction={stepsDirection.current}
                    responsive={true}
                    current={stepCount.step - 1}
                    className="steps-form-update">
                    {
                        routesList.map((item) => {
                            return (
                                <Step title={item.positionName} />
                            )
                        })
                    }
                </Steps>
            </Form.Item>
            <Row>
                <Col span={24}>
                    <Divider type={'horizontal'} />
                    <ApproveConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                    <Divider type={'vertical'} />
                    <Space>
                        <Divider type={'vertical'} />
                        <ReturnToSenderConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                        <ReturnStepBackConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                        <Divider type={'vertical'} />
                        <RejectConfirm reasonText={reasonText} dataProps={props} setState={setState} user={user} />
                    </Space>
                </Col>
                <Col span={24} className="marginTop">
                    <Button onClick={props.modalCancelHandler}>
                        Отменить
                    </Button>
                    <Divider type={'vertical'} />
                    <Button onClick={props.modalEnableEditHandler}>
                        Редактировать
                    </Button>
                </Col>
            </Row>

            <Divider type={'horizontal'} />

            <Form.Item
                className='font-form-header'
                name="reason"
                label="Замечание"
                labelCol={{ span: 24 }}
            >
            </Form.Item>
            <div>
                <Input
                    disabled={props.disabled}
                    onChange={ReasonInputChange}
                    placeholder="Замечание" />
                {props?.initialValues?.documents[0]?.reason?.map((item) => {
                    return (<span>
                        <span>{item.text + '-' + item.userPosition}</span><br />
                    </span>
                    )
                })}
            </div>

            <Divider type={'horizontal'} />

            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header="Созданные мною поручения по данному договору" key="1">
                    {/* <Button title={'Создать новое поручение по данному договору'} onClick={() => { setVisible(true) }} icon={<PlusOutlined />} /> */}
                    <TasksTableContainer
                        data={{ dict, records: props.documentTasksList }}
                        visibleModalUpdate={visibleModalUpdate}
                        GQL={DocumentTasks}
                        title={TasksTitleMenu}
                    />
                </Panel>
            </Collapse>

            <Divider type={'horizontal'} />
            <Form.Item
                className='font-form-header'
                name="comments"
                label="Комментарии"
                labelCol={{ span: 24 }}
            >
                <Input.TextArea rows={7} name='comment' onChange={props.HandleCommentOnChange} disabled={props.disabled} />
                <Button disabled={props.disabled} onClick={() => { props.HandleComment(props.form) }} className="marginTop">Оставить комментарий</Button>
                {props.commentsList.map((item) => {
                    return (
                        <div className='comments'>
                            <li className='comment-item'>
                                <span className='user-position-comment'>{item.position}</span>
                                <span className='user-name-comment'> ({item.fio}) </span>
                                <span className='user-date-time-comment'>{item.date}</span><br />
                                <span className='comment'>{item.comment}</span>
                            </li>
                        </div>

                    )
                })}
            </Form.Item>
            <Form.Item
                name="date_created"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="route_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="status_id"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="step"
                hidden={true}
            >
            </Form.Item>
            <Form.Item
                name="log_username"
                hidden={true}
            >
            </Form.Item>
        </Form>
    )
});

export default Update1;