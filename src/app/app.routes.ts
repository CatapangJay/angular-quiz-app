import { Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { QuizSelectorComponent } from './pages/quiz-selector/quiz-selector.component';

export const routes: Routes = [
    { path: 'tests', component: QuizSelectorComponent },
    { path: 'tests/:id', component: QuizComponent },
];
