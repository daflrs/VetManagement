import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet';
import { environment } from '../../environments/environment';
import { PetDetailsDto } from '../models/petDetails';

@Injectable({
  providedIn: 'root',
})
export class PetService {

  private apiUrlPets = `${environment.apiUrl}pets`;
  private apiUrlOwners = `${environment.apiUrl}owners`;

  constructor(private http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrlPets);
  }

  getPet(id: number) {
    return this.http.get(`${this.apiUrlPets}/${id}`)
  }

  getPetDetails(id: number): Observable<PetDetailsDto> {
    return this.http.get<PetDetailsDto>(`${this.apiUrlPets}/details/${id}`);
  }

  createPet(pet: any) {
    return this.http.post(this.apiUrlPets, pet);
  }

  getOwners() {
    return this.http.get<any>(this.apiUrlOwners);
  }

  searchPets(name: string) {
    return this.http.get<any>(`${this.apiUrlPets}/search?name=${name}`);
  }

  deletePet(id: number) {
    return this.http.delete(`${this.apiUrlPets}/${id}`);
  }

  updatePet(id: number, pet: any) {
    return this.http.put(`${this.apiUrlPets}/${id}`, pet);
  }
  
  updateOwner(id: number, ownerId: number): Observable<PetDetailsDto> {
    return this.http.put<PetDetailsDto>(`${this.apiUrlPets}/${id}/owner`,
      {
        ownerId
      });
  }
  
  removeOwner(id: number) {
    return this.http.delete(`${this.apiUrlPets}/${id}/owner`);
  }
}
