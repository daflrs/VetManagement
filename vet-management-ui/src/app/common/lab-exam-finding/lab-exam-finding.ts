import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImageUpload } from '../image-upload/image-upload';
import { LabExamFinding } from '../../models/labExamFinding';
import { environment } from '../../../environments/environment';
import { LabExamFindingForm } from '../../models/labExamFindingForm';
import { ConfirmModal } from '../confirm-modal/confirm-modal';

@Component({
  selector: 'app-lab-exam-finding',
  imports: [ReactiveFormsModule, ImageUpload, ConfirmModal],
  templateUrl: './lab-exam-finding.html',
  styleUrl: './lab-exam-finding.css',
})
export class LabExamFindingComponent {

  baseUrl: string | null = environment.baseUrl;
  imagePreview: string | null = null;
  selectedFileName: string | null = null;
  selectedImage: File | null = null;
  isImageRemoved: boolean = false;
  removeImageFromFinding: boolean = false;
  showConfirmSaveWithoutImageModal: boolean = false;
  
  labExamFindingForm!: FormGroup;

  mode = input<'create' | 'edit'>('create');
  finding = input<LabExamFinding>();
  isSaving = input(false);
  isLoading = input(false);
  imageClass = input('finding-image');
  saveClicked = output<LabExamFindingForm>();
  deleteFinding = output<void>();

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.labExamFindingForm = this.fb.group({
      remark: ['']
    });

    if (this.finding()) {
      this.labExamFindingForm.patchValue({
        remark: this.finding()?.remark
      });
    }
  }

  onDelete(): void {
    this.deleteFinding.emit();
    this.labExamFindingForm.markAsPristine();
  }

  submit(): void {
    this.saveClicked.emit({
      image: this.selectedImage!,
      remark: this.labExamFindingForm.value.remark,
      removeImage: this.removeImageFromFinding
    });
    
    this.labExamFindingForm.markAsPristine();
  }

  confirmSaveWithoutImage(): void {
    this.removeImageFromFinding = true;
    this.showConfirmSaveWithoutImageModal = false;
    
    this.submit();
  }
  
  cancelConfirmSaveWithoutImage(): void {
    this.showConfirmSaveWithoutImageModal = false;
  }
  
  onSaveClicked(): void {
    if (this.labExamFindingForm.invalid) {
      this.labExamFindingForm.markAllAsTouched();
      return;
    }

    if (this.selectedImage === null && this.labExamFindingForm.value.remark.trim() != '') {
      this.showConfirmSaveWithoutImageModal = true;
      return;
    }

    this.submit();
  }

  removeImageFromUpload(): void {
    this.imagePreview = null;
    this.selectedFileName = null;
    this.selectedImage = null;
    this.isImageRemoved = true;
    this.labExamFindingForm.markAsDirty();
  }
  
  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files?.length) {

      const file = input.files[0];

      this.selectedImage = file;
      this.selectedFileName = file.name;
      this.labExamFindingForm.patchValue({ image: file });
      this.labExamFindingForm.markAsDirty();

      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  extractFileNameFromPath(path: string): string {
    return path.split('/').pop() ?? "";
  }

  get fileNameToDisplay(): string | null {
    if (this.isImageRemoved) {
      return null;
    }

    if (this.selectedFileName) {
      return this.selectedFileName
    }

    if (this.finding() && this.finding()!.imagePath) {
      return this.extractFileNameFromPath(this.finding()!.imagePath);
    }

    return null;
  }

  get imageToDisplay(): string | null {
    if (this.isImageRemoved) {
      return null;
    }

    if (this.imagePreview) {
      return this.imagePreview;
    }

    if (this.finding() && this.finding()!.imagePath) {
      return `${this.baseUrl}${this.finding()!.imagePath}`;
    }

    return null;
  }
}
