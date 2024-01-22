import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { QuizService } from '../../service/quiz.service';
import { QuestionInfo } from '../../models/question';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'aqz-quiz',
  standalone: true,
  template: `
    <main class="h-screen flex flex-col">
      <aqz-header class="flex-none" />
      <div class="flex-auto">
        <div class="flex p-5 gap-2">
          <div class="flex-1 p-4 bg-white rounded-md">
            <p class="text-xl font-bold mb-2">
              Question {{ currentQidx + 1 }}/50
            </p>
            <p>
              {{ currentQ?.text }}
            </p>
          </div>
          <div class="flex-1 p-4 bg-white rounded-md h-fit">
            <p class="text-xl font-bold mb-2">Choices</p>
            <ul>
              @for (choice of currentQ?.answers; track $index) {
              <li>
                <input
                  type="radio"
                  id="{{ $index }}"
                  name="choice"
                  value="{{ $index }}"
                  class="hidden peer"
                  [(ngModel)]="selectedChoice"
                  required
                />
                <label
                  for="{{ $index }}"
                  class="inline-flex items-center justify-between w-full px-6 py-3 mb-2 text-gray-500 bg-white border border-gray-200 rounded-md cursor-pointer  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
                  >{{ choice.text }}</label
                >
              </li>
              }
            </ul>
          </div>
        </div>
      </div>
      <footer class="flex-none flex justify-between p-2 sticky">
        <div class="flex gap-2">
          <button
            class="bg-amber-300 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded"
          >
            Mark
          </button>
          <button
            class="bg-cyan-300 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded"
          >
            Show Answer
          </button>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-emerald-300 hover:bg-emerald-400 text-white font-bold py-2 px-4 w-28 rounded"
            (click)="goToPrev()"
          >
            Previous
          </button>
          <button
            class="bg-emerald-300 hover:bg-emerald-400 text-white font-bold py-2 px-4 w-28 rounded"
            (click)="goToNext()"
          >
            Next
          </button>
        </div>
      </footer>
    </main>
  `,
  imports: [HeaderComponent, FormsModule],
})
export class QuizComponent implements OnInit {
  questions: QuestionInfo[] = [];
  totalQs: number = 0;

  currentQ?: QuestionInfo;
  currentQidx: number = 0;

  selectedChoice?: number;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.quizService.getQuestions().subscribe((q) => {
      this.questions = q;
      this.totalQs = q.length;
      this.setCurrentQuestion();
    });
  }

  goToNext() {
    if (this.currentQidx < this.totalQs) {
      this.currentQidx++;
      this.setSelectedChoice();
      this.setCurrentQuestion();
    }
  }

  goToPrev() {
    if (this.currentQidx > 0) {
      this.currentQidx--;
      this.setCurrentQuestion();
    }
  }

  setSelectedChoice() {
    if (this.selectedChoice !== undefined)
      this.currentQ!.answers[this.selectedChoice].selected = true;
  }

  setCurrentQuestion() {
    this.currentQ = this.questions[this.currentQidx];
  }

  showAnswer() {
    if (this.selectedChoice !== undefined) {
      let selectedAnswer = this.currentQ!.answers[this.selectedChoice];
    }
    else{
      
    }
    this.setSelectedChoice();
  }
}
