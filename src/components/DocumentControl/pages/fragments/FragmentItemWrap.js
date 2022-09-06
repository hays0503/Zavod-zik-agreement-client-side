import { Row, Col } from 'antd';


/**
 * Фрагмент antd обёртка
 * @param children Принимает потомка и встраивает в строку
 */
 export const FormWrap = (props) =>{
    return (
        <div className='form-item-wrap'>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {props.children}
        </Row>
    </div>
    )
}


/**
 * Фрагмент antd вёрстки для вывода текста
 * @param Title Строка с Наименованием
 * @param Text Строка с Текстом
 */
export const FormItem = (Title,Text) =>{
    return (Title !==undefined && Text !==undefined) ?
    <>
        <Col span={8}> 
            <b>{Title}</b>
        </Col>
        <Col span={16}>
            {Text}
        </Col>
    </> : null
    
}