import { Component, OnInit } from '@angular/core';
import { TestInfo } from '../../models/test';
import { QuizService } from '../../service/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'aqz-quiz-selector',
  standalone: true,
  imports: [],
  template: `
    <div class="flex justify-center w-100">
        <div class="p-4 bg-white rounded-md items-center m-8 text-center">
          <p class="text-xl font-bold">Please Choose Exam:</p>
          
          @for (test of testList; track $index) {
            <div class="bg-gray-300 rounded-md my-2 cursor-pointer hover:bg-gray-400" (click)="navigateToTest(test.id)">
              <p class="text-xl font-bold">{{test.name}}</p>
              <p>{{test.description}}</p>
            </div>
          }
          
        </div>
      </div>
  `,
  styleUrl: './quiz-selector.component.scss'
})
export class QuizSelectorComponent implements OnInit {
  testList: TestInfo[] = [];

  constructor(private quizService: QuizService, private router: Router) {
  }

  ngOnInit(): void {
    this.quizService.getTests().subscribe(res => this.testList = res);
  }

  navigateToTest(testId: number) {
    this.router.navigate(['tests', testId]);
  }
}
