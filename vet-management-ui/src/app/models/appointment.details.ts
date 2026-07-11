import { Pet } from "./pet";

export interface AppointmentDetailsDto {
    appointmentId: number;
    petId: string;
    type: string;
    appointmentDate: string;
    reason: string;
    status: string;
    pet: Pet;
}