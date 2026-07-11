import { Pet } from "./pet";

export interface OwnerDetailsDto {
    ownerId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    pets: Pet[]
}