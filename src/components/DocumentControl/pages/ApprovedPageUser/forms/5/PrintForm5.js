import React, { useEffect, useState } from "react";
import { Row } from "antd";
import QRCode from "qrcode";
import "./TestPrint.css";
import { printReasons } from "./../../../../../../core/print/reports/test/PrintComponents";

const PrintForm5 = React.forwardRef((props, ref) => {
  const [QRCodeState, setQRCodeState] = useState();

  const generateQRCode = async () => {
    const opts = {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
    };

    let text = `
		Наименование: ${props?.printData?.documentData?.title},
        Примечание: ${props?.printData?.documentData?.data_custom[0]?.remark},
        Основание: ${props?.printData?.documentData?.data_custom[0]?.subject},
		${props?.printData?.documentData?.data_custom[0]?.custom_area?.map((item) => {
      return `${item.key} ${item.data}`;
    })}
        `;

    setQRCodeState(await QRCode.toDataURL(text));
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div ref={ref}>
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
              <b>Наименование:</b> {props?.printData?.documentData?.title}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Примечание:</b>
              {props?.printData?.documentData?.data_custom[0]?.remark}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Основание:</b>
              {props?.printData?.documentData?.data_custom[0]?.subject}
            </div>
            {props?.printData?.documentData?.data_custom[0]?.custom_area?.map(
              (item) => {
                return (
                  <>
                    <div style={{ marginBottom: "10px" }}>
                      <b>{`${item.key}: `}</b>
                      {`${item.data}`}
                    </div>
                  </>
                );
              }
            )}
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
export default PrintForm5;
