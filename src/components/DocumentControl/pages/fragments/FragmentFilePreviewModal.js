import { Alert, Button, Spin } from "antd";

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
					</div>{" "}
				</div>
			) : null}
		</>
	);
};
