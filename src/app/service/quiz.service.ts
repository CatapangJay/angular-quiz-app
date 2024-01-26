import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionInfo } from '../models/question';
import { TestInfo } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  public getTests() {
    return this.http.get<TestInfo[]>('/assets/test-list.json')
  }

  public getQuestions(testId:number) {
    return this.http.get<QuestionInfo[]>(`/assets/ace-${testId}.json`)
  }
}
