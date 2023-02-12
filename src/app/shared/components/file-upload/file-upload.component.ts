import { Component, EventEmitter, Output } from '@angular/core';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Output() fileUploaded = new EventEmitter<string>(); //emits file name

  fileName = '';
  storage = getStorage();
  storageRef = ref(this.storage);
  recipiesRef = ref(this.storageRef, 'recipies');

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const fileRef = ref(this.storage, `recipies/${this.fileName}`);
      const upload$ = from(uploadBytes(fileRef, file));
      upload$.pipe(take(1)).subscribe((res) => {
        this.fileUploaded.emit(res.metadata.name);
      });
    }
  }
}
