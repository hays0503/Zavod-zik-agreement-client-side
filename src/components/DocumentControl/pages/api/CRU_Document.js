import { useUser } from "../../../../core/functions";

/**
 * Считать из б/д(поручение) и открыть для просмотра
 * @param item id документа
 */
export const TaskFileOpenDocument = async (item) => {
	const tmp = await fetch("/api/tasks_files", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ item: item.id }),
	});
	const content = await tmp.json();
	if (content !== undefined) {
		return await content;
		//console.log("RESULT", content)
	}
};

/**
 * Скачать файл(поручение) из б/д
 */
export const TaskFileDownload = async (e) => {
	await fetch("/get-tasks-file", {
		method: "POST",
		body: JSON.stringify({ id: e.target.dataset.fileid }),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.then((response) => {
			let result = response.result;
			let link = document.createElement("a");
			link.href = result.data_file;
			link.download = result.filename;
			link.click();
		});
};
/**
 * Считать из б/д и открыть для просмотра
 * @param item id документа
 */
export const FileOpenDocument = async (item) => {
	const tmp = await fetch("/api/files", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ item: item.id }),
	});
	const content = await tmp.json();
	if (content !== undefined) {
		return await content;
	}
};
/**
 * Скачать файл из б/д
 */
export const FileDownload = async (e) => {
	await fetch("/get-file", {
		method: "POST",
		body: JSON.stringify({ id: e.target.dataset.fileid }),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.then((response) => {
			let result = response.result;
			let link = document.createElement("a");
			link.href = result.data_file;
			link.download = result.filename;
			link.click();
		});
};

/**
 * Считать из б/д(поручение) и открыть для просмотра
 * @param item id документа
 */
export const GetIDNameTaskFile = async (item) => {
	const tmp = await fetch("/api/tasks_files_is_add_to_document", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ item: item }),
	});
	const content = await tmp.json();
	if (content !== undefined) {
		//console.log("RESULT", content);
	}
	return await content;
};
