import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'antd'
import QRCode from 'qrcode'
import './TestPrint.css'

const PrintForm5 = React.forwardRef((props, ref) => {
  const [qrCodeState, setQrCodeState] = useState('')

  const documentData = {
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

  const generateQRCode = async () => {
    const opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    }
    // let text = `Лист согласования от: ${props?.printData?.documentData?.documents[0]?.fio}`
    const text = `Тип договора: Лист согласования на закуп ТРУ для внутризаводских нужд и капитальных затрат
        Наименование: ${props?.printData?.documentData?.documents[0]?.title},
        Примечание: ${props?.printData?.documentData?.documents[0]?.data_custom[0]?.remark},
        Основание: ${props?.printData?.documentData?.documents[0]?.data_custom[0]?.subject},
        `

    const qr = await QRCode.toDataURL(text, opts)

    setQrCodeState(qr)
  }

  generateQRCode()

  return (
        <div ref={ref} style={{ margin: 20 }}>
            <div style={{ paddingLeft: '25px', paddingRight: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h2><b>ЛИСТ СОГЛАСОВАНИЯ</b></h2>
                    <b>к договору No_____________ от ____________ 2022г.</b>
                </div>
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <b>Тип договора:</b> Другой
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <b>Наименование:</b> {props?.printData?.documentData?.documents[0]?.title}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <b>Примечание:</b> {props?.printData?.documentData?.documents[0]?.data_custom[0]?.remark}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <b>Основание:</b> {props?.printData?.documentData?.documents[0]?.data_custom[0]?.subject}
                    </div>
                </div>
                <div className='subpagepage'>
                    <Row style={{ marginTop: '30px' }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

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
                              const date = item.date_signature.match(/.{10}/)
                              const date_signature = date[0]
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
                <img src={qrCodeState} className="qr-code" />
            </div>
        </div>
  )
})
export default PrintForm5
