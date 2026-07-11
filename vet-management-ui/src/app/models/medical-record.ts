import { Pet } from "./pet";

export interface MedicalRecord {
    medicalRecordId: number;
    petName: string;
    appointmentId: number;
    visitDate: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    weight: number;
    notes: string;
}