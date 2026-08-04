export interface Medication {
    medicationId: number;
    name: string;
    price: number;
    availableCount: number;
    manufacturer: string;
    expirationDate?: string;
}