import { Appointment } from "./appointment";
import { LabExam } from "./labExam";
import { Owner } from "./owner";
import { Pet } from "./pet";

export interface MedicalRecordDetailsDto {
    medicalRecordId: number;
    pet: Pet;
    owner?: Owner;
    appointment: Appointment
    visitDate: string;
    complaint: string;
    diagnosis: string;
    treatment: string;
    clinicalExam: string;
    clientCommunication: string;
    weight: string;
    notes: string;
    labExam?: LabExam;
}