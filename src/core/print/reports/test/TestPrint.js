import React, { useEffect, useState } from "react"
import { Card, Row, Col } from "antd"
import "./TestPrint.css"
import QRCode from "qrcode"

const TestPrint = React.forwardRef((props, ref) => {

    let [qrCodeState, setQrCodeState] = useState('')

    let documentData = {
        documents: [
            {
                data_one: [
                    {
                        document_id: 255,
                        id: '9',
                        price: 1212,
                        subject: 'Form1 N1 subject',
                        supllier: 'Form1 N1 supllier'
                    }
                ],
                date_created: '2022-04-29 16:39:42',
                date_modified: '2022-04-29T16:41:04.649069'
            }
        ]
    }

    let generateQRCode = async () =>{
        const opts = {
            errorCorrectionLevel: "M",
            type: "image/png",
            quality: 0.92,
            margin: 1,
        };

        // let text = `Лист согласования от: ${props?.printData?.documentData?.documents[0]?.fio}`
        let text = `Тип договора: Лист согласования на реализацию готовой продукции
        Наименование ТРУ: ${props?.printData?.documentData?.documents[0]?.title},
        Поставщик ТРУ: ${props?.printData?.documentData?.documents[0]?.data_one[0]?.supllier},
        Основание: ${props?.printData?.documentData?.documents[0]?.data_one[0]?.subject},
        Общая сумма договора: ${props?.printData?.documentData?.documents[0]?.data_one[0]?.price},
        `
        let qr = await QRCode.toDataURL(text, opts)

        setQrCodeState(qr)
    }

    generateQRCode()
    console.log(props?.printData?.documentData?.documents[0].reason);
    return (
        <div ref={ref}>
        <div className="page">
            <div style={{ paddingLeft: '25px', paddingRight: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: "10px" }}>
                    <h2><b>ЛИСТ СОГЛАСОВАНИЯ</b></h2>
                    <b>к договору No_____________ от ____________ 2022г.</b>
                </div>
                <div>
                    <div style={{ marginBottom: "10px" }}>
                        <b>Предмет договора:</b> Закуп ТРУ
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <b>Поставщик ТРУ:</b> {props?.printData?.documentData?.documents[0]?.data_one[0]?.supllier}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <b>Наименование ТРУ:</b> {props?.printData?.documentData?.documents[0]?.title}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <b>Основание:</b> {props?.printData?.documentData?.documents[0]?.data_one[0]?.subject}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <b>Общая сумма договора:</b> {props?.printData?.documentData?.documents[0]?.data_one[0]?.price}
                    </div>
                </div>
                <div className='subpagepage'>
                    <Row style={{ marginTop: "30px" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

                        <table border='1'>
                            <tr>
                                <th>
                                    <b>Наименование должности (под-разделения)</b>
                                </th>
                                <th>
                                    <b>-согласовано;
                                        - не согласова-но;
                                        - согласовано с замечаниями
                                    </b>
                                </th>
                                <th>
                                    <b>Расшифровка подписи</b>
                                </th>
                                <th>
                                    <b>Дата согласования</b>
                                </th>
                            </tr>
                            {props?.printData?.documentData?.documents[0].signatures?.map((item) => {
                                let date = item.date_signature.match(/.{10}/)
                                let date_signature = date[0]
                                return (
                                    <>
                                        <tr style={{ textAlign: 'center' }}>
                                            <td>{item.position}</td>
                                            <td>Согласовано</td>
                                            <td>{item.fio}</td>
                                            <td>{date_signature}</td>
                                        </tr>
                                    </>
                                )
                            })}
                        </table>

                    </Row>
                    <div style={{ paddingTop: '20px' }}>
                        <b>Исполнитель:</b> {props?.printData?.documentData?.documents[0]?.position}, {props?.printData?.documentData?.documents[0]?.fio} <br />
                        <b>Телефоны исполнителя:</b> _________________ <br />
                        <b>Полученный сторонами оригинал договора получен:</b> _________________
                    </div>
                </div>
            </div>
            <div className="qr-container">
                <img src={qrCodeState} className="qr-code"/>
            </div>
        </div>
        <div className="page">
            <div style={{ paddingLeft: '25px', paddingRight: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: "10px" }}>
                    <h2><b>Замечания</b></h2>
                    <b>к договору No_____________ от ____________ 2022г.</b>
                </div>
                <div>
                <ul>{props?.printData?.documentData?.documents[0]?.reason.map((reasonsItem)=>
                    <>
                    <li>'{reasonsItem.text}'</li>
                    <li>{reasonsItem.userFio}&nbsp;&nbsp;:&nbsp;&nbsp;{reasonsItem.userPosition}&nbsp;</li>
                    </>
                    )}</ul>  
                </div>

            </div>
            <div className="qr-container">
                <img src={qrCodeState} className="qr-code"/>
            </div>
        </div>
        </div>
    )
})
export default TestPrint;