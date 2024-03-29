import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";

import "antd/dist/antd.css";

import PrintForm2 from "./PrintForm2";

function PrintContainer2(documentData) {
	let componentRef = useRef();
	const [printData, setPrintData] = useState(documentData);
	const [dataLoaded, setDataLoaded] = useState(false);
	const onBeforeGetContentResolve = useRef();
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
			{printData ? (
				<span style={{ display: "none" }}>
					<PrintForm2 ref={componentRef} printData={documentData} />
				</span>
			) : null}
			<Button onClick={handlePrint}>
				Получить файл согласованного договора
			</Button>
		</div>
	);
}

export default PrintContainer2;
