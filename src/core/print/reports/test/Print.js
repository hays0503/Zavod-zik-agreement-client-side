import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";

import "antd/dist/antd.css";

// import TestPrint from "./reports/test/TestPrint"
// import TestPrint2 from "./reports/test/TestPrint2"
import TestPrint2 from "./TestPrint2";
import TestPrint from "./TestPrint";


function Print(documentData) {
    let componentRef = useRef();
    const [printData, setPrintData] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const onBeforeGetContentResolve = useRef();
    console.log('documentData', documentData)
    const handleOnBeforeGetContent = () => {
        return new Promise((resolve) => {
            setTimeout(()=>{
                setPrintData(documentData)
                onBeforeGetContentResolve.current = resolve;
                setDataLoaded(true);
            },100)

        });
    };
    

    const handlePrint = useReactToPrint({
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
        onBeforeGetContent: handleOnBeforeGetContent
    });

    useEffect(() => {
        if (dataLoaded) {
            // Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
            onBeforeGetContentResolve.current();
            setDataLoaded(false)
        }
    }, [dataLoaded, onBeforeGetContentResolve]);
    debugger
    return (
        <div>
            {
                (documentData?.documents[0]?.route_id?.id==10)?
                <>
                <span style={{ display: "none" }}>
                <TestPrint ref={componentRef} printData={printData} />
                </span>
                <Button onClick={handlePrint}>Печать</Button>
                </>
                :''
            }
            {/* {
                (documentData?.documents[0]?.route_id?.id==11)?
                <>
                <span style={{ display: "none" }}>
                <TestPrint2 ref={componentRef} printData={printData} />
                </span>
                <Button onClick={handlePrint}>Печать</Button>
                </>
                :''
            } */}
            
        </div>
    );
}

export default Print;
