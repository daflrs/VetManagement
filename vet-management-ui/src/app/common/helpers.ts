export class Helpers {

    static formatDateForInput(date: string): string {
        return new Date(date).toISOString().split('T')[0];
    }
    
}