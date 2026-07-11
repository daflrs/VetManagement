import { Owner } from "./owner";

export interface PetDetailsDto {
    petId: number;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    weight: string;
    owner?: Owner
}