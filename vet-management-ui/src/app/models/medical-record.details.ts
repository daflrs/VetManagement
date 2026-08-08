import { Appointment } from "./appointment";
import { LabExam } from "./labExam";
import { Owner } from "./owner";
import { Pet } from "./pet";
import { Treatment } from "./treatment";

export interface MedicalRecordDetailsDto {
    medicalRecordId: number;
    pet: Pet;
    owner?: Owner;
    appointment: Appointment
    visitDate: string;
    complaint: string;
    diagnosis: string;
    treatment?: Treatment;
    clinicalExam: string;
    clientCommunication: string;
    weight: string;
    notes: string;
    labExam?: LabExam;
}