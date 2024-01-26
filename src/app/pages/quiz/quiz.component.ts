import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { QuizService } from '../../service/quiz.service';
import { QuestionInfo } from '../../models/question';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aqz-quiz',

  standalone: true,

  template: `
    <main class="h-screen flex flex-col">
      <aqz-header class="flex-none" />

      @if (isFinished) {

      <div class="flex justify-center w-100">
        <div class="p-4 bg-white rounded-md items-center m-8 text-center">
          <p class="text-xl font-bold">Results</p>

          <span
            class="text-3xl font-bold"
            [ngClass]="isPassed ? 'text-emerald-600' : 'text-red-600'"
            >{{ finalResult }}</span
          >/{{ totalQs }}

          <p>Thank you for taking the exam!</p>
          <p>Please review the wrong answers:</p>

          @for (failedQ of failedQuestions; track $index) {
          <div class="p-4 bg-white rounded-md items-center text-left">
            <span class="text-xl font-bold">Question #{{ failedQ.id }}</span>
            <p>{{ failedQ.text }}</p>
            @for (choice of failedQ.answers; track $index) {
            <div
              [ngClass]="{
                'bg-emerald-400': choice.correct,
                'bg-red-400': choice.selected
              }"
            >
              {{ choice.text }}
            </div>
            }
          </div>
          }
          <button
            class="bg-amber-300 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded"
          >
            Retake
          </button>
        </div>
      </div>

      } @else {

      <div class="flex-auto">
        <div class="flex p-5 gap-2">
          <div class="flex-1 p-4 bg-white rounded-md">
            <p class="text-xl font-bold mb-2">
              Question {{ currentQidx + 1 }}/{{ totalQs }}
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
                  #radioInput
                  type="radio"
                  id="{{ $index }}"
                  name="choice"
                  value="{{ $index }}"
                  class="hidden peer"
                  [(ngModel)]="selectedChoice"
                  [checked]="choice.selected"
                  [disabled]="isShownAnswer"
                  required
                />
                <label
                  for="{{ $index }}"
                  class="inline-flex items-center justify-between w-full px-6 py-3 mb-2 rounded-md peer-checked:border-blue-600 peer-checked:text-blue-600"
                  [ngClass]="
                    isShownAnswer && choice.correct
                      ? 'disabled border-emerald-300 text-emerald-400 bg-emerald-100'
                      : 'text-gray-500 bg-white border border-gray-200 hover:text-gray-600 hover:bg-gray-100 cursor-pointer'
                  "
                  >{{ choice.text }}</label
                >
              </li>

              }
            </ul>
          </div>
        </div>
      </div>

      }

      <footer class="flex-none flex justify-between p-2 sticky">
        <div class="flex gap-2">
          <button
            class="bg-amber-300 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded"
          >
            Mark
          </button>

          <button
            class="bg-cyan-300 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded"
            (click)="showAnswer()"
          >
            Show Answer
          </button>

          <button
            class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
            (click)="submit()"
          >
            SUBMIT
          </button>

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

        <div class="flex gap-2">
          <!-- <button
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
          </button> -->
        </div>
      </footer>
    </main>
  `,

  imports: [HeaderComponent, FormsModule, NgClass],
})
export class QuizComponent implements OnInit {
  @ViewChildren('radioInput') radioInputs?: ElementRef[];

  questions: QuestionInfo[] = [];
  totalQs: number = 0;
  shouldRandomizeChoices?: boolean = false;

  currentQ?: QuestionInfo;
  currentQidx: number = 0;

  isShownAnswer: boolean = false;
  selectedChoice?: number;

  isFinished: boolean = false;
  finalResult: number = 0;
  isPassed: boolean = false;

  failedQuestions: QuestionInfo[] = [];

  constructor(private quizService: QuizService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.route.params.subscribe((params) => {
      const id = +params['id'] as number;

      this.quizService.getTests().subscribe(t => {
        this.shouldRandomizeChoices = t.find(q => q.id === id)?.randomizeChoices;
      });
      this.quizService.getQuestions(id).subscribe((q) => {
        if (this.shouldRandomizeChoices) {
          q.forEach(question => {
            if (question.answers && Array.isArray(question.answers)) {
              question.answers = this.shuffleArray(question.answers);
            }
          });

          this.questions = q;
        }
        this.questions = q;
        this.totalQs = q.length;

        this.setCurrentQuestion();
      });
    });
  }

  goToNext() {
    if (this.currentQidx < this.totalQs) {
      this.setSelectedChoice();

      this.setQuestionCorrect();

      this.currentQidx++;

      this.setCurrentQuestion();

      if (this.hasChecked()) {
        this.resetChoices();
      }

      // this.checkTheCurrentSelected();a

      this.isShownAnswer = false;
    }
  }

  goToPrev() {
    if (this.currentQidx > 0) {
      this.setSelectedChoice();

      this.currentQidx--;

      this.resetChoices();

      this.setCurrentQuestion();

      this.isShownAnswer = false;
    }
  }

  checkTheCurrentSelected() {
    if (this.radioInputs !== undefined && this.selectedChoice !== undefined) {
      this.radioInputs[this.selectedChoice].nativeElement.checked = true;
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
    this.isShownAnswer = !this.isShownAnswer;

    // this.selectedChoice = this.getCheckedChoiceIdx();

    // if (this.selectedChoice !== undefined && this.selectedChoice > -1) {

    //   let selectedAnswer = this.currentQ!.answers[this.selectedChoice];

    // }

    // else {

    // }

    if (this.isShownAnswer) {
      this.setQuestionCorrect();
    }
  }

  private setQuestionCorrect() {
    var choiceIdx = this.getCheckedChoice();

    if (choiceIdx !== undefined) {
      var isCorrect =
        this.currentQ!.answers[choiceIdx.nativeElement.id].correct;

      this.currentQ!.isCorrect = isCorrect;

      // if (!isCorrect) {
      //   this.failedQuestions.push(this.currentQ!);
      // }
    }
  }

  submit() {
    this.finalResult = this.questions.filter((q) => q.isCorrect).length;

    this.failedQuestions = this.questions.filter((q) => !q.isCorrect);

    this.isPassed = (this.finalResult / this.totalQs) * 100 > 70;

    this.isFinished = true;
  }

  resetChoices() {
    this.radioInputs?.forEach((el) => {
      el.nativeElement.checked = false;
    });
  }

  hasChecked() {
    return this.radioInputs?.some((el) => el.nativeElement.checked);
  }

  getCheckedChoice() {
    return this.radioInputs?.find((el) => el.nativeElement.checked);
  }

  getCheckedChoiceIdx() {
    return this.radioInputs?.findIndex((el) => el.nativeElement.checked);
  }

  getCorrectChoice() {
    return this.radioInputs?.find((el) => el.nativeElement.checked);
  }

  shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
