export interface Pet {
    petId: number;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    weight: number;
    ownerId?: number;
    ownerName?: string;
}