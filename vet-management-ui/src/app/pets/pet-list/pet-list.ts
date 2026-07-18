import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pet } from '../../models/pet';
import { PetService } from '../../services/pet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageLayout],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList implements OnInit{

  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  pets: Pet[] = [];
  searchTerm: string = '';

  constructor(
    private petService: PetService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  search(): void {
    if (!this.searchTerm) {
      this.loadPets();
      return;
    }

    this.loadingState = 'loading';
    
    this.petService.searchPets(this.searchTerm).subscribe({
      next: (data) => {
        this.pets = data;
        this.loadingState = 'loaded';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.loadingState = 'error';
      }
    });
  }

  resetSearch(): void{
    this.searchTerm = '';
    this.loadPets();
  }

  loadPets(): void {
    this.loadingState = 'loading';

    this.petService.getPets().subscribe({
      next: (data) => {
        this.pets = data;
        this.loadingState = this.pets.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.loadingState = 'error';
      }
    });
  }

  deletePet(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this pet?')) return;

    this.petService.deletePet(id).subscribe({
      next: (data) =>{
        this.toastService.success('Pet deletion success.');
        this.loadPets();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }

  editPet(event: MouseEvent, id: number): void {
    event?.stopPropagation();
    this.router.navigate(['/pets/edit', id]);
  }

  viewPet(id: number): void {
    this.router.navigate(['/pets/details', id]);
  }
}
