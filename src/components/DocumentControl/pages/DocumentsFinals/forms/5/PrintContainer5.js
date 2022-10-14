import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";

import "antd/dist/antd.css";

import PrintForm5 from "./PrintForm5";

function PrintContainer5(documentData) {
	let componentRef = useRef();
	const [printData, setPrintData] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);
	const onBeforeGetContentResolve = useRef();
	//console.log('documentData', documentData)
	const handleOnBeforeGetContent = () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				setPrintData(documentData);
				onBeforeGetContentResolve.current = resolve;
				setDataLoaded(true);
			}, 100);
		});
	};

	const handlePrint = useReactToPrint({
		content: () => {
			const extra = componentRef.current.cloneNode(true);
			const PrintElem = document.createElement("div");
			{
				/*const header =
                `<div class="page-header"><p>I'm The header</p></div>` +
                `<div class="page-footer"><p>I'm The Footer</p></div>`;
            PrintElem.innerHTML = header;*/
			}
			PrintElem.appendChild(extra);
			return PrintElem;
		},
		onBeforeGetContent: handleOnBeforeGetContent,
	});

	useEffect(() => {
		if (dataLoaded) {
			// Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
			onBeforeGetContentResolve.current();
			setDataLoaded(false);
		}
	}, [dataLoaded, onBeforeGetContentResolve]);

	return (
		<div>
			<span style={{ display: "none" }}>
				<PrintForm5 ref={componentRef} printData={printData} />
			</span>
			<Button onClick={handlePrint}>
				Получить файл согласованного договора
			</Button>
		</div>
	);
}

export default PrintContainer5;
