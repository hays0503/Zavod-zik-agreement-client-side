// import JSZip from "jszip";

// const DonwloadMultipleZip = async (data, zipFilename) => {	

// 	let url = window.URL || window.webkitURL;
// 	let tmp = [];

// 	await fetch("/get-file", {
// 		method: "POST",
// 		body: JSON.stringify({ id: data[0].id }),
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	})
// 		.then((response) => {
// 			return response.json();
// 		})
// 		.then((response) => {
// 			let result = response.result;
// 			tmp.push({ filename: result.filename, blob: result.data_file });
// 		});

// 	let zip = new JSZip();
// 	//console.log('tmp',tmp)
// 	for (let i = 0; i < tmp.length; i++) {
// 		zip.file(tmp[i].filename, tmp[i].blob);
// 	}
// 	//zip.file("Hello.txt", "Hello World\n");
// 	//let img = zip.folder("images");
// 	//img.file("smile.pdf", imgData, { base64: true });

// 	zip.generateAsync({ type: "blob" }).then(function (content) {
// 		// see FileSaver.js
// 		//console.log("content", content);
// 		let link = document.createElement("a");
// 		link.href =
// 			url.createObjectURL(
// 				content
// 			); /*result.data_file.slice(result.data_file.indexOf(',')+1) */
// 		link.download = zipFilename;
// 		link.click();
// 		//saveAs(content, "example.zip");
// 	});

// 	function dataURIToBlob(dataURI) {
// 		dataURI = dataURI.replace(/^data:/, "");

// 		const type = dataURI.match(/image\/[^;]+/);
// 		const base64 = dataURI.replace(/^[^,]+,/, "");
// 		const arrayBuffer = new ArrayBuffer(base64.length);
// 		const typedArray = new Uint8Array(arrayBuffer);

// 		for (let i = 0; i < base64.length; i++) {
// 			typedArray[i] = base64.charCodeAt(i);
// 		}

// 		return new Blob([arrayBuffer], { type });
// 	}

// 	const convertBlobToBase64 = (blob) =>
// 		new Promise((resolve, reject) => {
// 			//blob to base64
// 			const reader = new FileReader();
// 			reader.onerror = reject;
// 			reader.onload = () => {
// 				resolve(reader.result);
// 			};
// 			reader.readAsDataURL(blob);
// 		});
// 	//const base64String = await convertBlobToBase64(blob); executed as f

// 	function base64toBlob(base64Data, contentType) {
// 		contentType = contentType || "";
// 		var sliceSize = 1024;
// 		var byteCharacters = atob(base64Data);
// 		var bytesLength = byteCharacters.length;
// 		var slicesCount = Math.ceil(bytesLength / sliceSize);
// 		var byteArrays = new Array(slicesCount);

// 		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
// 			var begin = sliceIndex * sliceSize;
// 			var end = Math.min(begin + sliceSize, bytesLength);

// 			var bytes = new Array(end - begin);
// 			for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
// 				bytes[i] = byteCharacters[offset].charCodeAt(0);
// 			}
// 			byteArrays[sliceIndex] = new Uint8Array(bytes);
// 		}
// 		return new Blob(byteArrays, { type: contentType });
// 	}
// };

// export default DonwloadMultipleZip;
