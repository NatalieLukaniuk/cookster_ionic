import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';



@NgModule({
  declarations: [HeaderComponent, LoadingOverlayComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HeaderComponent, LoadingOverlayComponent]
})
export class SharedModule { }
