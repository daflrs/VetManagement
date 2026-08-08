import { Medication } from "./medication";
import { Service } from "./service";

export interface TreatmentItem {
    treatmentItemId: number;
    medication?: Medication;
    service?: Service;
    nameAtTreatment: string;
    unitPrice: number;
    quantity: number;
    reason: string;
}