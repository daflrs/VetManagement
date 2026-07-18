import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owner } from '../models/owner';
import { environment } from '../../environments/environment';
import { OwnerDetailsDto } from '../models/ownerDetails';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {

  private apiUrlOwners = `${environment.apiUrl}owners`;

  constructor(private http: HttpClient) {}

  getOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.apiUrlOwners);
  }

  getOwner(id: number) {
    return this.http.get(`${this.apiUrlOwners}/${id}`);
  }

  getOwnerDetails(id: number): Observable<OwnerDetailsDto> {
    return this.http.get<OwnerDetailsDto>(`${this.apiUrlOwners}/details/${id}`);
  }

  getPetsAvailableForOwner() {
    return this.http.get<any>(`${this.apiUrlOwners}/available-for-owner`);
  }

  createOwner(owner: any) {
    return this.http.post(this.apiUrlOwners, owner);
  }

  deleteOwner(id: number) {
    return this.http.delete(`${this.apiUrlOwners}/${id}`);
  }
  
  updateOwner(id: number, owner: any) {
    return this.http.put(`${this.apiUrlOwners}/${id}`, owner);
  }
  
  addPetsToOwner(id: number, petIds: any): Observable<OwnerDetailsDto> {
    return this.http.put<OwnerDetailsDto>(`${this.apiUrlOwners}/${id}/add-pets`, 
      {
        petIds
      });
  }

  removePetFromOwner(id: number, petId: number): Observable<OwnerDetailsDto> {
    return this.http.delete<OwnerDetailsDto>(`${this.apiUrlOwners}/${id}/pet`, 
      { 
        body: {
          petId 
        }
      });
  }
}
