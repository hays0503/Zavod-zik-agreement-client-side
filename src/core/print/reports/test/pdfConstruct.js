import React from "react"
import {fs} from "fs"
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'


// const assets = {
//     sweet_mavka_script: fs.readFileSync('../../../../../public/SweetMavkaScript.ttf'),
//   };

/**
 * Сокращение для нахождение центра на странице или в блоке
 * @constructor
 * @param {Int} widthOrheight - Ожидается что пользователь передаст высоту или ширину
 * @param {Int} aliase - Ожидается что пользователь передаст смещение относительно высоты или ширины
 */
const centerPage = (widthOrheight,aliase) => {
    return (widthOrheight/2) - (aliase/2)
}


export async function createPdf() {

    const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
    const fontBytes = await fetch(url).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.create()


    pdfDoc.registerFontkit(fontkit)
    const customFont = await pdfDoc.embedFont(fontBytes)

    const page = pdfDoc.addPage()

    const { width, height } = page.getSize()
////////////////////ЛИСТ СОГЛАСОВАНИЯ////////////////////////////
    let text = 'ЛИСТ СОГЛАСОВАНИЯ'
    const textSizeLarge = 35
    let textWidth = customFont.widthOfTextAtSize(text, textSizeLarge)
    let textHeight = customFont.heightAtSize(textSizeLarge)

    page.drawText(text, {
    x: centerPage(width,textWidth),
    y: centerPage(height,textHeight),
    size: textSizeLarge,
    font: customFont,
    color: rgb(0, 0.53, 0.71),
    })
//////////////////////////////////////////////////////////////////

///////////к договору No_____________ от ____________ 2022г./////
text = 'к договору No_____________ от ____________ 2022г.'
const textSizeSmall = 16
textWidth = customFont.widthOfTextAtSize(text, textSizeSmall)
textHeight = customFont.heightAtSize(textSizeSmall)

page.drawText(text, {
x: centerPage(width,textWidth),
y: centerPage(height,textHeight)-50,
size: textSizeSmall,
font: customFont,
color: rgb(0, 0.53, 0.71),
})
////////////////////////////////////////////////////////////////////

///////////Предмет договора: Закуп ТРУ//////////////////////////////
text = 'Предмет договора: Закуп ТРУ'
textWidth = customFont.widthOfTextAtSize(text, textSizeSmall)
textHeight = customFont.heightAtSize(textSizeSmall)

page.drawText(text, {
x: 107,
y: centerPage(height,textHeight)-70,
size: textSizeSmall,
font: customFont,
color: rgb(0, 0.53, 0.71),
})
////////////////////////////////////////////////////////////////////

///////////Поставщик ТРУ: ТРУ///////////////////////////////////////
text = 'Поставщик ТРУ: ТРУ'
textWidth = customFont.widthOfTextAtSize(text, textSizeSmall)
textHeight = customFont.heightAtSize(textSizeSmall)

page.drawText(text, {
x: 107,
y: centerPage(height,textHeight)-90,
size: textSizeSmall,
font: customFont,
color: rgb(0, 0.53, 0.71),
})
////////////////////////////////////////////////////////////////////




    // page.drawRectangle({
    // x: centerPage(width,textWidth),
    // y: centerPage(height,textHeight),
    // width: textWidth,
    // height: textHeight,
    // borderColor: rgb(1, 0, 0),
    // borderWidth: 1.5,
    // })

    const pdfBytes = await pdfDoc.save()
    console.log(pdfBytes);
    // // Trigger the browser to download the PDF document
    // download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");

    var blob = new Blob([pdfBytes], {type: "text/plain;charset=utf-8"});
    var FileSaver = require('file-saver');
    FileSaver.saveAs(blob, "hello world.pdf");
  }


/**
 * Создание pdf документа из входящих данных html
 * @constructor
 * @param {Array} reason - Массив с замечанием по изменению и дополнению документа
 */
const pdfConstruct = React.forwardRef((props, ref) => {



})
export default pdfConstruct;