import React, { useEffect, useState } from "react";
import { Row } from "antd";
import "./TestPrint.css";
import QRCode from "qrcode";
import { printReasons } from "./../../../../../../core/print/reports/test/PrintComponents";

const PrintForm3 = React.forwardRef((props, ref) => {
  const [QRCodeState, setQRCodeState] = useState();
  const generateQRCode = async () => {
    const opts = {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
    };

    let text = `Тип договора: Лист согласования на закуп ТРУ для производства и продукции
        Наименование контрагента: ${props?.printData?.documentData?.title},
        Предмет договора: ${props?.printData?.documentData?.data_agreement_list_production[0]?.subject},
        Общая сумма договора: ${props?.printData?.documentData?.data_agreement_list_production[0]?.price},
        Валюта платежа: ${props?.printData?.documentData?.data_agreement_list_production[0]?.currency},
        Наименование подразделения, фамилия ответственного исполнителя: ${props?.printData?.documentData?.data_agreement_list_production[0]?.executor_name_division},
        Телефон исполнителя: ${props?.printData?.documentData?.data_agreement_list_production[0]?.executor_phone_number}
        Контакты контрагента: ${props?.printData?.documentData?.data_agreement_list_production[0]?.counteragent_contacts}
        `;

    setQRCodeState(await QRCode.toDataURL(text));
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div ref={ref}>
      {/*Начало Лист Согласования */}
      <div className="page">
        <div style={{ paddingLeft: "25px", paddingRight: "30px" }}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2>
              <b>ЛИСТ СОГЛАСОВАНИЯ</b>
            </h2>
            <b>к договору No_____________ от ____________ 2022г.</b>
          </div>
          <div>
            <div style={{ marginBottom: "10px" }}>
              <b>Тип договора:</b> Лист согласования на закуп ТРУ для
              производства и продукции
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Наименование контрагента:</b>{" "}
              {props?.printData?.documentData?.title}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Предмет договора:</b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.subject
              }
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Общая сумма договора:</b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.price
              }
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Валюта платежа:</b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.currency
              }
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>
                Наименование подразделения, фамилия ответственного исполнителя:
              </b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.executor_name_division
              }
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Телефон исполнителя:</b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.executor_phone_number
              }
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Контакты контрагента:</b>{" "}
              {
                props?.printData?.documentData
                  ?.data_agreement_list_production[0]?.counteragent_contacts
              }
            </div>
          </div>
          <div className="subpagepage">
            <Row
              style={{ marginTop: "30px" }}
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <table border="1">
                <tr>
                  <th>
                    <b>Наименование должности (под-разделения)</b>
                  </th>
                  <th>
                    <b>
                      -согласовано; - не согласова-но; - согласовано с
                      замечаниями
                    </b>
                  </th>
                  <th>
                    <b>Расшифровка подписи</b>
                  </th>
                  <th>
                    <b>Дата согласования</b>
                  </th>
                </tr>
                {props?.printData?.documentData?.signatures?.map((item) => {
                  let date = item.date_signature.match(/.{10}/);
                  let date_signature = date[0];
                  return (
                    <>
                      <tr style={{ textAlign: "center" }}>
                        <td>{item.position}</td>
                        <td>Согласовано</td>
                        <td>{item.fio}</td>
                        <td>{date_signature}</td>
                      </tr>
                    </>
                  );
                })}
              </table>
            </Row>
            <div style={{ paddingTop: "20px" }}>
              <b>Исполнитель:</b> {props?.printData?.documentData?.position},{" "}
              {props?.printData?.documentData?.fio} <br />
              <b>Телефоны исполнителя:</b> _________________ <br />
              <b>Полученный сторонами оригинал договора получен:</b>{" "}
              _________________
            </div>
          </div>
        </div>
        <div className="qr-container">
          <img src={QRCodeState} className="qr-code" />
        </div>
      </div>
      {/*Конец Лист Согласования */}

      {/*Начало Лист Замечаний */}
      {printReasons(props?.printData?.documentData?.reason)}
      {/*Конец Лист Замечаний */}
    </div>
  );
});
export default PrintForm3;
