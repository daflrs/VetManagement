import { Pet } from "./pet";

export interface MedicalRecord {
    medicalRecordId: number;
    petName: string;
    appointmentId: number;
    visitDate: string;
    complaint: string;
    diagnosis: string;
    treatment: string;
    clinicalExam: string;
    clientCommunication: string;
    weight: number;
    notes: string;
}