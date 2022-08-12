import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


const GenericPdfDownloader = ( rootElementId, downloadFileName ) => {
    const input = rootElementId;
    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p', // landscape
                unit: 'mm', // points, pixels won't work properly
                format: [240, 297] // set needed dimensions for any element
            });
            console.log('canvas', canvas.width, canvas.height);
            console.log('canvas2', canvas.style.width, canvas.style.height);
            console.log('canvas3 div', input.offsetWidth, input.offsetHeight);
            pdf.addImage(imgData, 'JPEG', 0,0);
            pdf.save(`${downloadFileName}.pdf`);
        })
}

export default GenericPdfDownloader;