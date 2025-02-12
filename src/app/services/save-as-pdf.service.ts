import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class SaveAsPdfService {

  constructor() { }

  public captureScreen(contentId: string) {
    var data = document.getElementById(contentId);  //Id of the table
    if (data) {
      html2canvas(data).then(canvas => {
        // Few necessary setting options  
        let imgWidth = 208;
        let pageHeight = 295;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
        let position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('MYPdf.pdf'); // Generated PDF   
      });
    }

  }
}
