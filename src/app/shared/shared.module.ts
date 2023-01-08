import { ImageComponent } from './components/image/image.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { NormalizeTimePipe } from './pipes/normalize-time.pipe';



@NgModule({
  declarations: [HeaderComponent, LoadingOverlayComponent, ImageComponent, NormalizeTimePipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HeaderComponent, LoadingOverlayComponent, ImageComponent, NormalizeTimePipe]
})
export class SharedModule { }
