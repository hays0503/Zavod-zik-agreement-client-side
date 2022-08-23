import { useUser } from "../../../../core/functions";


/**
 * Считать из б/д(поручение) и открыть для просмотра 
 * @param item id документа
 */
export const TaskFileOpenDocument = async (item) => {

    let user = useUser();

    // setBtnLoad(true)
    console.log("PROPS", item.id)
    // console.log('RECORD',props.record)
    const tmp = await fetch('/api/tasks_files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { user: Number(user.id), item: item.id }
        )
    })
    const content = await tmp.json();
    if (content !== undefined) {
        console.log("RESULT", content)
    }
}
/**
 * Скачать файл(поручение) из б/д
 */
export const TaskFileDownload = async (e) => {
    await fetch("/get-tasks-file", {
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
/**
 * Считать из б/д и открыть для просмотра 
 * @param item id документа
 */
export const FileOpenDocument = async (item) => {
    let user = useUser();

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
/**
 * Скачать файл из б/д
 */
export const FileDownload = async (e) => {
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