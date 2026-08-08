import { TreatmentItem } from "./treatmentItem";

export interface Treatment {
    treatmentId: number;
    treatmentItems: TreatmentItem[];
    others: string;
}