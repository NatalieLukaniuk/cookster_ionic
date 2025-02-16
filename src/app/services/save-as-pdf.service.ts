import { Injectable } from '@angular/core';
import { Printer } from '@bcyesil/capacitor-plugin-printer';

@Injectable({
  providedIn: 'root'
})
export class SaveAsPdfService {

  constructor() { }

  public captureScreen(contentId: string, documentName: string) {
    const toPrint = document.getElementById(contentId)
    if(toPrint){
      Printer.print({content: toPrint.outerHTML})
    }
    



  }
}
