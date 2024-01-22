export interface QuestionInfo {
    id: number;
    type: string;
    text: string;
    randomiseAnswers: boolean;
    answers: ChoiceInfo[]
}

interface ChoiceInfo{
    text: string;
    correct: boolean;
    selected: boolean;
}