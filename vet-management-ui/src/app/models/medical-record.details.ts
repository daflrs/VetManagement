import { Appointment } from "./appointment";
import { Owner } from "./owner";
import { Pet } from "./pet";

export interface MedicalRecordDetailsDto {
    medicalRecordId: number;
    pet: Pet;
    owner?: Owner;
    appointment: Appointment
    visitDate: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    weight: string;
    notes: string;
}