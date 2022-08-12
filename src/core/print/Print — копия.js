import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";

import "antd/dist/antd.css";

import TestPrint from "./reports/test/TestPrint"


function Print(printData, documentData) {
    let componentRef = useRef();
    const handlePrint = useReactToPrint({
        //content: () => componentRef.current
        content: () => {
            const extra = componentRef.current.cloneNode(true);
            const PrintElem = document.createElement('div');
            {/*const header =
                `<div class="page-header"><p>I'm The header</p></div>` +
                `<div class="page-footer"><p>I'm The Footer</p></div>`;
            PrintElem.innerHTML = header;*/}
            PrintElem.appendChild(extra);
            return PrintElem;
        },
    });
    let data = {
        title: { value: 'Тестовая печатная форма', label: 'Заголовок' },
        fio: { value: 'Иванов Иван Петрович', label: 'ФИО' },
        agreement: { value: "Поставка оборудования", label: 'Договор'},
        date: { value: "12.02.2022", label: 'Дата'}
    }
    window.sessionStorage['data'] = JSON.stringify(data)

    console.log('documentData1111', documentData)

    return (
        <div>
            <span style={{ display: "none" }}>
                <TestPrint ref={componentRef} printData={printData} />
            </span>
            <Button onClick={handlePrint}>Печать</Button>
            <Button onClick={() => { console.log(printData) }}>Log</Button>
        </div>
    );
}

export default Print;
