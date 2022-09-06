import { Form, Input, Collapse } from "antd";
import TasksTableContainer from "./../OnApprovalDocuments/tableContainers/TasksTableContainer";

/**
 * Фрагмент antd для вывода поручений по документам
 * @param dict
 * @param documentTasksList
 * @param visibleModalUpdate
 * @param DocumentTasks
 * @param TasksTitleMenu
 * @example
 *      //Пример использования компонента
        <FragmentTaskList
                    dict={dict}
                    documentTasksList={props.documentTasksList}
                    visibleModalUpdate={visibleModalUpdate}
                    DocumentTasks={DocumentTasks}
                    TasksTitleMenu={TasksTitleMenu}
        />
*/
export const FragmentTaskList = (props) => {
	const { dict } = props;
	return (
		<>
			<Collapse defaultActiveKey={["1"]} onChange={callback}>
				<Panel header="Созданные мною поручения по данному договору" key="1">
					<TasksTableContainer
						data={{
							dict,
							records: props.documentTasksList,
						}}
						visibleModalUpdate={props.visibleModalUpdate}
						GQL={props.DocumentTasks}
						title={props.TasksTitleMenu}
					/>
				</Panel>
			</Collapse>
		</>
	);
};

const { Panel } = Collapse;

//collapse
function callback(key) {
	// console.log(key);
}
