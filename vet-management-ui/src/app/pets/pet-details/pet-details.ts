import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { PetService } from '../../services/pet.service';
import { BackButton } from '../../common/back-button/back-button';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, BackButton],
  templateUrl: './pet-details.html',
  styleUrl: './pet-details.css',
})
export class PetDetails {

  petId: number | null = null;
  petDetails: any;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';

  constructor(
    private petService: PetService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.petId = +id;
      this.loadPetDetails(this.petId);
    }
  }

  loadPetDetails(id: number): void {
    this.loadingState = 'loading';

    this.petService.getPetDetails(id).subscribe({
      next: (data) => {
        this.petDetails = data;
        this.loadingState = 'loaded';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
}
