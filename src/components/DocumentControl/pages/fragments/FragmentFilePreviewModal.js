import { Alert, Button, Spin } from "antd";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../../../../../src/pdf.css";

//pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
//pdfjs.GlobalWorkerOptions.workerSrc = `192.168.0.34:8445/cdn/pdf.worker.min.js`
/**
 * `FragmentFilePreviewModal` Возвращает iframe с файл превью
 *
 */
export const FragmentFilePreviewModal = (props) => {
	return (
		<>
			{props.isLoadOpen ? (
				<div
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						translate: "-50% -50%",
						zIndex: "2000",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
					}}
				>
					<div
						style={{
							position: "fixed",
							top: "50%",
							left: "50%",
							translate: "-50% -50%",
							zIndex: "2002",
							width: "40%",
						}}
					>
						<Spin spinning={props.isLoadOpen}>
							<Alert
								message="В процессе....."
								description="Скачиваю и открываю для вас файл...."
								type="info"
							/>
						</Spin>
					</div>
				</div>
			) : null}
			{props.isModalOpen ? (
				<div
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						translate: "-50% -50%",
						zIndex: "2001",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
					}}
				>
					<div>
						<Button
							style={{ position: "fixed", top: "1%", left: "90%" }}
							onClick={() => {
								props.setIsModalLoad(false);
								props.setIsModalOpen(!props.isModalOpen);
							}}
						>
							Закрыть
						</Button>
						<div
							dangerouslySetInnerHTML={{
								__html: `
					<iframe title=${props.refFilePreview?.result?.filename}
					src=${props.refFilePreview?.result?.data}
					style="position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 2002;width: 90%;height: 90%;" />`,
							}}
						/>
					</div>
				</div>
			) : null}
		</>
	);
};

/**
 * `FragmentFilePreviewModal` Возвращает iframe с файл превью
 *
 */
export const FragmentFilePreviewModalPDF = (props) => {
	const [numPages, setNumPages] = useState(null);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}
	return (
		<>
			{props.isLoadOpen ? (
				<div
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						translate: "-50% -50%",
						zIndex: "2000",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
					}}
				>
					<div
						style={{
							position: "fixed",
							top: "50%",
							left: "50%",
							translate: "-50% -50%",
							zIndex: "2002",
							width: "40%",
						}}
					>
						<Spin spinning={props.isLoadOpen}>
							<Alert
								message="В процессе....."
								description="Скачиваю и открываю для вас файл...."
								type="info"
							/>
						</Spin>
					</div>
				</div>
			) : null}
			{props.isModalOpen ? (
				<div
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: "2001",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
					}}
				>
					<Button
						style={{ position: "fixed", top: "1%", left: "90%" }}
						onClick={() => {
							props.setIsModalLoad(false);
							props.setIsModalOpen(!props.isModalOpen);
						}}
					>
						Закрыть
					</Button>
					<div
						style={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: "2002",
							overflowY: "auto",
							scrollBehavior: "auto",
							maxHeight: "95%",
							//width: "1000px",
						}}
					>
						<Document
							file={props.refFilePreview?.result?.data}
							renderMode={"canvas"}
							onLoadSuccess={onDocumentLoadSuccess}
							// scale={1.5}
						>
							{Array.from(new Array(numPages), (el, index) => (
								<Page
									key={`page_${index + 1}`}
									className={"MarginBottom"}
									pageNumber={index + 1}
									width={1200}
								/>
							))}
						</Document>
					</div>
				</div>
			) : null}
		</>
	);
};
