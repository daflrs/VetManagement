import { LabExamFinding } from "./labExamFinding";

export interface LabExam {
    labExamId: number;
    interpretation: string;
    labExamFindings: LabExamFinding[];
}