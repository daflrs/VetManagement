import { Component, EventEmitter, input, output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {

  imageClass = input('finding-image');
  imagePreview = input<string | null>(null);
  selectedFileName = input<string | null>(null);
  imageSelected = output<Event>();
  removeImageClicked = output<void>();

  onImageSelected(event: Event): void {
    this.imageSelected.emit(event);
  }
  
  removeImage(): void {
    this.removeImageClicked.emit();
  }
  
  truncateFileName(fileName: string | null): string | null {
    if (!fileName) {
      return 'No file selected';  
    }

    if (fileName.length <= 10) {
      return fileName;
    }

    return `${fileName.substring(0, 5)}...${fileName.slice(-5)}`;
  }
}
