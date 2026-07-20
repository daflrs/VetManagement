import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { Router, RouterLink } from '@angular/router';
import { Owner } from '../../models/owner';
import { ToastService } from '../../services/toast.service';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-owner-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageLayout],
  templateUrl: './owner-list.html',
  styleUrl: './owner-list.css',
})
export class OwnerList {

  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  owners: Owner[] = [];

  constructor(
    private ownerService: OwnerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners(): void {
    this.loadingState = 'loading';

    this.ownerService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;
        this.loadingState = this.owners.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }

  deleteOwner(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this owner record?')) return;

    this.ownerService.deleteOwner(id).subscribe({
      next: (data) => {
        this.toastService.success('Owner record deletion success.');
        this.loadOwners();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }

  viewOwnerDetails(id: number): void {
    this.router.navigate(['owners/details', id]);
  }
}
