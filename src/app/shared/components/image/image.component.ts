import { Component, Input, OnInit } from '@angular/core';

export enum ImageType {
  RecipyMain,
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() imageType: ImageType = ImageType.RecipyMain;
  @Input() imagePath!: string;

  recipiesBasePath =
    'https://firebasestorage.googleapis.com/v0/b/cookster-12ac8.appspot.com/o/recipies%2F';
  mediaStuff = '?alt=media';
  url: string | undefined;

  ngOnInit(): void {
    this.url = this.recipiesBasePath + this.imagePath + this.mediaStuff;
  }
}
