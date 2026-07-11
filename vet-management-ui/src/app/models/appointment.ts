import { AppointmentStatus } from "./appointment-status";
import { AppointmentType } from "./appointment-type";

export interface Appointment {
    appointmentId: number;
    petId: string;
    type: AppointmentType;
    appointmentDate: string;
    reason: string;
    status: AppointmentStatus;
    petName: string;
    medicalRecordId: number
}