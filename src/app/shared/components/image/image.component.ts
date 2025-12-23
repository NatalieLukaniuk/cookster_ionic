import { Component, Input, OnChanges, OnInit } from '@angular/core';

export enum ImageType {
  RecipyMain,
}

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    standalone: false
})
export class ImageComponent implements OnChanges {
  @Input() imageType: ImageType = ImageType.RecipyMain;
  @Input() imagePath!: string;
  @Input() isPrint = false;

  recipiesBasePath =
    'https://firebasestorage.googleapis.com/v0/b/cookster-12ac8.appspot.com/o/recipies%2F';
  mediaStuff = '?alt=media';
  url: string | undefined;

  ngOnChanges(): void {
    this.url = this.recipiesBasePath + this.imagePath + this.mediaStuff;
  }
}
