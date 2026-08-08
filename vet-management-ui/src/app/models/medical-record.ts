import { Treatment } from "./treatment";

export interface MedicalRecord {
    medicalRecordId: number;
    petName: string;
    appointmentId: number;
    visitDate: string;
    complaint: string;
    diagnosis: string;
    treatment?: Treatment;
    clinicalExam: string;
    clientCommunication: string;
    weight: number;
    notes: string;
}